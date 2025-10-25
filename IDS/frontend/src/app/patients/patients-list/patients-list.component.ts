import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { PatientsService } from '../../services/patients.service';
import { Patient } from '../../models/patient.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';

  constructor(
    private patientsService: PatientsService,
    private notificationService: NotificationService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientsService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loading = false;
      }
    });
  }

  filterPatients() {
    this.filteredPatients = this.patients.filter(patient => {
      const matchesSearch = !this.searchTerm ||
        patient.first_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || patient.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  deletePatient(id: number) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientsService.deletePatient(id).subscribe({
        next: () => {
          this.notificationService.success('Paciente eliminado exitosamente');
          this.loadPatients();
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          this.notificationService.error('Error al eliminar el paciente');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
