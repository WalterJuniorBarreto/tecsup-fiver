'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { useChat } from '../../../../hooks/useChat'; 
import { chatService } from '../../../../services/chat.service';

export default function MessagesPage() {
  const { 
    currentUser, 
    conversations, 
    activeChatId, 
    setConversations,
    setActiveChatId, 
    messages, 
    isLoadingChats,
    isTyping, 
    unreadCounts, 
    sendMessage, 
    emitTyping,
    deleteConversation,
    isUploading, 
    sendAttachment
  } = useChat();
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [globalResults, setGlobalResults] = useState<{id: string, name: string, image?: string, avatar?: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 
  let typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeChatId]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      chatService.searchUsers(searchTerm).then(setGlobalResults);
    } else {
      setGlobalResults([]);
    }
  }, [searchTerm]);

  const activeConversation = conversations.find(c => c.id === activeChatId);
  
  const getOtherUser = (chat: any) => {
    if (!currentUser) return { id: '', name: 'Usuario' };
    return chat.participantA.id === currentUser.id ? chat.participantB : chat.participantA;
  };

  const otherUser = activeConversation ? getOtherUser(activeConversation) : null;

  const filteredChats = conversations.filter(chat => {
    const contact = getOtherUser(chat);
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!otherUser) return;

    emitTyping(otherUser.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(otherUser.id, false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser) return;

    sendMessage(otherUser.id, newMessage);
    setNewMessage('');
    emitTyping(otherUser.id, false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && otherUser) {
      try {
        await sendAttachment(otherUser.id, file);
      } catch (error) {
        setToast({ message: 'No se pudo subir el archivo. Revisa tu consola del Backend.', type: 'error' });
        setTimeout(() => setToast(null), 4000); 
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleStartGlobalChat = (user: {id: string, name: string}) => {
    const existingChat = conversations.find(c => getOtherUser(c).id === user.id);
    if (existingChat) {
      setActiveChatId(existingChat.id);
    } else {
      const tempChatId = `TEMP_${user.id}`;
      const tempChat = {
        id: tempChatId,
        participantA: currentUser!,
        participantB: user,
        messages: [],
        updatedAt: new Date().toISOString()
      };
      setConversations(prev => [tempChat, ...prev]);
      setActiveChatId(tempChatId);
    }
    setSearchTerm('');
    setGlobalResults([]);
  };

  if (isLoadingChats) {
    return <div className="h-[calc(100vh-120px)] flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin" size={40} /></div>;
  }

  const isCloudinaryUrl = (text: string) => text.includes('res.cloudinary.com');
  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

  return (
    <div className="h-[calc(100vh-120px)] flex bg-[#0c0c0e] border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
      
      <aside className="w-80 border-r border-zinc-900 flex flex-col bg-black/40">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Mensajes</h2>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-emerald-500/50 transition-all text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredChats.map((chat) => {
            const contact = getOtherUser(chat);
            const lastMsg = chat.messages[0]; 
            const isUserTyping = isTyping[contact.id];
            const unreadCount = activeChatId === chat.id ? 0 : (unreadCounts[chat.id] || 0); 
            const isMyMessage = lastMsg?.senderId === currentUser?.id;

            return (
              <div key={chat.id} className="relative group">
                <button
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full p-4 flex items-center gap-3 transition-all text-left border-b border-zinc-900/50 ${
                    activeChatId === chat.id ? 'bg-emerald-500/5 border-r-2 border-emerald-500' : 'hover:bg-zinc-900/30'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                      <img 
    src={contact.image || contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} 
    className="w-12 h-12 rounded-full border border-zinc-800 object-cover" 
    alt={contact.name} 
  />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold truncate text-zinc-200">{contact.name}</p>
                      <span className="text-[9px] text-zinc-600 uppercase font-bold flex-shrink-0 ml-2">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xs truncate text-zinc-500 pr-2">
                        {isUserTyping ? (
                          <span className="text-emerald-400 font-medium italic">Escribiendo...</span>
                        ) : (
                          lastMsg ? (
                            <>
                              {isMyMessage && <span className="font-semibold text-zinc-600 mr-1">Tu:</span>}
                              <span className={unreadCount > 0 ? 'text-zinc-200 font-medium' : ''}>{lastMsg.content}</span>
                            </>
                          ) : 'Sin mensajes'
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-[#00e676] text-black text-[9px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setChatToDelete(chat.id); 
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 bg-[#0c0c0e] shadow-[0_0_15px_10px_#0c0c0e] rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {globalResults.length > 0 && (
            <div className="mt-4 border-t border-zinc-900/50 pt-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase px-4 mb-2 tracking-wider">Resultados Globales</p>
              {globalResults.map(user => {
                if (user.id === currentUser?.id) return null;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => handleStartGlobalChat(user)}
                    className="w-full p-4 flex gap-3 transition-all text-left hover:bg-zinc-900/30"
                  >
                    <div className="relative flex-shrink-0">
                      <img 
    src={user.image || user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
    className="w-12 h-12 rounded-full border border-zinc-800 object-cover" 
    alt={user.name} 
  />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold truncate text-emerald-400">{user.name}</p>
                      <p className="text-[10px] text-zinc-500">Haz clic para iniciar chat</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          {filteredChats.length === 0 && (
            <p className="text-center text-xs text-zinc-600 mt-10">No hay conversaciones activas</p>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-black/20 relative">
        {otherUser ? (
          <>
            <header className="p-4 border-b border-zinc-900 bg-black/40 backdrop-blur-md flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <img 
      src={otherUser.image || otherUser.avatar || `https://ui-avatars.com/api/?name=${otherUser.name}&background=random`} 
      className="w-10 h-10 rounded-full border border-zinc-800 object-cover" 
      alt="" 
    />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-white">{otherUser.name}</p>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium">Chat Activo</p>
                </div>
              </div>
            </header>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-20"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1a1a1a 1px, transparent 0)', backgroundSize: '32px 32px' }}
            >
              <div className="flex justify-center mb-6">
                <span className="bg-zinc-900/80 text-zinc-500 text-[10px] font-bold px-4 py-1 rounded-full border border-zinc-800 uppercase tracking-widest shadow-sm">
                  Conversación segura encriptada
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                const isAttachment = isCloudinaryUrl(msg.content); 
                const isImg = isAttachment && isImage(msg.content); 

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[70%] p-3.5 rounded-2xl shadow-lg ${
                      isMe 
                      ? 'bg-emerald-500 text-black font-semibold rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800/50'
                    }`}>
                      
                      {isAttachment ? (
                        isImg ? (
                          <img src={msg.content} alt="Archivo adjunto" className="max-w-[250px] sm:max-w-xs rounded-xl cursor-pointer hover:opacity-90 transition border border-black/10" onClick={() => window.open(msg.content, '_blank')} />
                        ) : (
                          <a href={msg.content} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline decoration-black/30 hover:decoration-black transition">
                            <Paperclip size={16} /> Ver documento adjunto
                          </a>
                        )
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      )}

                      <div className={`flex items-center justify-end gap-1 mt-1.5 ${isMe ? 'text-black/50' : 'text-zinc-600'}`}>
                        <span className="text-[9px] font-bold">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping[otherUser.id] && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-zinc-900/50 text-emerald-500/80 px-4 py-2 rounded-2xl text-[11px] font-medium border border-emerald-500/10 shadow-sm">
                    {otherUser.name} está escribiendo...
                  </div>
                </div>
              )}
            </div>

            <footer className="p-4 bg-black border-t border-zinc-900 absolute bottom-0 left-0 right-0 z-20">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 pl-4 focus-within:border-emerald-500/50 transition-all shadow-inner">
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*,application/pdf" 
                  className="hidden" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="text-zinc-500 hover:text-emerald-500 transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={20} className="animate-spin text-emerald-500" /> : <Paperclip size={20} />}
                </button>
                
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={handleTypingChange}
                  placeholder="Escribe tu mensaje aquí..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-zinc-200 placeholder:text-zinc-600"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-emerald-500 text-black p-2.5 rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
            <Send size={48} className="mb-4 opacity-20" />
            <p>Selecciona una conversación para empezar a chatear</p>
          </div>
        )}
      </main>

      {chatToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-3xl max-w-sm w-full mx-4 shadow-2xl scale-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar chat?</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Esta acción no se puede deshacer. La conversación desaparecerá de tu bandeja.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setChatToDelete(null)} 
                className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  deleteConversation(chatToDelete);
                  setChatToDelete(null);
                }} 
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm border ${
            toast.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}