import prisma from '../config/db.js';
import { Preference , Payment} from 'mercadopago';
import { mpClient } from '../config/mercadopago.js'; 

export const paymentService = {
  createPreference: async (userId: string, serviceData: { id: string, title: string, price: number }) => {
    const service = await prisma.service.findUnique({
      where: { id: serviceData.id },
      include: { seller: true }
    });

    if (!service) throw new Error('Servicio no encontrado');

    const order = await prisma.order.create({
      data: {
        client: { connect: { id: userId } },
        seller: { connect: { id: service.sellerId } },
        service: { connect: { id: service.id } },
        price: serviceData.price,
        status: 'PENDING' 
      }
    });

    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/[\r\n ]+/g, "") : 'http://localhost:3000';
    const backendUrl = process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/[\r\n ]+/g, "") : 'http://localhost:4000';

    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [{
          id: service.id,
          title: `DevMarket: ${service.title}`,
          quantity: 1,
          unit_price: Number(service.price),
          currency_id: 'PEN'
        }],
        external_reference: order.id, 
        
        back_urls: {
          success: `${frontendUrl}/service/${service.id}`,
          failure: `${frontendUrl}/service/${service.id}`,
          pending: `${frontendUrl}/service/${service.id}`
        },
        

        notification_url: `${backendUrl}/api/payments/webhook`
      }
    });

    return result.id;
  },

  checkOrderAccess: async (userId: string, serviceId: string) => {
    const order = await prisma.order.findFirst({
      where: {
        clientId: userId,
        serviceId: serviceId,
        status: 'PAID' 
      }
    });
    return !!order; 
  },

  syncPaymentStatus: async (paymentId: string) => {
    try {
      const payment = new Payment(mpClient);
      const paymentInfo = await payment.get({ id: paymentId });

      if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
        await prisma.order.update({
          where: { id: paymentInfo.external_reference },
          data: { status: 'PAID' }
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error consultando pago en MP:", error);
      return false;
    }
  },
  handlePaymentWebhook: async (paymentId: string) => {
    const payment = new Payment(mpClient);
    const paymentInfo = await payment.get({ id: paymentId });

    if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
      const orderId = paymentInfo.external_reference;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID' }
      });
      
      console.log(`✅ [WEBHOOK] Pago procesado: Orden ${orderId} actualizada a PAID`);
    }
  },

  processInternalPayment: async (userId: string, serviceId: string, paymentData: any) => {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) throw new Error('Servicio no encontrado');

    const order = await prisma.order.create({
      data: {
        client: { connect: { id: userId } },
        seller: { connect: { id: service.sellerId } },
        service: { connect: { id: service.id } },
        price: service.price,
        status: 'PENDING' 
      }
    });

    const payment = new Payment(mpClient);
    const result = await payment.create({
      body: {
        ...paymentData,
        description: `DevMarket: ${service.title}`,
        external_reference: order.id,
      }
    });

    if (result.status === 'approved') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' }
      });
      return { success: true, status: result.status };
    }

    return { success: false, status: result.status };
  },
};
