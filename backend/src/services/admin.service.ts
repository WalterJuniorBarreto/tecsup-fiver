import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { reviewService } from './review.service.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js';

export const adminService = {
  getAllUsers: async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        services: { select: { id: true } }, 
        ordersGotten: {
          where: { status: 'COMPLETED' },   
          select: { price: true }
        }
      }
    });

    return users.map(user => ({
      id: user.id,
      name: user.name || user.username || 'Sin Nombre',
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      provider: user.provider,
      services: user.services.length,
      earnings: user.ordersGotten.reduce((sum, order) => sum + order.price, 0),
      date: user.createdAt.toISOString().split('T')[0] 
    }));
  },

  createUser: async (data: any) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error('El correo ya está registrado.');

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        password: hashedPassword,
        isVerified: true,
        isActive: true
      }
    });
  },

  updateUser: async (id: string, data: any) => {
    const updateData: any = {
      name: data.name,
      role: data.role,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  },

  toggleUserStatus: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');

    return await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    });
  },








  getServicesPaginated: async (page: number = 1, limit: number = 8, search: string = '') => {
    const skip = (page - 1) * limit;

    const whereClause: any = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { seller: { name: { contains: search, mode: 'insensitive' } } },
        { seller: { username: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    const [total, services] = await Promise.all([
      prisma.service.count({ where: whereClause }),
      prisma.service.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { name: true, username: true } },
          category: { select: { name: true } },
          orders: {
            where: { status: { in: ['PAID', 'IN_PROGRESS', 'COMPLETED'] } },
            select: { id: true }
          }
        }
      })
    ]);

    const mappedServices = await Promise.all(
      services.map(async (s) => {
        const reviewData = await reviewService.getServiceReviews(s.id);

        return {
          id: s.id,
          title: s.title,
          price: s.price,
          image: s.image,
          isPublished: s.isPublished,
          sellerName: s.seller.name || s.seller.username || 'Usuario',
          categoryName: s.category?.name || 'General',
          ordersCount: s.orders.length,
          averageRating: reviewData.stats.average, 
          reviewsCount: reviewData.stats.total    
        };
      })
    );

    return {
      services: mappedServices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  toggleServiceStatus: async (id: string) => {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new Error('Servicio no encontrado');

    return await prisma.service.update({
      where: { id },
      data: { isPublished: !service.isPublished }
    });
  },


  getFinancialSummary: async () => {
    
    const completedOrders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { 
        price: true, 
        createdAt: true,
        seller: { select: { membershipTier: true } } 
      }
    });

    let totalComisiones = 0;
    
    completedOrders.forEach(order => {
      const sellerTier = (order.seller?.membershipTier as PlanTier) || 'FREE';
      
      const commissionRate = PLAN_LIMITS[sellerTier]?.commissionRate || 0.15;
      
      totalComisiones += (order.price * commissionRate);
    });

    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const suscripcionesTotales = await prisma.transaction.aggregate({
      where: { type: 'SUSCRIPCION', status: 'COMPLETED' },
      _sum: { amount: true }
    });

    const totalSuscripciones = suscripcionesTotales._sum.amount || 0;

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      let targetMonth = currentMonth - i;
      let targetYear = new Date().getFullYear();
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      
      let comisionesMes = 0;
      completedOrders.forEach(o => {
        if (o.createdAt.getMonth() === targetMonth && o.createdAt.getFullYear() === targetYear) {
          const sellerTier = (o.seller?.membershipTier as PlanTier) || 'FREE';
          const rate = PLAN_LIMITS[sellerTier]?.commissionRate || 0.15;
          comisionesMes += (o.price * rate);
        }
      });

      monthlyData.push({
        name: meses[targetMonth],
        ingresos: parseFloat(comisionesMes.toFixed(2)) 
      });
    }

    return {
      stats: {
        ingresosTotales: totalComisiones + totalSuscripciones,
        comisiones: totalComisiones,
        suscripciones: totalSuscripciones,
      },
      chartData: monthlyData,
      recentTransactions: transactions
    };
  }
};