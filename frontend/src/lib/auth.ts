// src/lib/auth.ts
import Cookies from 'js-cookie';

export type AuthRole = 'client' | 'freelancer';

export type AuthUser = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  role: 'CLIENT' | 'FREELANCER';
  provider?: string; // Lo añadimos para soportar Google
};

// Mapeo seguro del rol
export const getRoleFromUser = (user: AuthUser | null): AuthRole =>
  user?.role === 'FREELANCER' ? 'freelancer' : 'client';

/**
 * 🔒 INICIO DE SESIÓN (Enterprise Standard)
 */
export const saveAuthSession = (token: string, user: AuthUser) => {
  // 1. Guardamos el Token en una Cookie (Dura 7 días, es segura en producción)
  Cookies.set('fh_auth_token', token, { 
    expires: 7, 
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict' // Previene ataques CSRF
  });

  // 2. Guardamos la data UI en localStorage (No pasa nada si la leen, no tiene contraseñas)
  localStorage.setItem('fh_auth_user', JSON.stringify(user));
  localStorage.setItem('fh_auth_role', getRoleFromUser(user));
};

/**
 * 🔓 OBTENER USUARIO ACTUAL
 */
export const getStoredUser = (): AuthUser | null => {
  // Validamos si estamos en el navegador (Next.js tira error si llamas a localStorage en el Server)
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

/**
 * 🚪 CERRAR SESIÓN (Logout)
 */
export const clearAuthSession = () => {
  // Limpiamos todo
  Cookies.remove('fh_auth_token');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fh_auth_user');
    localStorage.removeItem('fh_auth_role');
  }
};

/**
 * 🛡️ OBTENER TOKEN (Útil para inyectarlo en Axios si es necesario)
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get('fh_auth_token');
};
