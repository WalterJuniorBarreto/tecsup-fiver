import { MercadoPagoConfig } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  console.warn('MERCADOPAGO_ACCESS_TOKEN no está definido en el .env');
}

const cleanToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
export const mpClient = new MercadoPagoConfig({ 
  accessToken: cleanToken,
  options: { timeout: 5000, idempotencyKey: 'abc' }
});