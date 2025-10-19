import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { NurseDashboardComponent } from './nurse-dashboard/nurse-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PatientDashboardComponent,
    DoctorDashboardComponent,
    NurseDashboardComponent,
    AdminDashboardComponent,
    StaffDashboardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = JSON.parse(localStorage.getItem('user') || 'null');

  constructor(public router: Router) {}

  get userRole(): string {
    return this.user?.role || '';
  }

  get userName(): string {
    if (this.user?.first_name || this.user?.last_name) {
      return `${this.user.first_name} ${this.user.last_name}`.trim();
    }
    return this.user?.email || 'Usuario';
  }

  get roleLabel(): string {
    const roleLabels: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'DOCTOR': 'Doctor',
      'NURSE': 'Enfermero/a',
      'STAFF': 'Personal',
      'PATIENT': 'Paciente'
    };
    return roleLabels[this.userRole] || this.userRole;
  }

  logout() {
    fetch('http://localhost:8000/api/auth/logout/', { method: 'POST' }).finally(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
