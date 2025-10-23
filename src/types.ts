// Types for reservation system
export interface Reservation {
  id: number;
  customer_id: number;
  party_size: number;
  reservation_time: string;
  duration_minutes: number;
  status: 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  created_at: string;
  updated_at: string;
}

// Auth types
export interface AuthUser {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

