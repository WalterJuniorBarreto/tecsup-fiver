import prisma from '../config/db.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js'; 

export interface CreateServiceDTO {
  title: string;
  description: string;
  price: number;
  deliveryDays?: number;
  image?: string;
}

export const freelanceService = {
  getSellerStats: async (sellerId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: sellerId },
      select: { membershipTier: true } 
    });

    if (!user) throw new Error('Usuario no encontrado');

    const currentPlan = user.membershipTier as PlanTier;
    const maxServices = PLAN_LIMITS[currentPlan].maxServices;

    const totalServices = await prisma.service.count({
      where: { sellerId }
    });

    return {
      currentPlan,
      totalServices,
      maxServices,
      canCreateMore: totalServices < maxServices
    };
  },

  createService: async (sellerId: string, data: CreateServiceDTO) => {
    const stats = await freelanceService.getSellerStats(sellerId);

    if (!stats.canCreateMore) {
      const error: any = new Error(`Límite de plan alcanzado. Tu plan ${PLAN_LIMITS[stats.currentPlan].name} solo permite ${stats.maxServices} servicios.`);
      error.statusCode = 403; 
      error.code = 'LIMIT_REACHED';
      throw error;
    }

    return prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        deliveryDays: data.deliveryDays || 1, 
        image: data.image,
        sellerId: sellerId
      }
    });
  },

  getMyServices: async (sellerId: string) => {
    return prisma.service.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
  },

  updateService: async (serviceId: string, sellerId: string, data: Partial<CreateServiceDTO>) => {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.sellerId !== sellerId) {
      const error: any = new Error('Servicio no encontrado o acceso denegado');
      error.statusCode = 403;
      throw error;
    }

    return prisma.service.update({
      where: { id: serviceId },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        deliveryDays: data.deliveryDays,
        image: data.image
      }
    });
  },

  deleteService: async (serviceId: string, sellerId: string) => {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.sellerId !== sellerId) {
      const error: any = new Error('Servicio no encontrado o acceso denegado');
      error.statusCode = 403;
      throw error;
    }

    const ordersCount = await prisma.order.count({ where: { serviceId } });

    if (ordersCount > 0) {
      return prisma.service.update({
        where: { id: serviceId },
        data: { isPublished: false }
      });
    } else {
      return prisma.service.delete({
        where: { id: serviceId }
      });
    }
  }
};