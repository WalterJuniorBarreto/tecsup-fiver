'use client';

import { useState, useEffect } from 'react'; 
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  Star, Clock, MessageSquare, ChevronRight, ShieldCheck, 
  Loader2, ShoppingCart, Lock, CheckCircle2, Flag 
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import { getStoredUser } from '../../../lib/auth';
import { freelanceService } from '../../../services/freelance.service';
import { paymentService } from '../../../services/payment.service';
import { moderationService } from '../../../services/moderation.service'; 
import ReviewSection from '../../../components/reviews/ReviewSection';
import { useReviews } from '../../../hooks/useReviews';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params.id as string;
  const { stats } = useReviews(serviceId);

  const [service, setService] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const isOwner = currentUser?.id === service?.seller?.id;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
   const loadData = async () => {
      try {
        const loggedUser = getStoredUser();
        setCurrentUser(loggedUser);
        
        const data = await freelanceService.getServiceById(serviceId);
        const memberSinceYear = new Date(data.seller.createdAt).getFullYear();
        setService({
          ...data,
          seller: { ...data.seller, memberSince: memberSinceYear.toString() }
        });

        if (loggedUser) {
          const accessResult = await paymentService.checkAccess(serviceId);
          const isPaidInDb = accessResult?.hasAccess === true;
          
          const redirectStatus = searchParams.get('redirect_status');
          const isPaidInUrl = redirectStatus === 'succeeded';

          if (isPaidInDb || isPaidInUrl) {
            setHasPaid(true); 
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
      }
    };

    loadData();
  }, [serviceId, searchParams]); 

  const handleStartChat = async () => {
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

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      return showToast('Debes escribir un motivo para el reporte.', 'error');
    }
    try {
      setIsSubmittingReport(true);
      await moderationService.submitReport({
        targetType: 'SERVICE',
        targetId: service.id,
        reason: reportReason
      });
      setShowReportModal(false);
      setReportReason('');
      showToast('Reporte enviado. Nuestro equipo lo revisará pronto.', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Error al enviar el reporte', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00e676] animate-spin" />
      </div>
    );
  }

  if (!service) return <div className="min-h-screen bg-[#0c0c0e] text-white p-20 text-center">Servicio no encontrado</div>;

  const authorAvatar = service.seller.avatar || `https://ui-avatars.com/api/?name=${service.seller.name}&background=121214&color=00e676`;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white font-sans selection:bg-[#00e676]/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-sm text-zinc-500 flex items-center gap-2">
        <span className="hover:text-white cursor-pointer transition">Explorar</span>
        <ChevronRight size={14} />
        <span className="hover:text-white cursor-pointer transition">{service.category?.name || 'General'}</span>
        <ChevronRight size={14} />
        <span className="text-zinc-300 truncate max-w-xs">{service.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
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
                  <span className="flex items-center gap-1 text-[#00e676] font-bold">
                    <Star size={14} className="fill-[#00e676]" /> 
                    {stats?.average?.toFixed(1) || '0.0'}
                  </span>
                  <span>({stats?.total || 0} reseñas)</span>
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
            <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[10px] font-bold px-4 py-2 rounded-xl text-[#00e676] uppercase tracking-widest shadow-xl border border-[#00e676]/20">
              {service.category?.name}
            </span>
          </div>

          <section className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Acerca de este servicio</h2>
            <div className="prose prose-invert max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed break-words">
              {service.description}
            </div>
          </section>

          <ReviewSection serviceId={service.id} hasPaid={hasPaid} />
        </div>

        <div className="lg:col-span-4 sticky top-24 space-y-6 w-full">
          
          {/* Tarjeta de Pago */}
          <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex flex-col gap-1 mb-6">
              <span className="text-zinc-400 font-bold tracking-widest uppercase text-[10px] lg:text-xs">Paquete Único</span>
              <span className="text-4xl lg:text-5xl font-black text-white">S/ {service.price}</span>
            </div>

            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Adquisición del servicio completo según las especificaciones descritas por el vendedor.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-zinc-300 font-medium text-sm lg:text-base">
                <Clock className="text-[#00e676] shrink-0" size={20} />
                <span>Entrega en <strong>{service.deliveryDays} días</strong></span>
              </div>
              <div className="flex items-center gap-3 text-zinc-300 font-medium text-sm lg:text-base">
                <ShieldCheck className="text-[#00e676] shrink-0" size={20} />
                <span>Pago seguro y encriptado</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {hasPaid ? (
                <>
                  <div className="w-full bg-[#00e676]/10 border border-[#00e676]/30 p-4 rounded-xl flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
                    <span className="text-[#00e676] font-bold">¡Servicio adquirido!</span>
                  </div>
                  <button 
                    onClick={handleStartChat}
                    disabled={isStartingChat}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#00e676] hover:bg-[#00c868] text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:scale-[1.02]"
                  >
                    {isStartingChat ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                    Ir al Chat de Trabajo
                  </button>
                </>
              ) : isOwner ? (
                <button 
                  disabled
                  className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Este es tu servicio
                </button>
              ) : (
                <>
                  <button
                    onClick={() => router.push(`/checkout/${service.id}`)}
                    className="w-full py-4 bg-[#00e676] hover:bg-[#00c868] text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:scale-[1.02]"
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
            <p className="text-[#00e676] text-sm font-medium mb-4">Vendedor Verificado</p>
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

          {!isOwner && currentUser && (
            <div className="text-center mt-2">
              <button 
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10"
              >
                <Flag size={14} /> Reportar este servicio
              </button>
            </div>
          )}

        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Flag size={20} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Reportar Servicio</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Si consideras que este servicio viola nuestras políticas de uso, descríbenos el motivo detalladamente. Nuestro equipo de moderación lo revisará.
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Motivo del reporte</label>
                  <textarea 
                    rows={4}
                    placeholder="Ej: El servicio promete cosas irreales, es una estafa, contiene material inapropiado..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-500/50 resize-none mt-1 placeholder:text-zinc-600 transition-colors"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={isSubmittingReport} 
                  onClick={() => { setShowReportModal(false); setReportReason(''); }} 
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-300 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  disabled={isSubmittingReport} 
                  onClick={handleSubmitReport} 
                  className="flex-[2] py-3.5 rounded-xl text-sm font-black text-white bg-red-500 hover:bg-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-500/20"
                >
                  {isSubmittingReport ? <Loader2 size={16} className="animate-spin" /> : 'Enviar Reporte'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border bg-[#121214] ${toast.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-[#00e676] border-[#00e676]/30'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}