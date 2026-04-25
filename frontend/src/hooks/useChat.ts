import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { chatService } from '../services/chat.service';
import { getAuthToken, getStoredUser } from '../lib/auth';
import { ChatMessage, Conversation } from '../types/message.types';
import { useChatStore } from '../store/chatStore'; 

let socketInstance: Socket | null = null;

export const useChat = () => {
  const currentUser = getStoredUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  
  const { unreadCounts, setInitialCounts, incrementUnread, clearUnread } = useChatStore();

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    if (!socketInstance) {
      socketInstance = io(backendUrl, {
        auth: { token },
        transports: ['websocket']
      });
    }
    setSocket(socketInstance);

    chatService.getMyChats()
      .then(chats => {
        setConversations(chats);
        
        const initialCounts: Record<string, number> = {};
        chats.forEach((c: any) => {
          initialCounts[c.id] = c._count?.messages || 0;
        });
        setInitialCounts(initialCounts);

        if (chats.length > 0) setActiveChatId(chats[0].id);
      })
      .finally(() => setIsLoadingChats(false));

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, [setInitialCounts]); 

  useEffect(() => {
    if (!activeChatId) return;

    clearUnread(activeChatId);

    if (activeChatId.startsWith('TEMP_')) {
      setMessages([]); 
      return;
    }

    if (chatService.markAsRead) {
      chatService.markAsRead(activeChatId).catch(console.error);
    }

    chatService.getChatHistory(activeChatId)
      .then(setMessages)
      .catch(err => {
        console.error('Error cargando historial de chat:', err);
        setMessages([]); 
      });
  }, [activeChatId, clearUnread]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: ChatMessage) => {
      if (activeChatId === msg.conversationId) {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev; 
          return [...prev, msg];
        });
      } else {
        if (msg.senderId !== currentUser?.id) {
          incrementUnread(msg.conversationId);
        }
      }

      setConversations(prev => {
        const chatExists = prev.find(c => c.id === msg.conversationId);
        
        if (!chatExists) {
          chatService.getMyChats().then(setConversations);
          return prev;
        }

        return prev.map(chat => {
          if (chat.id === msg.conversationId) {
            return { ...chat, messages: [msg], updatedAt: new Date().toISOString() };
          }
          return chat;
        }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); 
      });
    };

    const handleTyping = ({ senderId }: { senderId: string }) => setIsTyping(prev => ({ ...prev, [senderId]: true }));
    const handleStopTyping = ({ senderId }: { senderId: string }) => setIsTyping(prev => ({ ...prev, [senderId]: false }));

    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleNewMessage); 
    socket.on('user_typing', handleTyping);
    socket.on('user_stopped_typing', handleStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleNewMessage);
      socket.off('user_typing', handleTyping);
      socket.off('user_stopped_typing', handleStopTyping);
    };
  }, [socket, activeChatId, currentUser?.id, incrementUnread]);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!socket || !content.trim()) return;
    socket.emit('send_message', { receiverId, content });
  }, [socket]);

  const emitTyping = useCallback((receiverId: string, isTypingNow: boolean) => {
    if (!socket) return;
    socket.emit(isTypingNow ? 'typing' : 'stop_typing', { receiverId });
  }, [socket]);

  const deleteConversation = async (chatId: string) => {
    try {
      await chatService.deleteChat(chatId);
      setConversations(prev => prev.filter(c => c.id !== chatId));
      if (activeChatId === chatId) setActiveChatId(null);
    } catch (error) {
      console.error("Error al eliminar el chat:", error);
    }
  };

  const sendAttachment = async (receiverId: string, file: File) => {
    if (!socket) return;
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const fileUrl = await chatService.uploadAttachment(formData);
      
      socket.emit('send_message', { receiverId, content: fileUrl });
      
    } catch (error) {
      console.error('Error al enviar el archivo:', error);
      throw new Error('Fallo al subir');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    currentUser,
    conversations,
    setConversations,
    activeChatId,
    setActiveChatId,
    messages,
    isLoadingChats,
    isTyping,
    unreadCounts,
    sendMessage,
    emitTyping,
    deleteConversation,
    isUploading,   
    sendAttachment,
  };
};