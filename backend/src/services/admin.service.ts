import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { reviewService } from './review.service.js';

export const adminService = {
  // 1. OBTENER TODOS LOS USUARIOS CON SUS ESTADÍSTICAS
  getAllUsers: async () => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        services: { select: { id: true } }, // Solo traemos los IDs para contarlos
        ordersGotten: {
          where: { status: 'COMPLETED' },   // Solo sumamos el dinero de órdenes completadas
          select: { price: true }
        }
      }
    });

    // Mapeamos los datos para entregárselos digeridos al Frontend
    return users.map(user => ({
      id: user.id,
      name: user.name || user.username || 'Sin Nombre',
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      provider: user.provider,
      services: user.services.length,
      earnings: user.ordersGotten.reduce((sum, order) => sum + order.price, 0),
      date: user.createdAt.toISOString().split('T')[0] // Formato YYYY-MM-DD
    }));
  },

  // 2. CREAR UN USUARIO MANUALMENTE
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
        isVerified: true, // Si lo crea el admin, ya está verificado
        isActive: true
      }
    });
  },

  // 3. EDITAR UN USUARIO
  updateUser: async (id: string, data: any) => {
    const updateData: any = {
      name: data.name,
      role: data.role,
    };

    // Solo actualizamos la contraseña si el admin escribió una nueva
    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData
    });
  },

  // 4. SUSPENDER / REACTIVAR USUARIO
  toggleUserStatus: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');

    // Cambiamos el estado al opuesto (Si era true, pasa a false, y viceversa)
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

    // 🚀 MAGIA HÍBRIDA: Recorremos los servicios de Postgres y traemos sus reseñas de Mongo
    const mappedServices = await Promise.all(
      services.map(async (s) => {
        // Llamada a tu base de datos MongoDB
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
          averageRating: reviewData.stats.average, // 🚀 DATO REAL
          reviewsCount: reviewData.stats.total     // 🚀 DATO REAL
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

  // 6. SUSPENDER/REACTIVAR SERVICIO
  toggleServiceStatus: async (id: string) => {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new Error('Servicio no encontrado');

    return await prisma.service.update({
      where: { id },
      data: { isPublished: !service.isPublished }
    });
  }
};