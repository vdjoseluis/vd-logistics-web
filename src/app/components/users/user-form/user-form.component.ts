import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  templateUrl: './user-form.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, MatSnackBarModule],
})
export default class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);


  form!: FormGroup;
  isEdit: boolean = false;
  userId: string = '';

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^[67]\\d{8}$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
            })
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
    const userData: Partial<User> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      email: formValue.email,
      address: formValue.address,
      type: formValue.type,
    };

    try {
      if (this.isEdit) {
        const response: any = await lastValueFrom(this.authService.updateUser(this.userId, userData));
        if (response?.success) {
          this.openSnackBar('✅ Usuario actualizado correctamente', '');
          this.router.navigate(['/dashboard/users']);
        } else {
          this.openSnackBar('❌ Error actualizando usuario', '');
        }
      } else {
        const response: any = await lastValueFrom(this.authService.createUser(userData, formValue.password));
        if (response?.uid) {
          this.userId = response.uid;
          this.openSnackBar('✅ Usuario creado correctamente', '');
          this.router.navigate(['/dashboard/users']);
        } else if (response?.error) {
          this.openSnackBar(`❌ ${response?.error}`, '');
        }
      }
    } catch (error) {
      console.error('Error guardando usuario:', error);
      this.openSnackBar('❌ Error guardando usuario', '');
    }
  }



  async deleteUser() {
    if (!this.userId) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: '¿Estás seguro de que deseas eliminar este usuario?' }
    });

    const confirm = await lastValueFrom(dialogRef.afterClosed());

    if (!confirm) return;

    const currentUid = this.authService.getCurrentUserId();
    if (this.userId === currentUid) {
      await this.authService.logout();
      this.router.navigate(['/login']); // ✅ Cierra sesión si es el usuario actual
    }

    try {
      const response: any = await lastValueFrom(this.authService.deleteUser(this.userId));
      if (response?.success) {
        this.openSnackBar('✅ Usuario eliminado correctamente', '');
        this.router.navigate(['/dashboard/users']);
      } else {
        this.openSnackBar('❌ Error eliminando usuario', '');
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      this.openSnackBar('❌ Error eliminando usuario', '');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
