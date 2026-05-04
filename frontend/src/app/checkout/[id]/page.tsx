'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '../../../components/payment/CheckoutForm';
import { getStoredUser } from '../../../lib/auth';
import { freelanceService } from '../../../services/freelance.service';
import { ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initCheckout = async () => {
      const currentUser = getStoredUser();
      if (!currentUser) {
        router.push(`/auth/login?redirect=/checkout/${serviceId}`);
        return;
      }
      setUser(currentUser);

      try {
        const data = await freelanceService.getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Error cargando servicio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCheckout();
  }, [serviceId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!service) return <div className="min-h-screen bg-[#0c0c0e] text-white text-center pt-20">Servicio no encontrado</div>;

  const options = {
    mode: 'payment' as const,
    amount: Math.round(service.price * 100), 
    currency: 'pen',
    appearance: { 
      theme: 'night' as const,
      variables: {
        colorPrimary: '#00e676',
        colorBackground: '#121214',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '12px',
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Volver al servicio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black mb-2">Resumen de tu pedido</h1>
              <p className="text-zinc-400">Revisa los detalles antes de procesar el pago seguro.</p>
            </div>

            <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-6 flex gap-6 items-center">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-32 h-24 object-cover rounded-xl border border-zinc-700"
              />
              <div>
                <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider">{service.category?.name}</span>
                <h3 className="font-bold text-lg leading-tight mt-1 mb-2">{service.title}</h3>
                <p className="text-zinc-400 text-sm">Vendedor: @{service.seller.username}</p>
              </div>
            </div>

            <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-4 text-zinc-300">
                <span>Precio del servicio</span>
                <span>S/ {service.price}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-zinc-300">
                <span>Tarifa de procesamiento</span>
                <span className="text-emerald-500">Gratis</span>
              </div>
              
              <div className="border-t border-zinc-800 pt-6 flex justify-between items-center">
                <span className="text-xl font-bold">Total a pagar</span>
                <span className="text-4xl font-black text-white">S/ {service.price}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-zinc-500 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <p>Tus pagos están protegidos por el cifrado de grado militar de Stripe. DevMarket no almacena los datos de tu tarjeta.</p>
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
             <h2 className="text-xl font-bold mb-6">Detalles de Pago</h2>
             
             <Elements stripe={stripePromise} options={options}>
               <CheckoutForm 
                 userId={user?.id} 
                 serviceId={serviceId} 
               /> 
             </Elements>
          </div>

        </div>
      </div>
    </div>
  );
}