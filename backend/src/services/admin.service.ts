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
  },


  getDashboardStats: async () => {
    const activeUsers = await prisma.user.count({ where: { isActive: true } });
    const publishedServices = await prisma.service.count({ where: { isPublished: true } });
    const completedOrdersCount = await prisma.order.count({ where: { status: 'COMPLETED' } });

    const completedOrders = await prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { price: true, seller: { select: { membershipTier: true } } }
    });
    
    let totalComisiones = 0;
    completedOrders.forEach(o => {
      const tier = (o.seller?.membershipTier as PlanTier) || 'FREE';
      const rate = PLAN_LIMITS[tier]?.commissionRate || 0.15;
      totalComisiones += (o.price * rate);
    });

    const subs = await prisma.transaction.aggregate({ where: { type: 'SUSCRIPCION', status: 'COMPLETED' }, _sum: { amount: true } });
    const totalIngresos = totalComisiones + (subs._sum.amount || 0);

    const pendingReportsData = await prisma.report.findMany({
      where: { status: 'PENDING' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { reportedUser: true, reportedService: true }
    });

    const pendingReports = pendingReportsData.map(r => ({
      id: r.id,
      targetName: r.reportedService?.title || r.reportedUser?.name || r.reportedUser?.username || 'Recurso eliminado',
      targetType: r.reportedServiceId ? 'SERVICIO' : 'USUARIO',
      reason: r.reason,
      date: r.createdAt
    }));

    const recentUsersData = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { ordersMade: true, ordersGotten: true }
    });

    const recentUsers = recentUsersData.map(u => {
      const isFreelancer = u.role === 'FREELANCER';
      const orders = isFreelancer ? u.ordersGotten : u.ordersMade;
      const totalAmount = orders.reduce((sum, o) => sum + o.price, 0);

      return {
        id: u.id,
        name: u.name || u.username || 'Usuario',
        email: u.email,
        role: u.role,
        status: u.isActive ? 'ACTIVO' : 'SUSPENDIDO',
        date: u.createdAt,
        amount: totalAmount,
        orders: orders.length
      };
    });

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const newUsersToday = await prisma.user.count({ where: { createdAt: { gte: today } } });
    const ordersInProgress = await prisma.order.count({ where: { status: 'IN_PROGRESS' } });
    const completedToday = await prisma.order.count({ where: { updatedAt: { gte: today }, status: 'COMPLETED' } });
    const reportsToday = await prisma.report.count({ where: { createdAt: { gte: today } } });

    return {
      stats: {
        ingresosTotales: totalIngresos,
        usuariosActivos: activeUsers,
        serviciosPublicados: publishedServices,
        ordenesCompletadas: completedOrdersCount
      },
      pendingReports,
      recentUsers,
      activity: { newUsersToday, ordersInProgress, completedToday, reportsToday }
    };
  },
};