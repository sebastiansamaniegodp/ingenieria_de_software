import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  loading = false;
  successMsg = '';
  errorMsg = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    first_name: [''],
    last_name: [''],
    role: ['PATIENT']
  });

  roles = [
    { value: 'PATIENT', label: 'Paciente' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Enfermería' },
    { value: 'STAFF', label: 'Personal' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async submit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.form.invalid) return;
    this.loading = true;
    try {
      const result = await this.auth.register(this.form.value as any);
      this.successMsg = 'Usuario registrado: ' + result.email;
      setTimeout(() => this.router.navigate(['/login']), 800);
    } catch (err: any) {
      if (err && err.email) {
        this.errorMsg = Array.isArray(err.email) ? err.email.join(', ') : err.email;
      } else if (err && err.password) {
        this.errorMsg = Array.isArray(err.password) ? err.password.join(', ') : err.password;
      } else {
        this.errorMsg = 'Error al registrar';
      }
    } finally {
      this.loading = false;
    }
  }
}
