"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Users, Briefcase, 
  ShieldAlert, Eye, Loader2,
  Search, PackageCheck, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { adminService } from '../../../services/admin.service'; 

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PEN' }).format(amount).replace('PEN', 'S/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="grid grid-cols-[auto_1fr] min-h-screen bg-[#0a0a0a] w-full">
        <AdminSidebar />
        <main className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#00e676] animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00e676]/30 w-full">
      {/* Columna 1: Barra lateral fija en su espacio automático */}
      <AdminSidebar />

      {/* Columna 2: Contenido dinámico principal */}
      <main className="min-h-screen overflow-y-auto w-full flex justify-center p-8 md:p-10">
        <div className="w-full max-w-[1400px]">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Panel de Administración</h2>
              <p className="text-zinc-500 text-sm font-medium">Bienvenido al centro de control de DevMarket</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/admin/moderation" className="flex items-center gap-2 bg-[#00e676] text-black px-5 py-2.5 rounded-xl text-sm font-black hover:bg-[#00c853] transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                <ShieldAlert size={16} /> {dashboardData.pendingReports.length} Reportes Nuevos
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Ingresos Totales" value={formatMoney(dashboardData.stats.ingresosTotales)} trend="Actualizado" subText="Comisiones + Subs" icon={<Wallet className="text-[#00e676]"/>} bgColor="bg-[#00e676]/10" borderColor="border-[#00e676]/20" />
            <StatCard title="Usuarios Activos" value={dashboardData.stats.usuariosActivos.toString()} trend="Global" subText="Registrados" icon={<Users className="text-blue-400"/>} bgColor="bg-blue-500/10" borderColor="border-blue-500/20" />
            <StatCard title="Servicios Publicados" value={dashboardData.stats.serviciosPublicados.toString()} trend="Global" subText="En plataforma" icon={<Briefcase className="text-purple-400"/>} bgColor="bg-purple-500/10" borderColor="border-purple-500/20" />
            <StatCard title="Órdenes Completadas" value={dashboardData.stats.ordenesCompletadas.toString()} trend="Global" subText="Trabajos exitosos" icon={<PackageCheck className="text-amber-400"/>} bgColor="bg-amber-500/10" borderColor="border-amber-500/20" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            
            {/* REPORTES PENDIENTES */}
            <div className="xl:col-span-2 bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <ShieldAlert size={20} className="text-[#00e676]" /> Reportes Pendientes
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Requieren revisión de un administrador</p>
                </div>
                <Link href="/dashboard/admin/moderation" className="text-[#00e676] text-xs font-bold hover:underline flex items-center gap-1">Ver todos →</Link>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] uppercase tracking-widest font-black px-2">
                      <th className="pb-4 pl-4">Reportado</th>
                      <th className="pb-4 text-center">Tipo</th>
                      <th className="pb-4 text-center">Motivo principal</th>
                      <th className="pb-4 text-center">Fecha</th>
                      <th className="pb-4 text-right pr-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {dashboardData.pendingReports.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-zinc-500 font-bold">No hay reportes pendientes.</td></tr>
                    ) : (
                      dashboardData.pendingReports.map((report: any, i: number) => (
                        <tr key={i} className="bg-[#0a0a0a] hover:bg-zinc-900/50 transition-colors group">
                          <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-800/50 group-hover:border-zinc-700">
                            <p className="font-bold text-zinc-300 text-sm truncate max-w-[200px]">{report.targetName}</p>
                          </td>
                          <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${report.targetType === 'SERVICIO' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'}`}>{report.targetType}</span>
                          </td>
                          <td className="py-4 text-center text-zinc-400 font-medium text-xs border-y border-zinc-800/50 group-hover:border-zinc-700 truncate max-w-[150px]">{report.reason}</td>
                          <td className="py-4 text-center text-zinc-500 text-xs font-medium border-y border-zinc-800/50 group-hover:border-zinc-700">{formatDate(report.date)}</td>
                          <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-zinc-800/50 group-hover:border-zinc-700">
                            <Link href="/dashboard/admin/moderation" className="p-2 inline-block text-zinc-500 hover:text-[#00e676] bg-[#121214] rounded-xl border border-zinc-800 transition-colors"><Eye size={16}/></Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTIVIDAD RECIENTE */}
            <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl flex flex-col">
              <h3 className="text-xl font-bold mb-1 text-white">Actividad de Hoy</h3>
              <p className="text-xs text-zinc-500 font-medium mb-6">Métricas registradas desde las 00:00</p>
              
              <div className="space-y-4 flex-1">
                <ActivityItem label="Nuevos usuarios" value={`+${dashboardData.activity.newUsersToday}`} sub="Registrados hoy" color="text-[#00e676]" icon={<Users size={18}/>} />
                <ActivityItem label="Órdenes iniciadas" value={dashboardData.activity.ordersInProgress} sub="En progreso actual" color="text-blue-400" icon={<Briefcase size={18}/>} />
                <ActivityItem label="Ventas completadas" value={dashboardData.activity.completedToday} sub="Finalizadas hoy" color="text-purple-400" icon={<PackageCheck size={18}/>} />
                <ActivityItem label="Nuevos reportes" value={dashboardData.activity.reportsToday} sub="Recibidos hoy" color="text-amber-400" icon={<AlertCircle size={18}/>} />
              </div>
            </div>
          </div>

          {/* USUARIOS RECIENTES (CON DATOS REALES DE API) */}
          <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Users size={20} className="text-[#00e676]" /> Usuarios Recientes
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">Los últimos 5 usuarios que se unieron a DevMarket</p>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input type="text" placeholder="Buscar usuarios..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00e676] transition-colors text-white" />
                </div>
                <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors whitespace-nowrap">Ver todos →</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[10px] text-zinc-500 font-black uppercase tracking-widest px-4">
                    <th className="pb-4 pl-4">Usuario</th>
                    <th className="pb-4 text-center">Rol</th>
                    <th className="pb-4 text-center">Estado</th>
                    <th className="pb-4 text-center">Registro</th>
                    <th className="pb-4">Monto Generado/Gastado</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {dashboardData.recentUsers.map((user: any, i: number) => (
                    <UserRow key={i} user={user} formatDate={formatDate} formatMoney={formatMoney} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- COMPONENTES HELPER ---

function StatCard({ title, value, trend, subText, icon, bgColor, borderColor }: any) {
  return (
    <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-bl-full pointer-events-none opacity-50`}></div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{title}</p>
          <h4 className="text-3xl font-black text-white">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl border ${bgColor} ${borderColor}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md text-[#00e676] bg-[#00e676]/10 border border-[#00e676]/20`}>{trend}</span>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{subText}</span>
      </div>
    </div>
  );
}

function UserRow({ user, formatDate, formatMoney }: any) {
  return (
    <tr className="bg-[#0a0a0a] hover:bg-zinc-900/50 transition-colors group">
      <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-800/50 group-hover:border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500 uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-zinc-200 text-sm truncate max-w-[150px]">{user.name}</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate max-w-[150px]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
        <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          user.role === 'FREELANCER' ? 'text-[#00e676] bg-[#00e676]/5 border-[#00e676]/20' : 'text-blue-400 bg-blue-400/5 border-blue-400/20'
        }`}>{user.role}</span>
      </td>
      <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
        <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          user.status === 'ACTIVO' ? 'text-zinc-300 bg-zinc-800 border-zinc-700' : 'text-red-400 bg-red-500/10 border-red-500/20'
        }`}>{user.status}</span>
      </td>
      <td className="py-4 text-center text-zinc-500 text-xs font-medium border-y border-zinc-800/50 group-hover:border-zinc-700">{formatDate(user.date)}</td>
      <td className="py-4 pr-4 rounded-r-2xl border-y border-r border-zinc-800/50 group-hover:border-zinc-700">
        <p className="font-black text-[#00e676] text-sm">{formatMoney(user.amount)}</p>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user.orders} {user.role === 'FREELANCER' ? 'Ventas' : 'Compras'}</p>
      </td>
    </tr>
  );
}

function ActivityItem({ label, value, sub, color, icon }: any) {
  return (
    <div className="bg-[#0a0a0a] p-5 rounded-2xl flex items-center justify-between border border-zinc-800/50">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-zinc-900 rounded-xl text-zinc-400 border border-zinc-800">{icon}</div>
        <div>
          <p className="text-sm font-bold text-white mb-0.5">{label}</p>
          <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}