'use client';

export type AuthRole = 'client' | 'freelancer';

export type AuthUser = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  role: 'CLIENT' | 'FREELANCER';
};

export const getRoleFromUser = (user: AuthUser | null): AuthRole =>
  user?.role === 'FREELANCER' ? 'freelancer' : 'client';

export const saveAuthSession = (token: string, user: AuthUser) => {
  localStorage.setItem('fh_auth_token', token);
  localStorage.setItem('fh_auth_user', JSON.stringify(user));
  localStorage.setItem('fh_auth_role', getRoleFromUser(user));
};

export const getStoredUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem('fh_auth_user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem('fh_auth_token');
  localStorage.removeItem('fh_auth_user');
  localStorage.removeItem('fh_auth_role');
};
