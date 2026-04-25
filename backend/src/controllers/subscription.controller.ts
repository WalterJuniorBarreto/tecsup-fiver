import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { subscriptionService } from '../services/subscription.service.js';
import { PLAN_LIMITS } from '../config/plans.config.js';
import { PlanTier } from '../config/plans.config.js';

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


export const generatePaymentLink = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const initPoint = await subscriptionService.createPaymentPreference(userId, planId as PlanTier);

    res.status(200).json({
      status: 'success',
      data: { paymentUrl: initPoint }
    });
  } catch (error: any) {
    console.error('[Error MercadoPago Preference]:', error);
    res.status(500).json({ status: 'error', message: 'Error generando link de pago' });
  }
};

export const mercadoPagoWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, data } = req.body;
    
    res.status(200).send('OK');

    if (type === 'payment' && data?.id) {
      subscriptionService.handlePaymentWebhook(data.id).catch(err => {
        console.error('[Error procesando Webhook de MP]:', err);
      });
    }
  } catch (error) {
    console.error('[Error crítico en Webhook]:', error);
  }
};