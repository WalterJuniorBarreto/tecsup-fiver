'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare, PackageX, Star } from 'lucide-react';
import { useOrders } from '../../../../hooks/useOrders'; 

export default function ClientOrdersDashboard() {
  const router = useRouter();
  
  const { orders, isLoading } = useOrders(); 
  
  const [activeTab, setActiveTab] = useState('TODOS');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-medium animate-pulse">Cargando tus pedidos...</p>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'TODOS') return true;
    if (activeTab === 'ACTIVOS') return order.status === 'PAID' || order.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETADOS') return order.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="p-8 text-white max-w-[1400px] mx-auto font-sans min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Mis pedidos</h1>
        <p className="text-zinc-400 text-sm md:text-base">Gestiona tus proyectos activos y revisa las entregas finales.</p>
      </header>

      <div className="flex items-center gap-3 md:gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('TODOS')}
          className={`px-6 py-3 rounded-full font-bold text-xs tracking-widest transition-all whitespace-nowrap
            ${activeTab === 'TODOS' 
              ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)] scale-105' 
              : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-white'}`}
        >
          TODOS <span className="ml-2 opacity-60 bg-black/20 px-2 py-0.5 rounded-full">{orders.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('ACTIVOS')}
          className={`px-6 py-3 rounded-full font-bold text-xs tracking-widest transition-all whitespace-nowrap
            ${activeTab === 'ACTIVOS' 
              ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)] scale-105' 
              : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-white'}`}
        >
          ACTIVOS <span className="ml-2 opacity-60 bg-black/20 px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'PAID' || o.status === 'IN_PROGRESS').length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETADOS')}
          className={`px-6 py-3 rounded-full font-bold text-xs tracking-widest transition-all whitespace-nowrap
            ${activeTab === 'COMPLETADOS' 
              ? 'bg-[#00e676] text-black shadow-[0_0_20px_rgba(0,230,118,0.3)] scale-105' 
              : 'bg-[#121214] text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-white'}`}
        >
          COMPLETADOS <span className="ml-2 opacity-60 bg-black/20 px-2 py-0.5 rounded-full">{orders.filter(o => o.status === 'COMPLETED').length}</span>
        </button>
      </div>

      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center justify-center bg-[#121214]/50 rounded-[2rem] border border-dashed border-zinc-800">
            <PackageX className="w-16 h-16 text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300 mb-2">No hay pedidos aquí</h3>
            <p className="text-zinc-500 text-sm">Aún no tienes proyectos en esta categoría.</p>
          </div>
        ) : (
          filteredOrders.map((order: any) => {
            
            let progress = 0;
            if (order.status === 'PAID') progress = 15;
            if (order.status === 'IN_PROGRESS') progress = 60;
            if (order.status === 'COMPLETED') progress = 100;

            const deliveryDate = new Date(order.createdAt);
            deliveryDate.setDate(deliveryDate.getDate() + (order?.service?.deliveryDays || 7));

            return (
              <div key={order.id} className="bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-600 transition-colors duration-300 rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group shadow-lg">
                
                <div className="flex items-center gap-5 w-full lg:w-[40%]">
                  <div className="relative shrink-0">
                    <img 
                      src={order?.seller?.avatar || `https://ui-avatars.com/api/?name=${order?.seller?.name}&background=121214&color=00e676`} 
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-4 border-[#121214] group-hover:border-zinc-800 transition-colors"
                      alt={order?.seller?.name || 'Vendedor'}
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-[#00e676] border-2 border-[#121214] rounded-full shadow-[0_0_10px_rgba(0,230,118,0.5)]"></span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                        {order.status === 'PAID' ? 'NUEVO' : order.status === 'IN_PROGRESS' ? 'EN PROCESO' : 'COMPLETADO'}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono tracking-wider truncate">
                        #{order.id.split('-')[0].toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg lg:text-[22px] text-white leading-tight mb-1 truncate">
                      {order?.service?.title || 'Servicio Personalizado'}
                    </h3>
                    <p className="text-sm text-zinc-500 italic truncate">
                      Freelancer: <span className="text-zinc-300 font-bold not-italic">{order?.seller?.name || '@usuario'}</span>
                    </p>
                  </div>
                </div>

                {/* 2. BARRA DE PROGRESO */}
                <div className="w-full lg:w-[25%] lg:px-6">
                  <div className="flex justify-between text-xs font-bold mb-3">
                    <span className="text-zinc-500 tracking-widest uppercase">Progreso</span>
                    <span className="text-[#00e676]">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-[#00e676] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. FECHA DE ENTREGA & PRECIO (Agrupados en móvil) */}
                <div className="flex items-center justify-between lg:justify-around w-full lg:w-[25%] gap-4">
                  <div className="text-left lg:text-center">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Entrega Est.</p>
                    <p className="font-bold text-sm lg:text-base text-zinc-200">
                      {deliveryDate.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')}
                    </p>
                  </div>

                  <div className="text-right lg:text-center">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Inversión</p>
                    <p className="font-black text-xl lg:text-2xl text-white">S/ {order.price}</p>
                  </div>
                </div>

                <div className="shrink-0 w-full lg:w-auto mt-4 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                  {['PAID', 'IN_PROGRESS', 'COMPLETED'].includes(order.status) && order?.service?.id && (
                    <button
                      onClick={() => router.push(`/explore/${order.service.id}?review=1#reviews`)}
                      className="w-full lg:w-[56px] h-[56px] bg-[#00e676] hover:bg-emerald-400 border border-[#00e676] rounded-2xl flex items-center justify-center transition-all duration-300 group shadow-lg shadow-emerald-500/10"
                      title="Calificar freelancer"
                    >
                      <Star className="w-6 h-6 text-black fill-black" />
                      <span className="ml-2 font-bold text-black lg:hidden block">Calificar</span>
                    </button>
                  )}

                  <button 
                    onClick={() => router.push(`/dashboard/client/messages?sellerId=${order.sellerId}&sellerName=${encodeURIComponent(order?.seller?.name)}&serviceTitle=${encodeURIComponent(order?.service?.title)}`)}
                    className="w-full lg:w-[56px] h-[56px] bg-[#121214] hover:bg-[#00e676] border border-zinc-800 hover:border-[#00e676] rounded-2xl flex items-center justify-center transition-all duration-300 group shadow-lg"
                    title="Ir al chat de trabajo"
                  >
                    <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-black transition-colors" />
                    <span className="ml-2 font-bold text-black lg:hidden block group-hover:text-black">Abrir Chat</span>
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
