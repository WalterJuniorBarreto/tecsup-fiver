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
import earningRoutes from './routes/earning.routes.js';
import adminRoutes from './routes/admin.routes.js';
import moderationRoutes from './routes/moderation.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = http.createServer(app);

connectRedis();
initializeSocket(httpServer);
connectMongoDB();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: (origin, callback) => {
 
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por la política de CORS'));
    }
  },
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
app.use('/api/earnings', earningRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/moderation', moderationRoutes); 

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
