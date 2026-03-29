'use client';

import { 
  Briefcase, 
  DollarSign, 
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  Inbox,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importamos el contexto para reflejar actividad real
import { useMessages } from '../../../context/MessagesContext';

export default function SellerDashboard() {
  const router = useRouter();
  const { allMessages } = useMessages();

  // Cálculo dinámico de mensajes sin leer (simulado basado en el contexto)
  const totalMessages = Object.values(allMessages).flat().length;

  // Datos de métricas (En un entorno real, estos vendrían de un fetch/API)
  const stats = [
    { label: 'Ganancias del mes', value: '$2,450', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Pedidos activos', value: '8', change: '+3 esta semana', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Calificación promedio', value: '4.9', sub: 'Basado en 156 reseñas', icon: TrendingUp, color: 'text-yellow-500' },
    { label: 'Visitas al perfil', value: '1,234', change: '+24% vs mes anterior', icon: Eye, color: 'text-purple-500' },
  ];

  const orders = [
    { id: 'ORD-001', title: 'Diseño de logo profesional', client: 'Maria Garcia', price: 150, status: 'En proceso', icon: Clock, statusColor: 'text-blue-500 bg-blue-500/10' },
    { id: 'ORD-002', title: 'Desarrollo de landing page', client: 'Carlos Lopez', price: 500, status: 'Pendiente', icon: AlertCircle, statusColor: 'text-yellow-500 bg-yellow-500/10' },
    { id: 'ORD-003', title: 'Edición de video promocional', client: 'Ana Martinez', price: 200, status: 'Completado', icon: CheckCircle2, statusColor: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'ORD-004', title: 'Desarrollo de API REST', client: 'Pedro Sanchez', price: 600, status: 'En proceso', icon: Clock, statusColor: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Panel de vendedor</h1>
          <p className="text-zinc-500 italic">Bienvenido de nuevo, Juan. Aquí tienes un resumen de tu actividad.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Estado del servidor</p>
          <p className="text-xs text-emerald-500 flex items-center justify-end gap-1.5 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sincronizado
          </p>
        </div>
      </header>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0c0c0e] border border-zinc-900 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
              <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
              <stat.icon size={20} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-2xl font-extrabold mb-1 text-white">{stat.value}</p>
            {stat.change && <p className={`text-[11px] font-bold ${stat.color}`}>{stat.change}</p>}
            {stat.sub && <p className="text-[10px] text-zinc-600 font-medium">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: PEDIDOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-white">Pedidos recientes</h3>
                <p className="text-xs text-zinc-500 font-medium">Gestiona tus proyectos actuales</p>
              </div>
              <Link 
                href="/dashboard/seller/orders" 
                className="text-xs font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
              >
                Ver todos los pedidos <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => router.push(`/dashboard/seller/orders?id=${order.id}`)}
                  className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${order.statusColor} transition-transform group-hover:scale-110`}>
                      <order.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">{order.title}</p>
                      <p className="text-xs text-zinc-500">Cliente: <span className="text-zinc-400">{order.client}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-white">${order.price}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ACCIONES Y RENDIMIENTO */}
        <div className="space-y-8">
          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
            <h3 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Acciones rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nuevo servicio', icon: Plus, href: '/dashboard/seller/services' },
                { label: 'Mensajes', icon: MessageSquare, href: '/dashboard/seller/messages', badge: totalMessages > 0 },
                { label: 'Mis Pedidos', icon: Inbox, href: '/dashboard/seller/orders' },
                { label: 'Finanzas', icon: DollarSign, href: '#' },
              ].map((action, i) => (
                <Link 
                  key={i} 
                  href={action.href} 
                  className="relative flex flex-col items-center justify-center p-5 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all gap-3 group"
                >
                  {action.badge && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  <action.icon size={22} className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[10px] font-bold text-center text-zinc-400 group-hover:text-zinc-200">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
            <h3 className="font-bold mb-6 text-white text-sm uppercase tracking-widest">Métricas de salud</h3>
            <div className="space-y-6">
              {[
                { label: 'Tasa de respuesta', value: '98%', color: 'bg-emerald-500' },
                { label: 'Entregas a tiempo', value: '100%', color: 'bg-emerald-500' },
                { label: 'Tasa de finalización', value: '95%', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-medium">{item.label}</span>
                    <span className="text-xs font-bold text-white">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full`} 
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase">
                <span>Pedidos cancelados</span>
                <span className="text-zinc-400">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}