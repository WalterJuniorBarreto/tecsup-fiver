import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/api/admin/users', { headers: getAuthHeader() });
    return response.data.data;
  },

  createUser: async (data: any) => {
    const response = await api.post('/api/admin/users', data, { headers: getAuthHeader() });
    return response.data.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/api/admin/users/${id}`, data, { headers: getAuthHeader() });
    return response.data.data;
  },

  toggleUserStatus: async (id: string) => {
    const response = await api.patch(`/api/admin/users/${id}/toggle-status`, {}, { headers: getAuthHeader() });
    return response.data.data;
  },

  getServices: async (page: number = 1, limit: number = 8, search: string = '') => {
    const response = await api.get(`/api/admin/services?page=${page}&limit=${limit}&search=${search}`, { headers: getAuthHeader() });
    return response.data.data; 
  },

  toggleServiceStatus: async (id: string) => {
    const response = await api.patch(`/api/admin/services/${id}/toggle-status`, {}, { headers: getAuthHeader() });
    return response.data.data;
  },

  getReports: async (status: string = 'PENDING') => {
    const response = await api.get(`/api/admin/moderation?status=${status}`, { headers: getAuthHeader() });
    return response.data.data;
  },

  updateReportStatus: async (id: string, status: 'RESOLVED' | 'DISMISSED') => {
    const response = await api.patch(`/api/admin/moderation/${id}`, { status }, { headers: getAuthHeader() });
    return response.data.data;
  },

  getFinances: async () => {
    const response = await api.get('/api/admin/finances', { headers: getAuthHeader() });
    return response.data.data;
  }
};