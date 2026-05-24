'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Info,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { useSubscription } from '../../../../../../hooks/useSubscription';
import { paypalService } from '../../../../../../services/paypal.service';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PLAN_DETAILS = {
  PRO: {
    name: 'DevMarket Pro',
    price: '39.90',
    included: [
      '10 servicios publicados',
      '50 solicitudes activas',
      'Comision reducida al 10%',
      'Sin comision primeros S/ 400',
      'Estadisticas avanzadas',
    ],
  },
  ELITE: {
    name: 'DevMarket Elite',
    price: '99.90',
    included: [
      'Servicios ilimitados',
      'Solicitudes ilimitadas',
      'Comision minima del 5%',
      'Sin comision primeros S/ 2000',
      'Soporte dedicado 24/7',
    ],
  },
} as const;

type PaidPlanId = keyof typeof PLAN_DETAILS;
type PaymentMethod = 'card' | 'paypal';

function CardPaymentForm({ planId }: { planId: PaidPlanId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setFormError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw new Error(submitError.message);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/seller/membership?subscription=${planId.toLowerCase()}`,
        },
      });

      if (error) throw new Error(error.message);
    } catch (error: any) {
      setFormError(error.message || 'No se pudo procesar el pago');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="seller-soft-panel border rounded-2xl p-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {formError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
          {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full rounded-xl bg-[#00e676] py-4 text-sm font-black text-black transition hover:bg-[#00c868] disabled:opacity-70"
      >
        {isProcessing ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" /> Procesando pago...
          </span>
        ) : (
          'Pagar'
        )}
      </button>
    </form>
  );
}

function PayPalPaymentBox({ planId }: { planId: PaidPlanId }) {
  const router = useRouter();
  const [paypalError, setPaypalError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-xs text-[var(--text-secondary)]">
        Inicia sesion con tu cuenta sandbox de PayPal para simular el pago.
      </div>

      {paypalError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
          {paypalError}
        </div>
      )}

      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
        createOrder={async () => {
          setPaypalError(null);
          return await paypalService.createSubscriptionOrder(planId);
        }}
        onApprove={async (data) => {
          try {
            if (!data.orderID) throw new Error('PayPal no devolvio la orden');
            await paypalService.captureSubscriptionOrder(data.orderID, planId);
            router.push(`/dashboard/seller/membership?subscription=${planId.toLowerCase()}-paypal`);
          } catch (error: any) {
            setPaypalError(error.message || 'No se pudo confirmar PayPal');
          }
        }}
        onError={(error) => {
          console.error('[PAYPAL BUTTON ERROR]:', error);
          setPaypalError('PayPal no pudo iniciar el pago');
        }}
      />
    </div>
  );
}

export default function MembershipCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const planId = String(params.plan || '').toUpperCase() as PaidPlanId;
  const plan = PLAN_DETAILS[planId];
  const { handleUpgrade, loadingPlan, error } = useSubscription();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const isValidPlan = planId === 'PRO' || planId === 'ELITE';

  useEffect(() => {
    let ignore = false;

    const prepareIntent = async () => {
      if (!isValidPlan) return;

      const secret = await handleUpgrade(planId);
      if (!ignore) setClientSecret(secret);
    };

    prepareIntent();

    return () => {
      ignore = true;
    };
  }, [handleUpgrade, isValidPlan, planId]);

  const stripeOptions = useMemo(() => {
    if (!clientSecret) return undefined;

    return {
      clientSecret,
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#00e676',
          borderRadius: '12px',
          fontFamily: 'system-ui, sans-serif',
        },
      },
    };
  }, [clientSecret]);

  if (!isValidPlan || !plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Plan no disponible</h1>
        <button onClick={() => router.push('/dashboard/seller/membership')} className="mt-4 text-sm font-bold text-emerald-500">
          Volver a membresia
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-8">
      <button
        onClick={() => router.push('/dashboard/seller/membership')}
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={18} /> Volver a planes
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <main className="space-y-8">
          <section>
            <h1 className="text-2xl font-black mb-4">Detalles de la suscripcion</h1>
            <div className="seller-panel border rounded-2xl p-6">
              <h2 className="text-base font-black mb-4">{plan.name}</h2>
              <p className="text-xs font-bold mb-4">El plan incluye:</p>
              <ul className="space-y-3">
                {plan.included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                    <Check size={16} className="text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 flex gap-3 rounded-xl border border-blue-500/40 bg-blue-500/5 px-4 py-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
              <p>
                Tu suscripcion se activa al confirmar el pago. Puedes cambiar de plan o cancelarlo desde tu panel.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black mb-4">Metodos de pago</h2>
            <div className="seller-panel border rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMethod('paypal')}
                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${method === 'paypal' ? 'bg-blue-500/5' : 'hover:bg-[var(--bg-soft)]'}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-full border ${method === 'paypal' ? 'border-blue-600 bg-blue-600 shadow-[inset_0_0_0_4px_white]' : 'border-zinc-400'}`} />
                  <span className="text-sm font-black text-blue-600">PayPal</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Proximamente</span>
              </button>

              {method === 'paypal' && (
                <div className="border-t border-[var(--border-strong)] p-5">
                  {paypalClientId ? (
                    <PayPalScriptProvider
                      options={{
                        clientId: paypalClientId,
                        currency: 'USD',
                        intent: 'capture',
                      }}
                    >
                      <PayPalPaymentBox planId={planId} />
                    </PayPalScriptProvider>
                  ) : (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
                      Falta NEXT_PUBLIC_PAYPAL_CLIENT_ID en frontend/.env.
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex w-full items-center justify-between border-t border-[var(--border-strong)] px-5 py-4 text-left transition ${method === 'card' ? 'bg-emerald-500/5' : 'hover:bg-[var(--bg-soft)]'}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`h-4 w-4 rounded-full border ${method === 'card' ? 'border-emerald-500 bg-emerald-500 shadow-[inset_0_0_0_4px_white]' : 'border-zinc-400'}`} />
                  <CreditCard size={18} className="text-zinc-500" />
                  <span className="text-sm font-bold">Tarjetas de credito y debito</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-500">Visa / Mastercard / Amex</span>
              </button>

              {method === 'card' && (
                <div className="border-t border-[var(--border-strong)] p-5">
                  {loadingPlan !== null && (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-[var(--bg-soft)] p-5 text-sm font-bold text-zinc-500">
                      <Loader2 size={18} className="animate-spin text-emerald-500" />
                      Preparando pago seguro...
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
                      {error}
                    </div>
                  )}

                  {stripeOptions && (
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <CardPaymentForm planId={planId} />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="border-t border-[var(--border-strong)] pt-8">
            <h2 className="text-lg font-black mb-4">Informacion de facturacion</h2>
            <p className="text-sm text-zinc-500">Peru</p>
          </section>
        </main>

        <aside className="lg:sticky lg:top-8 h-fit">
          <div className="seller-panel border rounded-2xl p-6">
            <div className="flex items-center justify-between text-sm font-black">
              <span>Total</span>
              <span>S/ {plan.price}</span>
            </div>

            <div className="my-5 h-px bg-[var(--border-strong)]" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>{plan.name}</span>
                <span>S/ {plan.price}/mes</span>
              </div>
              <div className="flex justify-between font-black">
                <span>Total</span>
                <span>S/ {plan.price}</span>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 text-xs text-zinc-500">
              <ShieldCheck size={16} className="shrink-0 text-blue-500" />
              <span>Pago seguro y protegido.</span>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
              <LockKeyhole size={16} className="shrink-0 text-emerald-500" />
              <span>No almacenamos los datos de tu metodo de pago.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
