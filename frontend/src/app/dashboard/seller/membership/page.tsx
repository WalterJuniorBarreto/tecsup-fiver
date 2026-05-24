'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Check,
  Sparkles,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { useSubscription } from '../../../../hooks/useSubscription';

type Plan = {
  id: 'FREE' | 'PRO' | 'ELITE';
  name: string;
  tagline: string;
  price: string;
  priceDetail: string;
  icon: React.ReactNode;
  benefits: { text: string; active: boolean }[];
};

type PaidPlan = Plan & { id: 'PRO' | 'ELITE' };

export default function MembershipPage() {
  const router = useRouter();
  const { loadingPlan, error, currentTier } = useSubscription();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan | null>(null);

  const handleCloseModal = () => {
    if (loadingPlan) return;
    setSelectedPlan(null);
  };

  const goToCheckout = () => {
    if (!selectedPlan) return;
    router.push(`/dashboard/seller/membership/checkout/${selectedPlan.id}`);
  };

  const plans: Plan[] = [
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
        { text: 'Chat basico con clientes', active: true },
        { text: 'Perfil publico', active: true },
        { text: 'Comision: 15%', active: true },
        { text: 'Estadisticas basicas', active: false },
        { text: 'Soporte prioritario', active: false },
        { text: 'Insignia verificado', active: false },
      ],
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
        { text: 'Comision reducida: 10%', active: true },
        { text: 'Sin comision primeros S/ 400', active: true },
        { text: 'Estadisticas avanzadas', active: true },
        { text: 'Soporte prioritario', active: false },
      ],
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
        { text: 'Comision minima: 5%', active: true },
        { text: 'Sin comision primeros S/ 2000', active: true },
        { text: 'Estadisticas avanzadas', active: true },
        { text: 'Soporte dedicado 24/7', active: true },
      ],
    },
  ];

  const faqs = [
    { q: 'Puedo cambiar de plan en cualquier momento?', a: 'Si, puedes cambiar o cancelar tu plan en cualquier momento desde tu panel de control.' },
    { q: 'Que incluye el soporte prioritario?', a: 'Respuestas mas rapidas, acceso a un equipo dedicado y prioridad en nuevas funciones.' },
    { q: 'Hay periodo de prueba?', a: 'Puedes comenzar gratis sin tarjeta de credito. Para probar planes pro, contactanos.' },
    { q: 'Como se calcula la comision?', a: 'Se aplica a cada pago recibido. Los planes Pro/Elite tienen descuentos significativos.' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 relative">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Planes que crecen con tu negocio</h1>
        <p className="text-zinc-500">Elige el plan perfecto para tus necesidades.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center font-bold max-w-2xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-8 rounded-[32px] border flex flex-col transition-all duration-300 seller-panel hover:border-emerald-500/50"
          >
            <div className="w-12 h-12 rounded-2xl seller-soft-panel border flex items-center justify-center mb-6">{plan.icon}</div>
            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
            <p className="text-zinc-500 text-sm mb-6">{plan.tagline}</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-bold">S/ {plan.price}</span>
              <span className="text-zinc-500 text-sm">{plan.priceDetail}</span>
            </div>

            <button
              onClick={() => plan.id !== 'FREE' && plan.id !== currentTier && setSelectedPlan(plan as PaidPlan)}
              disabled={loadingPlan !== null || plan.id === currentTier}
              className={`w-full py-4 rounded-2xl font-bold text-sm mb-8 transition disabled:opacity-50 ${
                plan.id === currentTier
                  ? 'bg-[var(--bg-soft)] text-zinc-500 cursor-default border border-zinc-800'
                  : plan.id === 'FREE'
                    ? 'bg-[var(--bg-soft)] text-zinc-500 cursor-default'
                    : plan.id === 'PRO'
                      ? 'bg-[#00e676] text-black hover:bg-[#00c868]'
                      : 'bg-[var(--text-primary)] text-[var(--bg-elevated)] hover:opacity-90'
              }`}
            >
              {plan.id === currentTier ? 'Plan Actual' : plan.id === 'FREE' ? 'Bajar de plan' : 'Actualizar'}
            </button>

            <ul className="space-y-4 flex-1">
              {plan.benefits.map((benefit) => (
                <li key={benefit.text} className={`flex items-center gap-3 text-sm ${benefit.active ? 'text-[var(--text-secondary)]' : 'text-zinc-500 opacity-60'}`}>
                  <Check size={16} className={benefit.active ? 'text-emerald-500' : 'text-zinc-900'} /> {benefit.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="seller-panel border w-full max-w-3xl rounded-[32px] overflow-hidden relative animate-in fade-in zoom-in duration-200 shadow-2xl">
            <button
              onClick={handleCloseModal}
              disabled={loadingPlan !== null}
              className="absolute top-6 right-6 text-zinc-500 hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold mb-2">Confirma tu actualizacion</h2>
              <p className="text-zinc-500 text-sm mb-8">Revisa tu plan antes de elegir el metodo de pago.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="seller-upgrade-panel border rounded-2xl p-6">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">Tu nuevo plan</p>
                  <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Plan {selectedPlan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">S/ {selectedPlan.price}</span>
                    <span className="text-zinc-500 text-xs">/mes</span>
                  </div>
                  <ul className="space-y-3">
                    {selectedPlan.benefits.slice(4, 8).map((benefit) => (
                      <li key={benefit.text} className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                        <Check size={14} className="text-emerald-500" /> {benefit.text}
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
                      <div className="h-px bg-[var(--border-strong)] my-4" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">Total hoy</span>
                        <span className="text-2xl font-bold text-[#00e676]">S/ {selectedPlan.price}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed mt-4">
                    En el siguiente paso podras elegir el metodo de pago y confirmar la suscripcion.
                  </p>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-4 bg-[var(--bg-soft)] text-[var(--text-primary)] border border-zinc-800 rounded-xl font-bold text-sm hover:border-emerald-500/40 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={goToCheckout}
                  className="flex-[2] py-4 bg-[#00e676] text-black rounded-xl font-bold text-sm hover:bg-[#00c868] transition-all flex items-center justify-center gap-2"
                >
                  Pagar <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="seller-panel border rounded-2xl p-6 cursor-pointer hover:border-zinc-700">
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
