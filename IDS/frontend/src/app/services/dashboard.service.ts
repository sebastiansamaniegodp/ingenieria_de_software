import { Injectable } from '@angular/core';
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
  // Base URL for future API integration
  private apiUrl = 'http://localhost:8000/api';

  constructor() {}

  // ============ APPOINTMENTS ============
  getAppointments(role?: string, userId?: number): Observable<Appointment[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/`);

    const mockAppointments: Appointment[] = [
      { id: 1, patient_name: 'Juan Pérez', doctor_name: 'Dra. García', date: '2025-10-19', time: '09:00', type: 'Consulta General', status: 'scheduled', room: 'Consultorio 1' },
      { id: 2, patient_name: 'María López', doctor_name: 'Dr. Martínez', date: '2025-10-19', time: '10:30', type: 'Control', status: 'in_progress', room: 'Consultorio 2' },
      { id: 3, patient_name: 'Carlos Rodríguez', doctor_name: 'Dra. Fernández', date: '2025-10-19', time: '11:00', type: 'Urgencia', status: 'scheduled', room: 'Emergencia' },
      { id: 4, patient_name: 'Ana Martín', doctor_name: 'Dr. Sánchez', date: '2025-10-20', time: '14:00', type: 'Seguimiento', status: 'scheduled', room: 'Consultorio 3' },
      { id: 5, patient_name: 'Pedro González', doctor_name: 'Dra. García', date: '2025-10-21', time: '09:30', type: 'Revisión', status: 'scheduled', room: 'Consultorio 1' }
    ];

    return of(mockAppointments).pipe(delay(300)); // Simulate network delay
  }

  getTodayAppointments(): Observable<Appointment[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/today/`);

    const today = new Date().toISOString().split('T')[0];
    const mockAppointments: Appointment[] = [
      { id: 1, patient_name: 'Juan Pérez', doctor_name: 'Dra. García', date: today, time: '09:00', type: 'Consulta General', status: 'scheduled', room: 'Consultorio 1' },
      { id: 2, patient_name: 'María López', doctor_name: 'Dr. Martínez', date: today, time: '10:30', type: 'Control', status: 'in_progress', room: 'Consultorio 2' },
      { id: 3, patient_name: 'Carlos Rodríguez', doctor_name: 'Dra. Fernández', date: today, time: '11:00', type: 'Urgencia', status: 'scheduled', room: 'Emergencia' }
    ];

    return of(mockAppointments).pipe(delay(300));
  }

  // ============ PATIENTS ============
  getPatients(limit?: number): Observable<Patient[]> {
    // TODO: Replace with actual API call
    // return this.http.get<Patient[]>(`${this.apiUrl}/patients/`);

    const mockPatients: Patient[] = [
      { id: 1, first_name: 'Juan', last_name: 'Pérez', email: 'juan@example.com', age: 45, gender: 'M', blood_type: 'O+', phone: '555-0101', last_visit: '2025-10-15', status: 'active' },
      { id: 2, first_name: 'María', last_name: 'López', email: 'maria@example.com', age: 32, gender: 'F', blood_type: 'A+', phone: '555-0102', last_visit: '2025-10-18', status: 'active' },
      { id: 3, first_name: 'Carlos', last_name: 'Rodríguez', email: 'carlos@example.com', age: 28, gender: 'M', blood_type: 'B+', phone: '555-0103', last_visit: '2025-10-10', status: 'active' },
      { id: 4, first_name: 'Ana', last_name: 'Martín', email: 'ana@example.com', age: 51, gender: 'F', blood_type: 'AB+', phone: '555-0104', last_visit: '2025-10-12', status: 'active' },
      { id: 5, first_name: 'Pedro', last_name: 'González', email: 'pedro@example.com', age: 39, gender: 'M', blood_type: 'O-', phone: '555-0105', last_visit: '2025-10-14', status: 'active' }
    ];

    const result = limit ? mockPatients.slice(0, limit) : mockPatients;
    return of(result).pipe(delay(300));
  }

  // ============ MEDICAL RECORDS ============
  getMedicalRecords(patientId?: number, type?: string): Observable<MedicalRecord[]> {
    // TODO: Replace with actual API call
    // return this.http.get<MedicalRecord[]>(`${this.apiUrl}/medical-records/`);

    const mockRecords: MedicalRecord[] = [
      { id: 1, patient_id: 1, patient_name: 'Juan Pérez', date: '2025-10-18', type: 'lab_result', title: 'Análisis de Sangre', description: 'Hemograma completo - Resultados normales', doctor_name: 'Dra. García', status: 'completed' },
      { id: 2, patient_id: 1, patient_name: 'Juan Pérez', date: '2025-10-15', type: 'prescription', title: 'Receta Médica', description: 'Ibuprofeno 400mg - 1 cada 8 horas', doctor_name: 'Dr. Martínez', status: 'completed' },
      { id: 3, patient_id: 2, patient_name: 'María López', date: '2025-10-17', type: 'diagnosis', title: 'Diagnóstico', description: 'Hipertensión arterial leve', doctor_name: 'Dr. Sánchez', status: 'reviewed' },
      { id: 4, patient_id: 3, patient_name: 'Carlos Rodríguez', date: '2025-10-16', type: 'lab_result', title: 'Radiografía de Tórax', description: 'Sin hallazgos patológicos', doctor_name: 'Dra. Fernández', status: 'pending' }
    ];

    return of(mockRecords).pipe(delay(300));
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
    // TODO: Replace with actual API call
    // return this.http.get<DashboardStats>(`${this.apiUrl}/stats/`);

    const mockStats: DashboardStats = {
      total_patients: 248,
      total_appointments: 87,
      appointments_today: 12,
      active_staff: 45,
      bed_occupancy: 78,
      pending_tasks: 15,
      unread_notifications: 3
    };

    return of(mockStats).pipe(delay(300));
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

  // ============ HELPER METHODS FOR FUTURE API INTEGRATION ============

  // Example of how to migrate to real API calls:
  /*
  import { HttpClient } from '@angular/common/http';

  constructor(private http: HttpClient) {}

  getAppointments(role?: string, userId?: number): Observable<Appointment[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    if (userId) params = params.set('user_id', userId.toString());

    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments/`, { params });
  }
  */
}
