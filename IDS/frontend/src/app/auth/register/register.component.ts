import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
    role: ['PATIENT'],
    specialty: [''],
    medical_license: [''],
    work_schedule: [null]
  });

  roles = [
    { value: 'PATIENT', label: 'Paciente' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Enfermería' },
    { value: 'STAFF', label: 'Personal' }
  ];

  specialties = [
    { value: 'CARDIOLOGY', label: 'Cardiología' },
    { value: 'DERMATOLOGY', label: 'Dermatología' },
    { value: 'PEDIATRICS', label: 'Pediatría' },
    { value: 'NEUROLOGY', label: 'Neurología' },
    { value: 'ORTHOPEDICS', label: 'Ortopedia' },
    { value: 'GYNECOLOGY', label: 'Ginecología' },
    { value: 'PSYCHIATRY', label: 'Psiquiatría' },
    { value: 'GENERAL', label: 'Medicina General' },
    { value: 'SURGERY', label: 'Cirugía' },
    { value: 'EMERGENCY', label: 'Emergencias' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // Escuchar cambios en el campo role para actualizar validaciones
    this.form.get('role')?.valueChanges.subscribe(role => {
      this.updateDoctorFieldsValidation(role);
    });
  }

  updateDoctorFieldsValidation(role: string | null) {
    const specialtyControl = this.form.get('specialty');
    const licenseControl = this.form.get('medical_license');

    if (role === 'DOCTOR') {
      specialtyControl?.setValidators([Validators.required]);
      licenseControl?.setValidators([Validators.required]);
    } else {
      specialtyControl?.clearValidators();
      licenseControl?.clearValidators();
      specialtyControl?.setValue('');
      licenseControl?.setValue('');
    }

    specialtyControl?.updateValueAndValidity();
    licenseControl?.updateValueAndValidity();
  }

  get isDoctor(): boolean {
    return this.form.get('role')?.value === 'DOCTOR';
  }

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
