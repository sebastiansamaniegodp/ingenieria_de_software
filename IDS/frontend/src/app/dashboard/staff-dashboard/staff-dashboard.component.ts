import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../shared/data-table/data-table.component';
import { DashboardService } from '../../services/dashboard.service';
import { Task, Notification, Appointment } from '../../models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent implements OnInit {
  myTasks: Task[] = [];
  notifications: Notification[] = [];
  todayAppointments: Appointment[] = [];
  loadingTasks = true;
  loadingNotifications = true;
  loadingAppointments = true;

  taskColumns: TableColumn[] = [
    { key: 'title', label: 'Tarea', sortable: true },
    { key: 'description', label: 'Descripción', sortable: false },
    {
      key: 'priority',
      label: 'Prioridad',
      sortable: true,
      render: (value) => this.renderPriority(value)
    },
    { key: 'due_date', label: 'Fecha Límite', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderTaskStatus(value)
    }
  ];

  notificationColumns: TableColumn[] = [
    { key: 'title', label: 'Título', sortable: true },
    { key: 'message', label: 'Mensaje', sortable: false },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (value) => this.renderNotificationType(value)
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (value) => this.formatDateTime(value)
    },
    {
      key: 'read',
      label: 'Leída',
      sortable: true,
      render: (value) => this.renderReadStatus(value)
    }
  ];

  appointmentColumns: TableColumn[] = [
    { key: 'time', label: 'Hora', sortable: true },
    { key: 'patient_name', label: 'Paciente', sortable: true },
    { key: 'doctor_name', label: 'Doctor', sortable: true },
    { key: 'room', label: 'Sala', sortable: false },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => this.renderAppointmentStatus(value)
    }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadMyTasks();
    this.loadNotifications();
    this.loadTodayAppointments();
  }

  loadMyTasks() {
    this.loadingTasks = true;
    this.dashboardService.getTasks().subscribe({
      next: (data) => {
        this.myTasks = data;
        this.loadingTasks = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loadingTasks = false;
      }
    });
  }

  loadNotifications() {
    this.loadingNotifications = true;
    this.dashboardService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loadingNotifications = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.loadingNotifications = false;
      }
    });
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

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  renderNotificationType(type: string): string {
    const typeMap: { [key: string]: { label: string; class: string } } = {
      info: { label: 'Info', class: 'type-info' },
      warning: { label: 'Alerta', class: 'type-warning' },
      success: { label: 'Éxito', class: 'type-success' },
      error: { label: 'Error', class: 'type-error' }
    };

    const typeInfo = typeMap[type] || { label: type, class: '' };
    return `<span class="status-badge ${typeInfo.class}">${typeInfo.label}</span>`;
  }

  renderReadStatus(read: boolean): string {
    return read
      ? '<span class="status-badge status-read">✓ Leída</span>'
      : '<span class="status-badge status-unread">✗ No leída</span>';
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

  onTaskClick(task: Task) {
    console.log('Task clicked:', task);
    // TODO: Show task details or update status
  }

  onNotificationClick(notification: Notification) {
    console.log('Notification clicked:', notification);
    // TODO: Mark as read and show details
  }

  onAppointmentClick(appointment: Appointment) {
    console.log('Appointment clicked:', appointment);
    // TODO: Show appointment details
  }

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get pendingTasks(): number {
    return this.myTasks.filter(t => t.status !== 'completed').length;
  }
}
