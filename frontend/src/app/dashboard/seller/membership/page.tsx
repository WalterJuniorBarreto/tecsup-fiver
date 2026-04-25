'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Zap, 
  Star, 
  ArrowUpRight,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';
import { useSubscription } from '../../../../hooks/useSubscription'; 

export default function MembershipPage() {
  const { handleUpgrade, loadingPlan, error, currentTier } = useSubscription();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const handleCloseModal = () => {
    if (loadingPlan) return; 
    setSelectedPlan(null);
  };

  const handleProcessPayment = () => {
    if (!selectedPlan) return;
    
    // Convertimos 'Pro' a 'PRO' o 'Elite' a 'ELITE'
    const planId = selectedPlan.name.toUpperCase() as 'PRO' | 'ELITE';
    
    // Llamamos al hook que pedirá la URL y redirigirá a MercadoPago
    handleUpgrade(planId);
  };

 const plans = [
    {
      id: 'FREE',
      name: 'Gratuito',
      tagline: 'Perfecto para comenzar en DevMarket',
      price: '0',
      priceDetail: '',
      icon: <Sparkles size={20} className="text-[#00e676]" />,
      benefits: [
        { text: '1 servicio publicado', active: true },
        { text: '5 solicitudes activas', active: true },
        { text: 'Chat básico con clientes', active: true },
        { text: 'Perfil público', active: true },
        { text: 'Comisión: 15%', active: true },
        { text: 'Estadísticas básicas', active: false },
        { text: 'Soporte prioritario', active: false },
        { text: 'Insignia verificado', active: false },
      ]
    },
    {
      id: 'PRO',
      name: 'Pro',
      tagline: 'Para crecer y escalar tu negocio',
      price: '39.90',
      priceDetail: '/mes',
      icon: <Zap size={20} className="text-[#00e676]" />,
      benefits: [
        { text: '10 servicios publicados', active: true },
        { text: '50 solicitudes activas', active: true },
        { text: 'Chat prioritario', active: true },
        { text: 'Perfil destacado', active: true },
        { text: 'Comisión reducida: 10%', active: true },
        { text: 'Sin comisión primeros S/ 400', active: true },
        { text: 'Estadísticas avanzadas', active: true },
        { text: 'Soporte prioritario', active: false },
      ]
    },
    {
      id: 'ELITE',
      name: 'Elite',
      tagline: 'Para profesionales y agencias',
      price: '99.90',
      priceDetail: '/mes',
      icon: <Star size={20} className="text-[#00e676]" />,
      benefits: [
        { text: 'Servicios ilimitados', active: true },
        { text: 'Solicitudes ilimitadas', active: true },
        { text: 'Chat prioritario 24/7', active: true },
        { text: 'Perfil destacado premium', active: true },
        { text: 'Comisión mínima: 5%', active: true },
        { text: 'Sin comisión primeros S/ 2000', active: true },
        { text: 'Estadísticas avanzadas', active: true },
        { text: 'Soporte dedicado 24/7', active: true },
      ]
    }
  ];

  const faqs = [
    { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí, puedes cambiar o cancelar tu plan en cualquier momento desde tu panel de control.' },
    { q: '¿Qué incluye el soporte prioritario?', a: 'Respuestas más rápidas, acceso a un equipo dedicado y prioridad en nuevas funciones.' },
    { q: '¿Hay período de prueba?', a: 'Puedes comenzar gratis sin tarjeta de crédito. Para probar planes pro, contáctanos.' },
    { q: '¿Cómo se calcula la comisión?', a: 'Se aplica a cada pago recibido. Los planes Pro/Elite tienen descuentos significativos.' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 relative">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Planes que crecen con tu negocio</h1>
        <p className="text-zinc-500">Elige el plan perfecto para tus necesidades.</p>
      </div>

      {/* 🚀 ALERTA DE ERROR DEL BACKEND */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center font-bold max-w-2xl mx-auto">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`p-8 rounded-[32px] border flex flex-col transition-all duration-300 bg-[#0c0c0e] border-zinc-900 hover:border-emerald-500/50`}
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6">{plan.icon}</div>
            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
            <p className="text-zinc-500 text-sm mb-6">{plan.tagline}</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold">S/ {plan.price}</span>
              <span className="text-zinc-500 text-sm">{plan.priceDetail}</span>
            </div>
            
            <button 
              onClick={() => plan.id !== 'FREE' && plan.id !== currentTier && setSelectedPlan(plan)}
              disabled={loadingPlan !== null || plan.id === currentTier}
              className={`w-full py-4 rounded-2xl font-bold text-sm mb-8 transition disabled:opacity-50 ${
                plan.id === currentTier 
                  ? 'bg-zinc-900 text-zinc-500 cursor-default border border-zinc-800' 
                  : plan.id === 'FREE'
                  ? 'bg-zinc-900 text-zinc-500 cursor-default' 
                  : plan.id === 'PRO'
                  ? 'bg-[#00e676] text-black hover:bg-[#00c868]' 
                  : 'bg-zinc-800 text-white hover:bg-zinc-700' 
              }`}
            >
              {plan.id === currentTier ? 'Plan Actual' : plan.id === 'FREE' ? 'Bajar de plan' : 'Actualizar'}
            </button>

            <ul className="space-y-4 flex-1">
              {plan.benefits.map((b, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${b.active ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <Check size={16} className={b.active ? 'text-emerald-500' : 'text-zinc-900'} /> {b.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-2xl rounded-[32px] overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              disabled={loadingPlan !== null}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-2">Confirma tu actualización</h2>
              <p className="text-zinc-500 text-sm mb-8">Estás a un paso de potenciar tu cuenta con MercadoPago</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#050505] border border-emerald-500/30 rounded-2xl p-6">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">Tu nuevo plan</p>
                  <h3 className="text-xl font-bold mb-4 text-white">Plan {selectedPlan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-white">S/ {selectedPlan.price}</span>
                    <span className="text-zinc-500 text-xs">/mes</span>
                  </div>
                  <ul className="space-y-3">
                    {selectedPlan.benefits.slice(4, 8).map((b: any, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Check size={14} className="text-emerald-500" /> {b.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-tighter text-zinc-400">Resumen del pedido</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Precio mensual</span>
                        <span className="font-medium">S/ {selectedPlan.price}</span>
                      </div>
                      <div className="h-px bg-zinc-900 my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">Total hoy</span>
                        <span className="text-2xl font-bold text-[#00e676]">S/ {selectedPlan.price}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed mt-4">
                    Al continuar, serás redirigido a la plataforma segura de MercadoPago para procesar tu transacción.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button 
                  onClick={handleCloseModal} 
                  disabled={loadingPlan !== null}
                  className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                
                {/* 🚀 EL BOTÓN QUE DISPARA MERCADOPAGO */}
                <button 
                  onClick={handleProcessPayment}
                  disabled={loadingPlan !== null}
                  className="flex-[2] py-4 bg-[#00e676] text-black rounded-xl font-bold text-sm hover:bg-[#00c868] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loadingPlan !== null ? (
                    <><Loader2 size={18} className="animate-spin" /> Redirigiendo a MercadoPago...</>
                  ) : (
                    <>Pagar con MercadoPago <ArrowUpRight size={18} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ SECTION */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-6 cursor-pointer hover:border-zinc-700">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm">{faq.q}</h4>
                <ArrowUpRight size={18} className={`text-zinc-500 transition-transform ${activeFaq === i ? 'rotate-45' : ''}`} />
              </div>
              {activeFaq === i && <p className="mt-4 text-sm text-zinc-500">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}