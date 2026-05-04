import prisma from '../config/db.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js';
import { MembershipTier } from '@prisma/client';
import { stripeClient } from '../config/stripe.js';
import Stripe from 'stripe';

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

  createSubscriptionIntent: async (userId: string, planTier: PlanTier) => {
    const plan = PLAN_LIMITS[planTier];
    if (!plan || plan.price === 0) throw new Error('Plan inválido para pago');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuario no encontrado');

    const amountInCents = Math.round(plan.price * 100);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: 'pen',
      receipt_email: user.email,
      metadata: {
        userId: userId,
        planTier: plan.tier,
        type: 'subscription' 
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  },

  handleSubscriptionWebhook: async (paymentIntent: Stripe.PaymentIntent) => {
    const userId = paymentIntent.metadata.userId;
    const planPurchased = paymentIntent.metadata.planTier as MembershipTier;
    
    if (!userId || !planPurchased) {
      console.error('Faltan metadatos en el PaymentIntent de la suscripción');
      return;
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    await prisma.user.update({
      where: { id: userId },
      data: {
        membershipTier: planPurchased,
        subscriptionStatus: 'ACTIVE',
        subscriptionId: paymentIntent.id,
        subscriptionEndsAt: expirationDate
      }
    });
    
    console.log(`STRIPE WEBHOOK] Pago procesado: Usuario ${userId} subió a ${planPurchased}`);
  }
};