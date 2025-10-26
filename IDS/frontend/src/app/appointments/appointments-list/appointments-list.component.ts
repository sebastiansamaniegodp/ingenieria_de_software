import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../models/appointment.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  typeFilter = '';
  dateFilter = '';

  constructor(
    private appointmentsService: AppointmentsService,
    private notificationService: NotificationService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentsService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.notificationService.error('Error al cargar las citas');
        this.loading = false;
      }
    });
  }

  filterAppointments() {
    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = !this.searchTerm ||
        (appointment.patient_name && appointment.patient_name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (appointment.doctor_name && appointment.doctor_name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (appointment.room && appointment.room.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = !this.statusFilter || appointment.status === this.statusFilter;
      const matchesType = !this.typeFilter || appointment.appointment_type === this.typeFilter;
      const matchesDate = !this.dateFilter || appointment.date === this.dateFilter;

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }

  deleteAppointment(id: number | undefined) {
    if (!id) return;
    
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.appointmentsService.deleteAppointment(id).subscribe({
        next: () => {
          this.notificationService.success('Cita eliminada exitosamente');
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.notificationService.error('Error al eliminar la cita');
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'scheduled': 'Programada',
      'in_progress': 'En Progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'consultation': 'Consulta',
      'followup': 'Seguimiento',
      'emergency': 'Emergencia',
      'surgery': 'Cirugía',
      'therapy': 'Terapia'
    };
    return labels[type] || type;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
