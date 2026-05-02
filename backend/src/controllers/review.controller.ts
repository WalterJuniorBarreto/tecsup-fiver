import { Request, Response } from 'express';
import { reviewService } from '../services/review.service.js';

export const reviewController = {
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId, rating, comment } = req.body;
      const clientId = (req as any).user?.sub || (req as any).user?.id;

      if (!clientId) {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
        return;
      }

      if (!rating || rating < 1 || rating > 5) {
        res.status(400).json({ status: 'error', message: 'El rating debe ser entre 1 y 5' });
        return;
      }

      const review = await reviewService.createReview(clientId, serviceId, rating, comment);
      
      res.status(201).json({ status: 'success', data: review });
    } catch (error: any) {
      console.error('[Error creando reseña]:', error.message);
      
      if (error.message.includes('FORBIDDEN')) {
         res.status(403).json({ status: 'error', message: error.message });
         return;
      }
      if (error.message.includes('CONFLICT')) {
         res.status(409).json({ status: 'error', message: error.message });
         return;
      }

      res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
  },

  getByService: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId } = req.params;
const result = await reviewService.getServiceReviews(serviceId as string);      
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      console.error('[Error obteniendo reseñas]:', error);
      res.status(500).json({ status: 'error', message: 'Error interno' });
    }
  }
};