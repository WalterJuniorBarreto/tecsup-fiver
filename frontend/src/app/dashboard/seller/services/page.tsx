'use client';

import { useState, useRef } from 'react';
import { 
  Plus, MoreVertical, Star, X, Eye, Pencil, 
  PauseCircle, Trash2, Image as ImageIcon,
  ChevronDown, PlayCircle, DollarSign, Zap, Lock, CheckCircle2,
  ArrowUpRight, Loader2
} from 'lucide-react';

export default function MyServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filter, setFilter] = useState('Todos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS PARA LA MEMBRESÍA ---
  const [paymentStep, setPaymentStep] = useState<'selection' | 'summary' | 'payment'>('selection');
  const [selectedPlan, setSelectedPlan] = useState<{name: string, price: string, benefits: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    pro: {
      name: 'Pro',
      price: '39.90',
      benefits: ["10 servicios publicados", "50 solicitudes activas", "Chat prioritario", "Perfil destacado", "Analíticas avanzadas", "Sin comisión en primeros S/ 400"]
    },
    elite: {
      name: 'Elite',
      price: '99.90',
      benefits: ["Servicios ilimitados", "Solicitudes ilimitadas", "Soporte 24/7", "Perfil destacado premium", "Analíticas avanzadas", "Comisión reducida al 5%", "Insignia de verificado"]
    }
  };

  const handleCloseUpgrade = () => {
    setIsUpgradeModalOpen(false);
    // Resetear al cerrar para que la próxima vez aparezca limpio
    setTimeout(() => { 
      setPaymentStep('selection'); 
      setSelectedPlan(null); 
    }, 300);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('¡Plan actualizado con éxito!');
      handleCloseUpgrade();
    }, 2000);
  };

  // --- DATA DE SERVICIOS ---
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Desarrollo de sitio web responsive con Next.js y Tailwind',
      category: 'Programación',
      price: 1800,
      rating: 5.0,
      reviews: 89,
      orders: 124,
      earned: 223200,
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    },
    {
      id: 2,
      title: 'Desarrollo de API REST con Node.js y MongoDB',
      category: 'Programación',
      price: 2200,
      rating: 4.9,
      reviews: 67,
      orders: 89,
      earned: 195800,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Programación',
    description: '',
    price: '',
    deliveryTime: '',
    image: '' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      id: Date.now(),
      title: formData.title || 'Servicio sin título',
      category: formData.category,
      price: Number(formData.price) || 0,
      rating: 0,
      reviews: 0,
      orders: 0,
      earned: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    };
    setServices([newService, ...services]);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Programación', description: '', price: '', deliveryTime: '', image: '' });
  };

  const toggleStatus = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: s.status === 'Activo' ? 'Pausado' : 'Activo' } : s
    ));
    setActiveMenu(null);
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    setActiveMenu(null);
  };

  const filteredServices = services.filter(s => filter === 'Todos' ? true : s.status === filter);

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis servicios</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona tus servicios publicados</p>
        </div>
        <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-[#121214] border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 text-zinc-400 text-xs hover:border-zinc-600 transition"
            >
                <Lock size={14} />
                <span>Límite alcanzado</span>
            </button>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-[#00e676] text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:scale-105 transition shadow-lg shadow-emerald-500/10"
            >
                <Plus size={18} /> Crear servicio
            </button>
        </div>
      </header>

      {/* FILTROS */}
      <div className="flex gap-4 mb-8">
        {['Todos', 'Activo', 'Pausado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition ${
              filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {f} ({f === 'Todos' ? services.length : services.filter(s => s.status === f).length})
          </button>
        ))}
      </div>

      {/* CARDS DE ESTADO / UPGRADE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#0c0c0e] border-l-4 border-l-emerald-400 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <span className="text-zinc-400 text-sm font-medium">Servicios Publicados</span>
                <span className="text-emerald-500 font-bold text-lg">S/</span>
            </div>
            <div className="flex justify-end mb-2">
                <span className="text-zinc-500 text-xs font-bold">3 / 1</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-3">
                <div className="bg-red-500 h-full w-full rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            </div>
            <p className="text-red-500 text-xs font-bold">Límite alcanzado. Actualiza tu plan para más.</p>
        </div>

        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
                <Zap className="text-emerald-400" size={18} />
                <h3 className="text-white font-bold text-sm">Mejora disponible</h3>
            </div>
            <p className="text-zinc-400 text-xs mb-6">Obtén 10 servicios, 50 solicitudes y más con Pro</p>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full bg-[#00a67e] hover:bg-[#00e676] text-white hover:text-black font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm group"
            >
                Actualizar ahora 
                <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </button>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* LISTA DE SERVICIOS */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-6 flex gap-6 items-center relative group hover:border-zinc-700 transition">
            <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-800">
              <img src={service.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${service.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  {service.status}
                </span>
                <span className="bg-zinc-900 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{service.category}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-400 transition">{service.title}</h3>
              <div className="flex items-center gap-6 text-xs text-zinc-500">
                <span className="text-white font-bold text-xl">S/ {service.price}</span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={14} fill="currentColor"/> {service.rating} ({service.reviews})</span>
                <span className="flex items-center gap-1 font-medium underline italic">{service.orders} pedidos</span>
                <span className="text-emerald-500 font-bold">S/ {service.earned.toLocaleString()} ganados</span>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setActiveMenu(activeMenu === service.id ? null : service.id)} className="p-2 hover:bg-zinc-900 rounded-full transition">
                <MoreVertical size={20} className="text-zinc-500" />
              </button>
              {activeMenu === service.id && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300 text-left"><Eye size={16} /> Ver servicio</button>
                  <button onClick={() => toggleStatus(service.id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300 text-left">
                    {service.status === 'Activo' ? <><PauseCircle size={16} /> Pausar</> : <><PlayCircle size={16} /> Activar</>}
                  </button>
                  <div className="h-[1px] bg-zinc-900 my-1" />
                  <button onClick={() => deleteService(service.id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 transition text-left"><Trash2 size={16} /> Eliminar</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR SERVICIO (Omitido para brevedad, igual al original) */}
      {/* ... (Tu modal de creación de servicio sigue igual) */}

      {/* MODAL: ACTUALIZA TU PLAN (Corregido) */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#0c0c0e] border border-zinc-900 w-full max-w-2xl rounded-[32px] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={handleCloseUpgrade} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition z-10">
              <X size={20} />
            </button>

            <div className="p-8">
              {/* PASO 1: SELECCIÓN (Sin selección por defecto) */}
              {paymentStep === 'selection' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Actualiza tu Plan</h2>
                    <p className="text-zinc-500 text-sm">Desbloquea más servicios y funciones exclusivas</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Plan Pro */}
                    <div className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className="text-emerald-400" />
                        <span className="font-bold text-sm text-white">Pro</span>
                      </div>
                      <p className="text-zinc-500 text-[10px] mb-4 uppercase tracking-wider">Para crecer tu negocio</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-white">S/ 39.90</span>
                        <span className="text-zinc-500 text-xs">/ mes</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plans.pro.benefits.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => { setSelectedPlan(plans.pro); setPaymentStep('summary'); }} 
                        className="w-full py-3 bg-zinc-900 text-white hover:bg-[#00e676] hover:text-black font-bold rounded-xl text-sm transition-all"
                      >
                        Elegir Pro
                      </button>
                    </div>

                    {/* Plan Elite */}
                    <div className="bg-black border border-zinc-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                      <div className="flex items-center gap-2 mb-1">
                        <Star size={16} className="text-emerald-400" />
                        <span className="font-bold text-sm text-white">Elite</span>
                      </div>
                      <p className="text-zinc-500 text-[10px] mb-4 uppercase tracking-wider">Para profesionales</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-bold text-white">S/ 99.90</span>
                        <span className="text-zinc-500 text-xs">/ mes</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plans.elite.benefits.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => { setSelectedPlan(plans.elite); setPaymentStep('summary'); }} 
                        className="w-full py-3 bg-zinc-900 text-white hover:bg-[#00e676] hover:text-black font-bold rounded-xl text-sm transition-all"
                      >
                        Elegir Elite
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: RESUMEN (Igual al anterior) */}
              {paymentStep === 'summary' && selectedPlan && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-2 text-white">Confirma tu pedido</h2>
                  <p className="text-zinc-500 text-sm mb-8">Revisa los detalles de tu nueva suscripción</p>
                  <div className="bg-black border border-zinc-900 rounded-3xl p-6 mb-8 flex justify-between items-center">
                    <div>
                      <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-1">Plan seleccionado</p>
                      <h3 className="text-xl font-bold text-white">Membresía {selectedPlan.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">S/ {selectedPlan.price}</span>
                      <p className="text-zinc-500 text-xs">Pago mensual</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setPaymentStep('selection')} className="flex-1 py-4 border border-zinc-800 rounded-2xl text-white font-bold text-sm">Atrás</button>
                    <button onClick={() => setPaymentStep('payment')} className="flex-[2] bg-[#00e676] text-black font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2">Ir al pago <ArrowUpRight size={18} /></button>
                  </div>
                </div>
              )}

              {/* PASO 3: PAGO (Igual al anterior) */}
              {paymentStep === 'payment' && selectedPlan && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-bold mb-2 text-white">Método de pago</h2>
                  <p className="text-zinc-500 text-sm mb-8 flex items-center gap-2"><Lock size={14} /> Transacción segura y encriptada</p>
                  <div className="space-y-4 mb-8">
                    <div className="bg-black border border-zinc-800 rounded-2xl p-4">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Número de tarjeta</label>
                      <input type="text" placeholder="**** **** **** 4242" className="w-full bg-transparent outline-none text-white font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Vencimiento</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-transparent outline-none text-white" />
                      </div>
                      <div className="bg-black border border-zinc-800 rounded-2xl p-4">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">CVC</label>
                        <input type="text" placeholder="***" className="w-full bg-transparent outline-none text-white" />
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={isProcessing}
                    onClick={handleProcessPayment}
                    className="w-full bg-[#00e676] text-black font-extrabold py-5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : `Pagar S/ ${selectedPlan.price}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}