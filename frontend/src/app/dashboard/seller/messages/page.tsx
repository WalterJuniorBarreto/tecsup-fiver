'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, CheckCheck, Loader2, Trash2, Lock, FileText, X, Download } from 'lucide-react';
import { useChat } from '../../../../hooks/useChat'; 
import { useChatStore } from '../../../../store/chatStore';
import { chatService } from '../../../../services/chat.service';

const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
  
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};

export default function MessagesPage() {
  const { 
    currentUser, conversations, activeChatId, setConversations,
    setActiveChatId, messages, isLoadingChats, isTyping, 
    unreadCounts, sendMessage, emitTyping, deleteConversation,
    isUploading, sendAttachment
  } = useChat();

  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [globalResults, setGlobalResults] = useState<{id: string, name: string, image?: string, avatar?: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const clearUnread = useChatStore(state => state.clearUnread);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 
  let typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDownloadFile = async (url: string) => {
    setToast({ message: 'Descargando archivo...', type: 'success' });
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error en la descarga");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = url.split('/').pop()?.split('?')[0] || 'documento_devmarket.pdf';

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setTimeout(() => setToast(null), 2500);
    } catch (error) {
      console.error("Error forzando la descarga:", error);
      window.open(url, '_blank'); 
    }
  };

  useEffect(() => {
    if (activeChatId && !activeChatId.startsWith('TEMP_')) {
      clearUnread(activeChatId);
      chatService.markAsRead(activeChatId).catch((err) => {
        console.error("Error marcando como leído en BD:", err);
      });
    }
  }, [activeChatId, messages.length, clearUnread]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
        setToast({ message: 'No se pudo subir el archivo. Revisa tu consola.', type: 'error' });
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
      const tempChat: any = {
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
    return <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="animate-spin text-[#00e676]" size={40} /></div>;
  }

  const isCloudinaryUrl = (text: string) => text.includes('res.cloudinary.com');
  const isImage = (url: string) => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(cleanUrl);
  };

  let lastDateStr: string | null = null;

  return (
    <div className="h-[calc(100vh-120px)] flex bg-[var(--bg-elevated)] border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
      
      <aside className="w-80 border-r border-zinc-900 flex flex-col bg-[var(--bg-elevated)]">
        <div className="p-6">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">Mensajes</h2>
            <span className="bg-[#00e676]/10 text-[#00e676] text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-2 border border-[#00e676]/20 shadow-[0_0_10px_rgba(0,230,118,0.1)]">
              <div className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-pulse" /> LIVE
            </span>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00e676] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-800/80 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none focus:border-[#00e676]/50 focus:bg-[#0a0a0a] transition-all text-white placeholder:text-zinc-600"
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
                  className={`w-full p-5 flex items-center gap-4 transition-all text-left border-b border-zinc-800/30 ${
                    activeChatId === chat.id ? 'bg-[#121214] border-l-4 border-l-[#00e676]' : 'hover:bg-[#121214]/50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={contact.image || contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=0a0a0a&color=00e676`} 
                      className="w-12 h-12 rounded-full border border-zinc-700 object-cover" 
                      alt={contact.name} 
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#00e676] border-2 border-[#0c0c0e] w-3 h-3 rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-white' : 'text-zinc-300'}`}>{contact.name}</p>
                      <span className="text-[10px] text-zinc-500 font-medium flex-shrink-0 ml-2">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xs truncate text-zinc-500 pr-2">
                        {isUserTyping ? (
                          <span className="text-[#00e676] font-medium italic animate-pulse">Escribiendo...</span>
                        ) : (
                          lastMsg ? (
                            <>
                              {isMyMessage && <span className="font-bold text-zinc-400 mr-1">Tú:</span>}
                              <span className={unreadCount > 0 ? 'text-zinc-200 font-bold' : ''}>
                                {isCloudinaryUrl(lastMsg.content) ? '📎 Archivo adjunto' : lastMsg.content}
                              </span>
                            </>
                          ) : 'Sin mensajes'
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-[#00e676] text-black text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(0,230,118,0.3)]">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-white hover:bg-red-500 bg-[#121214] border border-zinc-700 shadow-xl rounded-xl transition-all"
                  title="Eliminar chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}

          {globalResults.length > 0 && (
            <div className="mt-4 border-t border-zinc-800/60 pt-4 pb-4">
              <p className="text-[10px] font-bold text-[#00e676] uppercase px-6 mb-2 tracking-widest">Resultados Globales</p>
              {globalResults.map(user => {
                if (user.id === currentUser?.id) return null;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleStartGlobalChat(user)}
                    className="w-full p-4 px-6 flex gap-3 transition-all text-left hover:bg-[#121214]/50 border-l-4 border-transparent hover:border-[#00e676]"
                  >
                    <div className="relative flex-shrink-0">
                      <img src={user.image || user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0a0a0a&color=00e676`} className="w-10 h-10 rounded-full border border-zinc-700 object-cover" alt={user.name} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold truncate text-white">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Haz clic para iniciar chat</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {filteredChats.length === 0 && globalResults.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 text-center opacity-50">
              <Search className="w-8 h-8 text-zinc-500 mb-3" />
              <p className="text-xs text-zinc-400">No hay conversaciones</p>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[var(--bg-soft)] relative">
        {otherUser ? (
          <>
            <header className="p-4 border-b border-zinc-900 bg-[var(--bg-elevated)] backdrop-blur-md flex justify-between items-center z-10">
              <div className="flex items-center gap-3">

                <img 
                  src={otherUser.image || otherUser.avatar || `https://ui-avatars.com/api/?name=${otherUser.name}&background=0a0a0a&color=00e676`} 
                  className="w-12 h-12 rounded-full border border-zinc-700 object-cover shadow-md" 
                  alt="" 
                />
                <div>
                  <h3 className="font-black text-lg text-white leading-tight">
                    {otherUser.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                    <p className="text-xs text-[#00e676] font-bold tracking-wider">CLIENTE EN LÍNEA</p>
                  </div>
                </div>
              </div>
            </header>

            <div 
              ref={scrollRef}

              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #121214 1px, transparent 0)', backgroundSize: '24px 24px' }}
            >
              <div className="flex justify-center mb-8 mt-2">
                <span className="bg-[#121214] text-zinc-500 text-[10px] font-bold px-4 py-1.5 rounded-full border border-zinc-800/60 uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                  <Lock size={12} /> Conversación cifrada de extremo a extremo
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                const isAttachment = isCloudinaryUrl(msg.content); 
                const isImg = isAttachment && isImage(msg.content); 

                const currentMsgDate = new Date(msg.createdAt).toDateString();
                const showDateSeparator = currentMsgDate !== lastDateStr;
                lastDateStr = currentMsgDate;

                return (
                  <React.Fragment key={msg.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-6">
                        <span className="bg-[#121214] text-zinc-400 text-[10px] font-bold px-4 py-1.5 rounded-full border border-zinc-800/60 uppercase tracking-widest shadow-sm capitalize">
                          {formatMessageDate(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[75%] p-4 shadow-lg flex flex-col group relative ${
                        isMe 
                        ? 'bg-[#00e676] text-black font-medium rounded-2xl rounded-br-sm' 
                        : 'bg-[#121214] text-zinc-200 rounded-2xl rounded-bl-sm border border-zinc-800/60'
                      }`}>
                        
                        {isAttachment ? (
                          isImg ? (
                            <img 
                              src={msg.content} 
                              alt="Adjunto" 
                              className="max-w-[250px] sm:max-w-sm rounded-xl cursor-pointer hover:opacity-90 transition border border-black/10 shadow-sm" 
                              onClick={() => setSelectedImage(msg.content)} 
                            />
                          ) : (
                            <button 
                              onClick={() => handleDownloadFile(msg.content)}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition text-left w-full ${isMe ? 'bg-black/10 border-black/20 hover:bg-black/20' : 'bg-[#0a0a0a] border-zinc-800 hover:border-zinc-600'}`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${isMe ? 'bg-[#00c853] text-black' : 'bg-zinc-800 text-[#00e676]'}`}><FileText size={20} /></div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold truncate">Documento adjunto</span>
                                <span className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${isMe ? 'text-black/60' : 'text-zinc-500'}`}>
                                  <Download size={10} /> Haz clic para descargar
                                </span>
                              </div>
                            </button>
                          )
                        ) : (
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}

                        <div className={`flex items-center justify-end gap-1.5 mt-2 ${isMe ? 'text-black/60' : 'text-zinc-500'}`}>
                          <span className="text-[10px] font-bold">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck size={14} className="opacity-80" />}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {isTyping[otherUser.id] && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-[#121214] border border-zinc-800/60 text-[#00e676] px-5 py-3.5 rounded-2xl rounded-bl-sm text-xs font-bold flex items-center gap-2 shadow-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#00e676] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <footer className="p-4 md:p-6 bg-[#0c0c0e] border-t border-zinc-800/60 shrink-0 z-20">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-[#121214] border border-zinc-800/80 rounded-[1.5rem] p-2 pl-4 focus-within:border-[#00e676]/50 focus-within:shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-all">
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
                
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="text-zinc-400 hover:text-[#00e676] transition-colors disabled:opacity-50 p-2 bg-[#0a0a0a] rounded-xl border border-zinc-800"
                  title="Adjuntar archivo"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin text-[#00e676]" /> : <Paperclip size={18} />}
                </button>
                
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={handleTypingChange}
                  placeholder="Escribe tu mensaje..." 
                  className="flex-1 bg-transparent border-none outline-none text-[15px] py-3 px-2 text-white placeholder:text-zinc-600"
                />
                
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#00e676] text-black p-3.5 rounded-xl hover:bg-[#00c853] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_4px_14px_0_rgba(0,230,118,0.2)]"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 bg-[#0a0a0a]">
            <div className="w-24 h-24 bg-[#121214] border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Send size={40} className="text-zinc-700 ml-2" />
            </div>
            <h3 className="text-xl font-bold text-zinc-400 mb-2">Tus mensajes</h3>
            <p className="text-sm">Selecciona una conversación en el panel izquierdo.</p>
          </div>
        )}
      </main>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 hover:scale-110 transition-all backdrop-blur-md"
            title="Cerrar"
          >
            <X size={24} />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              handleDownloadFile(selectedImage);
            }} 
            className="absolute top-6 right-24 p-3 bg-[#00e676] text-black font-bold rounded-full hover:bg-[#00c853] hover:scale-110 shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all flex items-center gap-2"
            title="Descargar imagen"
          >
            <Download size={20} />
          </button>

          <img 
            src={selectedImage} 
            alt="Vista previa ampliada" 
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {chatToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] max-w-sm w-full mx-4 shadow-2xl scale-in-95 duration-200">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">¿Eliminar chat?</h3>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              Esta acción no se puede deshacer. La conversación y todos sus adjuntos desaparecerán de tu bandeja.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setChatToDelete(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition">
                Cancelar
              </button>
              <button onClick={() => { deleteConversation(chatToDelete); setChatToDelete(null); }} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border ${
            toast.type === 'error' ? 'bg-[#121214] text-red-400 border-red-500/30' : 'bg-[#121214] text-[#00e676] border-[#00e676]/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
