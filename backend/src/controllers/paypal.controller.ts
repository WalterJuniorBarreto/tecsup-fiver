import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { PlanTier } from '../config/plans.config.js';
import { paypalService } from '../services/paypal.service.js';

const getUserId = (req: AuthRequest) => {
  return req.user?.sub || req.user?.id;
};

export const paypalController = {
  createSubscriptionOrder: async (req: AuthRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const { planId } = req.body;

      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'No autorizado' });
      }

      if (planId !== 'PRO' && planId !== 'ELITE') {
        return res.status(400).json({ status: 'error', message: 'Plan no valido' });
      }

      const data = await paypalService.createSubscriptionOrder(userId, planId as PlanTier);
      res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      console.error('[PAYPAL CREATE ORDER ERROR]:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  captureSubscriptionOrder: async (req: AuthRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const { orderId, planId } = req.body;

      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'No autorizado' });
      }

      if (!orderId) {
        return res.status(400).json({ status: 'error', message: 'orderId es requerido' });
      }

      if (planId !== 'PRO' && planId !== 'ELITE') {
        return res.status(400).json({ status: 'error', message: 'Plan no valido' });
      }

      const data = await paypalService.captureSubscriptionOrder(userId, orderId, planId as PlanTier);
      res.status(200).json({ status: 'success', data });
    } catch (error: any) {
      console.error('[PAYPAL CAPTURE ERROR]:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};
