import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
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

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    if (!userId) return socket.disconnect();

    console.log(`Usuario conectado: ${userId} (Socket: ${socket.id})`);

    socket.join(userId);

    io.emit('user_status', { userId, status: 'online' });

    socket.on('send_message', async (data: { receiverId: string, content: string }) => {
      try {
        console.log(`📥 Procesando mensaje de ${userId} para ${data.receiverId}...`);
        
        const savedMessage = await chatService.saveMessage(
          userId, 
          data.receiverId, 
          data.content
        );

        io.to(data.receiverId).emit('new_message', savedMessage);
        socket.emit('message_sent', savedMessage);
        
        console.log(`✅ Mensaje guardado y emitido con éxito.`);
      } catch (error) {
        console.error('❌ Error al guardar mensaje en la BD:', error);
        socket.emit('error', { message: 'No se pudo enviar el mensaje' });
      }
    });

    socket.on('typing', (data: { receiverId: string }) => {
      socket.to(data.receiverId).emit('user_typing', { senderId: userId });
    });

    socket.on('stop_typing', (data: { receiverId: string }) => {
      socket.to(data.receiverId).emit('user_stopped_typing', { senderId: userId });
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${userId}`);
      io.emit('user_status', { userId, status: 'offline' });
    });
  });

  return io;
};