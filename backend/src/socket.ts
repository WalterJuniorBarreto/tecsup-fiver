import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient, redisClient } from './config/redis.js';
import jwt from 'jsonwebtoken';
import { chatService } from './services/chat.service.js';

interface AuthenticatedSocket extends Socket {
  user?: { id: string; role: string };
}

export let io: SocketIOServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) return next(new Error('Autenticación denegada: No token'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      socket.user = { id: decoded.id || decoded.sub, role: decoded.role };
      next();
    } catch (err) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    if (!userId) return socket.disconnect();

    console.log(`Usuario conectado: ${userId} (Socket: ${socket.id})`);

    await redisClient.set(`online:${userId}`, socket.id);
    
    socket.join(userId);

    io.emit('user_status', { userId, status: 'online' });

    socket.on('disconnect', async () => {
      console.log(`Usuario desconectado: ${userId}`);
      await redisClient.del(`online:${userId}`);
      io.emit('user_status', { userId, status: 'offline' });
    });

    socket.on('send_message', async (data: { receiverId: string, content: string }) => {
      try {
        const savedMessage = await chatService.saveMessage(
          userId, 
          data.receiverId, 
          data.content
        );

        io.to(data.receiverId).emit('new_message', savedMessage);
        
        socket.emit('message_sent', savedMessage);
        
      } catch (error) {
        console.error('Error al enviar mensaje via Socket:', error);
        socket.emit('error', { message: 'No se pudo enviar el mensaje' });
      }
    });

    socket.on('typing', (data: { receiverId: string }) => {
      socket.to(data.receiverId).emit('user_typing', { senderId: userId });
    });

    socket.on('stop_typing', (data: { receiverId: string }) => {
      socket.to(data.receiverId).emit('user_stopped_typing', { senderId: userId });
    });
  });

  return io;
};