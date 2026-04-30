import Cookies from 'js-cookie';

// 🚀 1. AÑADIMOS EL 'admin' AL TIPO FRONTEND
export type AuthRole = 'client' | 'freelancer' | 'admin';

// 🚀 2. AÑADIMOS EL 'ADMIN' AL TIPO DE LA BD
export type AuthUser = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatar?: string | null;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN'; 
  provider?: string; 
};

const AUTH_USER_STORAGE_KEY = 'fh_auth_user';
const AUTH_ROLE_STORAGE_KEY = 'fh_auth_role';
const AUTH_SESSION_UPDATED_EVENT = 'fh-auth-session-updated';

export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🚀 3. LE ENSEÑAMOS A MAPEAR EL ROL DE ADMIN
export const getRoleFromUser = (user: AuthUser | null): AuthRole => {
  if (user?.role === 'ADMIN') return 'admin';
  if (user?.role === 'FREELANCER') return 'freelancer';
  return 'client';
};


export const saveAuthSession = (token: string, user: AuthUser) => {
  Cookies.set('fh_auth_token', token, { 
    expires: 7, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  });

  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, getRoleFromUser(user));
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_UPDATED_EVENT, { detail: user }));
};


export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const rawUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch (error) {
    console.error('Error parseando el usuario:', error);
    return null;
  }
};

export const updateStoredUser = (partialUser: Partial<AuthUser>) => {
  if (typeof window === 'undefined') return;

  const currentUser = getStoredUser();
  if (!currentUser) return;

  const nextUser: AuthUser = { ...currentUser, ...partialUser };
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser));
  localStorage.setItem(AUTH_ROLE_STORAGE_KEY, getRoleFromUser(nextUser));
  window.dispatchEvent(new CustomEvent(AUTH_SESSION_UPDATED_EVENT, { detail: nextUser }));
};

export const subscribeToAuthUser = (callback: (user: AuthUser | null) => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleSessionUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<AuthUser | null>;
    callback(customEvent.detail ?? getStoredUser());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_USER_STORAGE_KEY) {
      callback(getStoredUser());
    }
  };

  window.addEventListener(AUTH_SESSION_UPDATED_EVENT, handleSessionUpdate as EventListener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(AUTH_SESSION_UPDATED_EVENT, handleSessionUpdate as EventListener);
    window.removeEventListener('storage', handleStorage);
  };
};

export const clearAuthSession = () => {
  Cookies.remove('fh_auth_token');
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    localStorage.removeItem(AUTH_ROLE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_SESSION_UPDATED_EVENT, { detail: null }));
  }
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('fh_auth_token');
}; 