import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { ChatMessage, Conversation } from '../types/message.types';

export const chatService = {
  getMyChats: async (): Promise<Conversation[]> => {
    const response = await api.get('/api/chats', { headers: getAuthHeader() });
    return response.data.data;
  },

  getChatHistory: async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/chats/${conversationId}`, { headers: getAuthHeader() });
    return response.data.data;
  },

  deleteChat: async (conversationId: string): Promise<void> => {
    await api.delete(`/api/chats/${conversationId}`, { headers: getAuthHeader() });
  },
searchUsers: async (query: string): Promise<{id: string, name: string, image?: string, avatar?: string}[]> => {    const response = await api.get(`/api/chats/users/search?q=${query}`, { headers: getAuthHeader() });
    return response.data.data;
  },
  getInbox: async (): Promise<Conversation[]> => {
    const resp = await api.get('/api/chats/inbox', { headers: getAuthHeader() });
    return resp.data.data;
  },
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.post(`/api/chats/${conversationId}/read`, {}, { headers: getAuthHeader() });
  },

  uploadAttachment: async (formData: FormData): Promise<string> => {
    const resp = await api.post('/api/chats/upload', formData, {
      headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
    });
    return resp.data.fileUrl; 
  }
};