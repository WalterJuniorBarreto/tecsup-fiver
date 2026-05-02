'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Star, Clock, MessageSquare, ChevronRight, CheckCircle2, ShieldCheck, Loader2, ShoppingCart, Lock } from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import { getAuthHeader, getStoredUser } from '../../../lib/auth';
import { freelanceService } from '../../../services/freelance.service';
import { paymentService } from '../../../services/payment.service';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { api } from '../../../config/axios';
import ReviewSection from '../../../components/reviews/ReviewSection';



initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '');
export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = getStoredUser();
        
        const data = await freelanceService.getServiceById(serviceId);
        const memberSinceYear = new Date(data.seller.createdAt).getFullYear();
        setService({
          ...data,
          seller: { ...data.seller, memberSince: memberSinceYear.toString() }
        });

        if (currentUser) {
          const paymentId = searchParams.get('payment_id'); 
          const status = searchParams.get('status');

          if (status === 'approved' && paymentId) {
            console.log("Validando el pago con el servidor...");
            await paymentService.verifyPayment(paymentId); 
            router.replace(`/explore/${serviceId}`);
          }

          const access = await paymentService.checkAccess(serviceId);
          setHasPaid(access);
        }
      } catch (error) {
        console.error("Error cargando la vista:", error);
      } finally {
        setIsLoading(false);
        setCheckingPayment(false);
      }
    };

    loadData();
  }, [serviceId, searchParams, router]);
  
  const handlePurchase = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await api.post('/api/payments/create-preference', {
        serviceId: service.id,
        title: service.title,
        price: service.price
      }, { headers: getAuthHeader() });

      setPreferenceId(response.data.preferenceId);
      
    } catch (error) {
      console.error("Error al generar el pago:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleStartChat = async () => {
    const currentUser = getStoredUser();
    if (!currentUser) return;

    setIsStartingChat(true);
    try {
      router.push(
        `/dashboard/client/messages?sellerId=${service.seller.id}&sellerName=${encodeURIComponent(service.seller.name)}&serviceTitle=${encodeURIComponent(service.title)}`
      );
    } catch (error) {
      console.error("Error iniciando chat", error);
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!service) return <div className="min-h-screen bg-[#0c0c0e] text-white p-20 text-center">Servicio no encontrado</div>;

  const authorAvatar = service.seller.avatar || `https://ui-avatars.com/api/?name=${service.seller.name}&background=121214&color=00e676`;
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white font-sans selection:bg-emerald-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-sm text-zinc-500 flex items-center gap-2">
        <span className="hover:text-white cursor-pointer transition">Explorar</span>
        <ChevronRight size={14} />
        <span className="hover:text-white cursor-pointer transition">{service.category?.name || 'General'}</span>
        <ChevronRight size={14} />
        <span className="text-zinc-300 truncate max-w-xs">{service.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 flex flex-col lg:flex-row gap-12">
        
        <div className="flex-1 space-y-10">
          
          <header className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {service.title}
            </h1>
            
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
              <img src={authorAvatar} alt={service.seller.name} className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover" />
              <div>
                <p className="font-bold text-white text-lg">{service.seller.name}</p>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <Star size={14} className="fill-emerald-500" /> 5.0
                  </span>
                  <span>(0 reseñas)</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span>@{service.seller.username}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="rounded-[2rem] overflow-hidden border border-zinc-800 bg-[#121214] aspect-video relative group">
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[10px] font-bold px-4 py-2 rounded-xl text-emerald-400 uppercase tracking-widest shadow-xl border border-emerald-500/20">
              {service.category?.name}
            </span>
          </div>

          <section className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Acerca de este servicio</h2>
            <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {service.description}
            </div>
          </section>

          <ReviewSection serviceId={service.id} />

        </div>

        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 space-y-6">
            
        
            <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-zinc-400 font-bold tracking-widest uppercase text-xs">Paquete Único</span>
                <span className="text-4xl font-black text-white">S/ {service.price}</span>
              </div>

              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                Adquisición del servicio completo según las especificaciones descritas por el vendedor.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-zinc-300 font-medium">
                  <Clock className="text-emerald-500" size={20} />
                  <span>Entrega en <strong>{service.deliveryDays} días</strong></span>
                </div>
                <div className="flex items-center gap-3 text-zinc-300 font-medium">
                  <ShieldCheck className="text-emerald-500" size={20} />
                  <span>Pago protegido por DevMarket</span>
                </div>
              </div>

              <div className="space-y-3">
                {hasPaid ? (
                  <div className="bg-zinc-900 p-4 rounded-xl flex items-center justify-center gap-3 border border-zinc-800 shadow-inner">
                    <Lock className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">¡Servicio adquirido con éxito!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push(`/checkout/${service.id}`)}
                    className="w-full py-4 bg-[#00e676] hover:bg-emerald-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Ir al Checkout - S/ {service?.price}
                  </button>
                )}

                <button 
                  onClick={handleStartChat}
                  disabled={!hasPaid || isStartingChat}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all border
                    ${hasPaid 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/10' 
                      : 'bg-zinc-900/30 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                    }`}
                >
                  {!hasPaid && <Lock size={16} />}
                  {isStartingChat ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                  {hasPaid ? 'Ir al Chat de Trabajo' : 'Chat bloqueado hasta el pago'}
                </button>
              </div>
            </div>

            <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[2rem] p-6 text-center">
              <img src={authorAvatar} alt={service.seller.name} className="w-20 h-20 mx-auto rounded-full border-4 border-[#121214] object-cover mb-4" />
              <h3 className="font-bold text-lg">{service.seller.name}</h3>
              <p className="text-emerald-500 text-sm font-medium mb-4">Vendedor Verificado</p>
              
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-4 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Miembro desde</p>
                  <p className="font-bold text-zinc-300">{service.seller.memberSince}</p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Tiempo de resp.</p>
                  <p className="font-bold text-zinc-300">~ 1 hora</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}