import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { PatientsService } from '../../services/patients.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit {
  appointment: Partial<Appointment> = {
    patient: 0,
    doctor: 0,
    date: '',
    time: '',
    appointment_type: 'consultation',
    status: 'scheduled',
    room: '',
    notes: ''
  };

  patients: Patient[] = [];
  doctors: any[] = [];
  isEditMode = false;
  appointmentId: number | null = null;
  loading = false;
  submitting = false;

  constructor(
    private appointmentsService: AppointmentsService,
    private patientsService: PatientsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPatients();
    this.loadDoctors();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.appointmentId = +params['id'];
        this.loadAppointment();
      }
    });
  }

  loadPatients() {
    this.patientsService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.notificationService.error('Error al cargar pacientes');
      }
    });
  }

  loadDoctors() {
    this.appointmentsService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.notificationService.error('Error al cargar doctores');
      }
    });
  }

  loadAppointment() {
    if (!this.appointmentId) return;

    this.loading = true;
    this.appointmentsService.getAppointment(this.appointmentId).subscribe({
      next: (data) => {
        this.appointment = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointment:', error);
        this.notificationService.error('Error al cargar la cita');
        this.loading = false;
        this.router.navigate(['/appointments']);
      }
    });
  }

  onSubmit() {
    if (!this.appointment.patient || !this.appointment.doctor || !this.appointment.date || !this.appointment.time) {
      this.notificationService.error('Por favor complete todos los campos requeridos');
      return;
    }

    this.submitting = true;

    const operation = this.isEditMode && this.appointmentId
      ? this.appointmentsService.updateAppointment(this.appointmentId, this.appointment)
      : this.appointmentsService.createAppointment(this.appointment);

    operation.subscribe({
      next: () => {
        this.notificationService.success(`Cita ${this.isEditMode ? 'actualizada' : 'creada'} exitosamente`);
        this.router.navigate(['/appointments']);
      },
      error: (error) => {
        console.error('Error saving appointment:', error);
        const errorMessage = error.error?.non_field_errors?.[0] ||
                           error.error?.detail ||
                           'Error al guardar la cita';
        this.notificationService.error(errorMessage);
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/appointments']);
  }
}
