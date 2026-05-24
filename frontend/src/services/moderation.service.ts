import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const moderationService = {
  submitReport: async (data: { targetType: 'USER' | 'SERVICE', targetId: string, reason: string }) => {
    const response = await api.post('/api/moderation/report', data, { headers: getAuthHeader() });
    return response.data;
  }
};