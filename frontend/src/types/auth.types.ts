export type UserRole = 'CLIENT' | 'FREELANCER';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    id: string;
    email: string;
    role: UserRole;
  };
  issues?: string[]; 
}

export interface VerifyEmailData {
  email: string;
  code: string; 
}