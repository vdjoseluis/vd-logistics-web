import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: string = '';

  async onLogin() {
    if (this.form.invalid) return;

    const email = this.form.get('email')?.value ?? ''; // Evita valores nulos/undefined
    const password = this.form.get('password')?.value ?? '';

    if (!email || !password) {
      this.error = 'Email y contraseña son requeridos';
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
      const user = userCredential.user;

      const userData = await lastValueFrom(this.authService.getUser(user.uid));

      if (userData?.type === 'Administrativo') {
        this.router.navigate(['/dashboard/users']);
      } else {
        this.error = '🚫 Acceso denegado.';
        await getAuth().signOut();
      }
    } catch (error) {
      this.error = '❌ Email o contraseña incorrectos';
    }
  }

}


