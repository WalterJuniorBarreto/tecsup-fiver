import { FavoriteItem } from '../types/favorite';
import { api } from '../config/axios';
export const favoriteService = {
  getMyFavorites: async (): Promise<FavoriteItem[]> => {
    try {
      const response = await api.get('/api/favorites');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error obteniendo favoritos:', error);
      throw error;
    }
  },

  toggleFavorite: async (serviceId: string): Promise<{ isFavorited: boolean }> => {
    try {
      const response = await api.post('/api/favorites/toggle', { serviceId });
      return response.data.data;
    } catch (error) {
      console.error('❌ Error alternando favorito:', error);
      throw error;
    }
  }
};