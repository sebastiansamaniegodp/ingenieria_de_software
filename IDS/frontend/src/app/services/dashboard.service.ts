import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Appointment,
  Patient,
  MedicalRecord,
  Task,
  Notification,
  DashboardStats,
  VitalSigns
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Base URL for API integration
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ============ APPOINTMENTS ============
  getAppointments(role?: string, userId?: number): Observable<Appointment[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    if (userId) params = params.set('user_id', userId.toString());

    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/`, { params });
  }

  getTodayAppointments(): Observable<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const params = new HttpParams().set('date', today);

    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/`, { params });
  }

  // ============ PATIENTS ============
  getPatients(limit?: number): Observable<Patient[]> {
    let params = new HttpParams();
    if (limit) {
      // Note: Django REST Framework doesn't have a built-in limit parameter,
      // so we'll fetch all and slice on the frontend for now
      // TODO: Add pagination support on backend
    }

    return this.http.get<Patient[]>(`${this.apiUrl}/patients/`, { params });
  }

  // ============ MEDICAL RECORDS ============
  getMedicalRecords(patientId?: number, type?: string): Observable<MedicalRecord[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId.toString());
    if (type) params = params.set('type', type);

    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/medical-records/`, { params });
  }

  // ============ TASKS ============
  getTasks(assignedTo?: number): Observable<Task[]> {
    let params = new HttpParams();
    if (assignedTo) params = params.set('assigned_to', assignedTo.toString());

    return this.http.get<Task[]>(`${this.apiUrl}/tasks/`, { params });
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks/`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}/`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}/`);
  }

  getStaffUsers(): Observable<any[]> {
    // Obtener todos los usuarios y filtrar solo staff/nurse/admin
    return this.http.get<any[]>(`${this.apiUrl}/auth/users/`);
  }

  // ============ NOTIFICATIONS ============
  getNotifications(userId?: number): Observable<Notification[]> {
    let params = new HttpParams();
    if (userId) params = params.set('user', userId.toString());

    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/`, { params });
  }

  markNotificationAsRead(notificationId: number): Observable<Notification> {
    return this.http.post<Notification>(
      `${this.apiUrl}/notifications/${notificationId}/mark_as_read/`,
      {}
    );
  }

  markAllNotificationsAsRead(userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/notifications/mark_all_as_read/`,
      { user_id: userId }
    );
  }

  // ============ STATS ============
  getDashboardStats(role?: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/auth/dashboard/stats/`);
  }

  // ============ CHART DATA ============
  getAppointmentChartData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/appointments/chart_data/`);
  }

  // ============ VITAL SIGNS ============
  getVitalSigns(patientId?: number): Observable<VitalSigns[]> {
    let params = new HttpParams();
    if (patientId) params = params.set('patient', patientId.toString());

    return this.http.get<VitalSigns[]>(`${this.apiUrl}/vital-signs/`, { params });
  }

}
