import prisma from '../config/db.js';
import { stripeClient } from '../config/stripe.js';
import Stripe from 'stripe';
<<<<<<< Updated upstream
import { MembershipTier } from '@prisma/client';
=======
import { subscriptionService } from './subscription.service.js';
>>>>>>> Stashed changes

export const paymentService = {
  createPaymentIntent: async (userId: string, serviceId: string) => {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!service) throw new Error('Servicio no encontrado');
    if (!user) throw new Error('Usuario no encontrado');

    if (service.sellerId === userId) {
      throw new Error('No puedes comprar tu propio servicio');
    }

    const order = await prisma.order.create({
      data: {
        client: { connect: { id: userId } },
        seller: { connect: { id: service.sellerId } },
        service: { connect: { id: service.id } },
        price: service.price,
        status: 'PENDING'
      }
    });

    const amountInCents = Math.round(Number(service.price) * 100);

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amountInCents,
      currency: 'pen', 
      metadata: {
        orderId: order.id,
        userId: userId,
        serviceId: service.id
      },
      receipt_email: user.email 
    });

    return {
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    };
  },

  handleStripeWebhook: async (rawBody: Buffer, signature: string) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(rawBody, signature, endpointSecret);
    } catch (err: any) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
<<<<<<< Updated upstream
      const paymentType = paymentIntent.metadata.type;

      if (paymentType === 'subscription') {
        const userId = paymentIntent.metadata.userId;
        const planPurchased = paymentIntent.metadata.planTier as MembershipTier;

        if (!userId || !planPurchased) {
          console.error('[STRIPE WEBHOOK] Faltan metadatos para actualizar membresía.');
          return { received: true };
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

        console.log(`[STRIPE WEBHOOK] Membresía actualizada. Usuario ${userId} subió a ${planPurchased}.`);
        return { received: true };
      }

      const orderId = paymentIntent.metadata.orderId;
=======
>>>>>>> Stashed changes

      if (paymentIntent.metadata.orderId) {
        const orderId = paymentIntent.metadata.orderId;
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        });
        console.log(`[STRIPE WEBHOOK] Pago exitoso. Orden ${orderId} actualizada a PAID.`);
      } 
      
      else if (paymentIntent.metadata.type === 'subscription') {
        await subscriptionService.handleSubscriptionWebhook(paymentIntent);
      }
    }

    return { received: true };
  },

  checkOrderAccess: async (userId: string, serviceId: string) => {
    const order = await prisma.order.findFirst({
      where: {
        clientId: userId,
        serviceId: serviceId,
        status: {
          in: ['PENDING', 'PAID', 'IN_PROGRESS', 'REVISION']
        }
      }
    });
    
    return !!order; 
  },
};
