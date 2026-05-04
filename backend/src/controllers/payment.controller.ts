import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service.js';

export const paymentController = {
  createIntent: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId; 
      const { serviceId } = req.body;

      if (!serviceId) {
        return res.status(400).json({ success: false, error: 'serviceId es requerido' });
      }

      const intentData = await paymentService.createPaymentIntent(userId, serviceId);
      
      res.status(200).json({ success: true, data: intentData });
    } catch (error: any) {
      console.error('[STRIPE ERROR]:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  webhook: async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    try {
      await paymentService.handleStripeWebhook(req.body, signature);
      res.status(200).send('Webhook procesado');
    } catch (error: any) {
      console.error(` Error en Webhook: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  },


  checkAccess: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.sub; 
      const serviceId = req.params.serviceId as string;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'No autorizado' });
      }

      const hasAccess = await paymentService.checkOrderAccess(userId, serviceId);
      res.status(200).json({ hasAccess });
    } catch (error: any) {
      console.error('[CHECK ACCESS ERROR]:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};