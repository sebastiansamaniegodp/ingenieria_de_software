import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = false;
  userName: string = '';
  userEmail: string = '';
  roleLabel: string = '';
  userRole: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadUserData();
    // Cargar estado de colapso desde localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = savedState === 'true';
  }

  loadUserData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userName = `${user.first_name} ${user.last_name}`.trim() || user.email;
      this.userEmail = user.email;
      this.userRole = user.role;
      this.roleLabel = this.getRoleLabel(user.role);
    }
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'DOCTOR': 'Doctor',
      'NURSE': 'Enfermería',
      'STAFF': 'Personal',
      'PATIENT': 'Paciente'
    };
    return labels[role] || role;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
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

  canAccessManagement(): boolean {
    return ['ADMIN'].includes(this.userRole);
  }

  logout() {
    this.http.post('http://localhost:8000/api/auth/logout/', {}).subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }
}
