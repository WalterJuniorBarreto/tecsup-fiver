import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const orderService = {
  // 🚀 Para el Cliente (Tus compras)
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

  // 🚀 Para el Freelancer (Tus ventas / Pedidos recibidos)
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

  // 🚀 NUEVO: Para actualizar la barra de progreso y el estado
  updateProgress: async (orderId: string, progress: number) => {
    try {
      const headers = getAuthHeader();
      // Llamamos a una nueva ruta PATCH en tu backend
      const response = await api.patch(`/api/orders/${orderId}/progress`, { progress }, { headers });
      return response.data;
    } catch (error) {
      console.error("❌ Error actualizando el progreso:", error);
      throw error;
    }
  }
};