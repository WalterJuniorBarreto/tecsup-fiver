'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, Clock, RefreshCcw, Check, MessageSquare, Share2, Heart, ChevronLeft, X, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('Estandar');
  const [activeTab, setActiveTab] = useState('descripcion');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

 
  const allServices = [
    { 
      id: 1, 
      category: 'Diseño', 
      title: 'Diseño de logo profesional con guía de marca completa', 
      author: 'Maria G.', 
      rating: 4.9, 
      reviews: 234, 
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1000',
      plans: {
        Basico: { price: 50, delivery: 2, revisions: 1, features: ["1 Concepto", "Archivo JPG/PNG", "Uso comercial"] },
        Estandar: { price: 150, delivery: 5, revisions: 5, features: ["3 Conceptos", "Archivos Vectoriales", "Guía de marca", "Revisiones prioritarias"] },
        Premium: { price: 250, delivery: 7, revisions: 99, features: ["5 Conceptos", "Social Media Kit", "Papelería completa", "Soporte 24/7"] }
      }
    },
    { 
      id: 2, 
      category: 'Programacion', 
      title: 'Desarrollo de sitio web responsive con Next.js y Tailwind', 
      author: 'Carlos R.', 
      rating: 5.0, 
      reviews: 89, 
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      plans: {
        Basico: { price: 300, delivery: 7, revisions: 2, features: ["Landing Page", "Diseño Adaptable", "Optimización SEO básica"] },
        Estandar: { price: 500, delivery: 14, revisions: 5, features: ["Sitio de 5 páginas", "Blog", "Panel de administración", "Integración de API"] },
        Premium: { price: 900, delivery: 30, revisions: 99, features: ["E-commerce completo", "Pasarela de pagos", "Soporte post-lanzamiento", "Hosting 1 año"] }
      }
    },
    { 
      id: 3, 
      category: 'Video', 
      title: 'Edicion de video profesional para YouTube y redes sociales', 
      author: 'Ana L.', 
      rating: 4.8, 
      reviews: 156, 
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000',
      plans: {
        Basico: { price: 80, delivery: 2, revisions: 1, features: ["Video de 1 min", "Cortes básicos", "Música de stock"] },
        Estandar: { price: 200, delivery: 4, revisions: 3, features: ["Video de 10 min", "Subtítulos", "Corrección de color", "Motion graphics"] },
        Premium: { price: 400, delivery: 7, revisions: 6, features: ["Video 4K", "Diseño sonoro", "Miniatura incluida", "2 Formatos (Vertical/Horizontal)"] }
      }
    }
  ];

  const service = useMemo(() => {
    return allServices.find(s => s.id === Number(params.id)) || allServices[0];
  }, [params.id]);

  const plan = service.plans[selectedPlan as keyof typeof service.plans];

 
  const handlePurchase = () => {
    setIsProcessing(true);

   
    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      chatRef: service.id,
      title: service.title,
      freelancer: service.author,
      status: 'En proceso',
      statusType: 'process',
      progress: 10,
      deliveryDate: `${plan.delivery} días`,
      total: plan.price,
      image: service.image
    };

    
    const existingOrders = JSON.parse(localStorage.getItem('simulated_orders') || '[]');
    localStorage.setItem('simulated_orders', JSON.stringify([newOrder, ...existingOrders]));

    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckout(false);
      alert('¡Compra realizada con éxito! Serás redirigido a tus pedidos.');
      router.push('/dashboard/client/orders');
    }, 2000);
  };
  // ------------------------------------------

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 px-4">
      {/* Botón Volver */}
      <Link href="/dashboard/client/explore" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors group w-fit">
        <div className="p-2 rounded-full group-hover:bg-zinc-900 transition-all">
          <ChevronLeft size={20} />
        </div>
        <span className="text-sm font-bold">Volver al catálogo</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* LADO IZQUIERDO: CONTENIDO */}
        <div className="flex-1 space-y-8">
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-zinc-900 shadow-2xl">
            <img src={service.image} className="w-full h-full object-cover" alt={service.title} />
          </div>

          <div className="p-6 bg-[#0c0c0e] border border-zinc-900 rounded-3xl flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00e676] to-emerald-800 p-0.5">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold">
                  {service.author.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{service.author}</h3>
                <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-[#00e676] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Top Rated</span>
                    <p className="text-xs text-zinc-500 font-medium">Freelancer Verificado</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="p-3 border border-zinc-800 rounded-2xl text-zinc-300 hover:bg-zinc-900 transition"><Heart size={20}/></button>
              <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-bold text-sm hover:border-zinc-700 transition flex items-center gap-2">
                <MessageSquare size={18} /> Contactar
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-black text-white mb-8 leading-tight">{service.title}</h1>
            
            {/* Pestañas */}
            <div className="flex border-b border-zinc-900 mb-8">
              {['descripcion', 'resenas'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-10 py-5 text-xs font-black uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-[#00e676]' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {tab === 'descripcion' ? 'Información del servicio' : `Reseñas (${service.reviews})`}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00e676] shadow-[0_0_10px_#00e676]" />}
                </button>
              ))}
            </div>

            <div className="text-zinc-400 leading-relaxed text-lg bg-zinc-900/30 p-8 rounded-3xl border border-zinc-900/50">
              {activeTab === 'descripcion' ? (
                <div className="space-y-4">
                  <p className="text-white font-bold">¿Por qué elegir este servicio?</p>
                  <p>Ofrezco soluciones de alta calidad en el área de <span className="text-[#00e676] font-bold">{service.category}</span>. Mi enfoque es 100% personalizado, garantizando que cada detalle se alinee con tus objetivos comerciales.</p>
                  <p>He completado exitosamente más de 150 proyectos con clientes internacionales, manteniendo una calificación impecable.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <Star size={40} className="mb-4 text-zinc-800" />
                    <p>Las reseñas se cargarán una vez que se verifique el historial.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LADO DERECHO: SIDEBAR FIJO */}
        <aside className="w-full lg:w-96">
          <div className="sticky top-24 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Selectores de Plan */}
            <div className="flex bg-zinc-900/50 p-2 m-4 rounded-2xl gap-1">
              {['Basico', 'Estandar', 'Premium'].map((p) => (
                <button 
                  key={p} 
                  onClick={() => setSelectedPlan(p)} 
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all ${selectedPlan === p ? 'bg-[#00e676] text-black shadow-lg shadow-emerald-500/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="p-8 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Precio Total</p>
                    <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-[#00e676] font-bold text-sm">
                        <Star size={16} className="fill-[#00e676]" /> {service.rating}
                    </div>
                    <p className="text-zinc-600 text-[10px] font-bold">{service.reviews} opiniones</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
                    <Clock size={20} className="text-zinc-500 mb-2" />
                    <p className="text-white text-xs font-bold">{plan.delivery} días</p>
                    <p className="text-[10px] text-zinc-600 uppercase font-black">Entrega</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center text-center">
                    <RefreshCcw size={20} className="text-zinc-500 mb-2" />
                    <p className="text-white text-xs font-bold">{plan.revisions}</p>
                    <p className="text-[10px] text-zinc-600 uppercase font-black">Revisiones</p>
                </div>
              </div>

              <ul className="space-y-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <div className="p-1 bg-emerald-500/10 rounded-lg">
                        <Check size={14} className="text-[#00e676]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-[#00e676] text-black font-black py-5 rounded-[1.5rem] hover:bg-emerald-400 hover:scale-[1.02] transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
              >
                Contratar ahora
              </button>

              <div className="flex items-center justify-center gap-2 text-zinc-600">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pago 100% seguro</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL DE CHECKOUT FUNCIONAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition">
                <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-white mb-2">Confirmar pedido</h2>
            <p className="text-zinc-500 text-sm mb-8">Estás a un paso de comenzar tu proyecto con {service.author}.</p>

            <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800 mb-8 space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Servicio:</span>
                    <span className="text-white font-bold truncate ml-4">{service.category}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Plan seleccionado:</span>
                    <span className="text-[#00e676] font-black uppercase tracking-tighter">{selectedPlan}</span>
                </div>
                <div className="h-px bg-zinc-800 w-full my-2" />
                <div className="flex justify-between items-center">
                    <span className="text-white font-bold">Total:</span>
                    <span className="text-2xl font-black text-white">${plan.price}</span>
                </div>
            </div>

            <button 
              disabled={isProcessing}
              onClick={handlePurchase}
              className={`w-full py-5 rounded-2xl font-black text-black transition-all flex items-center justify-center gap-3 ${isProcessing ? 'bg-zinc-700 cursor-not-allowed' : 'bg-[#00e676] hover:bg-emerald-400'}`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Procesando...
                </>
              ) : 'Confirmar y pagar'}
            </button>
            <p className="text-center text-[10px] text-zinc-600 mt-6 font-bold uppercase tracking-widest">No se te cobrará nada hasta que confirmes</p>
          </div>
        </div>
      )}
    </div>
  );
}