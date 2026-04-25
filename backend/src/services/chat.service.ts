import prisma from '../config/db.js';

export const chatService = {
  findOrCreateConversation: async (userId1: string, userId2: string) => {
   
    const [participantAId, participantBId] = [userId1, userId2].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        participantAId_participantBId: { participantAId, participantBId }
      }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { participantAId, participantBId }
      });
    } else {
      if (conversation.deletedByA || conversation.deletedByB) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: { deletedByA: false, deletedByB: false }
        });
      }
    }

    return conversation;
  },

  saveMessage: async (senderId: string, receiverId: string, content: string) => {
    const conversation = await chatService.findOrCreateConversation(senderId, receiverId);

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId: conversation.id
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return message;
  },

  getMyConversations: async (userId: string) => {
    return prisma.conversation.findMany({
      where: {
        OR: [
          { participantAId: userId, deletedByA: false },
          { participantBId: userId, deletedByB: false }
        ]
      },
      include: {
        participantA: { select: { id: true, name: true, role: true, avatar: true } },
        participantB: { select: { id: true, name: true, role: true, avatar: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        
        _count: {
          select: {
            messages: {
              where: { 
                isRead: false, 
                senderId: { not: userId } 
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  },

  getConversationHistory: async (conversationId: string, userId: string) => {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [ { participantAId: userId }, { participantBId: userId } ]
      }
    });

    if (!conversation) throw new Error('No tienes acceso a esta conversación');

    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }, 
      include: { sender: { select: { id: true, name: true } } }
    });
  },

  deleteConversation: async (conversationId: string, userId: string) => {
    const chat = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!chat) throw new Error('Chat no encontrado');

    const isParticipantA = chat.participantAId === userId;
    const isParticipantB = chat.participantBId === userId;

    if (!isParticipantA && !isParticipantB) throw new Error('Acceso denegado');

    return prisma.conversation.update({
      where: { id: conversationId },
      data: isParticipantA ? { deletedByA: true } : { deletedByB: true }
    });
  },
  markConversationAsRead: async (conversationId: string, userId: string) => {
    return prisma.message.updateMany({
      where: { 
        conversationId: conversationId,
        senderId: { not: userId }, 
        isRead: false 
      },
      data: { isRead: true }
    });
  },

 
};