import prisma from '../config/db.js'; 
import { ReviewModel } from '../models/nosql/review.model.js';

export const reviewService = {
  
  createReview: async (clientId: string, serviceId: string, rating: number, comment?: string) => {
    // 🚀 EL FIX DEFINITIVO: Sincronizamos los estados permitidos con los del botón de pago
    const hasPurchased = await prisma.order.findFirst({
      where: {
        clientId: clientId,
        serviceId: serviceId,
        status: { 
          in: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] 
        } 
      },
      include: { client: true }
    });

    if (!hasPurchased) {
      throw new Error('FORBIDDEN: Solo los clientes que han adquirido este servicio pueden dejar una reseña.');
    }

    const existingReview = await ReviewModel.findOne({ clientId, serviceId });
    if (existingReview) {
      throw new Error('CONFLICT: Ya has dejado una reseña para este servicio.');
    }

    const newReview = await ReviewModel.create({
      serviceId,
      clientId,
      clientName: hasPurchased.client.name || 'Cliente Anónimo',      
      clientAvatar: hasPurchased.client.avatar || '',
      rating,
      comment
    });

    return newReview;
  },

  getServiceReviews: async (serviceId: string) => {
    // Obtenemos las reseñas ordenadas por las más recientes
    const reviews = await ReviewModel.find({ serviceId }).sort({ createdAt: -1 });
    
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews).toFixed(1)
      : 0;

    return {
      stats: { total: totalReviews, average: Number(averageRating) },
      reviews
    };
  }
};