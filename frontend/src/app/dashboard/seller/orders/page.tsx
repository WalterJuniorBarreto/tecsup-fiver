'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare } from 'lucide-react';
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
    if (!progress || progress === 0) return { text: 'Iniciar', color: 'bg-[#00e676] text-black hover:bg-[#00c853]' };
    if (progress === 25) return { text: 'Avanzar 50%', color: 'bg-blue-500 text-white hover:bg-blue-600' };
    if (progress === 50) return { text: 'Avanzar 75%', color: 'bg-blue-600 text-white hover:bg-blue-700' };
    if (progress === 75) return { text: 'Entregar', color: 'bg-[#00e676] text-black hover:scale-105' };
    return { text: 'Completado', color: 'bg-zinc-800 text-emerald-500 cursor-not-allowed border border-zinc-700' };
  };

  // Función para extraer las iniciales del nombre (ej: "Paisana Jacinta" -> "PJ")
  const getInitials = (name: string) => {
    if (!name) return 'US';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) return <div className="flex justify-center mt-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>;

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
    <div className="p-6 md:p-10 text-white w-full max-w-[1100px] mx-auto font-sans min-h-screen">
      
      {/* ENCABEZADO Y CAJA DE INGRESOS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Pedidos recibidos</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona los pedidos de tus clientes</p>
        </div>
        
        <div className="border border-zinc-800 rounded-2xl px-6 py-4 min-w-[180px] text-center shadow-md bg-[#0c0c0e]">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">INGRESO ACTIVO</p>
          <p className="text-2xl md:text-3xl font-black text-[#00e676]">S/ {totalActivos}</p>
        </div>
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div className="flex items-center gap-3 mb-8 border-b border-zinc-800/50 pb-6 overflow-x-auto scrollbar-hide">
        {['Todos', 'Activos', 'Completados'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-bold text-sm px-6 py-2 rounded-full transition-all whitespace-nowrap
              ${activeTab === tab 
                ? 'bg-white text-black' 
                : 'bg-transparent text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LISTADO DE TARJETAS */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 bg-transparent rounded-2xl border border-dashed border-zinc-800">
            No tienes pedidos en esta categoría.
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const btnState = getButtonState(order.progress);

            return (
              <div key={order.id} className="bg-transparent border border-zinc-800 hover:border-zinc-700 transition-colors duration-300 rounded-3xl p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* LADO IZQUIERDO: Avatar y Textos */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-zinc-700 flex items-center justify-center bg-[#1a1a1c] text-white text-lg md:text-xl font-medium shrink-0">
                    {getInitials(order?.client?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1">
                      PROGRESO: {order.progress || 0}%
                    </p>
                    <h3 className="font-bold text-lg md:text-xl text-white leading-tight mb-0.5 truncate">
                      {order?.service?.title || 'Servicio Personalizado'}
                    </h3>
                    <p className="text-sm text-zinc-500 truncate">
                      Cliente: <span className="text-zinc-300">{order?.client?.username || order?.client?.name || 'Usuario'}</span>
                    </p>
                  </div>
                </div>

                {/* LADO DERECHO: Precios y Botones */}
                <div className="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto mt-2 lg:mt-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">PAGO</p>
                    <p className="font-black text-xl text-white">S/ {order.price}</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => router.push(`/dashboard/seller/messages?clientId=${order.clientId}&clientName=${encodeURIComponent(order?.client?.name)}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium"
                    >
                      <MessageSquare size={16} /> <span className="sm:hidden md:block">Chat</span>
                    </button>

                    <button 
                      onClick={() => handleProgressClick(order.id, order.progress)}
                      disabled={order.progress === 100 || isUpdating === order.id}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 min-w-[120px] rounded-xl font-bold transition-all text-sm ${btnState.color} ${isUpdating === order.id ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {isUpdating === order.id ? <Loader2 size={16} className="animate-spin" /> : btnState.text}
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