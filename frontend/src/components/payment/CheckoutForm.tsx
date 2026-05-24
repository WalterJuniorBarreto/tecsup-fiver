'use client';

import { PaymentElement } from '@stripe/react-stripe-js';
import { usePayment } from '../../hooks/usePayment';
import { Lock } from 'lucide-react';

interface Props {
  userId: string;
  serviceId: string;
}

export const CheckoutForm = ({ userId, serviceId }: Props) => {
  const { processPayment, loading, error } = usePayment(userId, serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processPayment();
  };
 
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full py-4 bg-[#00e676] hover:bg-emerald-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          'Procesando conexión segura...'
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar de forma segura
          </>
        )}
      </button>
    </form>
  );
};