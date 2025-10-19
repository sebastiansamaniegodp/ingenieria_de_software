export interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress';
  room?: string;
}
