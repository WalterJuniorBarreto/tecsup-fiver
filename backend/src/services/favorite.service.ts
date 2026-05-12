import prisma from '../config/db.js';

export const favoriteService = {
  toggleFavorite: async (userId: string, serviceId: string) => {
    const serviceExists = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    
    if (!serviceExists) throw new Error('El servicio no existe');

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_serviceId: { userId, serviceId }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return { isFavorited: false };
    } else {
      await prisma.favorite.create({
        data: { userId, serviceId }
      });
      return { isFavorited: true };
    }
  },

  getUserFavorites: async (userId: string) => {
    return await prisma.favorite.findMany({
      where: { userId },
      include: {
        service: {
          include: {
            seller: { 
              select: { id: true, name: true, avatar: true } 
            },
            category: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};