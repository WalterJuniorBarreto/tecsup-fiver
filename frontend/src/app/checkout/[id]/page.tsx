'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { freelanceService } from '../../../services/freelance.service';
import { api } from '../../../config/axios';
import { getAuthHeader } from '../../../lib/auth';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '');

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await freelanceService.getServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Error cargando servicio", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadService();
  }, [serviceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!service) return <div className="text-white text-center mt-20">Servicio no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver al servicio
        </button>
        <h1 className="text-3xl font-black mb-10">Checkout Seguro</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 border-b border-zinc-800 pb-4">Resumen del pedido</h2>
              
              <div className="flex gap-4 mb-6">
                <img src={service.image} alt="Service" className="w-24 h-24 object-cover rounded-xl" />
                <div>
                  <h3 className="font-bold text-lg leading-tight text-zinc-200">{service.title}</h3>
                  <p className="text-zinc-500 text-sm mt-1">Por: {service.seller.name}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                <span className="text-zinc-400">Total a pagar</span>
                <span className="text-3xl font-black text-white">S/ {service.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <ShieldCheck size={24} />
              <p className="text-sm font-medium">Pago procesado internamente con máxima seguridad por DevMarket y Mercado Pago.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 overflow-hidden shadow-2xl">
            <Payment
              initialization={{ amount: Number(service.price) }}
              customization={{ paymentMethods: { creditCard: 'all', debitCard: 'all' } }}
             onSubmit={async (param) => {
    return new Promise<void>(async (resolve, reject) => {
                  try {
                    const res = await api.post('/api/payments/process', {
                      serviceId: service.id,
                      paymentData: param.formData 
                    }, { headers: getAuthHeader() });

                    if (res.data.status === 'success') {
                      resolve();
                      router.push(`/explore/${service.id}`); 
                    } else {
                      reject();
                    }
                  } catch (error) {
                    console.error("Error en pago:", error);
                    reject();
                  }
                });
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}