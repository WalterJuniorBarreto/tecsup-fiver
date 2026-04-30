import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const orderService = {
  getMyOrders: async () => {
    try {
      const response = await api.get('/api/payments/my-orders', { 
        headers: getAuthHeader() 
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  getReceivedOrders: async () => {
    const response = await api.get('/api/payments/received-orders', { headers: getAuthHeader() });
    return response.data.data;
  },
  updateProgress: async (orderId: string, progress: number) => {
    const response = await api.post('/api/payments/update-progress', { orderId, progress }, { headers: getAuthHeader() });
    return response.data.data;
  }
};