import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './user-form.component.html',
})
export default class UserFormComponent implements OnInit {
  private db = inject(FormBuilder);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  userId: string = '';

  ngOnInit(): void {
    this.form = this.db.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: [''],
      type: ['Operario', Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEdit = true;
        this.userId = id;
        this.form.get('password')?.disable();

        this.usersService.getUserById(id).subscribe(user => {
          if (user) {
            this.form.patchValue({
              id,
              ...user,
            });
          } else {
            this.router.navigate(['/dashboard/users']);
          }
        });
      } else {
        this.isEdit = false;
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const userData: Omit<User, 'id'> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address,
      type: formValue.type,
    };

    try {
      if (this.isEdit) {
        await this.usersService.updateUser(this.userId, userData);
      } else {
        const uid = await this.authService.createUserAuth(formValue.email, formValue.password);
        await this.usersService.createUserWithId(uid, userData);
      }

      this.router.navigate(['/dashboard/users']);
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  }
}
