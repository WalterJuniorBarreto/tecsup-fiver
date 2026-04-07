import { api } from '../config/axios';
import { RegisterData, AuthResponse, VerifyEmailData } from '../types/auth.types';
import { isAxiosError } from 'axios';

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
  }

};