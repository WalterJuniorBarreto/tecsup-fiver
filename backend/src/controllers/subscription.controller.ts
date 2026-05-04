import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { subscriptionService } from '../services/subscription.service.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js';

export const getMyPlanDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    
    if (!userId) {
      res.status(401).json({ status: 'error', message: 'No autorizado' });
      return;
    }

    const subscriptionData = await subscriptionService.getMySubscription(userId);

    res.status(200).json({
      status: 'success',
      data: subscriptionData
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllAvailablePlans = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({
    status: 'success',
    data: PLAN_LIMITS
  });
};

// 🚀 Actualizado a Stripe
export const createSubscriptionPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any).sub || (req.user as any).id;
    const { planId } = req.body; 

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'No autorizado' });
      return;
    }

    if (planId !== 'PRO' && planId !== 'ELITE') {
      res.status(400).json({ status: 'error', message: 'Plan no válido' });
      return;
    }

    // Llamamos al nuevo servicio de Stripe que hicimos hace un rato
    const intentData = await subscriptionService.createSubscriptionIntent(userId, planId as PlanTier);

    res.status(200).json({
      status: 'success',
      data: { clientSecret: intentData.clientSecret } // Devolvemos el secreto para el frontend
    });
  } catch (error: any) {
    console.error('[Error Stripe Subscription Intent]:', error);
    res.status(500).json({ status: 'error', message: 'Error generando intención de pago' });
  }
};

// 🚀 El mercadoPagoWebhook fue ELIMINADO.
// Todo el manejo de webhooks (servicios y suscripciones) ahora vive en payment.controller.ts