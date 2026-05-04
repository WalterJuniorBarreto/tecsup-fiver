import { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';
import prisma from '../config/db.js'; // Importamos Prisma para la actualización de progreso
export const orderController = {
  
  getClientOrders: async (req: Request, res: Response) => {
    try {
      // 🚀 EL FIX CLAVE: Soportamos tanto 'id' (LOCAL) como 'sub' (GOOGLE)
      const userId = (req as any).user?.id || (req as any).user?.sub;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'No autorizado. Token inválido.' });
      }

      const orders = await orderService.getMyOrdersAsClient(userId);
      
      // Enviamos directamente el array, como espera tu Frontend
      res.status(200).json(orders);
    } catch (error: any) {
      console.error('[GET CLIENT ORDERS ERROR]:', error.message);
      res.status(500).json({ success: false, error: 'Error interno del servidor al obtener pedidos.' });
    }
  },

  getSellerOrders: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'No autorizado. Token inválido.' });
      }

      const orders = await orderService.getMyOrdersAsSeller(userId);
      res.status(200).json(orders);
    } catch (error: any) {
      console.error('[GET SELLER ORDERS ERROR]:', error.message);
      res.status(500).json({ success: false, error: 'Error interno del servidor al obtener ventas.' });
    }
  },
  updateProgress: async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id as string;
      const { progress } = req.body;
      const userId = (req as any).user?.id || (req as any).user?.sub;

      if (!userId) return res.status(401).json({ error: 'No autorizado' });

      // Verificamos que la orden pertenezca a este freelancer
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.sellerId !== userId) {
        return res.status(403).json({ error: 'No tienes permiso para editar esta orden' });
      }

      // 🚀 Magia automática: Si el progreso es 100, cambiamos el status a COMPLETED
      const newStatus = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          progress: progress,
          status: newStatus 
        }
      });

      res.status(200).json(updatedOrder);
    } catch (error: any) {
      console.error('[UPDATE PROGRESS ERROR]:', error.message);
      res.status(500).json({ error: 'Error actualizando progreso' });
    }
  }
};