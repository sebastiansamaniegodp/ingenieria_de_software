import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user = JSON.parse(localStorage.getItem('user') || 'null');
  constructor(private router: Router) {}

  logout() {
    fetch('http://localhost:8000/api/auth/logout/', { method: 'POST' }).finally(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
