import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { isAxiosError } from 'axios';

export const subscriptionService = {
  createSubscriptionIntent: async (planId: 'PRO' | 'ELITE'): Promise<string> => {
    try {
      const response = await api.post(
        '/api/subscriptions/create-intent',
        { planId },
        { headers: getAuthHeader() }
      );

      return response.data.data.clientSecret;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error al preparar el pago');
      }

      throw new Error('Error de conexion con el servidor');
    }
  }
};