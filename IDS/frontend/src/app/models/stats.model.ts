export interface DashboardStats {
  total_patients?: number;
  total_appointments?: number;
  appointments_today?: number;
  active_staff?: number;
  bed_occupancy?: number;
  pending_tasks?: number;
  unread_notifications?: number;
}

export interface VitalSigns {
  id: number;
  patient_id: number;
  patient_name: string;
  temperature?: number;
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  recorded_at: string;
  recorded_by: string;
}
