export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  sender?: { id: string; name: string };
}

export interface Conversation {
  id: string;
  participantA: { id: string; name: string; image?: string; avatar?: string };
  participantB: { id: string; name: string; image?: string; avatar?: string };
  messages: ChatMessage[];
  updatedAt: string;
}