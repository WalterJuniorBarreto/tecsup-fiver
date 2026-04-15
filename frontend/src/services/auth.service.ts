import { api } from '../config/axios';
import { RegisterData, AuthResponse, VerifyEmailData, LoginData, GoogleLoginData } from '../types/auth.types';
import { isAxiosError } from 'axios';


const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (isAxiosError(error) && error.response) {
    const errorMessage = error.response.data.message || error.response.data.issues?.join(', ') || defaultMessage;
    throw new Error(errorMessage);
  }
  
  throw new Error('Error de conexión con el servidor');
};

export const authService = {
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || error.response.data.issues?.join(', ') || 'Error de servidor';
        throw new Error(errorMessage);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },


  verifyEmail: async (data: VerifyEmailData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/verify-email', data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Error al verificar el código';
        throw new Error(errorMessage);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || error.response.data.issues?.join(', ') || 'Error al iniciar sesión';
        throw new Error(errorMessage);
      }
      throw new Error('Error de conexión con el servidor');
    }
  },

  googleLogin: async (data: GoogleLoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/auth/google', data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Error en la autenticación con Google');
    }
  }

};