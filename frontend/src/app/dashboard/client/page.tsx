'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, MessageSquare, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { getStoredUser, type AuthUser } from '../../../lib/auth';
import { api } from '../../../config/axios';

// 🚀 IMPORTAMOS TUS HOOKS (Ajusta las rutas según tu proyecto)
import { useFavorites } from '../../../hooks/useFavorites';
import { useChatStore } from '../../../store/chatStore';
import { orderService } from '../../../services/order.service';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. TRAEMOS LOS DATOS GLOBALES (Favoritos y Mensajes)
  const { favorites } = useFavorites();
  const unreadCount = useChatStore(state => state.getTotalUnread());

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        // 🚀 AQUÍ LA MAGIA: Usamos tu servicio oficial en lugar de "api.get"
        const data = await orderService.getMyOrders();
        
        // Como tu backend hace res.json(orders), la data ya es el array directo
        setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtramos solo los pedidos ACTIVOS (Pagados o en proceso)
  const activeOrders = orders.filter(o => o.status === 'PAID' || o.status === 'IN_PROGRESS' || o.status === 'REVISION');

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen animate-in fade-in duration-700">
      
      {/* 🚀 HEADER Y SALUDO */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            Hola, {user?.name?.split(' ')[0] || user?.username || 'Cliente'} <span className="animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-zinc-400">
            Tienes <span className="text-[#00e676] font-bold">{activeOrders.length} pedidos</span> requiriendo tu atención.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
            MARCAR MENSAJES COMO LEÍDOS
          </button>
        )}
      </header>

      {/* 🚀 LAS 3 TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Pedidos */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 relative overflow-hidden group hover:border-[#00e676]/30 transition-all">
          <ShoppingBag className="absolute -right-6 -bottom-6 w-32 h-32 text-zinc-900/50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Pedidos Activos</h3>
            <p className="text-5xl font-black text-white mb-2">{activeOrders.length}</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">En Proceso</p>
          </div>
        </div>

        {/* Card 2: Favoritos */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <Heart className="absolute -right-6 -bottom-6 w-32 h-32 text-zinc-900/50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Favoritos Guardados</h3>
            <p className="text-5xl font-black text-white mb-2">{favorites.length}</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Servicios</p>
          </div>
        </div>

        {/* Card 3: Mensajes */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <MessageSquare className="absolute -right-6 -bottom-6 w-32 h-32 text-zinc-900/50 group-hover:scale-110 transition-transform" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Mensajes sin leer</h3>
              {unreadCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>}
            </div>
            <p className="text-5xl font-black text-white mb-2">{unreadCount}</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Nuevos</p>
          </div>
        </div>
      </div>

      {/* 🚀 SECCIÓN: PEDIDOS EN CURSO */}
      <section className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Pedidos en curso</h2>
            <p className="text-xs font-medium text-zinc-500">Gestión en tiempo real de tus contrataciones</p>
          </div>
          
          {/* BOTÓN VER HISTORIAL (Lleva a la página de pedidos) */}
          <Link 
            href="/dashboard/client/orders" 
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 px-5 py-2.5 rounded-full transition-all hover:text-white"
          >
            VER HISTORIAL <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-10 text-zinc-500 font-bold text-sm animate-pulse">Cargando tus pedidos...</div>
          ) : activeOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 text-sm font-medium mb-4">No tienes pedidos en curso en este momento.</p>
              <Link href="/dashboard/client/explore" className="inline-flex items-center gap-2 text-[#00e676] text-xs font-bold uppercase tracking-widest hover:text-emerald-400">
                Explorar servicios <ChevronRight size={14} />
              </Link>
            </div>
          ) : (
            activeOrders.slice(0, 3).map((order) => {
              // Lógica de Progreso de tu código anterior
              let progress = 0;
              if (order.status === 'PAID') progress = 15;
              if (order.status === 'IN_PROGRESS') progress = 60;
              if (order.status === 'REVISION') progress = 90;

              // Fecha formateada
              const dateObj = new Date(order.createdAt);
              const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace('.', '');

              return (
                <div key={order.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800/80 transition-all gap-4">
                  
                  {/* Avatar y Título */}
                  <div className="flex items-center gap-4 w-full md:w-[40%]">
                    <div className="relative shrink-0">
                      <img 
                        src={order.seller?.avatar || `https://ui-avatars.com/api/?name=${order.seller?.name}&background=121214&color=00e676`} 
                        alt="Freelancer" 
                        className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00e676] rounded-full border-2 border-[#121214]"></div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00e676] transition-colors">{order.service?.title || 'Servicio'}</h4>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">con <span className="text-zinc-400 font-medium">{order.seller?.name}</span></p>
                    </div>
                  </div>

                  {/* Barra de Progreso */}
                  <div className="w-full md:w-[25%]">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span className="text-zinc-600 uppercase tracking-widest">Completado</span>
                      <span className="text-[#00e676]">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00e676] rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  {/* Fecha, Estado y Acción */}
                  <div className="flex items-center justify-between w-full md:w-[30%] gap-4">
                    <div className="text-right flex-1">
                      <p className="text-[10px] text-zinc-500 font-mono mb-1 flex items-center justify-end gap-1">
                        <Clock size={10} /> {formattedDate}
                      </p>
                      <span className="inline-block text-[9px] font-black px-2 py-1 rounded bg-blue-500/10 text-blue-400 uppercase tracking-widest">
                        {order.status === 'PAID' ? 'NUEVO' : order.status === 'IN_PROGRESS' ? 'EN PROCESO' : 'REVISIÓN'}
                      </span>
                    </div>
                    
                    {/* Botón de Chat (En lugar de eliminar un pedido activo, lo llevamos al chat) */}
                    <button 
                      onClick={() => router.push(`/dashboard/client/messages?sellerId=${order.sellerId}`)}
                      className="shrink-0 w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-[#00e676] hover:text-black hover:border-transparent transition-all"
                      title="Ir al chat"
                    >
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 🚀 SECCIÓN PARA TI */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">Para ti</h2>
            <p className="text-xs font-medium text-zinc-500">Algoritmo basado en tus preferencias</p>
          </div>
          <Link href="/dashboard/client/explore" className="bg-[#00e676] text-black font-black text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)]">
            EXPLORAR TODO
          </Link>
        </div>
        
        {/* Aquí puedes meter un mini grid de servicios recomendados si los tienes, por ahora un banner bonito */}
        <div className="bg-gradient-to-r from-zinc-900 to-[#121214] border border-zinc-800 rounded-[2rem] p-10 text-center flex flex-col items-center justify-center group overflow-hidden relative">
           <div className="absolute inset-0 bg-[#00e676]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <CheckCircle2 className="w-12 h-12 text-[#00e676] mb-4 relative z-10" />
           <h3 className="text-lg font-bold text-white mb-2 relative z-10">Tu ecosistema digital está listo</h3>
           <p className="text-zinc-500 text-sm max-w-md mx-auto relative z-10">Descubre los mejores talentos del mercado y lleva tus proyectos al siguiente nivel con los freelancers top rankeados.</p>
        </div>
      </section>

    </div>
  );
}