'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface MessagesContextType {
  allMessages: Record<string, any[]>;
  addMessage: (orderId: string, message: any) => void;
  isTypingGlobal: Record<string, boolean>;
  setTyping: (orderId: string, status: boolean) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [allMessages, setAllMessages] = useState<Record<string, any[]>>({
    'ORD-001': [
      { sender: 'me', text: 'Hola! Acabo de ver tu pedido para el logo', time: '10:30' },
      { sender: 'client', text: 'Hola! Si, necesito algo minimalista', time: '10:32' }
    ],
    'ORD-002': [
      { sender: 'client', text: 'Acabo de realizar el pago, quedo atento.', time: '09:00' }
    ]
  });

  const [isTypingGlobal, setIsTypingGlobal] = useState<Record<string, boolean>>({});

  const addMessage = (orderId: string, message: any) => {
    setAllMessages(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), message]
    }));
  };

  const setTyping = (orderId: string, status: boolean) => {
    setIsTypingGlobal(prev => ({ ...prev, [orderId]: status }));
  };

  return (
    <MessagesContext.Provider value={{ allMessages, addMessage, isTypingGlobal, setTyping }}>
      {children}
    </MessagesContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) throw new Error('useMessages debe usarse dentro de MessagesProvider');
  return context;
};