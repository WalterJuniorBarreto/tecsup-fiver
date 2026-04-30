'use client';

import { useState } from 'react';
import { Plus, Lock, Zap, MoreVertical, Loader2, Eye, Edit, Trash2  } from 'lucide-react';
import Link from 'next/link';
import { useFreelance } from '../../../../hooks/useFreelance';
import CreateServiceModal from '../../../../components/CreateServiceModal'; 

export default function ServicesPage() {
  const { stats, services, isLoading, progressPercentage, refreshData, removeService, editService } = useFreelance();
  const [activeTab, setActiveTab] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<any | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleEditClick = (service: any) => {
    setEditingService(service); 
    setIsModalOpen(true);      
    setOpenMenuId(null);     
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const isLimitReached = !stats.canCreateMore;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-8">
      
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Mis servicios</h1>
          <p className="text-zinc-500 text-sm">Gestiona tus servicios publicados</p>
        </div>
        
        <button 
          disabled={isLimitReached}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            isLimitReached 
              ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800' 
              : 'bg-[#00e676] text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(0,230,118,0.3)]'
          }`}
          onClick={() => setIsModalOpen(true)}
        >
          {isLimitReached ? <Lock size={18} /> : <Plus size={18} />}
          {isLimitReached ? 'Límite alcanzado' : 'Crear servicio'}
        </button>
      </header>

      <div className="flex gap-6 mb-8 border-b border-zinc-900 pb-4">
        {['Todos', 'Activo', 'Pausado'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold transition-colors ${
              activeTab === tab ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab} {tab === 'Todos' && `(${services.length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
          {!isLimitReached && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
          
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-zinc-300 font-medium">Servicios Publicados</h3>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-400">
                {stats.totalServices} / {stats.maxServices === 9999 ? '∞' : stats.maxServices}
              </span>
            </div>
          </div>

          <div className="w-full h-1.5 bg-zinc-900 rounded-full mb-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-emerald-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className={`text-xs font-bold ${isLimitReached ? 'text-red-500' : 'text-zinc-500'}`}>
            {isLimitReached ? 'Límite alcanzado. Actualiza tu plan para más.' : `Puedes publicar ${stats.maxServices - stats.totalServices} servicio(s) más.`}
          </p>
        </div>

        {stats.currentPlan !== 'ELITE' && (
          <div className="bg-gradient-to-br from-[#121214] to-[#0a110d] border border-emerald-500/20 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Zap size={18} className="text-emerald-400" />
              Mejora disponible
            </div>
            <p className="text-zinc-400 text-sm mb-5">
              Obtén {stats.currentPlan === 'FREE' ? '10' : 'ilimitados'} servicios, solicitudes prioritarias y más con {stats.currentPlan === 'FREE' ? 'Pro' : 'Elite'}.
            </p>
            <Link 
              href="/pricing" 
              className="block w-full text-center bg-emerald-500 text-black font-bold py-2.5 rounded-xl hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(0,230,118,0.1)]"
            >
              Actualizar ahora ↗
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 mb-4">Aún no tienes servicios publicados.</p>
            {!isLimitReached && (
              <button 
          disabled={isLimitReached}
          className={"text-emerald-500 font-bold hover:underline"}
          onClick={() => setIsModalOpen(true)}
        >
          Crear mi primer servicio
        </button>
            )}
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-[#121214] border border-zinc-800 p-4 rounded-2xl flex gap-6 items-center hover:border-zinc-700 transition cursor-pointer">
              <div className="w-48 h-28 bg-zinc-900 rounded-xl flex-shrink-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80')` }} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${service.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'}`}>
                    {service.isPublished ? 'Activo' : 'Pausado'}
                  </span>
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wider">
                    Programación
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 truncate">{service.title}</h3>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="font-bold">S/ {service.price}</div>
                  <div className="flex items-center gap-1 text-zinc-400">
                    <span className="text-yellow-500">★</span> 5.0 <span className="text-zinc-600">(0)</span>
                  </div>
                  <div className="text-zinc-500 underline decoration-zinc-700">0 pedidos</div>
                  <div className="text-emerald-500 font-medium">S/ 0 ganados</div>
                </div>
              </div>

              <button 
                  onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                  className={`p-2 transition rounded-lg ${openMenuId === service.id ? 'text-white bg-zinc-800' : 'text-zinc-500 hover:text-white'}`}
                >
                  <MoreVertical size={20} />
                </button>

                {openMenuId === service.id && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setOpenMenuId(null)} 
                    />
                    
                    <div className="absolute right-0 mt-2 w-48 bg-[#121214] border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                      
                      <button 
                        onClick={() => {
                          setOpenMenuId(null);
                          alert("Abriendo vista pública del servicio...");
                        }} 
                        className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <Eye size={16} className="text-zinc-400" /> 
                        Ver como cliente
                      </button>
                        <button 
      onClick={() => handleEditClick(service)} 
      className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
    >
      <Edit size={16} className="text-zinc-400" /> 
      Actualizar
    </button>

                      <div className="h-px bg-zinc-800 my-1 mx-2" /> 

                      <button 
                        onClick={async () => {
                          setOpenMenuId(null);
                          if(confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
                            try {
                              await removeService(service.id); 
                            } catch (error) {
                              alert("Hubo un error al eliminar."); 
                            }
                          }
                        }} 
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                      >
                        <Trash2 size={16} /> 
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
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
    </div>
  );
}