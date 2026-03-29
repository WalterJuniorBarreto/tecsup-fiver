'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCheck
} from 'lucide-react';

// 1. Importamos el contexto global con ruta relativa para evitar errores de compilación
import { useMessages } from '../../../../context/MessagesContext';

export default function MessagesPage() {
  // --- ACCESO AL CONTEXTO GLOBAL ---
  const { allMessages, addMessage, isTypingGlobal, setTyping } = useMessages();
  
  // --- ESTADO LOCAL ---
  const [selectedChatId, setSelectedChatId] = useState('ORD-001');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulación de base de datos de clientes/pedidos
  const chatsInfo = [
    {
      id: 'ORD-001',
      user: 'Maria Garcia',
      service: 'Diseño de logo profesional',
      image: 'https://i.pravatar.cc/100?u=maria',
      online: true,
    },
    {
      id: 'ORD-002',
      user: 'Carlos Lopez',
      service: 'Desarrollo de landing page',
      image: 'https://i.pravatar.cc/100?u=carlos',
      online: false,
    },
    {
      id: 'ORD-003',
      user: 'Ana Martinez',
      service: 'Edición de video promocional',
      image: 'https://i.pravatar.cc/100?u=ana',
      online: true,
    }
  ];

  // Auto-scroll suave al final cuando llegan mensajes o alguien escribe
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [allMessages, selectedChatId, isTypingGlobal]);

  // Filtrar chats por búsqueda
  const filteredChats = chatsInfo.filter(chat => 
    chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentChat = chatsInfo.find(c => c.id === selectedChatId) || chatsInfo[0];

  // --- LÓGICA DE ENVÍO INTELIGENTE ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    const lowerText = text.toLowerCase();

    // Mensaje del Freelancer (Tú)
    const msg = {
      sender: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addMessage(selectedChatId, msg);
    setNewMessage('');

    // --- GENERADOR DE RESPUESTA COHERENTE ---
    // Activamos el estado "Escribiendo..." global
    setTyping(selectedChatId, true);
    
    setTimeout(() => {
      let responseText = "Entendido, quedo a la espera de más novedades.";

      // Lógica de palabras clave
      if (lowerText.includes("hola") || lowerText.includes("buenos días")) {
        responseText = `¡Hola! ¿Cómo vas con el pedido ${selectedChatId}?`;
      } else if (lowerText.includes("color") || lowerText.includes("tonos") || lowerText.includes("estilo")) {
        responseText = "Me gustaría algo moderno, quizás usando azules oscuros y mucho espacio en blanco.";
      } else if (lowerText.includes("tiempo") || lowerText.includes("cuándo") || lowerText.includes("entrega") || lowerText.includes("plazo")) {
        responseText = "¿Crees que podrías tener un primer borrador para finales de semana?";
      } else if (lowerText.includes("precio") || lowerText.includes("pago") || lowerText.includes("costo") || lowerText.includes("dinero")) {
        responseText = "El presupuesto me parece correcto. Liberaré el pago en cuanto confirmemos la entrega final.";
      } else if (lowerText.includes("gracias") || lowerText.includes("listo") || lowerText.includes("ok")) {
        responseText = "¡Perfecto! Muchas gracias por tu profesionalismo.";
      } else if (lowerText.includes("archivo") || lowerText.includes("enviar") || lowerText.includes("logo") || lowerText.includes("link")) {
        responseText = "Genial, lo reviso ahora mismo y te doy feedback.";
      }

      const reply = {
        sender: 'client',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      addMessage(selectedChatId, reply);
      setTyping(selectedChatId, false);
    }, 2500); // 2.5 segundos para simular tiempo de escritura humana
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-[#0c0c0e] border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* LISTA DE CHATS (Lado Izquierdo) */}
      <aside className="w-80 border-r border-zinc-900 flex flex-col bg-black/40">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Mensajes</h2>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Live</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por cliente o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-emerald-500/50 transition-all text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredChats.map((chat) => {
            const lastMessages = allMessages[chat.id] || [];
            const lastMsg = lastMessages[lastMessages.length - 1];
            const isTyping = isTypingGlobal[chat.id];
            
            return (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-4 flex gap-3 transition-all text-left border-b border-zinc-900/50 ${
                  selectedChatId === chat.id ? 'bg-emerald-500/5 border-r-2 border-emerald-500' : 'hover:bg-zinc-900/30'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.image} className="w-12 h-12 rounded-full border border-zinc-800 object-cover" alt={chat.user} />
                  {chat.online && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0c0c0e] rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold truncate text-zinc-200">{chat.user}</p>
                    <span className="text-[9px] text-zinc-600 uppercase font-bold">{lastMsg?.time || 'Nuevo'}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate mb-1">{chat.service}</p>
                  <p className={`text-xs truncate ${isTyping ? 'text-emerald-400 font-medium italic' : (selectedChatId === chat.id ? 'text-zinc-300' : 'text-zinc-500')}`}>
                    {isTyping ? 'Escribiendo...' : (lastMsg?.text || 'Sin mensajes aún')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ÁREA DE CHAT (Lado Derecho) */}
      <main className="flex-1 flex flex-col bg-black/20 relative">
        
        {/* Header del Chat */}
        <header className="p-4 border-b border-zinc-900 bg-black/40 backdrop-blur-md flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <img src={currentChat.image} className="w-10 h-10 rounded-full border border-zinc-800" alt="" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-white">{currentChat.user}</p>
                <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full font-mono">{currentChat.id}</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">{currentChat.service}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-[10px] font-bold flex items-center gap-1.5 ${currentChat.online ? 'text-emerald-500' : 'text-zinc-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${currentChat.online ? 'bg-emerald-500' : 'bg-zinc-600'}`} /> 
              {currentChat.online ? 'En línea' : 'Desconectado'}
            </span>
            <MoreVertical size={18} className="text-zinc-500 cursor-pointer hover:text-white transition" />
          </div>
        </header>

        {/* Cuerpo de Mensajes */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #1a1a1a 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }}
        >
          <div className="flex justify-center mb-6">
            <span className="bg-zinc-900/80 text-zinc-500 text-[10px] font-bold px-4 py-1 rounded-full border border-zinc-800 uppercase tracking-widest shadow-sm">
              Conversación segura encriptada
            </span>
          </div>

          {(allMessages[selectedChatId] || []).map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[70%] p-3.5 rounded-2xl shadow-lg ${
                msg.sender === 'me' 
                ? 'bg-emerald-500 text-black font-semibold rounded-tr-none' 
                : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800/50'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1.5 ${msg.sender === 'me' ? 'text-black/50' : 'text-zinc-600'}`}>
                  <span className="text-[9px] font-bold">{msg.time}</span>
                  {msg.sender === 'me' && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          ))}

          {isTypingGlobal[selectedChatId] && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-zinc-900/50 text-emerald-500/80 px-4 py-2 rounded-2xl text-[11px] font-medium border border-emerald-500/10 shadow-sm">
                {currentChat.user} está escribiendo...
              </div>
            </div>
          )}
        </div>

        {/* Footer / Input */}
        <footer className="p-4 bg-black/40 border-t border-zinc-900">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-2 pl-4 focus-within:border-emerald-500/50 transition-all shadow-inner"
          >
            <button type="button" className="text-zinc-500 hover:text-emerald-500 transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..." 
              className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-zinc-200 placeholder:text-zinc-600"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-emerald-500 text-black p-2.5 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:hover:bg-emerald-500 shadow-lg shadow-emerald-500/10"
            >
              <Send size={18} />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}