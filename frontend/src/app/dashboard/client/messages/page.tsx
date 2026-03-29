'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Paperclip, MoreVertical, 
  Circle, Smile, CheckCheck 
} from 'lucide-react';

export default function MessagesPage() {
  // 1. DATA DE CHATS (Sincronizada con Pedidos)
  const [chats, setChats] = useState([
    { id: 1, name: 'Carlos Designer', service: 'Diseño de logo profesional', lastMessage: 'Perfecto, te envío el primer borrador mañana', time: '10:45', online: true, image: 'https://i.pravatar.cc/100?u=carlos' },
    { id: 2, name: 'Ana Dev', service: 'Desarrollo de landing page', lastMessage: 'Ya terminé la sección del hero', time: '12:20', online: true, image: 'https://i.pravatar.cc/100?u=ana' },
    { id: 3, name: 'Pedro Editor', service: 'Edición de video promocional', lastMessage: 'El video está listo para revisión', time: 'Ayer', online: false, image: 'https://i.pravatar.cc/100?u=pedro' }
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. HISTORIALES INICIALES COHERENTES
  const [allMessages, setAllMessages] = useState<{ [key: number]: any[] }>({
    1: [
      { id: 1, sender: 'other', text: '¡Hola! Gracias por el pedido del logo. ¿Tienes alguna paleta de colores en mente?', time: '10:30' },
      { id: 2, sender: 'me', text: 'Hola Carlos, me gustaría algo en tonos azules.', time: '10:32' },
    ],
    2: [
      { id: 1, sender: 'other', text: 'Hola, he configurado el repositorio de Next.js para tu landing.', time: '12:00' },
    ],
    3: [
      { id: 1, sender: 'other', text: 'Ya tengo el material bruto del video. Empezaré con el montaje hoy.', time: 'Ayer' },
    ]
  });

  // 3. MOTOR DE RESPUESTAS COHERENTES (Simulación de IA)
  const getSmartResponse = (userMsg: string, chatId: number) => {
    const msg = userMsg.toLowerCase();
    const freelancer = chats.find(c => c.id === chatId);
    const name = freelancer?.name.split(' ')[0];

    // Lógica por palabras clave
    if (msg.includes('hola') || msg.includes('buenos días')) return `¡Hola! ¿En qué puedo ayudarte con el proyecto de ${freelancer?.service}?`;
    if (msg.includes('cuándo') || msg.includes('entrega') || msg.includes('listo')) return `Tengo planeado entregarlo el ${chats.find(c => c.id === chatId)?.id === 1 ? 'próximo lunes' : 'miércoles'}. ¿Te parece bien?`;
    if (msg.includes('color') || msg.includes('estilo') || msg.includes('diseño')) return `Entiendo perfectamente. Aplicaré esos detalles de estilo en la siguiente versión del ${freelancer?.service}.`;
    if (msg.includes('gracias') || msg.includes('perfecto') || msg.includes('ok')) return `¡De nada! Es un placer trabajar en esto. Te mantendré al tanto.`;
    if (msg.includes('precio') || msg.includes('pago') || msg.includes('dinero')) return `Recuerda que el pago se libera una vez que apruebes la entrega final en la sección de "Mis Pedidos".`;
    
    // Respuesta por defecto según profesión
    if (chatId === 2) return "He revisado el código y esa funcionalidad es posible. ¿Quieres que la implemente ahora?";
    return `¡Entendido! Lo apunto para la revisión de "${freelancer?.service}". ¿Algo más que deba saber?`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userText = newMessage;
    const msgTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Mensaje del usuario
    const userMsg = { id: Date.now(), sender: 'me', text: userText, time: msgTime };
    
    setAllMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), userMsg]
    }));
    setNewMessage('');

    // Respuesta coherente simulada
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botText = getSmartResponse(userText, selectedChatId);
        const botMsg = { id: Date.now() + 1, sender: 'other', text: botText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        setAllMessages(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), botMsg]
        }));

        // Actualizar último mensaje en la lista
        setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, lastMessage: botText, time: 'Ahora' } : c));
      }, 1500);
    }, 800);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [allMessages, isTyping]);

  const activeChat = chats.find(c => c.id === selectedChatId);

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      
      {/* LISTA DE CHATS */}
      <aside className="w-96 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] flex flex-col overflow-hidden">
        <div className="p-8 border-b border-zinc-900/50">
          <h2 className="text-2xl font-black text-white mb-6">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input type="text" placeholder="Buscar mensajes..." className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 px-12 text-sm text-zinc-300 focus:outline-none focus:border-[#00e676] transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <button 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${selectedChatId === chat.id ? 'bg-zinc-900 border border-zinc-800' : 'hover:bg-zinc-900/40 border border-transparent'}`}
            >
              <div className="relative shrink-0">
                <img src={chat.image} className="w-12 h-12 rounded-full border border-zinc-800" />
                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00e676] border-2 border-[#0c0c0e] rounded-full" />}
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-zinc-100 truncate">{chat.name}</p>
                  <span className="text-[10px] text-zinc-600 font-bold">{chat.time}</span>
                </div>
                <p className="text-[10px] text-[#00e676] font-black uppercase mb-1">{chat.service}</p>
                <p className="text-xs text-zinc-500 truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* VENTANA DE CONVERSACIÓN */}
      <main className="flex-1 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-900/20">
          <div className="flex items-center gap-4">
            <img src={activeChat?.image} className="w-10 h-10 rounded-full border border-zinc-800" />
            <div>
              <p className="text-sm font-black text-white tracking-tight">{activeChat?.name}</p>
              <p className="text-[10px] text-[#00e676] font-bold uppercase tracking-widest">Activo en {activeChat?.service}</p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white p-2 transition-colors"><MoreVertical size={20} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]">
          {allMessages[selectedChatId]?.map((msg) => (
            <div key={msg.id} className={`max-w-[70%] flex flex-col animate-in slide-in-from-bottom-2 ${msg.sender === 'me' ? 'ml-auto items-end' : 'items-start'}`}>
              <div className={`px-5 py-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-[#00e676] text-black font-bold rounded-tr-none' : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none'}`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-2 px-1">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{msg.time}</span>
                {msg.sender === 'me' && <CheckCheck size={12} className="text-[#00e676]" />}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
              <div className="flex gap-1"><div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" /><div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" /></div>
              <span className="text-[9px] font-black uppercase tracking-widest">{activeChat?.name.split(' ')[0]} está escribiendo...</span>
            </div>
          )}
        </div>

        <div className="p-8 bg-zinc-900/10 border-t border-zinc-900/50">
          <form onSubmit={handleSendMessage} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-2 flex items-center gap-2 focus-within:border-[#00e676]/50 transition-all">
            <button type="button" className="p-3 text-zinc-500 hover:text-zinc-300"><Paperclip size={20} /></button>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Pregunta sobre el estado de la entrega..." 
              className="flex-1 bg-transparent border-none text-sm text-zinc-200 focus:outline-none py-2 px-1"
            />
            <button type="button" className="p-3 text-zinc-500 hover:text-yellow-500"><Smile size={20} /></button>
            <button type="submit" disabled={!newMessage.trim()} className="bg-[#00e676] text-black p-3.5 rounded-2xl hover:scale-105 transition-all disabled:opacity-50">
              <Send size={18} fill="currentColor" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}