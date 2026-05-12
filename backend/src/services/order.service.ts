import prisma from '../config/db.js';

export const orderService = {
  getMyOrdersAsClient: async (clientId: string) => {
    return await prisma.order.findMany({
      where: {
        clientId: clientId, 
      },
      include: {
        service: true, 
        seller: {     
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
  },

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