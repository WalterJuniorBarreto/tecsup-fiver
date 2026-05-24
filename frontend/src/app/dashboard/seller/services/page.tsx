'use client';

import { useState } from 'react';
import { 
  Plus, Lock, Zap, MoreVertical, Loader2, 
  Eye, Edit, Trash2, ExternalLink, Star, Package, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFreelance } from '../../../../hooks/useFreelance';
import CreateServiceModal from '../../../../components/CreateServiceModal'; 

export default function ServicesPage() {
  const router = useRouter();
  const { stats, services, isLoading, progressPercentage, refreshData, removeService } = useFreelance();
  
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const handleEditClick = (service: any) => {
    setEditingService(service); 
    setIsModalOpen(true);      
    setOpenMenuId(null);     
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await removeService(serviceToDelete);
      setToast({ message: 'Servicio eliminado correctamente.', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ message: 'Hubo un error al eliminar el servicio.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsDeleting(false);
      setServiceToDelete(null);
    }
  };

  if (isLoading || !stats) {
    return (
<<<<<<< Updated upstream
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
=======
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00e676] animate-spin" />
>>>>>>> Stashed changes
      </div>
    );
  }

  const isLimitReached = !stats.canCreateMore;

  const filteredServices = services.filter(service => {
    if (activeTab === 'Activo') return service.isPublished;
    if (activeTab === 'Pausado') return !service.isPublished;
    return true;
  });

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen bg-transparent text-[var(--text-primary)] p-8">
=======
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10 font-sans max-w-[1400px] mx-auto selection:bg-[#00e676]/30">
>>>>>>> Stashed changes
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-[40px] font-black mb-2 tracking-tight">Mis servicios</h1>
          <p className="text-zinc-500 text-sm">Gestiona tus servicios publicados y optimiza tu catálogo.</p>
        </div>
        
        <button 
          disabled={isLimitReached}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
            isLimitReached 
<<<<<<< Updated upstream
              ? 'bg-[var(--bg-soft)] text-zinc-500 cursor-not-allowed border border-zinc-800'
              : 'bg-[#00e676] text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.3)]'
=======
              ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800' 
              : 'bg-[#00e676] text-black hover:bg-[#00c853] hover:scale-105 shadow-[#00e676]/20'
>>>>>>> Stashed changes
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {isLimitReached ? <Lock size={18} /> : <Plus size={18} />}
          {isLimitReached ? 'Límite alcanzado' : 'Crear nuevo servicio'}
        </button>
      </header>

<<<<<<< Updated upstream
      <div className="flex gap-6 mb-8 border-b border-zinc-900 pb-4">
        {['Todos', 'Activo', 'Pausado'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold transition-colors ${
              activeTab === tab ? 'text-[var(--text-primary)]' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab} {tab === 'Todos' && `(${services.length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        <div className="seller-panel border p-6 rounded-2xl relative overflow-hidden">
          {!isLimitReached && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
=======
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] relative overflow-hidden shadow-lg">
          {!isLimitReached && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00e676] shadow-[0_0_15px_#00e676]" />}
>>>>>>> Stashed changes
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Capacidad del plan</p>
              <h3 className="text-zinc-300 font-bold text-lg">Servicios Publicados</h3>
            </div>
            <div className="text-right bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
              <span className="text-2xl font-black text-white">
                {stats.totalServices} <span className="text-zinc-500 text-lg">/ {stats.maxServices === 9999 ? '∞' : stats.maxServices}</span>
              </span>
            </div>
          </div>

<<<<<<< Updated upstream
          <div className="w-full h-1.5 bg-[var(--bg-soft)] rounded-full mb-3 overflow-hidden">
=======
          <div className="w-full h-2 bg-zinc-900 rounded-full mb-4 overflow-hidden border border-zinc-800">
>>>>>>> Stashed changes
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[#00e676] shadow-[0_0_10px_#00e676]'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className={`text-xs font-bold flex items-center gap-1.5 ${isLimitReached ? 'text-red-400' : 'text-zinc-400'}`}>
            {isLimitReached ? <><AlertCircle size={14}/> Límite alcanzado. Actualiza tu plan.</> : <><CheckCircle2 size={14} className="text-[#00e676]"/> Tienes espacio para {stats.maxServices - stats.totalServices} servicio(s) más.</>}
          </p>
        </div>

        {stats.currentPlan !== 'ELITE' && (
<<<<<<< Updated upstream
          <div className="seller-upgrade-panel border p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold mb-2">
              <Zap size={18} className="text-emerald-400" />
              Mejora disponible
=======
          <div className="bg-gradient-to-br from-[#121214] to-[#0a0a0a] border border-[#00e676]/30 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/10 blur-3xl rounded-full pointer-events-none transition-all group-hover:bg-[#00e676]/20"></div>
            <div className="flex items-center gap-2 text-white font-black text-lg mb-3">
              <Zap size={20} className="text-[#00e676] fill-[#00e676]" />
              Mejora tu cuenta
>>>>>>> Stashed changes
            </div>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Obtén {stats.currentPlan === 'FREE' ? 'hasta 10' : 'ilimitados'} servicios activos, destaca en las búsquedas y reduce comisiones con el plan {stats.currentPlan === 'FREE' ? 'PRO' : 'ELITE'}.
            </p>
            <Link 
              href="/dashboard/seller/membership" 
              className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-[#00e676] text-black font-black rounded-xl hover:bg-[#00c853] transition-colors shadow-[0_0_15px_rgba(0,230,118,0.2)]"
            >
<<<<<<< Updated upstream
              Actualizar ahora
=======
              Actualizar ahora <ExternalLink size={16} />
>>>>>>> Stashed changes
            </Link>
          </div>
        )}
      </div>

      <div className="flex p-1.5 bg-[#121214] border border-zinc-800/60 rounded-2xl w-fit mb-8 gap-1">
        {['Todos', 'Activo', 'Pausado'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#1f1f22] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.toUpperCase()} {tab === 'Todos' && `(${services.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] rounded-[2rem] border border-dashed border-zinc-800 flex flex-col items-center">
            <Package className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-bold mb-4">No se encontraron servicios en esta categoría.</p>
            {!isLimitReached && activeTab === 'Todos' && (
              <button onClick={() => setIsModalOpen(true)} className="text-[#00e676] font-bold hover:underline flex items-center gap-1 text-sm">
                Crear mi primer servicio <Plus size={16} />
              </button>
            )}
          </div>
        ) : (
<<<<<<< Updated upstream
          services.map((service) => (
            <div key={service.id} className="seller-panel border p-4 rounded-2xl flex gap-6 items-center hover:border-zinc-700 transition cursor-pointer">
              <div className="w-48 h-28 bg-[var(--bg-soft)] rounded-xl flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80')` }} />
=======
          filteredServices.map((service) => (
            <div key={service.id} className="bg-[#121214] border border-zinc-800/80 p-5 md:p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 items-center hover:border-zinc-700 transition-colors shadow-lg relative group">
>>>>>>> Stashed changes
              
              <div className="w-full md:w-56 h-36 bg-zinc-900 rounded-2xl flex-shrink-0 relative overflow-hidden border border-zinc-800">
                <img 
                  src={service.image || 'https://via.placeholder.com/600x400/0a0a0a/3f3f46?text=Sin+Imagen'} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg ${
                    service.isPublished ? 'bg-[#00e676] text-black' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}>
                    {service.isPublished ? 'Activo' : 'Pausado'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 mb-2 inline-block">
                  {service.category?.name || 'Categoría General'}
                </span>
                
<<<<<<< Updated upstream
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 truncate">{service.title}</h3>
=======
                <h3 className="text-xl font-black text-white mb-4 truncate pr-8" title={service.title}>{service.title}</h3>
>>>>>>> Stashed changes
                
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Precio</span>
                    <span className="font-black text-lg text-white">S/ {service.price}</span>
                  </div>
                  
                  <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block"></div>
                  
                  <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" /> 
                    {service.averageRating?.toFixed(1) || '0.0'} 
                    <span className="text-zinc-600 text-xs">({service.reviewsCount || 0} reseñas)</span>
                  </div>

                  <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block"></div>
                  
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Package size={16} /> <span className="font-bold">{service.ordersCount || 0}</span> pedidos
                  </div>

                  <div className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:block"></div>
                  
                  <div className="flex items-center gap-2 text-[#00e676] font-bold">
                    <TrendingUp size={16} /> S/ {service.totalEarnings || 0} ganados
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 md:static">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
<<<<<<< Updated upstream
                  className={`p-2 transition rounded-lg ${openMenuId === service.id ? 'text-[var(--text-primary)] bg-[var(--bg-soft)]' : 'text-zinc-500 hover:text-[var(--text-primary)]'}`}
=======
                  className={`p-2 transition-colors rounded-xl border ${openMenuId === service.id ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-[#0a0a0a] text-zinc-500 border-zinc-800 hover:text-white hover:bg-zinc-900'}`}
>>>>>>> Stashed changes
                >
                  <MoreVertical size={20} />
                </button>

                {openMenuId === service.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                    
<<<<<<< Updated upstream
                    <div className="absolute right-0 mt-2 w-48 seller-panel border rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
=======
                    <div className="absolute right-4 top-14 md:top-auto md:right-8 mt-2 w-52 bg-[#121214] border border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
>>>>>>> Stashed changes
                      
                      <button 
                        onClick={() => {
                          setOpenMenuId(null);
                          router.push(`/explore/${service.id}`);
                        }} 
                        className="w-full text-left px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <Eye size={16} className="text-zinc-400" /> Ver en tienda
                      </button>
                      
                      <button 
                        onClick={() => handleEditClick(service)} 
                        className="w-full text-left px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <Edit size={16} className="text-zinc-400" /> Editar servicio
                      </button>

                      <div className="h-px bg-zinc-800/80 my-1 mx-3" /> 

                      <button 
                        onClick={() => {
                          setOpenMenuId(null);
                          setServiceToDelete(service.id);
                        }} 
                        className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CreateServiceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={refreshData}
        serviceToEdit={editingService}
      />


      {serviceToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] max-w-sm w-full mx-4 shadow-2xl scale-in-95 duration-200">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">¿Eliminar servicio?</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              Esta acción no se puede deshacer. Tu servicio desaparecerá del marketplace y los clientes ya no podrán contratarlo.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setServiceToDelete(null)} 
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition flex items-center justify-center min-w-[100px] disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

  
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border bg-[#121214] ${
            toast.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-[#00e676] border-[#00e676]/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
