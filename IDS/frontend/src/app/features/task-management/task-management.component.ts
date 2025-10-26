import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { Task, Patient } from '../../models';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent implements OnInit {
  tasks: Task[] = [];
  staffUsers: any[] = [];
  patients: Patient[] = [];
  loading = true;
  loadingUsers = true;
  showForm = false;
  editingTask: Task | null = null;

  newTask: Partial<Task> = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assigned_to: undefined,
    patient: undefined,
    due_date: undefined
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadTasks();
    this.loadStaffUsers();
    this.loadPatients();
  }

  loadTasks() {
    this.loading = true;
    this.dashboardService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loading = false;
      }
    });
  }

  loadStaffUsers() {
    this.loadingUsers = true;
    this.dashboardService.getStaffUsers().subscribe({
      next: (data) => {
        // Filtrar solo staff, nurses y admins
        this.staffUsers = data.filter(user =>
          ['STAFF', 'NURSE', 'ADMIN'].includes(user.role)
        );
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error loading staff users:', err);
        this.loadingUsers = false;
      }
    });
  }

  loadPatients() {
    this.dashboardService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.editingTask = null;
    this.newTask = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      assigned_to: undefined,
      patient: undefined,
      due_date: undefined
    };
  }

  saveTask() {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.assigned_to) {
      alert('Por favor completa los campos obligatorios: Título, Descripción y Usuario Asignado');
      return;
    }

    // Limpiar campos undefined antes de enviar
    const taskData: any = {
      title: this.newTask.title,
      description: this.newTask.description,
      assigned_to: this.newTask.assigned_to,
      priority: this.newTask.priority || 'medium',
      status: this.newTask.status || 'pending'
    };

    // Solo incluir campos opcionales si tienen valor
    if (this.newTask.patient) {
      taskData.patient = this.newTask.patient;
    }
    if (this.newTask.due_date) {
      taskData.due_date = this.newTask.due_date;
    }

    if (this.editingTask) {
      // Update existing task
      this.dashboardService.updateTask(this.editingTask.id, taskData).subscribe({
        next: () => {
          this.loadTasks();
          this.toggleForm();
        },
        error: (err) => {
          console.error('Error updating task:', err);
          const errorMsg = err.error?.detail || err.error || 'Error al actualizar la tarea';
          alert(`Error: ${JSON.stringify(errorMsg)}`);
        }
      });
    } else {
      // Create new task
      this.dashboardService.createTask(taskData).subscribe({
        next: () => {
          this.loadTasks();
          this.toggleForm();
        },
        error: (err) => {
          console.error('Error creating task:', err);
          const errorMsg = err.error?.detail || err.error || 'Error al crear la tarea';
          alert(`Error: ${JSON.stringify(errorMsg)}`);
        }
      });
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.newTask = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assigned_to: task.assigned_to,
      patient: task.patient,
      due_date: task.due_date
    };
    this.showForm = true;
  }

  deleteTask(taskId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.dashboardService.deleteTask(taskId).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          alert('Error al eliminar la tarea');
        }
      });
    }
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'urgent': 'priority-urgent'
    };
    return classes[priority] || '';
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'in_progress': 'status-in-progress',
      'completed': 'status-completed'
    };
    return classes[status] || '';
  }

  formatPriority(priority: string): string {
    const labels: { [key: string]: string } = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  }

  formatStatus(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_progress': 'En Progreso',
      'completed': 'Completada'
    };
    return labels[status] || status;
  }
}
