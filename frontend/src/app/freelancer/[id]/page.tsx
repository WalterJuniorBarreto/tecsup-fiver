'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFreelancer } from '../../../hooks/useFreelancer';
import { 
  Loader2, MapPin, Calendar, Star, Package, 
  CheckCircle2, ExternalLink, Code2, ArrowLeft, Heart, MessageSquareQuote, Flag
} from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '../../../hooks/useFavorites';
import { reviewService } from '../../../services/review.service';
import { getStoredUser } from '../../../lib/auth';
import { moderationService } from '../../../services/moderation.service';

export default function FreelancerPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params.id as string;
  
  const { profile, loading, error } = useFreelancer(freelancerId);
  const { isServiceFavorited, toggleFavorite } = useFavorites();

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const [realStats, setRealStats] = useState({ total: 0, average: 0 });
  const handleStatsLoaded = useCallback((total: number, avg: number) => {
    setRealStats((prev) => {
      if (prev.total === total && prev.average === avg) return prev;
      return { total, average: avg };
    });
  }, []);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      return showToast('Debes escribir un motivo para el reporte.', 'error');
    }
    try {
      setIsSubmittingReport(true);
     await moderationService.submitReport({
        targetType: 'USER',
        targetId: profile.id, //
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00e676] w-12 h-12 mb-4" />
        <p className="text-zinc-500 font-medium tracking-widest text-sm uppercase">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="text-red-500 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Perfil no encontrado</h1>
        <p className="text-zinc-400 mb-8">{error || "El freelancer que buscas no existe o fue eliminado."}</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-[#121214] text-white rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Volver
        </button>
      </div>
    );
  }

  const displayName = profile.username || profile.name || 'Freelancer';
  const memberSince = new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const isOwner = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans pt-8 pb-20 px-4 md:px-8 selection:bg-[#00e676]/30">
      
      <div className="max-w-[1400px] mx-auto mb-8">
        <button onClick={() => router.back()} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors w-fit">
          <ArrowLeft size={16} /> Volver a resultados
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <aside className="xl:col-span-4 space-y-6">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#00e676]/20 to-transparent opacity-50 pointer-events-none"></div>

            <div className="relative w-36 h-36 mx-auto mb-6">
              <img 
                src={profile.avatar || `https://ui-avatars.com/api/?name=${displayName}&background=0a0a0a&color=00e676&size=200`} 
                alt={displayName}
                className="w-full h-full rounded-full object-cover border-4 border-[#121214] shadow-[0_0_30px_rgba(0,230,118,0.15)] relative z-10"
              />
              <div className="absolute bottom-1 right-2 w-5 h-5 bg-[#00e676] border-[3px] border-[#121214] rounded-full z-20"></div>
            </div>

            <h1 className="text-3xl font-black text-white mb-1 truncate">{displayName}</h1>
            <p className="text-[#00e676] font-bold text-sm mb-4 tracking-wide uppercase">
              {profile.professionalTitle || 'Freelancer Profesional'}
            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-white font-black text-lg">
                  <Star size={16} className="text-[#00e676] fill-[#00e676]" /> 
                  {realStats.total > 0 ? realStats.average.toFixed(1) : '0.0'}
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">({realStats.total} reseñas)</span>
              </div>

              <div className="w-[1px] h-8 bg-zinc-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-white font-black text-lg">{profile.completedOrders}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Proyectos</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-zinc-800/60 mb-6"></div>

            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-400"><MapPin size={16} /> Ubicación</span>
                <span className="font-bold text-white text-right">{profile.location || 'No especificada'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-zinc-400"><Calendar size={16} /> Miembro desde</span>
                <span className="font-bold text-white text-right capitalize">{memberSince}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <Code2 size={20} className="text-[#00e676]" /> Habilidades
            </h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-[#0a0a0a] border border-zinc-800 text-zinc-300 text-xs font-bold rounded-lg hover:border-[#00e676]/50 transition-colors cursor-default">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-zinc-500 text-sm italic">Aún no ha agregado habilidades.</p>
              )}
            </div>

            {profile.portfolioUrl && (
              <>
                <div className="h-[1px] w-full bg-zinc-800/60 mb-6"></div>
                <a 
                  href={profile.portfolioUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-zinc-800 hover:border-[#00e676] group transition-all"
                >
                  <span className="font-bold text-sm text-zinc-300 group-hover:text-white">Ver Portafolio Externo</span>
                  <ExternalLink size={16} className="text-zinc-500 group-hover:text-[#00e676]" />
                </a>
              </>
            )}
          </div>

          {!isOwner && currentUser && (
            <div className="text-center mt-2">
              <button 
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10"
              >
                <Flag size={14} /> Reportar a este usuario
              </button>
            </div>
          )}
        </aside>

        <main className="xl:col-span-8 space-y-8">
          
          <section className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 md:p-10 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-4">Sobre mí</h2>
            <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap text-[15px]">
              {profile.bio || "Este freelancer aún no ha escrito su biografía, pero sus servicios hablan por sí solos."}
            </p>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-2xl font-black text-white">Servicios de {displayName}</h2>
              <span className="text-xs font-bold bg-zinc-800/50 text-zinc-400 px-3 py-1 rounded-full border border-zinc-700">
                {profile.services.length} disponibles
              </span>
            </div>

            {profile.services.length === 0 ? (
              <div className="bg-[#121214] border border-dashed border-zinc-800/80 rounded-[2rem] p-12 text-center flex flex-col items-center">
                <Package size={48} className="text-zinc-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No hay servicios publicados</h3>
                <p className="text-zinc-500 text-sm">Este freelancer está preparando nuevos proyectos. Vuelve pronto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.services.map((service: any) => {
                  const favorited = isServiceFavorited(service.id);
                  return (
                    <Link key={service.id} href={`/explore/${service.id}`} className="bg-[#121214] border border-zinc-800/60 rounded-[1.5rem] overflow-hidden group hover:border-[#00e676]/50 transition-all cursor-pointer shadow-lg flex flex-col relative">
                      <div className="h-48 bg-[#0a0a0a] relative overflow-hidden">
                        <img src={service.image || `https://placehold.co/600x400/0a0a0a/00e676?text=Servicio+DevMarket`} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-40" />
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 z-10">
                          <span className="text-[#00e676] font-black tracking-tight">S/ {service.price}</span>
                        </div>
                        <button onClick={(e) => { e.preventDefault(); toggleFavorite(service.id); }} className={`absolute top-3 left-3 p-2.5 backdrop-blur-md border rounded-full transition-all active:scale-90 z-20 ${favorited ? 'bg-[#00e676] text-black border-transparent shadow-[0_0_15px_rgba(0,230,118,0.4)]' : 'bg-black/40 text-zinc-400 border-zinc-700/50 hover:bg-[#00e676] hover:text-black hover:border-transparent'}`}>
                          <Heart size={18} fill={favorited ? "currentColor" : "none"} className={favorited ? "animate-in zoom-in-125 duration-300" : ""} />
                        </button>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-[#00e676] transition-colors line-clamp-2">{service.title}</h3>
                        <div className="mt-auto pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-bold">
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> Entrega: {service.deliveryDays} días</span>
                          <span className="text-white bg-zinc-800 px-3 py-1.5 rounded-md group-hover:bg-[#00e676] group-hover:text-black transition-colors">Ver detalles</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {profile.services.length > 0 && (
            <FreelancerGlobalReviews 
              services={profile.services} 
              onStatsLoaded={handleStatsLoaded} 
            />
          )}

        </main>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <Flag size={20} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Reportar Usuario</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Si consideras que este usuario viola nuestras políticas de uso o comportamiento, descríbenos el motivo. El equipo de moderación lo evaluará.
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Motivo del reporte</label>
                  <textarea 
                    rows={4}
                    placeholder="Ej: Comportamiento abusivo, perfil falso, fraude..."
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


function FreelancerGlobalReviews({ services, onStatsLoaded }: { services: any[], onStatsLoaded: (total: number, avg: number) => void }) {
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      setIsLoading(true);
      try {
        const promises = services.map(async (service) => {
          const data = await reviewService.getServiceReviews(service.id);
          return data.reviews.map((r: any) => ({ ...r, serviceTitle: service.title }));
        });

        const results = await Promise.all(promises);
        const merged = results.flat();
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setAllReviews(merged);

        const total = merged.length;
        const avg = total > 0 ? (merged.reduce((acc, r) => acc + r.rating, 0) / total) : 0;
        
        onStatsLoaded(total, avg);

      } catch (error) {
        console.error("Error cargando reseñas globales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (services.length > 0) {
      fetchAllReviews();
    } else {
      setIsLoading(false);
    }
  }, [services, onStatsLoaded]);

  if (isLoading) {
    return (
      <section className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 md:p-10 shadow-xl mt-8 flex justify-center">
        <Loader2 className="animate-spin text-[#00e676] w-8 h-8" />
      </section>
    );
  }

  if (allReviews.length === 0) {
    return null; 
  }

  return (
    <section className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 md:p-10 shadow-xl mt-8">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquareQuote className="text-[#00e676] w-8 h-8" />
        <h2 className="text-2xl font-black text-white">Lo que dicen los clientes</h2>
      </div>

      <div className="space-y-4">
        {allReviews.map((review) => {
          const avatar = review.clientAvatar || `https://ui-avatars.com/api/?name=${review.clientName}&background=0a0a0a&color=00e676`;
          const date = new Date(review.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

          return (
            <div key={review._id} className="p-6 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-[#00e676]/30 transition-colors shadow-lg">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 shrink-0 bg-[#121214] rounded-full border border-zinc-800 overflow-hidden">
                   <img src={avatar} alt={review.clientName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-0.5">{review.clientName}</h4>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{date}</p>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <p className="text-[#00e676] text-[10px] font-bold uppercase bg-[#00e676]/10 px-2 py-0.5 rounded-md border border-[#00e676]/20">
                      Servicio: {review.serviceTitle}
                    </p>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed break-words">{review.comment}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0 bg-[#121214] p-2.5 rounded-xl h-fit border border-zinc-800/50">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} className={star <= review.rating ? "text-[#00e676] fill-[#00e676]" : "text-zinc-800 fill-zinc-800"} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}