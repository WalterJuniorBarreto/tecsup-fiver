'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles, Loader2, PackageOpen, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../../components/layout/Navbar';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  
  const serviceId = params.id as string;
  const redirectStatus = searchParams.get('redirect_status');
  
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!redirectStatus || redirectStatus !== 'succeeded') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#00e676] mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest">Verificando transacción...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00e676]/30 flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e676]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="max-w-xl w-full bg-[#121214] border border-zinc-800/80 rounded-[3rem] p-10 md:p-14 text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
          
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#00e676]/20 blur-xl rounded-full animate-pulse"></div>
                <Loader2 className="w-20 h-20 text-[#00e676] animate-spin relative z-10" />
              </div>
              <h2 className="text-2xl font-black mb-2">Procesando tu pedido...</h2>
              <p className="text-zinc-500 text-sm">Estamos conectándote con el vendedor y asegurando tu pago.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#00e676]/30 blur-2xl rounded-full"></div>
                <div className="w-24 h-24 bg-[#0a0a0a] border-2 border-[#00e676] rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(0,230,118,0.4)]">
                  <CheckCircle2 className="w-12 h-12 text-[#00e676]" />
                </div>
                <Sparkles className="absolute -top-2 -right-4 w-8 h-8 text-yellow-400 animate-bounce" />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] text-xs font-black uppercase tracking-widest mb-6">
                <PackageOpen size={14} /> Compra Exitosa
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">¡Servicio Adquirido!</h1>
              
              <p className="text-zinc-400 mb-10 leading-relaxed">
                Tu pago se ha procesado de forma segura y el vendedor ha sido notificado. Ya puedes iniciar el chat de trabajo y enviar tus requerimientos.
              </p>

              <div className="w-full space-y-4">
                <Link 
                  href={`/explore/${serviceId}?redirect_status=succeeded&review=1#reviews`} 
                  className="w-full py-4 bg-[#00e676] text-black rounded-xl font-black text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.2)] hover:scale-[1.02]"
                >
                  <Star size={18} fill="currentColor" />
                  Calificar al freelancer
                </Link>

                <Link
                  href={`/explore/${serviceId}?redirect_status=succeeded`}
                  className="w-full py-4 bg-[#101012] text-zinc-200 rounded-xl font-bold text-sm border border-zinc-800 hover:text-white hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Ir al panel del servicio
                </Link>
                
                <Link 
                  href="/dashboard/client/orders" 
                  className="w-full py-4 bg-[#0a0a0a] text-zinc-300 rounded-xl font-bold text-sm border border-zinc-800 hover:text-white hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  Ver mis pedidos <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ServiceSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 animate-spin text-[#00e676] mb-4" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest">Cargando...</p>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}