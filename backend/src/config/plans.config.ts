
export const PLAN_LIMITS = {
  FREE: {
    tier: 'FREE',
    name: 'Gratuito',
    price: 0,
    maxServices: 1,
    maxActiveRequests: 5,
    commissionRate: 0.15, 
    feeFreeAmount: 0,
    hasPrioritySupport: false,
    hasFeaturedProfile: false
  },
  PRO: {
    tier: 'PRO',
    name: 'Pro',
    price: 39.90,
    maxServices: 10,
    maxActiveRequests: 50,
    commissionRate: 0.10, 
    feeFreeAmount: 400,
    hasPrioritySupport: true,
    hasFeaturedProfile: true
  },
  ELITE: {
    tier: 'ELITE',
    name: 'Elite',
    price: 99.90,
    maxServices: 9999, 
    maxActiveRequests: 9999,
    commissionRate: 0.05, 
    feeFreeAmount: 2000,
    hasPrioritySupport: true, 
    hasFeaturedProfile: true 
  }
} as const;

export type PlanTier = keyof typeof PLAN_LIMITS;