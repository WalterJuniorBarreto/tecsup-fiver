'use client';

import { 
  Eye, 
  Users, 
  MousePointer2, 
  BarChart3, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  TrendingUp,
  Clock
} from 'lucide-react';

export default function StatsPage() {
  const topStats = [
    { label: 'Visitas al perfil', value: '1,234', change: '+24% vs mes anterior', icon: Eye },
    { label: 'Impresiones de servicios', value: '5,678', change: '+18% vs mes anterior', icon: Users },
    { label: 'Clics en servicios', value: '432', change: '+12% vs mes anterior', icon: MousePointer2 },
    { label: 'Tasa de conversión', value: '7.6%', change: '+2.1% vs mes anterior', icon: BarChart3 },
  ];

  const metrics = [
    { label: 'Tasa de respuesta', value: '98%', target: 'Meta: 90%' },
    { label: 'Entregas a tiempo', value: '100%', target: 'Meta: 90%' },
    { label: 'Tasa de finalizacion', value: '95%', target: 'Meta: 90%' },
    { label: 'Calificacion promedio', value: '4.9/5', target: 'Meta: 4.5/5' },
  ];

  const activities = [
    { text: 'Nuevo pedido recibido', time: 'Hace 2 horas', icon: Clock, color: 'bg-emerald-500/10 text-emerald-500' },
    { text: 'Nueva reseña de 5 estrellas', time: 'Hace 5 horas', icon: Star, color: 'bg-yellow-500/10 text-yellow-500' },
    { text: '3 mensajes nuevos', time: 'Hace 8 horas', icon: MessageSquare, color: 'bg-blue-500/10 text-blue-500' },
    { text: 'Tu perfil tuvo 45 visitas hoy', time: 'Hace 12 horas', icon: Eye, color: 'bg-purple-500/10 text-purple-500' },
    { text: 'Pedido completado exitosamente', time: 'Ayer', icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-500' },
  ];

  const servicePerformance = [
    { name: 'Desarrollo de sitio web responsive', views: 890, clicks: 156, orders: 24, conv: '15.4%', rating: 5 },
    { name: 'Desarrollo de API REST', views: 654, clicks: 98, orders: 18, conv: '18.4%', rating: 4.9 },
    { name: 'Aplicacion movil con React Native', views: 432, clicks: 67, orders: 8, conv: '11.9%', rating: 4.8 },
  ];

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Estadísticas</h1>
        <p className="text-zinc-500 text-sm italic">Analiza el rendimiento de tu perfil y servicios</p>
      </header>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {topStats.map((stat, i) => (
          <div key={i} className="bg-[#0c0c0e] border border-zinc-900 p-6 rounded-3xl group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
              <stat.icon size={18} className="text-zinc-700 group-hover:text-emerald-500 transition" />
            </div>
            <p className="text-2xl font-extrabold mb-1">{stat.value}</p>
            <p className="text-[10px] font-medium text-emerald-500">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* MÉTRICAS DE RENDIMIENTO (Progress Bars) */}
        <div className="lg:col-span-3 bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
          <h3 className="font-bold mb-2">Métricas de rendimiento</h3>
          <p className="text-zinc-500 text-xs mb-8">Tu desempeño como vendedor</p>
          <div className="space-y-8">
            {metrics.map((m, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    {m.value} <CheckCircle2 size={14} className="text-emerald-500" />
                  </p>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: i === 1 ? '100%' : i === 0 ? '98%' : '95%' }}
                  />
                </div>
                <p className="text-[10px] text-zinc-600 mt-2 font-medium">{m.target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="lg:col-span-2 bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
          <h3 className="font-bold mb-2">Actividad reciente</h3>
          <p className="text-zinc-500 text-xs mb-8">Últimos eventos en tu cuenta</p>
          <div className="space-y-6">
            {activities.map((act, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`p-2 rounded-xl flex-shrink-0 ${act.color}`}>
                  <act.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{act.text}</p>
                  <p className="text-[10px] text-zinc-500">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLA DE RENDIMIENTO POR SERVICIO */}
      <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 overflow-hidden">
        <h3 className="font-bold mb-2">Rendimiento por servicio</h3>
        <p className="text-zinc-500 text-xs mb-8">Analiza el desempeño de cada uno de tus servicios</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest border-b border-zinc-900">
                <th className="pb-4">Servicio</th>
                <th className="pb-4">Vistas</th>
                <th className="pb-4">Clics</th>
                <th className="pb-4 text-center">Pedidos</th>
                <th className="pb-4 text-center">Conversion</th>
                <th className="pb-4 text-right">Calificacion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {servicePerformance.map((item, i) => (
                <tr key={i} className="group hover:bg-zinc-900/20 transition-colors">
                  <td className="py-4 text-sm font-bold group-hover:text-emerald-400 transition">{item.name}</td>
                  <td className="py-4 text-sm text-zinc-500">{item.views}</td>
                  <td className="py-4 text-sm text-zinc-500">{item.clicks}</td>
                  <td className="py-4 text-sm font-extrabold text-center">{item.orders}</td>
                  <td className="py-4 text-center">
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {item.conv}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-sm font-bold text-yellow-500">
                      <Star size={14} fill="currentColor" /> {item.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}