import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';
import authRoutes from './routes/auth.routes.js'; 
import profileRoutes from './routes/profile.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import http from 'http';
import { initializeSocket } from './socket.js';
import { connectRedis } from './config/redis.js';
import chatRoutes from './routes/chat.routes.js';
import freelanceRoutes from './routes/freelance.routes.js';
import categoryRoutes from './routes/category.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { connectMongoDB } from './config/mongo.js';
import reviewRoutes from './routes/review.routest.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = http.createServer(app);

connectRedis();
initializeSocket(httpServer);
connectMongoDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 🚀 1. EL FIX PARA STRIPE:
// Le decimos a Express que deje en paz el body (Raw Buffer) SOLO para la ruta del webhook.
// Al poner esto ANTES del express.json(), Stripe recibe el mensaje crudo y la firma pasa.
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' })
);

// 🚀 2. PARSER GLOBAL:
// Ahora sí, convertimos a JSON todo el RESTO de las peticiones de tu app.
app.use(express.json()); 

// 🚀 3. TUS RUTAS:
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/freelance', freelanceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes); // El webhook también pasará por aquí, pero ya con formato Raw
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'success',
      message: 'Servidor de DevMarket en línea',
      database: 'Conectada',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error conectando a la base de datos',
    });
  }
});

// 🚀 EL FIX DEL PUERTO:
// Eliminamos el "app.listen" repetido. Solo se necesita httpServer.listen 
// porque este ya envuelve a "app" y maneja los WebSockets al mismo tiempo.
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor HTTP y WebSockets corriendo en http://localhost:${PORT}`);
  console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
});