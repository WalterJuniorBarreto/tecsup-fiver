import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscription.service';
import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

export const useSubscription = () => {
  const [loadingPlan, setLoadingPlan] = useState<'PRO' | 'ELITE' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO' | 'ELITE'>('FREE');
  const [isLoadingTier, setIsLoadingTier] = useState(true);

  const fetchCurrentPlan = async () => {
    try {
      setIsLoadingTier(true);
      const response = await api.get('/api/subscriptions/my-plan', {
        headers: getAuthHeader()
      });
      setCurrentTier(response.data.data.tier);
    } catch (err) {
      console.error("Error obteniendo el plan actual", err);
    } finally {
      setIsLoadingTier(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleUpgrade = async (planId: 'PRO' | 'ELITE') => {
    try {
      setLoadingPlan(planId);
      setError(null);
      const paymentUrl = await subscriptionService.createPaymentLink(planId);
      window.location.href = paymentUrl; 
    } catch (err: any) {
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  return {
    handleUpgrade,
    loadingPlan,
    error,
    currentTier,
    isLoadingTier 
  };
};