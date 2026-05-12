import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { favoriteService } from '../services/favorite.service.js';

export const favoriteController = {
  
  toggle: async (req: AuthRequest, res: Response) => {
    try {
      const userId = (req.user as any).sub || (req.user as any).id;
      const { serviceId } = req.body;

      if (!serviceId) {
        return res.status(400).json({ error: 'El ID del servicio es requerido' });
      }

      const result = await favoriteService.toggleFavorite(userId, serviceId);
      
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error('[TOGGLE FAVORITE ERROR]:', error.message);
      res.status(500).json({ error: error.message || 'Error al procesar el favorito' });
    }
  },

  getMyFavorites: async (req: AuthRequest, res: Response) => {
    try {
      const userId = (req.user as any).sub || (req.user as any).id;
      
      const favorites = await favoriteService.getUserFavorites(userId);
      
      res.status(200).json({ success: true, data: favorites });
    } catch (error: any) {
      console.error('[GET FAVORITES ERROR]:', error.message);
      res.status(500).json({ error: 'Error al obtener tu lista de favoritos' });
    }
  }

};