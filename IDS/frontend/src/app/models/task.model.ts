export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: number;
  assigned_to_name?: string;
  patient?: number;
  patient_name?: string;
  appointment?: number;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}
