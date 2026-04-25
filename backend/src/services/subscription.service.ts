import prisma from '../config/db.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js';
import { Preference, Payment } from 'mercadopago';
import { mpClient } from '../config/mercadopago.js';
import { MembershipTier } from '@prisma/client';

export const subscriptionService = {
  
  getMySubscription: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { membershipTier: true, subscriptionStatus: true, subscriptionEndsAt: true }
    });

    if (!user) throw new Error('Usuario no encontrado');

    const currentLimits = PLAN_LIMITS[user.membershipTier as PlanTier];

    return {
      tier: user.membershipTier,
      status: user.subscriptionStatus,
      expiresAt: user.subscriptionEndsAt,
      limits: currentLimits,
    };
  },

  canCreateService: async (userId: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { membershipTier: true, services: { select: { id: true } } } 
    });

    if (!user) return false;

    const limit = PLAN_LIMITS[user.membershipTier as PlanTier].maxServices;
    const currentCount = user.services.length;

    return currentCount < limit; 
  },


  createPaymentPreference: async (userId: string, planTier: PlanTier) => {
    const plan = PLAN_LIMITS[planTier];
    if (!plan || plan.price === 0) throw new Error('Plan inválido para pago');

    const preference = new Preference(mpClient);

    const backendUrl = process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/[\r\n ]+/g, "") : '';

    const result = await preference.create({
      body: {
        items: [
          {
            id: plan.tier,
            title: `Plan ${plan.name} - DevMarket`,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'PEN',
          }
        ],
        external_reference: userId, 
        back_urls: {
          success: "http://localhost:3000/dashboard/seller/membership",
          failure: "http://localhost:3000/dashboard/seller/membership",
          pending: "http://localhost:3000/dashboard/seller/membership"
        },
        
        // auto_return: "approved", 
        
        notification_url: backendUrl ? `${backendUrl}/api/subscriptions/webhook` : undefined,
      }
    });

    return result.init_point;
  },

  

  handlePaymentWebhook: async (paymentId: string) => {
    const payment = new Payment(mpClient);
    const paymentInfo = await payment.get({ id: paymentId });

    if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
      const userId = paymentInfo.external_reference;
      
      const planPurchased = paymentInfo.additional_info?.items?.[0]?.id as MembershipTier;
      
      if (!planPurchased) return;

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      await prisma.user.update({
        where: { id: userId },
        data: {
          membershipTier: planPurchased,
          subscriptionStatus: 'ACTIVE',
          subscriptionId: paymentInfo.id?.toString(),
          subscriptionEndsAt: expirationDate
        }
      });
      
      console.log(`Pago procesado: Usuario ${userId} subió a ${planPurchased}`);
    }
  }

};