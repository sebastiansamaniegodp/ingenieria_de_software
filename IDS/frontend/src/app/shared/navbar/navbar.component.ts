import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user = JSON.parse(localStorage.getItem('user') || 'null');

  constructor(private router: Router) {}

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

  canAccessPatients(): boolean {
    return ['ADMIN', 'DOCTOR', 'NURSE', 'STAFF'].includes(this.userRole);
  }

  canAccessAppointments(): boolean {
    return ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'].includes(this.userRole);
  }

  canAccessMedicalRecords(): boolean {
    return ['ADMIN', 'DOCTOR', 'NURSE'].includes(this.userRole);
  }

  logout() {
    fetch('http://localhost:8000/api/auth/logout/', { method: 'POST' }).finally(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
