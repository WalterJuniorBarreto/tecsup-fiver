export type UserRole = 'CLIENT' | 'FREELANCER' | 'ADMIN';

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
      avatar?: string | null;
      role: UserRole;
      provider: string; 
    };
    isNewUser?: boolean;
    onboardingRequired?: boolean;
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
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string; 
  newPassword: string;
}

export interface AuthMessageResponse {
  status: 'success' | 'error';
  message?: string; 
  data?: {
    message: string; 
  };
  issues?: string[]; 
}


export interface GithubLoginData {
  code: string;
  role?: UserRole;
}

export interface OAuthOnboardingData {
  username: string;
  role: 'CLIENT' | 'FREELANCER';
}
