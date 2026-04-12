'use client';

import React, { useState } from 'react';
import { 
  Check, 
  Zap, 
  Star, 
  ArrowUpRight,
  Sparkles,
  X,
  Lock,
  CreditCard,
  Loader2
} from 'lucide-react';

export default function MembershipPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setShowPayment(false);
    setIsProcessing(false);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert('¡Pago procesado con éxito!');
      handleCloseModal();
    }, 2000);
  };

  const plans = [
    {
      name: 'Gratuito',
      tagline: 'Perfecto para comenzar en DevMarket',
      price: '0',
      priceDetail: '',
      buttonText: 'Plan Actual',
      buttonVariant: 'bg-zinc-900 text-zinc-500 cursor-default',
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
      name: 'Pro',
      tagline: 'Para crecer y escalar tu negocio',
      price: '39.90',
      priceDetail: '/mes',
      buttonText: 'Actualizar',
      buttonVariant: 'bg-[#00e676] text-black hover:bg-[#00c868]',
      featured: true, // Se mantiene para lógica interna si es necesario
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
      name: 'Elite',
      tagline: 'Para profesionales y agencias',
      price: '99.90',
      priceDetail: '/mes',
      buttonText: 'Actualizar',
      buttonVariant: 'bg-zinc-800 text-white hover:bg-zinc-700',
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
              onClick={() => plan.price !== '0' && setSelectedPlan(plan)}
              className={`w-full py-4 rounded-2xl font-bold text-sm mb-8 transition ${plan.buttonVariant}`}
            >
              {plan.buttonText}
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

      {/* MODAL PRINCIPAL */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-2xl rounded-[32px] overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              {!showPayment ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">Confirma tu actualización</h2>
                  <p className="text-zinc-500 text-sm mb-8">Revisa los detalles antes de continuar al pago</p>

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
                        Se renovará el 15 de cada mes. Puedes cambiar o cancelar en cualquier momento.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button onClick={handleCloseModal} className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors">
                      Cancelar
                    </button>
                    <button 
                      onClick={() => setShowPayment(true)}
                      className="flex-[2] py-4 bg-[#00e676] text-black rounded-xl font-bold text-sm hover:bg-[#00c868] transition-all flex items-center justify-center gap-2"
                    >
                      Continuar al pago <ArrowUpRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-2">Información de pago</h2>
                  <p className="text-zinc-500 text-sm mb-8 flex items-center gap-2">
                    <Lock size={14} /> Tu información está encriptada y segura
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
                      <div>
                        <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Nombre en la tarjeta</label>
                        <input 
                          type="text" 
                          placeholder="Juan Pérez" 
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Número de tarjeta</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="**** **** **** 4242" 
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors pl-10"
                          />
                          <Lock size={16} className="absolute left-3.5 top-3.5 text-zinc-600" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Vencimiento</label>
                          <input 
                            type="text" 
                            placeholder="12/26" 
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">CVC</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="***" 
                              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors pl-10"
                            />
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-zinc-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">Plan {selectedPlan.name}</p>
                        <p className="text-[10px] text-zinc-500">Se renueva mensualmente</p>
                      </div>
                      <span className="font-bold text-emerald-500">S/ {selectedPlan.price}/mes</span>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowPayment(false)}
                        disabled={isProcessing}
                        className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50"
                      >
                        Atrás
                      </button>
                      <button 
                        onClick={handleProcessPayment}
                        disabled={isProcessing}
                        className="flex-[2] py-4 bg-[#00e676] text-black rounded-xl font-bold text-sm hover:bg-[#00c868] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={18} className="animate-spin" /> Procesando...
                          </>
                        ) : (
                          <>
                            Pagar ahora <Lock size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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