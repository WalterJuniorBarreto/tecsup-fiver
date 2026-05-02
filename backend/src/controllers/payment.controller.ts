import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service.js';
import prisma from '../config/db.js';
export const paymentController = {
  generateCheckout: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId, title, price } = req.body;
      
      const userId = (req as any).user?.sub || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
        return;
      }

      const preferenceId = await paymentService.createPreference(userId, { id: serviceId, title, price });
      
      res.status(200).json({ status: 'success', preferenceId });
    } catch (error: any) {
      console.error("[Error MercadoPago Pago Único]:", error); 
      res.status(500).json({ status: 'error', message: 'Error generando link de pago' });
    }
  },

  verifyServiceAccess: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const userId = (req as any).user?.sub || (req as any).user?.id;

      if (!userId) {
         res.status(401).json({ status: 'error', message: 'No autorizado' });
         return;
      }

const hasAccess = await paymentService.checkOrderAccess(userId, serviceId as string);      res.status(200).json({ status: 'success', hasPaid: hasAccess });
    } catch (error: any) {
      console.error("[Error verificando acceso a compra]:", error);
      res.status(500).json({ status: 'error', message: 'Error verificando acceso' });
    }
  },
  syncPayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.body;
      console.log("[BACKEND] Petición de sincronización recibida. ID:", paymentId);

      if (!paymentId) {
        res.status(400).json({ status: 'error', message: 'ID requerido' });
        return;
      }

      const isSynced = await paymentService.syncPaymentStatus(paymentId);
      console.log("[BACKEND] ¿La base de datos se actualizó a PAID?:", isSynced);
      
      res.status(200).json({ status: 'success', synced: isSynced });
    } catch (error: any) {
      console.error("[BACKEND] Error catastrófico:", error);
      res.status(500).json({ status: 'error', message: 'Error' });
    }
  },
  webhook: async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, data } = req.body;
      
      res.status(200).send('OK');

      if (type === 'payment' && data?.id) {
        paymentService.handlePaymentWebhook(data.id).catch(err => {
          console.error('[Error procesando Webhook de Pago Único]:', err);
        });
      }
    } catch (error) {
      console.error('[Error crítico en Webhook de Pago Único]:', error);
    }
  },

  processCustomPayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId, paymentData } = req.body;
      const userId = (req as any).user?.sub || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
        return;
      }

      const result = await paymentService.processInternalPayment(userId, serviceId, paymentData);

      if (result.success) {
        res.status(200).json({ status: 'success', data: result });
      } else {
        res.status(400).json({ status: 'error', message: `Pago rechazado. Estado: ${result.status}` });
      }
    } catch (error: any) {
      console.error("[ERROR REAL MP]:", error.response?.data || error.message);
      
      if (error.cause && error.cause.length > 0) {
        console.error("[CAUSAS DETALLADAS]:", error.cause);
      }

      res.status(500).json({ status: 'error', message: 'Error interno procesando pago' });
    }
  },


  getMyOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
        return;
      }

      const orders = await prisma.order.findMany({
        where: { 
          clientId: userId,
          status: 'PAID' 
        },
        include: {
          service: true,
          seller: {    
            select: { name: true, avatar: true, username: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({ status: 'success', data: orders });
    } catch (error: any) {
      console.error("[Error obteniendo pedidos]:", error);
      res.status(500).json({ status: 'error', message: 'Error cargando pedidos' });
    }
  },


  getReceivedOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.sub || (req as any).user?.id;

      const orders = await prisma.order.findMany({
        where: { 
          sellerId: userId,
          status: { not: 'PENDING' } 
        },
        include: {
          service: true,
          client: { select: { id: true, name: true, avatar: true } } 
        },
        orderBy: { createdAt: 'desc' }
      });

      res.status(200).json({ status: 'success', data: orders });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error cargando pedidos' });
    }
  },

  updateOrderProgress: async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, progress } = req.body;

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          progress: progress,
          status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS' 
        }
      });

      res.status(200).json({ status: 'success', data: updatedOrder });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error actualizando progreso' });
    }
  },
};

