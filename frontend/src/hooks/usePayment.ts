'use client';

import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService } from '../services/payment.service';

export const usePayment = (userId: string, serviceId: string) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async () => {
    if (!stripe || !elements) return; 

    setLoading(true);
    setError(null);

    try {
      
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message); 
      }

      const { success, data, error: apiError } = await paymentService.createPaymentIntent({
        userId,
        serviceId,
      });

      if (!success || !data || !data.clientSecret) {
        throw new Error(apiError || 'Error al conectar con el servidor de pagos');
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret, 
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success/${serviceId}`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading, error };
};