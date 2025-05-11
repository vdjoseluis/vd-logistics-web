import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent implements OnInit {
  private db = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form!: FormGroup;
  error = '';

  ngOnInit(): void {
    this.form = this.db.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  onLogin() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.login(email!, password!)
      .then(() => this.router.navigate(['/dashboard/services']))
      .catch(() => this.error = 'Credenciales no válidas');
  }
}
