import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { ServiceData, ServiceStats } from '../types/freelance.types';

export const freelanceService = {
  getStats: async (): Promise<ServiceStats> => {
    const response = await api.get('/api/freelance/stats', { headers: getAuthHeader() });
    return response.data.data;
  },

  getMyServices: async (): Promise<ServiceData[]> => {
    const response = await api.get('/api/freelance/my-services', { headers: getAuthHeader() });
    return response.data.data;
  },

  createService: async (data: { title: string; description: string; price: number; deliveryDays: number; image?: string }): Promise<ServiceData> => {
    const response = await api.post('/api/freelance/create', data, { headers: getAuthHeader() });
    return response.data.data;
  },
  getExploreServices: async () => {
    const response = await api.get('/api/freelance/explore'); // Sin token
    return response.data.data;
  },

  updateService: async (id: string, data: Partial<ServiceData>) => {
    const response = await api.put(`/api/freelance/update/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  deleteService: async (id: string) => {
    const response = await api.delete(`/api/freelance/delete/${id}`, { headers: getAuthHeader() });
    return response.data;
  }
};