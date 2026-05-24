import prisma from '../config/db.js';
import { PLAN_LIMITS, PlanTier } from '../config/plans.config.js';
import { MembershipTier } from '@prisma/client';

const getPayPalBaseUrl = () => {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal no esta configurado');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('No se pudo autenticar con PayPal');
  }

  const data = await response.json() as { access_token: string };
  return data.access_token;
};

const activateMembership = async (userId: string, planTier: PlanTier, subscriptionId: string) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipTier: planTier as MembershipTier,
      subscriptionStatus: 'ACTIVE',
      subscriptionId,
      subscriptionEndsAt: expirationDate,
    },
  });
};

export const paypalService = {
  createSubscriptionOrder: async (userId: string, planTier: PlanTier) => {
    const plan = PLAN_LIMITS[planTier];

    if (!plan || plan.price === 0) {
      throw new Error('Plan invalido para pago');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) throw new Error('Usuario no encontrado');

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `${userId}:${planTier}`,
            description: `DevMarket ${plan.name}`,
            amount: {
              currency_code: 'USD',
              value: Number(plan.price).toFixed(2),
            },
            custom_id: JSON.stringify({ userId, planTier }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('No se pudo crear la orden de PayPal');
    }

    const data = await response.json() as { id: string };
    return { orderId: data.id };
  },

  captureSubscriptionOrder: async (userId: string, orderId: string, planTier: PlanTier) => {
    const plan = PLAN_LIMITS[planTier];

    if (!plan || plan.price === 0) {
      throw new Error('Plan invalido para pago');
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo capturar el pago de PayPal');
    }

    const data = await response.json() as { status: string; id: string };

    if (data.status !== 'COMPLETED') {
      throw new Error('PayPal no confirmo el pago');
    }

    await activateMembership(userId, planTier, data.id);

    return {
      status: data.status,
      orderId: data.id,
    };
  },
};
