import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { ChartComponent } from '../../shared/chart/chart.component';
import { DashboardService } from '../../services/dashboard.service';
import { Appointment, Patient, DashboardStats } from '../../models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ChartComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
  todayAppointments: Appointment[] = [];
  recentPatients: Patient[] = [];
  stats: DashboardStats | null = null;
  loadingAppointments = true;
  loadingPatients = true;
  loadingStats = true;
  loadingCharts = true;

  // Chart data
  appointmentsTrendData: any;
  appointmentsByTypeData: any;

  appointmentColumns: TableColumn[] = [
    { key: 'time', label: 'Hora', sortable: true },
    { key: 'patient_name', label: 'Paciente', sortable: true },
    { key: 'type', label: 'Tipo', sortable: false },
    { key: 'room', label: 'Sala', sortable: false },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderStatus(value)
    }
  ];

  patientColumns: TableColumn[] = [
    { key: 'first_name', label: 'Nombre', sortable: true },
    { key: 'last_name', label: 'Apellido', sortable: true },
    { key: 'age', label: 'Edad', sortable: true },
    { key: 'blood_type', label: 'Grupo Sanguíneo', sortable: false },
    { key: 'last_visit', label: 'Última Visita', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderPatientStatus(value)
    }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadTodayAppointments();
    this.loadRecentPatients();
    this.loadStats();
    this.loadChartData();
  }

  loadTodayAppointments() {
    this.loadingAppointments = true;
    this.dashboardService.getTodayAppointments().subscribe({
      next: (data) => {
        this.todayAppointments = data;
        this.loadingAppointments = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loadingAppointments = false;
      }
    });
  }

  loadRecentPatients() {
    this.loadingPatients = true;
    this.dashboardService.getPatients(5).subscribe({
      next: (data) => {
        this.recentPatients = data;
        this.loadingPatients = false;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.loadingPatients = false;
      }
    });
  }

  loadStats() {
    this.loadingStats = true;
    this.dashboardService.getDashboardStats('DOCTOR').subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingStats = false;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.loadingStats = false;
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

  renderPatientStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      active: { label: 'Activo', class: 'status-active' },
      inactive: { label: 'Inactivo', class: 'status-inactive' }
    };

    const statusInfo = statusMap[status] || { label: status, class: '' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  onAppointmentClick(appointment: Appointment) {
    console.log('Appointment clicked:', appointment);
    // TODO: Navigate to appointment details or start consultation
  }

  onPatientClick(patient: Patient) {
    console.log('Patient clicked:', patient);
    // TODO: Navigate to patient medical history
  }

  loadChartData() {
    this.loadingCharts = true;
    this.dashboardService.getAppointmentChartData().subscribe({
      next: (data) => {
        // Trend chart (line chart)
        this.appointmentsTrendData = {
          labels: data.by_date.map((d: any) => {
            const date = new Date(d.date);
            return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          }),
          datasets: [{
            label: 'Mis Citas por Día',
            data: data.by_date.map((d: any) => d.count),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };

        // By type chart (doughnut)
        const typeLabels: { [key: string]: string } = {
          'consultation': 'Consulta',
          'followup': 'Seguimiento',
          'emergency': 'Emergencia',
          'surgery': 'Cirugía',
          'therapy': 'Terapia'
        };

        this.appointmentsByTypeData = {
          labels: data.by_type.map((d: any) => typeLabels[d.appointment_type] || d.appointment_type),
          datasets: [{
            data: data.by_type.map((d: any) => d.count),
            backgroundColor: [
              '#10B981',
              '#3B82F6',
              '#F59E0B',
              '#EF4444',
              '#8B5CF6'
            ]
          }]
        };

        this.loadingCharts = false;
      },
      error: (err) => {
        console.error('Error loading chart data:', err);
        this.loadingCharts = false;
      }
    });
  }
}
