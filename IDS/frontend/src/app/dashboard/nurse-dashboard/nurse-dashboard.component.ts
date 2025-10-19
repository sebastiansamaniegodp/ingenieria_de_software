import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { DashboardService } from '../../services/dashboard.service';
import { Patient, VitalSigns, Task } from '../../models';

@Component({
  selector: 'app-nurse-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './nurse-dashboard.component.html',
  styleUrl: './nurse-dashboard.component.css'
})
export class NurseDashboardComponent implements OnInit {
  assignedPatients: Patient[] = [];
  vitalSigns: VitalSigns[] = [];
  tasks: Task[] = [];
  loadingPatients = true;
  loadingVitals = true;
  loadingTasks = true;

  patientColumns: TableColumn[] = [
    { key: 'first_name', label: 'Nombre', sortable: true },
    { key: 'last_name', label: 'Apellido', sortable: true },
    { key: 'age', label: 'Edad', sortable: true },
    { key: 'blood_type', label: 'Grupo Sanguíneo', sortable: false },
    { key: 'room', label: 'Habitación', sortable: false },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderPatientStatus(value)
    }
  ];

  vitalSignsColumns: TableColumn[] = [
    { key: 'patient_name', label: 'Paciente', sortable: true },
    {
      key: 'temperature',
      label: 'Temp. (°C)',
      sortable: true,
      render: (value) => value ? `${value}°C` : '-'
    },
    { key: 'blood_pressure', label: 'Presión', sortable: false },
    {
      key: 'heart_rate',
      label: 'FC (lpm)',
      sortable: true,
      render: (value) => value ? `${value}` : '-'
    },
    {
      key: 'oxygen_saturation',
      label: 'SpO2 (%)',
      sortable: true,
      render: (value) => value ? `${value}%` : '-'
    },
    {
      key: 'recorded_at',
      label: 'Fecha/Hora',
      sortable: true,
      render: (value) => this.formatDateTime(value)
    }
  ];

  taskColumns: TableColumn[] = [
    { key: 'title', label: 'Tarea', sortable: true },
    {
      key: 'priority',
      label: 'Prioridad',
      sortable: true,
      render: (value) => this.renderPriority(value)
    },
    { key: 'due_date', label: 'Vencimiento', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderTaskStatus(value)
    }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadAssignedPatients();
    this.loadVitalSigns();
    this.loadTasks();
  }

  loadAssignedPatients() {
    this.loadingPatients = true;
    this.dashboardService.getPatients().subscribe({
      next: (data) => {
        this.assignedPatients = data;
        this.loadingPatients = false;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.loadingPatients = false;
      }
    });
  }

  loadVitalSigns() {
    this.loadingVitals = true;
    this.dashboardService.getVitalSigns().subscribe({
      next: (data) => {
        this.vitalSigns = data;
        this.loadingVitals = false;
      },
      error: (err) => {
        console.error('Error loading vital signs:', err);
        this.loadingVitals = false;
      }
    });
  }

  loadTasks() {
    this.loadingTasks = true;
    this.dashboardService.getTasks('Enfermería').subscribe({
      next: (data) => {
        this.tasks = data.filter(t => t.status !== 'completed');
        this.loadingTasks = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loadingTasks = false;
      }
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  renderPatientStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      active: { label: 'Activo', class: 'status-active' },
      inactive: { label: 'Inactivo', class: 'status-inactive' }
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

  renderTaskStatus(status: string): string {
    const statusMap: { [key: string]: { label: string; class: string } } = {
      pending: { label: 'Pendiente', class: 'status-pending' },
      in_progress: { label: 'En Curso', class: 'status-in-progress' },
      completed: { label: 'Completada', class: 'status-completed' }
    };

    const statusInfo = statusMap[status] || { label: status, class: '' };
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>`;
  }

  onPatientClick(patient: Patient) {
    console.log('Patient clicked:', patient);
    // TODO: Navigate to patient details
  }

  onVitalSignsClick(vital: VitalSigns) {
    console.log('Vital signs clicked:', vital);
    // TODO: Show vital signs history
  }

  onTaskClick(task: Task) {
    console.log('Task clicked:', task);
    // TODO: Update task status or show details
  }
}
