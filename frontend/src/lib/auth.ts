import Cookies from 'js-cookie';

export type AuthRole = 'client' | 'freelancer';

export type AuthUser = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  role: 'CLIENT' | 'FREELANCER';
  provider?: string; 
};

export const getRoleFromUser = (user: AuthUser | null): AuthRole =>
  user?.role === 'FREELANCER' ? 'freelancer' : 'client';


export const saveAuthSession = (token: string, user: AuthUser) => {
  Cookies.set('fh_auth_token', token, { 
    expires: 7, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  });

  localStorage.setItem('fh_auth_user', JSON.stringify(user));
  localStorage.setItem('fh_auth_role', getRoleFromUser(user));
};


export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const rawUser = localStorage.getItem('fh_auth_user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch (error) {
    console.error('Error parseando el usuario:', error);
    return null;
  }
};


export const clearAuthSession = () => {
  Cookies.remove('fh_auth_token');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fh_auth_user');
    localStorage.removeItem('fh_auth_role');
  }
};


export const getAuthToken = (): string | undefined => {
  return Cookies.get('fh_auth_token');
};
