import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { ChartComponent } from '../../shared/chart/chart.component';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats, Appointment, Patient, Task } from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ChartComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentAppointments: Appointment[] = [];
  recentPatients: Patient[] = [];
  systemTasks: Task[] = [];
  loadingStats = true;
  loadingAppointments = true;
  loadingPatients = true;
  loadingTasks = true;
  loadingCharts = true;

  // Chart data
  appointmentsTrendData: any;
  appointmentsByTypeData: any;
  appointmentsByStatusData: any;

  appointmentColumns: TableColumn[] = [
    { key: 'date', label: 'Fecha', sortable: true },
    { key: 'time', label: 'Hora', sortable: true },
    { key: 'patient_name', label: 'Paciente', sortable: true },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderAppointmentStatus(value)
    }
  ];

  patientColumns: TableColumn[] = [
    { key: 'first_name', label: 'Nombre', sortable: true },
    { key: 'last_name', label: 'Apellido', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Teléfono', sortable: false },
    { key: 'last_visit', label: 'Última Visita', sortable: true }
  ];

  taskColumns: TableColumn[] = [
    { key: 'title', label: 'Tarea', sortable: true },
    { key: 'assigned_to', label: 'Asignado a', sortable: true },
    {
      key: 'priority',
      label: 'Prioridad',
      sortable: true,
      render: (value) => this.renderPriority(value)
    },
    { key: 'due_date', label: 'Vencimiento', sortable: true }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentAppointments();
    this.loadRecentPatients();
    this.loadSystemTasks();
    this.loadChartData();
  }

  loadStats() {
    this.loadingStats = true;
    this.dashboardService.getDashboardStats('ADMIN').subscribe({
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

  loadRecentAppointments() {
    this.loadingAppointments = true;
    this.dashboardService.getTodayAppointments().subscribe({
      next: (data) => {
        this.recentAppointments = data;
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

  loadSystemTasks() {
    this.loadingTasks = true;
    this.dashboardService.getTasks().subscribe({
      next: (data) => {
        this.systemTasks = data.filter(t => t.status !== 'completed').slice(0, 5);
        this.loadingTasks = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loadingTasks = false;
      }
    });
  }

  renderAppointmentStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      scheduled: { label: 'Programada', class: 'status-scheduled' },
      in_progress: { label: 'En Curso', class: 'status-in-progress' },
      completed: { label: 'Completada', class: 'status-completed' },
      cancelled: { label: 'Cancelada', class: 'status-cancelled' }
    };

    const statusInfo = statusMap[status] || { label: status, class: '' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  renderPriority(priority: string): string {
    const priorityMap: { [key: string]: { label: string; class: string } } = {
      low: { label: 'Baja', class: 'priority-low' },
      medium: { label: 'Media', class: 'priority-medium' },
      high: { label: 'Alta', class: 'priority-high' },
      urgent: { label: 'Urgente', class: 'priority-urgent' }
    };

    const priorityInfo = priorityMap[priority] || { label: priority, class: '' };
    return `<span class="status-badge ${priorityInfo.class}">${priorityInfo.label}</span>`;
  }

  onAppointmentClick(appointment: Appointment) {
    console.log('Appointment clicked:', appointment);
    // TODO: Navigate to appointment details
  }

  onPatientClick(patient: Patient) {
    console.log('Patient clicked:', patient);
    // TODO: Navigate to patient details
  }

  onTaskClick(task: Task) {
    console.log('Task clicked:', task);
    // TODO: Navigate to task management
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
            label: 'Citas por Día',
            data: data.by_date.map((d: any) => d.count),
            borderColor: '#5a6c7d',
            backgroundColor: 'rgba(90, 108, 125, 0.1)',
            tension: 0.4,
            fill: true
          }]
        };

        // By type chart (pie chart)
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
              '#5a6c7d',
              '#6b7985',
              '#7a8c9d',
              '#8a9aad',
              '#9aaabd'
            ]
          }]
        };

        // By status chart (doughnut chart)
        const statusLabels: { [key: string]: string } = {
          'scheduled': 'Programada',
          'in_progress': 'En Curso',
          'completed': 'Completada',
          'cancelled': 'Cancelada'
        };

        this.appointmentsByStatusData = {
          labels: data.by_status.map((d: any) => statusLabels[d.status] || d.status),
          datasets: [{
            data: data.by_status.map((d: any) => d.count),
            backgroundColor: [
              '#6b7985',
              '#7a8c9d',
              '#8a9aad',
              '#9aaabd'
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
