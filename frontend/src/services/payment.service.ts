import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth'; 

export const paymentService = {
  createPreference: async (serviceId: string, title: string, price: number) => {
    const response = await api.post(
      '/api/payments/create-preference', 
      { serviceId, title, price },
      { headers: getAuthHeader() } 
    );
    
    return response.data.initPoint; 
  },

  checkAccess: async (serviceId: string) => {
    const headers = getAuthHeader();
    
    if (Object.keys(headers).length === 0) return false;

    try {
      const response = await api.get(`/api/payments/check-access/${serviceId}`, {
        headers 
      });
      return response.data.hasPaid;
    } catch (error) {
      console.error("Error verificando acceso", error);
      return false; 
    }
  },

  verifyPayment: async (paymentId: string) => {
    const headers = getAuthHeader();
    try {
      const response = await api.post('/api/webhook', { paymentId }, { headers });
      return response.data.synced;
    } catch (error) {
      console.error("Error verificando pago con backend", error);
      return false;
    }
  }
};