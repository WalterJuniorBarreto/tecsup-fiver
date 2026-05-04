'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Star, Clock, MessageSquare, ChevronRight, ShieldCheck, Loader2, ShoppingCart, Lock, CheckCircle2} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import { getStoredUser } from '../../../lib/auth';
import { freelanceService } from '../../../services/freelance.service';
import { paymentService } from '../../../services/payment.service';
import ReviewSection from '../../../components/reviews/ReviewSection';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);

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
          console.log("🕵️ Verificando en base de datos si ya pagó...");
          
          // 1. Le preguntamos a la base de datos (con la función que modificamos arriba)
          const accessResult = await paymentService.checkAccess(serviceId);
          
          // 2. Extraemos el booleano CORRECTAMENTE
          const isPaidInDb = accessResult?.hasAccess === true;
          console.log("✅ ¿El usuario ya pagó según la BD?:", isPaidInDb);

          // 3. Revisamos si recién viene de Stripe
          const redirectStatus = searchParams.get('redirect_status');
          const isPaidInUrl = redirectStatus === 'succeeded';

          // 4. Si alguna de las dos es verdad, ¡DESBLOQUEAMOS EL BOTÓN!
          if (isPaidInDb || isPaidInUrl) {
            setHasPaid(true); // 🚀 ESTO LIBERA EL BOTÓN
            
            // Limpiamos la URL sin recargar la página molestas
            if (isPaidInUrl) {
               window.history.replaceState(null, '', `/explore/${serviceId}`);
            }
          } else {
            setHasPaid(false);
          }
        }
      } catch (error) {
        console.error("Error cargando la vista:", error);
      } finally {
        setIsLoading(false);
        setCheckingPayment(false);
      }
    };

    loadData();
  }, [serviceId, searchParams]); // 🚀 Quitamos 'router' de las dependencias
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

      {/* 🚀 EL NUEVO LAYOUT: CSS GRID DE 12 COLUMNAS */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* COLUMNA IZQUIERDA (Contenido) - Toma 8 de las 12 columnas */}
        <div className="lg:col-span-8 space-y-10">
          
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

        {/* COLUMNA DERECHA (Tarjetas) - Toma 4 de las 12 columnas */}
        <div className="lg:col-span-4 sticky top-24 space-y-6 w-full">
          
          {/* Tarjeta de Pago */}
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex flex-col gap-1 mb-6">
              <span className="text-zinc-400 font-bold tracking-widest uppercase text-[10px] lg:text-xs">Paquete Único</span>
              <span className="text-4xl lg:text-5xl font-black text-white">S/ {service.price}</span>
            </div>

            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Adquisición del servicio completo según las especificaciones descritas por el vendedor.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-zinc-300 font-medium text-sm lg:text-base">
                <Clock className="text-emerald-500 shrink-0" size={20} />
                <span>Entrega en <strong>{service.deliveryDays} días</strong></span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300 font-medium text-sm lg:text-base">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <span>Pago seguro y encriptado</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {hasPaid ? (
                <>
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-emerald-500 font-bold">¡Servicio adquirido!</span>
                  </div>
                  <button 
                    onClick={handleStartChat}
                    disabled={isStartingChat}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#00e676] hover:bg-emerald-400 text-black rounded-xl font-bold transition-all shadow-xl hover:scale-[1.02]"
                  >
                    {isStartingChat ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                    Ir al Chat de Trabajo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push(`/checkout/${service.id}`)}
                    className="w-full py-4 bg-[#00e676] hover:bg-emerald-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.02]"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Continuar al Pago - S/ {service?.price}
                  </button>
                  <button 
                    disabled
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold border bg-zinc-900/30 border-zinc-800 text-zinc-600 cursor-not-allowed"
                  >
                    <Lock size={16} />
                    Chat bloqueado hasta el pago
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tarjeta del vendedor */}
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-6 text-center">
            <img src={authorAvatar} alt={service.seller.name} className="w-20 h-20 mx-auto rounded-full border-4 border-[#121214] object-cover mb-4" />
            <h3 className="font-bold text-lg">{service.seller.name}</h3>
            <p className="text-emerald-500 text-sm font-medium mb-4">Vendedor Verificado</p>
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-4 text-sm">
              <div>
                <p className="text-zinc-500 mb-1 text-xs">Miembro desde</p>
                <p className="font-bold text-zinc-300">{service.seller.memberSince}</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1 text-xs">Tiempo resp.</p>
                <p className="font-bold text-zinc-300">~ 1 hora</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}