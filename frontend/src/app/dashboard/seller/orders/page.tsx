'use client';

import { useState, useRef } from 'react';
import { 
  MessageSquare, Upload, Play, Clock, X, Send 
} from 'lucide-react';
// 1. Importamos el hook del contexto global
// Esta ruta sube 4 niveles para salir de app/dashboard/seller/orders y entrar en context
import { useMessages } from '../../../../context/MessagesContext';

export default function ReceivedOrdersPage() {
  // --- ACCESO AL CONTEXTO GLOBAL ---
  const { allMessages, addMessage, isTypingGlobal, setTyping } = useMessages();

  // --- ESTADO DE PEDIDOS (Local a esta página) ---
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      client: { name: 'Maria Garcia', image: 'https://i.pravatar.cc/100?u=maria' },
      service: 'Diseño de logo profesional',
      tag: 'Logo minimalista para startup tech',
      deadline: '28 Mar 2026',
      price: 150,
      status: 'En proceso',
      type: 'Activos'
    },
    {
      id: 'ORD-002',
      client: { name: 'Carlos Lopez', image: 'https://i.pravatar.cc/100?u=carlos' },
      service: 'Desarrollo de landing page con Next.js',
      tag: 'Landing para producto SaaS, integracion con Stripe',
      deadline: '02 Abr 2026',
      price: 500,
      status: 'Nuevo pedido',
      type: 'Activos'
    },
    {
      id: 'ORD-003',
      client: { name: 'Ana Martinez', image: 'https://i.pravatar.cc/100?u=ana' },
      service: 'Edicion de video promocional',
      deadline: '25 Mar 2026',
      price: 200,
      status: 'Entregado',
      type: 'Completados'
    }
  ]);

  const [activeTab, setActiveTab] = useState('Todos'); 
  const [selectedOrderChat, setSelectedOrderChat] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Todos') return true;
    return order.type === activeTab;
  });

  const handleAction = (orderId: string, currentStatus: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        if (currentStatus === 'Nuevo pedido') return { ...order, status: 'En proceso' };
        if (currentStatus === 'En proceso') return { ...order, status: 'Entregado', type: 'Completados' };
      }
      return order;
    }));
  };

  // --- LÓGICA DE MENSAJERÍA CONECTADA AL CONTEXTO ---
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedOrderChat) return;

    const orderId = selectedOrderChat.id;
    const userText = newMessage.toLowerCase();
    const currentStatus = selectedOrderChat.status;
    
    const msg = { 
      sender: 'me', 
      text: newMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    // 2. Guardamos en el contexto global
    addMessage(orderId, msg);
    setNewMessage('');
    setTyping(orderId, true);

    setTimeout(() => {
      let response = "";

      if (currentStatus === 'Entregado' && userText.match(/(revisa|mira|chequea|visto|opina|que tal|archivo)/)) {
        response = "Perfecto, ya veo que lo entregaste. Dame un momento para revisarlo detalladamente.";
      } 
      else if (currentStatus === 'Nuevo pedido' && userText.match(/(empezar|inicio|arranco|trabajando|comienzo)/)) {
        response = "¡Excelente! Me alegra que ya vayas a comenzar.";
      }
      
      if (!response) {
        if (userText.match(/(hola|buenas|tal|saludos|hey)/)) {
          response = `¡Hola! Justo estaba pensando en el avance de "${selectedOrderChat.service}".`;
        } else {
          response = "Entiendo perfectamente. Gracias por mantenerme al tanto.";
        }
      }

      const reply = { 
        sender: 'client', 
        text: response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };

      // 3. La respuesta del cliente también va al contexto global
      addMessage(orderId, reply);
      setTyping(orderId, false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Pedidos recibidos</h1>
            <p className="text-zinc-500 text-sm italic">Gestiona los pedidos de tus clientes</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-[#0c0c0e] border border-zinc-900 px-5 py-3 rounded-[20px]">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Total Activos</span>
                <p className="text-white font-bold text-lg leading-tight mt-1">$1,250</p>
            </div>
          </div>
        </header>

        {/* TABS DE FILTRADO */}
        <div className="flex gap-3 mb-10">
          {['Todos', 'Activos', 'Completados'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-[#0c0c0e]/50 border border-zinc-900 rounded-[32px] p-8 hover:border-zinc-700 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <img src={order.client.image} className="w-14 h-14 rounded-full border-2 border-zinc-800" alt="" />
                  <div>
                    <span className="text-zinc-600 text-[11px] font-mono">{order.id}</span>
                    <h3 className="font-bold text-xl group-hover:text-emerald-400 transition-colors">{order.service}</h3>
                    <p className="text-zinc-500 text-sm">de {order.client.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-black">Pago</p>
                    <p className="text-sm font-bold">${order.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedOrderChat(order)}
                      className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <MessageSquare size={18} /> Chat
                    </button>
                    <button 
                      onClick={() => handleAction(order.id, order.status)}
                      className={`px-8 py-4 rounded-2xl flex items-center gap-2 text-xs font-black transition-all ${
                        order.status === 'En proceso' ? 'bg-[#00e676] text-black' : 'bg-zinc-800 text-white'
                      }`}
                    >
                      {order.status === 'En proceso' ? <><Upload size={18} /> Entregar</> : <><Play size={18} /> Iniciar</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE CHAT */}
      {selectedOrderChat && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrderChat(null)} />
          <div className="relative w-full max-w-2xl bg-[#0c0c0e] border-l border-zinc-900 flex flex-col h-full shadow-2xl">
            <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={selectedOrderChat.client.image} className="w-12 h-12 rounded-full" alt="" />
                <div>
                  <p className="font-bold text-lg">{selectedOrderChat.client.name}</p>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
                    {isTypingGlobal[selectedOrderChat.id] ? 'Escribiendo...' : 'En línea'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedOrderChat(null)} className="p-3 text-zinc-500"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* 4. Leemos los mensajes desde el objeto global allMessages */}
              {(allMessages[selectedOrderChat.id] || []).map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[75%] px-6 py-4 rounded-[24px] text-sm ${
                    msg.sender === 'me' ? 'bg-[#00e676] text-black font-bold' : 'bg-zinc-900 text-zinc-200'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-600 mt-2 font-bold">{msg.time}</span>
                </div>
              ))}
              
              {isTypingGlobal[selectedOrderChat.id] && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="bg-zinc-900 text-zinc-500 px-6 py-4 rounded-[24px] text-xs italic">
                    {selectedOrderChat.client.name} está redactando...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="p-8 bg-black border-t border-zinc-900 flex items-center gap-4">
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-[#0c0c0e] border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none"
              />
              <button type="submit" className="bg-[#00e676] text-black p-4 rounded-2xl"><Send size={20} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}