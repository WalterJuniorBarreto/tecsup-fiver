import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({ url: redisUrl });

export const pubClient = redisClient.duplicate();
export const subClient = redisClient.duplicate();

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    await pubClient.connect();
    await subClient.connect();
    console.log('Conectado a Redis Exitosamente');
  } catch (error) {
    console.error('Error conectando a Redis:', error);
  }
};