export interface MedicalRecord {
  id: number;
  patient_id: number;
  patient_name: string;
  date: string;
  type: 'lab_result' | 'prescription' | 'diagnosis' | 'note';
  title: string;
  description: string;
  doctor_name?: string;
  status?: 'pending' | 'completed' | 'reviewed';
}
