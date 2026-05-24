'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, ArrowLeft, Zap, Star } from 'lucide-react';
// Ajusta la ruta del Navbar según tu proyecto
import Navbar from '../../../../components/layout/Navbar'; 

// 🚀 Cargamos Stripe con tu llave pública (asegúrate de tenerla en tu .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function SubscriptionCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = params.planId as string;
  const clientSecret = searchParams.get('secret');

  // Datos visuales del plan
  const isPro = planId === 'PRO';
  const planName = isPro ? 'Pro' : 'Elite';
  const planPrice = isPro ? '39.90' : '99.90';
  const PlanIcon = isPro ? Zap : Star;
  const iconColor = isPro ? 'text-[#00e676]' : 'text-yellow-500';

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Error de sesión de pago</h1>
        <p className="text-zinc-500 mb-6">No se encontró el token de seguridad de Stripe.</p>
        <button onClick={() => router.push('/membership')} className="px-6 py-3 bg-zinc-800 rounded-xl font-bold">
          Volver a membresías
        </button>
      </div>
    );
  }

  // 🚀 Configuramos Stripe para que tenga modo oscuro y combine con tu diseño
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#00e676',
        colorBackground: '#121214',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        borderRadius: '16px',
        spacingUnit: '4px',
      },
      rules: {
        '.Input': {
          border: '1px solid #27272a',
          boxShadow: 'none',
        },
        '.Input:focus': {
          border: '1px solid #00e676',
          boxShadow: '0 0 0 1px #00e676',
        }
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00e676]/30">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button onClick={() => router.back()} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors mb-8 w-fit">
          <ArrowLeft size={16} /> Volver a los planes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMNA IZQUIERDA: RESUMEN DEL PLAN */}
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-3xl font-black mb-6">Finaliza tu suscripción</h1>
            
            <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/5 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-[#0a0a0a] border border-zinc-800 flex items-center justify-center ${iconColor}`}>
                  <PlanIcon size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Suscripción Mensual</p>
                  <h2 className="text-2xl font-black">Plan {planName}</h2>
                </div>
              </div>

              <div className="h-px bg-zinc-800/60 my-6"></div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Facturación</span>
                  <span className="font-bold">Mensual</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold">S/ {planPrice}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-zinc-800/60 pt-6">
                <div>
                  <p className="text-sm font-bold text-zinc-400 mb-1">Total a pagar hoy</p>
                  <p className="text-[10px] text-zinc-500">Incluye impuestos aplicables</p>
                </div>
                <span className="text-3xl font-black text-[#00e676]">S/ {planPrice}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
              <ShieldCheck className="text-[#00e676] shrink-0 mt-0.5" size={20} />
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tus pagos están protegidos con encriptación de grado bancario (AES-256) por Stripe. No almacenamos los datos de tu tarjeta.
              </p>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO DE STRIPE */}
          <div className="lg:col-span-7">
            <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 shadow-xl">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm planId={planId} />
              </Elements>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 🧩 COMPONENTE DEL FORMULARIO DE PAGO
// ---------------------------------------------------------------------------
function CheckoutForm({ planId }: { planId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage(null);

         const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/freelancer?payment=success&plan=${planId}`,
      },
    });

    if (error) {
      setMessage(error.message || 'Ocurrió un error inesperado al procesar el pago.');
    } else {
      setMessage('Un error inesperado ha ocurrido.');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <PaymentElement className="mb-8" />

      {message && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold animate-in fade-in">
          {message}
        </div>
      )}

      <button 
        disabled={isLoading || !stripe || !elements} 
        type="submit"
        className="w-full py-4 bg-[#00e676] text-black rounded-xl font-black text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,230,118,0.2)]"
      >
        {isLoading ? (
          <><Loader2 size={18} className="animate-spin" /> Procesando pago...</>
        ) : (
          <>Pagar suscripción ahora</>
        )}
      </button>

      <p className="text-center text-[11px] text-zinc-500 mt-4">
        Al confirmar, aceptas los Términos de Servicio y la Política de Privacidad.
      </p>
    </form>
  );
}