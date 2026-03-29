'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  Search, 
  Star,
  ChevronRight,
  Clock,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  // --- ESTADOS PARA LA SIMULACIÓN ---
  const [orders, setOrders] = useState([
    { id: 1, title: 'Diseño de logo profesional', freelancer: 'Carlos Designer', progress: 60, date: '28 Mar 2026', status: 'En proceso', statusColor: 'text-blue-400 bg-blue-400/10', img: 'https://i.pravatar.cc/100?u=carlos' },
    { id: 2, title: 'Desarrollo de landing page', freelancer: 'Ana Dev', progress: 30, date: '02 Abr 2026', status: 'En proceso', statusColor: 'text-blue-400 bg-blue-400/10', img: 'https://i.pravatar.cc/100?u=ana' },
    { id: 3, title: 'Edición de video promocional', freelancer: 'Pedro Editor', progress: 90, date: '25 Mar 2026', status: 'En revisión', statusColor: 'text-yellow-500 bg-yellow-500/10', img: 'https://i.pravatar.cc/100?u=pedro' }
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(5);

  // --- LÓGICA DE SIMULACIÓN ---
  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  const completeOrder = (id: number) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const stats = [
    { label: 'Pedidos activos', value: orders.length.toString(), sub: 'En proceso', icon: ShoppingBag, color: 'text-emerald-500' },
    { label: 'Favoritos guardados', value: favorites.length.toString(), sub: 'Servicios', icon: Heart, color: 'text-rose-500' },
    { label: 'Mensajes sin leer', value: unreadMessages.toString(), sub: 'Nuevos', icon: MessageSquare, color: 'text-blue-500' },
  ];

  const recommendedServices = [
    { id: 101, title: 'Desarrollo de app móvil con React Native', author: 'Tech Studio', rating: 4.9, reviews: 156, price: 800, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=500' },
    { id: 102, title: 'Diseño de identidad de marca completa', author: 'Brand Master', rating: 5.0, reviews: 89, price: 350, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=500' },
    { id: 103, title: 'SEO y marketing digital', author: 'SEO Pro', rating: 4.8, reviews: 234, price: 400, image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=500' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Hola, Maria 👋</h1>
          <p className="text-zinc-500 text-sm font-medium">Tienes <span className="text-[#00e676]">{orders.length} pedidos</span> requiriendo tu atención.</p>
        </div>
        <button 
          onClick={() => setUnreadMessages(0)}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition"
        >
          Marcar mensajes como leídos
        </button>
      </div>

      {/* STAT CARDS (Dinámicas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0c0c0e] border border-zinc-900 p-8 rounded-[2rem] relative overflow-hidden hover:border-zinc-700 transition-all group shadow-2xl">
             <div className="flex justify-between items-start mb-4">
                <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={20} className={`${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
             </div>
             <p className="text-5xl font-black text-white mb-1 tracking-tighter">{stat.value}</p>
             <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{stat.sub}</p>
             <div className="absolute -bottom-2 -right-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <stat.icon size={120} />
             </div>
          </div>
        ))}
      </div>

      {/* PEDIDOS EN CURSO */}
      <section className="bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] p-8 mb-12 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">Pedidos en curso</h3>
            <p className="text-xs text-zinc-500 font-medium">Gestión en tiempo real de tus contrataciones</p>
          </div>
          <Link href="/dashboard/client/orders" className="bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-2xl text-xs font-black text-zinc-400 hover:text-white flex items-center gap-2 transition-all">
            VER HISTORIAL <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/40 rounded-[2rem] hover:bg-zinc-900/60 transition-all group">
              <div className="flex items-center gap-5 flex-1">
                <div className="relative">
                  <img src={order.img} className="w-12 h-12 rounded-full border-2 border-zinc-800 object-cover" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00e676] border-2 border-[#0c0c0e] rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-zinc-100 group-hover:text-[#00e676] transition-colors">{order.title}</h4>
                  <p className="text-xs text-zinc-500 font-medium">con <span className="text-zinc-300">{order.freelancer}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-10">
                <div className="hidden lg:block w-48 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-zinc-600">Completado</span>
                    <span className="text-[#00e676]">{order.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-[#00e676] transition-all duration-1000" style={{ width: `${order.progress}%` }} />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right min-w-[100px]">
                    <div className="flex items-center justify-end gap-1 text-zinc-600 text-[10px] mb-1 font-black uppercase">
                      <Clock size={10} /> {order.date}
                    </div>
                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.1em] shadow-sm ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  {/* ACCIÓN DE SIMULACIÓN */}
                  <button 
                    onClick={() => completeOrder(order.id)}
                    className="p-3 rounded-2xl bg-zinc-900 text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-zinc-800"
                    title="Cancelar simulacion"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2rem]">
               <ShoppingBag size={40} className="mx-auto text-zinc-800 mb-4" />
               <p className="text-zinc-500 font-bold">No tienes pedidos activos actualmente.</p>
               <Link href="/dashboard/client/explore" className="text-[#00e676] text-xs font-black uppercase mt-4 block hover:underline">Explorar servicios</Link>
            </div>
          )}
        </div>
      </section>

      {/* SERVICIOS RECOMENDADOS (Con Favoritos Funcionales) */}
      <section>
        <div className="flex justify-between items-center mb-8 px-2">
          <div>
            <h3 className="text-2xl font-black text-white mb-1">Para ti</h3>
            <p className="text-xs text-zinc-500 font-medium">Algoritmo basado en tus preferencias</p>
          </div>
          <Link href="/dashboard/client/explore" className="flex items-center gap-2 bg-[#00e676] text-black px-6 py-3 rounded-2xl text-xs font-black hover:scale-105 transition-all shadow-lg shadow-emerald-500/10">
            EXPLORAR TODO
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedServices.map((service) => (
            <div key={service.id} className="bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] overflow-hidden group hover:border-zinc-700 transition-all duration-500 shadow-2xl">
              <div className="relative h-56 overflow-hidden">
                <img src={service.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60" />
                
                <button 
                  onClick={() => toggleFavorite(service.id)}
                  className={`absolute top-5 right-5 p-3 backdrop-blur-md rounded-2xl transition-all duration-300 ${
                    favorites.includes(service.id) 
                    ? 'bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/20' 
                    : 'bg-black/40 text-white hover:bg-[#00e676] hover:text-black'
                  }`}
                >
                  <Heart size={18} fill={favorites.includes(service.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="p-7">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] text-[#00e676] font-black uppercase tracking-[0.2em] mb-1">{service.author}</p>
                    <h4 className="font-black text-lg text-zinc-100 leading-tight group-hover:text-[#00e676] transition-colors">{service.title}</h4>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-zinc-900/80">
                  <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-black text-white">{service.rating}</span>
                    <span className="text-[10px] text-zinc-600 font-bold">({service.reviews})</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Desde</p>
                    <p className="text-2xl font-black text-white tracking-tighter">${service.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}