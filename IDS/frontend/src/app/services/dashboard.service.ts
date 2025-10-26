import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
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
  getTasks(assignedTo?: string): Observable<Task[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Task[]>(`${this.apiUrl}/tasks/`);

    const mockTasks: Task[] = [
      { id: 1, title: 'Revisar resultados de laboratorio', description: 'Paciente Juan Pérez - Análisis pendiente', priority: 'high', status: 'pending', assigned_to: 'Dra. García', due_date: '2025-10-19', created_at: '2025-10-18' },
      { id: 2, title: 'Actualizar inventario de medicamentos', description: 'Verificar stock de antibióticos', priority: 'medium', status: 'in_progress', assigned_to: 'Farmacia', due_date: '2025-10-20', created_at: '2025-10-17' },
      { id: 3, title: 'Preparar sala de operaciones', description: 'Cirugía programada para mañana 08:00', priority: 'urgent', status: 'pending', assigned_to: 'Enfermería', due_date: '2025-10-20', created_at: '2025-10-19' },
      { id: 4, title: 'Llamar a paciente para confirmación', description: 'Confirmar cita del 21/10', priority: 'low', status: 'pending', assigned_to: 'Recepción', due_date: '2025-10-19', created_at: '2025-10-18' }
    ];

    return of(mockTasks).pipe(delay(300));
  }

  // ============ NOTIFICATIONS ============
  getNotifications(userId?: number): Observable<Notification[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Notification[]>(`${this.apiUrl}/notifications/`);

    const mockNotifications: Notification[] = [
      { id: 1, title: 'Nueva cita programada', message: 'Cita con Juan Pérez el 19/10 a las 09:00', type: 'info', read: false, created_at: '2025-10-18T15:30:00' },
      { id: 2, title: 'Resultado de laboratorio disponible', message: 'Análisis de sangre de María López', type: 'success', read: false, created_at: '2025-10-18T14:20:00' },
      { id: 3, title: 'Urgencia en sala de espera', message: 'Paciente requiere atención inmediata', type: 'warning', read: true, created_at: '2025-10-18T12:15:00' },
      { id: 4, title: 'Sistema actualizado', message: 'Nueva versión del sistema disponible', type: 'info', read: true, created_at: '2025-10-17T10:00:00' }
    ];

    return of(mockNotifications).pipe(delay(300));
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
    // TODO: Replace with actual API call
    // return this.http.get<VitalSigns[]>(`${this.apiUrl}/vital-signs/`);

    const mockVitalSigns: VitalSigns[] = [
      { id: 1, patient_id: 1, patient_name: 'Juan Pérez', temperature: 36.5, blood_pressure: '120/80', heart_rate: 72, respiratory_rate: 16, oxygen_saturation: 98, recorded_at: '2025-10-19T08:30:00', recorded_by: 'Enf. López' },
      { id: 2, patient_id: 2, patient_name: 'María López', temperature: 37.2, blood_pressure: '130/85', heart_rate: 78, respiratory_rate: 18, oxygen_saturation: 97, recorded_at: '2025-10-19T09:00:00', recorded_by: 'Enf. García' },
      { id: 3, patient_id: 3, patient_name: 'Carlos Rodríguez', temperature: 36.8, blood_pressure: '115/75', heart_rate: 68, respiratory_rate: 14, oxygen_saturation: 99, recorded_at: '2025-10-19T09:30:00', recorded_by: 'Enf. Martínez' }
    ];

    return of(mockVitalSigns).pipe(delay(300));
  }

}
