'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare } from 'lucide-react';
import { orderService } from '../../../../services/order.service'; // Ajusta la ruta a tu servicio
import { getStoredUser } from '../../../../lib/auth';

export default function ClientOrdersDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('TODOS');

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUser = getStoredUser();
      if (currentUser) {
        const data = await orderService.getMyOrders();
        setOrders(data);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center mt-20"><Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /></div>;
  }

  // Filtrado básico para los tabs
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'TODOS') return true;
    if (activeTab === 'ACTIVOS') return order.status === 'PAID' || order.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETADOS') return order.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="p-8 text-white max-w-[1400px] mx-auto font-sans">
      <h1 className="text-4xl font-black mb-2 tracking-tight">Mis pedidos</h1>
      <p className="text-zinc-500 mb-10 text-sm">Gestiona tus proyectos activos y revisa entregas finales.</p>

      {/* 🚀 TABS RESTAURADOS (COMO EN TU IMAGEN) */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => setActiveTab('TODOS')}
          className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all
            ${activeTab === 'TODOS' ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)]' : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:text-white'}`}
        >
          TODOS <span className="ml-2 opacity-60">{orders.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('ACTIVOS')}
          className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all
            ${activeTab === 'ACTIVOS' ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)]' : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:text-white'}`}
        >
          ACTIVOS <span className="ml-2 opacity-60">{orders.filter(o => o.status === 'PAID').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETADOS')}
          className={`px-6 py-2.5 rounded-full font-bold text-xs tracking-widest transition-all
            ${activeTab === 'COMPLETADOS' ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)]' : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:text-white'}`}
        >
          COMPLETADOS <span className="ml-2 opacity-60">{orders.filter(o => o.status === 'COMPLETED').length}</span>
        </button>
      </div>

      {/* LISTA DE ÓRDENES */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 bg-[#121214] rounded-3xl border border-zinc-800">
            No se encontraron pedidos en esta categoría.
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            
            // Calculamos un % visual (Por ahora 0% ya que recién lo compró)
            const progress = order.status === 'COMPLETED' ? 100 : 0; 

            // Fecha de entrega simulada (+ días de delivery si los tienes, si no mostramos la fecha de creación + 7 días)
            const deliveryDate = new Date(order.createdAt);
            deliveryDate.setDate(deliveryDate.getDate() + (order.service.deliveryDays || 7));

            return (
              <div key={order.id} className="bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors rounded-[2rem] p-6 flex items-center justify-between">
                
                {/* 1. INFO DEL VENDEDOR Y SERVICIO */}
                <div className="flex items-center gap-5 w-1/3">
                  <div className="relative shrink-0">
                    <img 
                      src={order.seller.avatar || `https://ui-avatars.com/api/?name=${order.seller.name}&background=121214&color=00e676`} 
                      className="w-[72px] h-[72px] rounded-full object-cover border-4 border-[#121214]"
                      alt={order.seller.name}
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#00e676] border-2 border-[#121214] rounded-full"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        EN PROCESO
                      </span>
                      <span className="text-xs text-zinc-600 font-mono tracking-wider">
                        ORD-{order.id.substring(0, 5).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-[22px] text-white leading-tight mb-1 truncate max-w-[280px]">
                      {order.service.title}
                    </h3>
                    <p className="text-sm text-zinc-500 italic">
                      Freelancer: <span className="text-zinc-300 font-bold not-italic">{order.seller.name}</span>
                    </p>
                  </div>
                </div>

                {/* 2. BARRA DE PROGRESO (RESTAURADA) */}
                <div className="w-1/4 px-6">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-500 tracking-widest">COMPLETADO</span>
                    <span className="text-[#00e676]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00e676] rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. FECHA DE ENTREGA */}
                <div className="w-1/6 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">ENTREGA</p>
                  <p className="font-bold text-sm text-zinc-200">
                    {deliveryDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')}
                  </p>
                </div>

                {/* 4. PAGO */}
                <div className="w-1/6 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">PAGO</p>
                  <p className="font-black text-2xl text-white">S/ {order.price}</p>
                </div>

                {/* 5. BOTÓN DE CHAT (LLEVA DIRECTO A MENSAJES) */}
                <div className="shrink-0">
                  <button 
                    onClick={() => router.push(`/dashboard/client/messages?sellerId=${order.sellerId}&sellerName=${encodeURIComponent(order.seller.name)}&serviceTitle=${encodeURIComponent(order.service.title)}`)}
                    className="w-[52px] h-[52px] bg-[#121214] hover:bg-zinc-800 border border-zinc-800 rounded-[1.25rem] flex items-center justify-center transition-all group"
                  >
                    <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
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