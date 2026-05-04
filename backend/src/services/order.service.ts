import prisma from '../config/db.js';

export const orderService = {
  // 🚀 Obtiene todas las órdenes donde TÚ eres el cliente
  getMyOrdersAsClient: async (clientId: string) => {
    return await prisma.order.findMany({
      where: {
        clientId: clientId, // Usamos la variable clientId de tu Prisma schema
      },
      include: {
        service: true, // Trae título, imagen, días de delivery
        seller: {      // Trae los datos del freelancer
          select: {
            id: true,
            name: true,
            avatar: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Las más recientes primero
      }
    });
  },

  // (Opcional) Obtiene las órdenes donde TÚ eres el vendedor
  getMyOrdersAsSeller: async (sellerId: string) => {
    return await prisma.order.findMany({
      where: {
        sellerId: sellerId,
      },
      include: {
        service: true,
        client: {
          select: {
            id: true,
            name: true,
            avatar: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
};