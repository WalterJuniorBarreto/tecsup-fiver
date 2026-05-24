import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { isAxiosError } from 'axios';

type PaidPlanId = 'PRO' | 'ELITE';

export const paypalService = {
  createSubscriptionOrder: async (planId: PaidPlanId): Promise<string> => {
    try {
      const response = await api.post(
        '/api/paypal/subscriptions/create-order',
        { planId },
        { headers: getAuthHeader() }
      );

      return response.data.data.orderId;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'No se pudo crear la orden de PayPal');
      }

      throw new Error('Error de conexion con PayPal');
    }
  },

  captureSubscriptionOrder: async (orderId: string, planId: PaidPlanId) => {
    try {
      const response = await api.post(
        '/api/paypal/subscriptions/capture-order',
        { orderId, planId },
        { headers: getAuthHeader() }
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'No se pudo capturar el pago de PayPal');
      }

      throw new Error('Error de conexion con PayPal');
    }
  },
};
