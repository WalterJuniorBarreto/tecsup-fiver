'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare, Upload } from 'lucide-react';
import { orderService } from '../../../../services/order.service';
import { getStoredUser } from '../../../../lib/auth';

export default function FreelancerOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todos');

  const loadOrders = async () => {
    const currentUser = getStoredUser();
    if (currentUser) {
      const data = await orderService.getReceivedOrders();
      setOrders(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleProgressClick = async (orderId: string, currentProgress: number) => {
    let nextProgress = 25;
    if (currentProgress === 0) nextProgress = 25;
    else if (currentProgress === 25) nextProgress = 50;
    else if (currentProgress === 50) nextProgress = 75;
    else if (currentProgress === 75) nextProgress = 100;

    await orderService.updateProgress(orderId, nextProgress);
    loadOrders(); 
  };

  const getButtonState = (progress: number) => {
    if (!progress || progress === 0) return { text: 'Iniciar', icon: null, color: 'bg-[#00e676] text-black' };
    if (progress === 25) return { text: 'Avanzar 50%', icon: null, color: 'bg-blue-500 text-white' };
    if (progress === 50) return { text: 'Avanzar 75%', icon: null, color: 'bg-indigo-500 text-white' };
    if (progress === 75) return { text: 'Entregar', icon: <Upload size={16} />, color: 'bg-[#00e676] text-black hover:scale-105' };
    return { text: 'Completado', icon: null, color: 'bg-zinc-800 text-emerald-500 cursor-not-allowed' };
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
    <div className="p-8 text-white max-w-[1200px] mx-auto font-sans bg-[#0c0c0e] min-h-screen">
      
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black mb-1">Pedidos recibidos</h1>
          <p className="text-zinc-500 italic text-sm">Gestiona los pedidos de tus clientes</p>
        </div>
        
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-4 min-w-[160px] text-center shadow-lg">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">TOTAL ACTIVOS</p>
          <p className="text-2xl font-black text-white">S/ {totalActivos}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8 border-b border-zinc-800/50 pb-4">
        {['Todos', 'Activos', 'Completados'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-bold text-sm px-4 py-2 rounded-full transition-all
              ${activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 bg-[#121214] rounded-[2rem] border border-zinc-800">
            No tienes pedidos en esta categoría.
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            const btnState = getButtonState(order.progress);

            return (
              <div key={order.id} className="bg-[#0c0c0e] border border-zinc-800 hover:border-zinc-700 transition-colors rounded-[2rem] p-6 flex items-center justify-between">
                
                <div className="flex items-center gap-5">
                  <img 
                    src={order.client.avatar || `https://ui-avatars.com/api/?name=${order.client.name}&background=121214&color=fff`} 
                    className="w-[60px] h-[60px] rounded-full object-cover border-2 border-zinc-800 grayscale hover:grayscale-0 transition-all"
                    alt={order.client.name}
                  />
                  <div>
                    <p className="text-[10px] text-zinc-600 font-mono tracking-wider mb-1">
                      ORD-{order.id.substring(0, 5).toUpperCase()}
                    </p>
                    <h3 className="font-bold text-xl text-white leading-tight mb-1">
                      {order.service.title}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      de <span className="text-zinc-400">{order.client.name}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">PAGO</p>
                    <p className="font-black text-lg text-white">S/ {order.price}</p>
                  </div>

                  <button 
                    onClick={() => router.push(`/dashboard/seller/messages?clientId=${order.clientId}&clientName=${encodeURIComponent(order.client.name)}`)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all text-sm font-medium"
                  >
                    <MessageSquare size={16} /> Chat
                  </button>

                  <button 
                    onClick={() => handleProgressClick(order.id, order.progress)}
                    disabled={order.progress === 100}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${btnState.color}`}
                  >
                    {btnState.icon}
                    {btnState.text}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}