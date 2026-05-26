'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Briefcase, Star, Plus, MessageSquare, 
  Package, Wallet, Clock, CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { getStoredUser } from '../../../lib/auth';
import { earningService } from '../../../services/earning.service';
import { orderService } from '../../../services/order.service';
import { freelanceService } from '../../../services/freelance.service';

export default function SellerDashboardPage() {
  const [userName, setUserName] = useState('Freelancer');
  const [isLoading, setIsLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState({
    earnings: 0,
    activeOrdersCount: 0,
    averageRating: 0,
    totalReviews: 0,
    recentOrders: [] as any[]
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const user = getStoredUser();
        if (user) setUserName(user.name || user.username || 'Freelancer');

        const earnings = await earningService.getSummary();
        
        const allOrders = await orderService.getReceivedOrders();
        const activeOrders = allOrders.filter((o: any) => o.progress < 100 && o.status !== 'CANCELLED');
        
        const services = await freelanceService.getMyServices();
        let totalStars = 0;
        let totalReviewsCount = 0;

        services.forEach((service: any) => {
          if (service.reviewsCount > 0) {
            totalStars += (service.averageRating * service.reviewsCount);
            totalReviewsCount += service.reviewsCount;
          }
        });

        const globalRating = totalReviewsCount > 0 ? (totalStars / totalReviewsCount) : 0;

        setDashboardData({
          earnings: earnings.total || 0, 
          activeOrdersCount: activeOrders.length,
          averageRating: globalRating,
          totalReviews: totalReviewsCount,
          recentOrders: allOrders.slice(0, 4) 
        });

      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatMoney = (amount: number) => amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00e676] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto font-sans animate-in fade-in duration-500 pb-10">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Panel de vendedor</h1>
          <p className="text-zinc-500 text-sm">Bienvenido de nuevo, {userName}. Aquí tienes un resumen de tu actividad.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#121214] border border-zinc-800/80 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Estado del servidor</span>
          <div className="flex items-center gap-1.5 text-[#00e676] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676] animate-pulse"></span>
            Sincronizado
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Ganancias */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ganancias totales</p>
            <DollarSign size={20} className="text-zinc-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">S/ {formatMoney(dashboardData.earnings)}</h2>
          <p className="text-xs text-[#00e676] font-bold flex items-center gap-1">
            Calculado de ventas reales
          </p>
        </div>

        {/* Pedidos Activos */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pedidos activos</p>
            <Briefcase size={20} className="text-zinc-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">{dashboardData.activeOrdersCount}</h2>
          <p className="text-xs text-blue-400 font-bold flex items-center gap-1">
            En progreso actualmente
          </p>
        </div>

        {/* Calificación Global */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Calificación global</p>
            <Star size={20} className="text-zinc-600" />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">
            {dashboardData.averageRating > 0 ? dashboardData.averageRating.toFixed(1) : '0.0'}
          </h2>
          <p className="text-xs text-zinc-500 font-medium">
            Basado en {dashboardData.totalReviews} reseñas reales
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: PEDIDOS */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-800/80 rounded-[2rem] overflow-hidden shadow-lg flex flex-col">
          <div className="p-8 border-b border-zinc-800/60 flex justify-between items-center bg-[#0c0c0e]">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Pedidos recientes</h3>
              <p className="text-xs text-zinc-500 font-medium">Gestiona tus proyectos actuales</p>
            </div>
            <Link href="/dashboard/seller/orders" className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="flex-1 p-6 space-y-4">
            {dashboardData.recentOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-10">
                <Package size={40} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">Aún no tienes pedidos.</p>
              </div>
            ) : (
              dashboardData.recentOrders.map((order: any) => {
                const isFinished = order.progress === 100;
                return (
                  <div key={order.id} className="border border-zinc-800/80 bg-[#0a0a0a] rounded-2xl p-5 flex items-center justify-between hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        isFinished ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      }`}>
                        {isFinished ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm md:text-base mb-1 truncate max-w-[200px] md:max-w-xs">{order.service?.title}</h4>
                        <p className="text-xs text-zinc-500">Cliente: <span className="text-zinc-300">{order.client?.name || order.client?.username}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-white text-lg mb-1">S/ {formatMoney(order.price)}</p>
                      <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                        isFinished ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {isFinished ? 'Completado' : 'En proceso'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: ACCIONES */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-lg flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Acciones rápidas</h3>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            <Link href="/dashboard/seller/services" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 hover:border-zinc-700 transition-all group">
              <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-[#00e676]/10 transition-colors">
                <Plus size={20} className="text-zinc-400 group-hover:text-[#00e676] transition-colors" />
              </div>
              <span className="text-xs font-bold text-zinc-300">Nuevo servicio</span>
            </Link>
            
            <Link href="/dashboard/seller/messages" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 hover:border-zinc-700 transition-all group relative">
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></div>
              <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-[#00e676]/10 transition-colors">
                <MessageSquare size={20} className="text-zinc-400 group-hover:text-[#00e676] transition-colors" />
              </div>
              <span className="text-xs font-bold text-zinc-300">Mensajes</span>
            </Link>

            <Link href="/dashboard/seller/orders" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 hover:border-zinc-700 transition-all group">
              <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-[#00e676]/10 transition-colors">
                <Package size={20} className="text-zinc-400 group-hover:text-[#00e676] transition-colors" />
              </div>
              <span className="text-xs font-bold text-zinc-300">Mis Pedidos</span>
            </Link>

            <Link href="/dashboard/seller/earnings" className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-zinc-900 hover:border-zinc-700 transition-all group">
              <div className="p-3 bg-zinc-900 rounded-xl group-hover:bg-[#00e676]/10 transition-colors">
                <Wallet size={20} className="text-zinc-400 group-hover:text-[#00e676] transition-colors" />
              </div>
              <span className="text-xs font-bold text-zinc-300">Finanzas</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}