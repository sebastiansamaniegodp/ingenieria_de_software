export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  age?: number;
  gender?: 'M' | 'F' | 'Other';
  blood_type?: string;
  phone?: string;
  address?: string;
  last_visit?: string;
  status?: 'active' | 'inactive';
}
