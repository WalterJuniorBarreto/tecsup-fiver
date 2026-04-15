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
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: UserRole;
      provider: string; 
    };
  };
  issues?: string[]; 
}

export interface VerifyEmailData {
  email: string;
  code: string; 
}
export interface LoginData {
  email: string;
  password: string;
}


export interface GoogleLoginData {
  token: string;
  role?: UserRole;
}