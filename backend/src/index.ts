import express from 'express';
import cookieParser from 'cookie-parser';
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
import paypalRoutes from './routes/paypal.routes.js';
import { connectMongoDB } from './config/mongo.js';
import reviewRoutes from './routes/review.routest.js';
import orderRoutes from './routes/order.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
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

app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/freelance', freelanceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/paypal', paypalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favorites', favoriteRoutes);

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

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor HTTP y WebSockets corriendo en http://localhost:${PORT}`);
  console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
});
