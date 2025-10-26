export interface Appointment {
  id?: number;
  patient: number;
  patient_name?: string;
  patient_details?: any;
  doctor: number;
  doctor_name?: string;
  doctor_details?: any;
  date: string;
  time: string;
  appointment_type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  room?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
