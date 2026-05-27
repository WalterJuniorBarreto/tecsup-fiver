import { useState, useEffect, useCallback } from 'react';
import { subscriptionService } from '../services/subscription.service';
import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { useSearchParams } from 'next/navigation';

export const useSubscription = () => {
  const searchParams = useSearchParams(); 
  
  const [loadingPlan, setLoadingPlan] = useState<'PRO' | 'ELITE' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO' | 'ELITE'>('FREE');
  const [isLoadingTier, setIsLoadingTier] = useState(true);

  const fetchCurrentPlan = useCallback(async () => {
    try {
      setIsLoadingTier(true);
      
      const justPaid = searchParams.get('payment') === 'success';
      const paidPlan = searchParams.get('plan') as 'PRO' | 'ELITE';

      if (justPaid && paidPlan) {
        setCurrentTier(paidPlan);
        setIsLoadingTier(false);
        
        window.history.replaceState(null, '', '/dashboard/seller/membership');
        return; 
      }

      const response = await api.get('/api/subscriptions/my-plan', {
        headers: getAuthHeader()
      });
      setCurrentTier(response.data.data.tier);
    } catch (err) {
      console.error("Error obteniendo el plan actual", err);
    } finally {
      setIsLoadingTier(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCurrentPlan();
  }, [fetchCurrentPlan]);

  const handleUpgrade = useCallback(async (planId: 'PRO' | 'ELITE') => {
    try {
      setLoadingPlan(planId);
      setError(null);
      
      const clientSecret = await subscriptionService.createSubscriptionIntent(planId);
      return clientSecret;
      
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoadingPlan(null);
    }
  }, []);

  return { handleUpgrade, loadingPlan, error, currentTier, isLoadingTier };
};
