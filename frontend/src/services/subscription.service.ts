import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { isAxiosError } from 'axios';

export const subscriptionService = {
  createPaymentLink: async (planId: 'PRO' | 'ELITE'): Promise<string> => {
    try {
      const response = await api.post(
        '/api/subscriptions/create-preference', 
        { planId }, 
        { headers: getAuthHeader() }
      );
      return response.data.data.paymentUrl;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al generar el link de pago');
      }
      throw new Error('Error de conexión con el servidor');
    }
  }
};