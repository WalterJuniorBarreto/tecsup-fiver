'use client';

import { useState, useEffect } from 'react'; // Agregado useEffect
import { 
  MessageSquare, 
  Download, 
  CheckCircle, 
  Clock, 
  Eye, 
  X,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  // ESTADO DE PEDIDOS (Ahora empieza con tus básicos + los del localStorage)
  const [orders, setOrders] = useState([
    { id: 'ORD-001', title: 'Diseño de logo profesional', freelancer: 'Carlos Designer', status: 'En proceso', statusType: 'process', progress: 60, deliveryDate: '28 Mar 2026', total: 150, image: 'https://i.pravatar.cc/100?u=carlos' },
    { id: 'ORD-002', title: 'Desarrollo de landing page con Next.js', freelancer: 'Ana Dev', status: 'En proceso', statusType: 'process', progress: 30, deliveryDate: '02 Abr 2026', total: 500, image: 'https://i.pravatar.cc/100?u=ana' },
    { id: 'ORD-003', title: 'Edición de video promocional', freelancer: 'Pedro Editor', status: 'En revisión', statusType: 'review', progress: 100, deliveryDate: '25 Mar 2026', total: 200, image: 'https://i.pravatar.cc/100?u=pedro' },
    { id: 'ORD-004', title: 'Redacción de artículos SEO', freelancer: 'Lucía Pérez', status: 'Completado', statusType: 'completed', progress: 100, deliveryDate: '20 Mar 2026', total: 80, image: 'https://i.pravatar.cc/100?u=lucia' }
  ]);

  // --- LÓGICA DE SIMULACIÓN: CARGAR COMPRAS NUEVAS ---
  useEffect(() => {
    // 1. Leemos lo que se guardó al "Pagar" en la página de detalle
    const purchased = JSON.parse(localStorage.getItem('simulated_orders') || '[]');
    
    if (purchased.length > 0) {
      // 2. Filtramos para no duplicar si el usuario recarga la página
      const newOrders = purchased.filter(
        (p: any) => !orders.some(o => o.id === p.id)
      );
      
      if (newOrders.length > 0) {
        setOrders(prev => [...newOrders, ...prev]);
      }
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // --- FUNCIONES DE INTERACCIÓN ---
  const approveOrder = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, status: 'Completado', statusType: 'completed', progress: 100 } 
        : order
    ));
    alert('¡Pedido aprobado con éxito! El pago ha sido liberado al freelancer.');
  };

  const handleDownload = (title: string) => {
    alert(`Preparando descarga de entregables para: ${title}`);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    alert(`Mensaje enviado a ${selectedOrderForChat.freelancer}: "${chatMessage}"`);
    setChatMessage('');
    setSelectedOrderForChat(null);
  };

  // --- LÓGICA DE FILTRADO ---
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Activos') return order.statusType === 'process' || order.statusType === 'review';
    if (activeFilter === 'Completados') return order.statusType === 'completed';
    return true;
  });

  const filters = [
    { name: 'Todos', count: orders.length },
    { name: 'Activos', count: orders.filter(o => o.statusType !== 'completed').length },
    { name: 'Completados', count: orders.filter(o => o.statusType === 'completed').length }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Mis pedidos</h1>
        <p className="text-zinc-500 text-sm font-medium">Gestiona tus proyectos activos y revisa entregas finales.</p>
      </header>

      {/* FILTROS DINÁMICOS */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => setActiveFilter(filter.name)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shrink-0 ${
              activeFilter === filter.name 
              ? 'bg-[#00e676] text-black border-[#00e676] shadow-lg shadow-emerald-500/20' 
              : 'text-zinc-500 border-zinc-900 hover:border-zinc-700 hover:text-zinc-300 bg-[#0c0c0e]'
            }`}
          >
            {filter.name} <span className="ml-2 opacity-50">{filter.count}</span>
          </button>
        ))}
      </div>

      {/* LISTA DE PEDIDOS */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className="bg-[#0c0c0e] border border-zinc-900 rounded-[2rem] p-6 hover:border-zinc-700 transition-all group shadow-xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              
              {/* Info Principal */}
              <div className="flex items-start gap-5 flex-1">
                <div className="relative shrink-0">
                  <img src={order.image} className="w-14 h-14 rounded-full border-2 border-zinc-800 object-cover" alt="" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#0c0c0e] ${
                    order.statusType === 'completed' ? 'bg-emerald-500' : 'bg-[#00e676]'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-widest ${
                      order.statusType === 'process' ? 'text-blue-400 bg-blue-400/10' : 
                      order.statusType === 'review' ? 'text-purple-400 bg-purple-400/10 animate-pulse' : 
                      'text-emerald-500 bg-emerald-500/10'
                    }`}>
                      {order.statusType === 'process' ? <Clock size={12} /> : order.statusType === 'review' ? <Eye size={12} /> : <CheckCircle2 size={12} />}
                      {order.status}
                    </span>
                    <span className="text-[10px] text-zinc-700 font-mono font-bold">{order.id}</span>
                  </div>
                  <h3 className="text-lg font-black text-zinc-100 group-hover:text-[#00e676] transition-colors leading-tight">{order.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-medium italic">Freelancer: <span className="text-zinc-300 not-italic font-bold">{order.freelancer}</span></p>
                </div>
              </div>

              {/* Stats del pedido */}
              <div className="flex flex-wrap items-center gap-10 lg:gap-12">
                <div className="w-full md:w-44">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter mb-2">
                    <span className="text-zinc-600">Completado</span>
                    <span className={order.progress === 100 ? 'text-emerald-500' : 'text-[#00e676]'}>{order.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${order.progress === 100 ? 'bg-emerald-500' : 'bg-[#00e676]'}`}
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Entrega</p>
                  <p className="text-sm text-zinc-200 font-bold">{order.deliveryDate}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Pago</p>
                  <p className="text-lg text-white font-black tracking-tighter">${order.total}</p>
                </div>

                {/* ACCIONES */}
                <div className="flex items-center gap-3 ml-auto lg:ml-0">
                  <button 
                    onClick={() => setSelectedOrderForChat(order)}
                    title="Enviar mensaje" 
                    className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-[#00e676] hover:border-[#00e676]/30 transition-all active:scale-90"
                  >
                    <MessageSquare size={20} />
                  </button>

                  {order.statusType === 'review' && (
                    <div className="flex items-center gap-3 animate-in zoom-in-95">
                      <button 
                        onClick={() => handleDownload(order.title)}
                        className="flex items-center gap-2 px-5 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black text-zinc-300 hover:text-white transition"
                      >
                        <Download size={16} /> ENTREGAS
                      </button>
                      <button 
                        onClick={() => approveOrder(order.id)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#00e676] text-black rounded-2xl text-xs font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
                      >
                        <CheckCircle size={16} /> APROBAR
                      </button>
                    </div>
                  )}

                  {order.statusType === 'completed' && (
                    <div className="flex items-center gap-2 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs font-black text-emerald-500 uppercase tracking-widest">
                      <CheckCircle2 size={16} /> Pagado
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-24 border-4 border-dashed border-zinc-900 rounded-[3rem]">
            <Clock size={48} className="mx-auto text-zinc-800 mb-4" />
            <p className="text-zinc-500 font-bold text-lg">No se encontraron pedidos en esta categoría.</p>
            <button onClick={() => setActiveFilter('Todos')} className="text-[#00e676] font-black uppercase text-xs mt-4 hover:underline">Ver todos los pedidos</button>
          </div>
        )}
      </div>

      {/* MODAL DE MENSAJERÍA (Simulación) */}
      {selectedOrderForChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/30">
              <div className="flex items-center gap-4">
                <img src={selectedOrderForChat.image} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <h2 className="text-white font-black">{selectedOrderForChat.freelancer}</h2>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Chat del pedido {selectedOrderForChat.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedOrderForChat(null)} className="text-zinc-500 hover:text-white transition p-2">
                <X size={24} />
              </button>
            </div>

            <div className="h-64 p-8 overflow-y-auto flex flex-col gap-4">
              <div className="bg-zinc-900/50 p-4 rounded-2xl rounded-tl-none self-start max-w-[80%] border border-zinc-800">
                <p className="text-zinc-300 text-sm italic">Hola, ya estoy trabajando en los detalles finales de "{selectedOrderForChat.title}". ¿Tienes alguna duda?</p>
              </div>
              <p className="text-center text-[9px] font-black text-zinc-700 uppercase tracking-widest my-2">Hoy</p>
            </div>

            <form onSubmit={sendMessage} className="p-6 bg-zinc-900/20 border-t border-zinc-900">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:border-[#00e676] transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-[#00e676] text-black rounded-xl hover:scale-105 transition-all">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}