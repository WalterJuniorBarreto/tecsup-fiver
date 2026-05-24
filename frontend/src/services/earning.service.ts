import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const earningService = {
  getSummary: async () => {
    try {
      const response = await api.get('/api/earnings/summary', {
        headers: getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error("Error obteniendo el resumen de ganancias", error);
      throw error;
    }
  },

  getTransactions: async () => {
    try {
      const response = await api.get('/api/earnings/transactions', {
        headers: getAuthHeader()
      });
      return response.data.data;
    } catch (error) {
      console.error("Error obteniendo transacciones", error);
      throw error;
    }
  },

  requestWithdrawal: async (amount: number, destination: string) => {
    try {
      const response = await api.post('/api/earnings/withdraw', { amount, destination }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al procesar el retiro');
    }
  }
};