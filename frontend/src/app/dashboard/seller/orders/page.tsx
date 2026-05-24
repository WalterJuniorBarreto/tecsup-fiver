'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare, Package, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { orderService } from '../../../../services/order.service';
import { getStoredUser } from '../../../../lib/auth';

export default function FreelancerOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Todos');

  const loadOrders = async () => {
    try {
      const currentUser = getStoredUser();
      if (currentUser) {
        const data = await orderService.getReceivedOrders();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleProgressClick = async (orderId: string, currentProgress: number) => {
    setIsUpdating(orderId);
    try {
      let nextProgress = 25;
      if (currentProgress === 0) nextProgress = 25;
      else if (currentProgress === 25) nextProgress = 50;
      else if (currentProgress === 50) nextProgress = 75;
      else if (currentProgress === 75) nextProgress = 100;

      await orderService.updateProgress(orderId, nextProgress);
      await loadOrders(); 
    } catch (error) {
      console.error("Error al actualizar:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const getButtonState = (progress: number) => {
    if (!progress || progress === 0) return { text: 'Iniciar Trabajo', color: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700', icon: <Clock size={16} /> };
    if (progress === 25) return { text: 'Avanzar a 50%', color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30', icon: <ArrowRight size={16} /> };
    if (progress === 50) return { text: 'Avanzar a 75%', color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30', icon: <ArrowRight size={16} /> };
    if (progress === 75) return { text: 'Entregar Proyecto', color: 'bg-[#00e676] text-black hover:bg-[#00c853] shadow-[0_0_15px_rgba(0,230,118,0.3)]', icon: <Package size={16} /> };
    return { text: 'Completado', color: 'bg-[#00e676]/10 text-[#00e676] cursor-not-allowed border border-[#00e676]/30', icon: <CheckCircle2 size={16} /> };
  };

  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center bg-[#0a0a0a]"><Loader2 className="w-12 h-12 text-[#00e676] animate-spin" /></div>;

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Todos') return true;
    if (activeTab === 'Activos') return order.progress < 100;
    if (activeTab === 'Completados') return order.progress === 100;
    return true;
  });

  const totalActivos = orders
    .filter(o => o.progress < 100)
    .reduce((sum, o) => sum + Number(o.price), 0);

  return (
    <div className="p-6 md:p-10 text-white w-full max-w-[1200px] mx-auto font-sans min-h-screen bg-[#0a0a0a] selection:bg-[#00e676]/30">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-[40px] font-black mb-2 tracking-tight">Pedidos recibidos</h1>
          <p className="text-zinc-500 text-sm">Gestiona los proyectos de tus clientes y actualiza su progreso.</p>
        </div>
        
        <div className="bg-[#121214] border border-[#00e676]/30 rounded-3xl px-8 py-5 min-w-[220px] text-center shadow-[0_0_20px_rgba(0,230,118,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#00e676]/10 blur-xl rounded-full"></div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Ingreso Activo (En curso)</p>
          <p className="text-3xl md:text-4xl font-black text-white">S/ {totalActivos.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
        </div>
      </div>

      <div className="flex p-1.5 bg-[#121214] border border-zinc-800/60 rounded-2xl w-fit mb-8 gap-1">
        {['Todos', 'Activos', 'Completados'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-[#1f1f22] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-[#121214] rounded-[2rem] border border-dashed border-zinc-800">
            <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-bold text-sm">No tienes pedidos en esta categoría.</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const btnState = getButtonState(order.progress);
            const isCompleted = order.progress === 100;

            return (
              <div key={order.id} className="bg-[#121214] border border-zinc-800/80 hover:border-zinc-700 transition-colors duration-300 rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-lg">
                
                <div className="flex items-center gap-5 w-full lg:w-[40%]">
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-white text-lg font-black shrink-0 shadow-inner ${isCompleted ? 'bg-[#00e676]/20 border-[#00e676]/30 text-[#00e676]' : 'bg-[#1a1a1c] border-zinc-700'}`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : getInitials(order?.client?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1.5 ${isCompleted ? 'text-[#00e676]' : 'text-blue-500'}`}>
                      {isCompleted ? 'PROYECTO FINALIZADO' : 'EN CURSO'}
                    </p>
                    <h3 className="font-bold text-xl text-white leading-tight mb-1 truncate" title={order?.service?.title}>
                      {order?.service?.title || 'Servicio Personalizado'}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">
                      Cliente: <span className="text-zinc-300 font-medium">{order?.client?.username || order?.client?.name || 'Usuario'}</span>
                    </p>
                  </div>
                </div>

                <div className="w-full lg:w-[30%] flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Progreso</span>
                    <span className={`text-sm font-black ${isCompleted ? 'text-[#00e676]' : 'text-white'}`}>{order.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800/80">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-700 ease-out ${isCompleted ? 'bg-[#00e676] shadow-[0_0_10px_#00e676]' : 'bg-blue-500'}`} 
                      style={{ width: `${order.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Monto</p>
                    <p className="font-black text-2xl text-white">S/ {order.price}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => router.push(`/dashboard/seller/messages?clientId=${order.clientId}&clientName=${encodeURIComponent(order?.client?.name)}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-3.5 rounded-xl border border-zinc-700 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all shadow-sm"
                      title="Abrir Chat"
                    >
                      <MessageSquare size={18} />
                    </button>

                    <button 
                      onClick={() => handleProgressClick(order.id, order.progress)}
                      disabled={isCompleted || isUpdating === order.id}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 min-w-[160px] rounded-xl font-bold transition-all text-sm ${btnState.color} ${isUpdating === order.id ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {isUpdating === order.id ? <Loader2 size={18} className="animate-spin" /> : (
                        <>
                          {btnState.text} {btnState.icon}
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}