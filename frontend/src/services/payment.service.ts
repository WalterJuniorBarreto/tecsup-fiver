import { CreateIntentDto, PaymentIntentResponse } from '../types/payment';
import { getAuthHeader } from '../lib/auth'; 
import { api } from '../config/axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const paymentService = {
  createPaymentIntent: async (data: CreateIntentDto): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  checkAccess: async (serviceId: string) => {
    try {
      const headers = getAuthHeader(); 
      console.log("🔑 Headers enviados al backend:", headers); // 👈 Reflector 1

      const response = await api.get(`/api/payments/check-access/${serviceId}`, {
        headers: headers
      });
      
      console.log("📥 Respuesta cruda del backend:", response.data); // 👈 Reflector 2
      return response.data; 
      
    } catch (error) {
      console.error("❌ Error al verificar acceso:", error);
      return { hasAccess: false }; 
    }
  }
};