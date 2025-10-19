import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { DashboardService } from '../../services/dashboard.service';
import { Appointment, MedicalRecord } from '../../models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  medicalRecords: MedicalRecord[] = [];
  loadingAppointments = true;
  loadingRecords = true;

  appointmentColumns: TableColumn[] = [
    { key: 'date', label: 'Fecha', sortable: true },
    { key: 'time', label: 'Hora', sortable: true },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    { key: 'type', label: 'Tipo de Consulta', sortable: false },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderStatus(value)
    }
  ];

  recordColumns: TableColumn[] = [
    { key: 'date', label: 'Fecha', sortable: true },
    { key: 'title', label: 'Título', sortable: true },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (value) => this.renderRecordType(value)
    },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderRecordStatus(value)
    }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadMedicalRecords();
  }

  loadAppointments() {
    this.loadingAppointments = true;
    this.dashboardService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loadingAppointments = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loadingAppointments = false;
      }
    });
  }

  loadMedicalRecords() {
    this.loadingRecords = true;
    this.dashboardService.getMedicalRecords().subscribe({
      next: (data) => {
        this.medicalRecords = data;
        this.loadingRecords = false;
      },
      error: (err) => {
        console.error('Error loading medical records:', err);
        this.loadingRecords = false;
      }
    });
  }

  renderStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      scheduled: { label: 'Programada', class: 'status-scheduled' },
      in_progress: { label: 'En Curso', class: 'status-in-progress' },
      completed: { label: 'Completada', class: 'status-completed' },
      cancelled: { label: 'Cancelada', class: 'status-cancelled' }
    };

    const statusInfo = statusMap[status] || { label: status, class: '' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  renderRecordType(type: string): string {
    const typeMap: { [key: string]: string } = {
      lab_result: 'Resultado de Laboratorio',
      prescription: 'Receta Médica',
      diagnosis: 'Diagnóstico',
      note: 'Nota Médica'
    };

    return typeMap[type] || type;
  }

  renderRecordStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      pending: { label: 'Pendiente', class: 'status-pending' },
      completed: { label: 'Completado', class: 'status-completed' },
      reviewed: { label: 'Revisado', class: 'status-reviewed' }
    };

    const statusInfo = statusMap[status] || { label: status, class: '' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  onAppointmentClick(appointment: Appointment) {
    console.log('Appointment clicked:', appointment);
    // TODO: Navigate to appointment details or show modal
  }

  onRecordClick(record: MedicalRecord) {
    console.log('Record clicked:', record);
    // TODO: Navigate to record details or show modal
  }

  get activePrescriptionsCount(): number {
    return this.medicalRecords.filter(r => r.type === 'prescription').length;
  }
}
