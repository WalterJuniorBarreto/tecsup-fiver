import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const orderService = {
  getMyOrders: async () => {
    try {
      const headers = getAuthHeader();
      const response = await api.get('/api/orders/my-orders', { headers });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo mis pedidos:", error);
      return []; 
    }
  },

  getReceivedOrders: async () => {
    try {
      const headers = getAuthHeader();
      const response = await api.get('/api/orders/my-sales', { headers });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo pedidos recibidos:", error);
      return [];
    }
  },

  updateProgress: async (orderId: string, progress: number) => {
    try {
      const headers = getAuthHeader();
      const response = await api.patch(`/api/orders/${orderId}/progress`, { progress }, { headers });
      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando el progreso:", error);
      throw error;
    }
  }
};