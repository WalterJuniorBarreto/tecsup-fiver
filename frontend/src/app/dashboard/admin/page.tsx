+"use client";

import React from 'react';
import { 
  ShieldCheck, Wallet, Users, Briefcase, 
  TrendingUp, AlertCircle, Eye, Check, X,
  Search, MoreVertical, TrendingDown
} from 'lucide-react';
import AdminSidebar from "../../../components/admin/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      {/* Sidebar Reutilizable */}
      <AdminSidebar />

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
            <p className="text-zinc-500 text-sm">Bienvenido al centro de control de DevMarket</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-medium text-amber-500 hover:bg-zinc-800 transition-colors">
              <AlertCircle size={14} /> 3 Disputas
            </button>
            <button className="flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors">
              <ShieldCheck size={14} /> 5 Por moderar
            </button>
          </div>
        </header>

        {/* --- SECCIÓN 1: KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Ingresos totales" value="$48,250" trend="+18.2%" subText="vs mes anterior" icon={<Wallet className="text-emerald-400"/>} bgColor="bg-emerald-500/10" />
          <StatCard title="Usuarios activos" value="2,847" trend="+12.5%" subText="Este mes" icon={<Users className="text-blue-400"/>} bgColor="bg-blue-500/10" />
          <StatCard title="Servicios publicados" value="1,234" trend="+8.3%" subText="Total en plataforma" icon={<Briefcase className="text-purple-400"/>} bgColor="bg-purple-500/10" />
          <StatCard title="Tasa de conversión" value="24.5%" trend="-2.1%" subText="Visitas a compras" icon={<TrendingUp className="text-orange-400"/>} bgColor="bg-orange-500/10" isDown />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* --- SECCIÓN 2: TABLA DE MODERACIÓN --- */}
          <div className="xl:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-500" /> Servicios pendientes de moderación
                </h3>
                <p className="text-sm text-zinc-500">Revisa y aprueba nuevos servicios</p>
              </div>
              <button className="text-emerald-500 text-sm font-medium hover:underline">Ver todos →</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-800">
                    <th className="pb-4 font-bold px-2">Servicio</th>
                    <th className="pb-4 font-bold text-center px-2">Categoría</th>
                    <th className="pb-4 font-bold text-center px-2">Precio</th>
                    <th className="pb-4 font-bold text-center px-2">Enviado</th>
                    <th className="pb-4 font-bold text-right px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <ModerationRow title="Desarrollo de app móvil React Native" user="Carlos Mendez" cat="Desarrollo" price="$500" time="Hace 2 horas" />
                  <ModerationRow title="Diseño de logo e identidad corporativa" user="Ana Martinez" cat="Diseño" price="$150" time="Hace 4 horas" />
                  <ModerationRow title="Edición de video profesional 4K" user="Miguel Torres" cat="Video" price="$80" time="Hace 6 horas" />
                  <ModerationRow title="Redacción de contenido SEO" user="Laura Sanchez" cat="Escritura" price="$45" time="Hace 8 horas" />
                  <ModerationRow title="Campañe de marketing en redes" user="Pedro Gomez" cat="Marketing" price="$200" time="Hace 12 horas" />
                </tbody>
              </table>
            </div>
          </div>

          {/* --- SECCIÓN 3: ACTIVIDAD RECIENTE --- */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8">
            <h3 className="text-lg font-bold mb-1">Actividad reciente</h3>
            <p className="text-sm text-zinc-500 mb-6">Resumen de las últimas 24 horas</p>
            <div className="space-y-4">
              <ActivityItem label="Nuevos usuarios" value="+47" sub="Registrados hoy" color="text-emerald-500" icon={<Users size={18}/>} />
              <ActivityItem label="Servicios aprobados" value="+18" sub="Últimas 24h" color="text-emerald-500" icon={<Briefcase size={18}/>} />
              <ActivityItem label="Transacciones" value="156" sub="Completadas hoy" color="text-blue-500" icon={<Wallet size={18}/>} />
              <ActivityItem label="Reportes activos" value="8" sub="Requieren atención" color="text-orange-500" icon={<AlertCircle size={18}/>} />
            </div>
          </div>
        </div>

        {/* --- SECCIÓN 4: GESTIÓN DE USUARIOS --- */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Users size={20} className="text-emerald-500" /> Gestión de usuarios
                    </h3>
                    <p className="text-sm text-zinc-500">Administra los usuarios de la plataforma</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input type="text" placeholder="Buscar usuarios..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <button className="bg-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-700 transition-colors whitespace-nowrap">Ver todos →</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="text-xs text-zinc-500 border-b border-zinc-800">
                        <tr>
                            <th className="pb-4 font-medium px-2">Usuario</th>
                            <th className="pb-4 font-medium px-2 text-center">Rol</th>
                            <th className="pb-4 font-medium px-2 text-center">Estado</th>
                            <th className="pb-4 font-medium px-2 text-center">Registro</th>
                            <th className="pb-4 font-medium px-2">Actividad</th>
                            <th className="pb-4 font-medium px-2 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <UserRow name="Maria Garcia" email="maria@email.com" role="Freelancer" status="Activo" date="15 Abr 2026" amount="$3,450" count="5 servicios" />
                        <UserRow name="Juan Rodriguez" email="juan@email.com" role="Cliente" status="Activo" date="14 Abr 2026" amount="$1,200" count="8 pedidos" />
                        <UserRow name="Sofia Herrera" email="sofia@email.com" role="Freelancer" status="Pendiente" date="13 Abr 2026" amount="$0" count="0 servicios" />
                        <UserRow name="Diego Morales" email="diego@email.com" role="Cliente" status="Suspendido" date="10 Abr 2026" amount="$450" count="3 pedidos" />
                        <UserRow name="Valentina Lopez" email="valentina@email.com" role="Freelancer" status="Activo" date="8 Abr 2026" amount="$2,100" count="3 servicios" />
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTES HELPER ---

function StatCard({ title, value, trend, subText, icon, bgColor, isDown = false }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[28px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        <div className={`p-3 rounded-2xl ${bgColor}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold ${isDown ? 'text-red-500' : 'text-emerald-500'}`}>{trend}</span>
        <span className="text-[10px] text-zinc-600 font-medium uppercase">{subText}</span>
      </div>
    </div>
  );
}

function ModerationRow({ title, user, cat, price, time }: any) {
  return (
    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
          <div>
            <p className="font-bold text-xs group-hover:text-emerald-400 transition-colors">{title}</p>
            <p className="text-[10px] text-zinc-500">{user}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 text-center">
        <span className="bg-zinc-800 text-[10px] px-2 py-0.5 rounded-md text-zinc-400 border border-zinc-700">{cat}</span>
      </td>
      <td className="py-4 px-2 text-center font-bold text-xs">{price}</td>
      <td className="py-4 px-2 text-center text-zinc-500 text-[10px] whitespace-nowrap">{time}</td>
      <td className="py-4 px-2 text-right">
        <div className="flex justify-end gap-1">
          <button className="p-1.5 text-zinc-500 hover:text-white transition-colors"><Eye size={14}/></button>
          <button className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><Check size={14}/></button>
          <button className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><X size={14}/></button>
        </div>
      </td>
    </tr>
  );
}

function UserRow({ name, email, role, status, date, amount, count }: any) {
  const statusStyles: any = {
    'Activo': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'Pendiente': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'Suspendido': 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  return (
    <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
      <td className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700"></div>
          <div>
            <p className="font-bold text-zinc-100">{name}</p>
            <p className="text-[11px] text-zinc-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 text-center">
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${
          role === 'Freelancer' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 'text-blue-400 bg-blue-400/5 border-blue-400/20'
        }`}>
          {role}
        </span>
      </td>
      <td className="py-4 px-2 text-center">
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="py-4 px-2 text-center text-zinc-400 text-xs">{date}</td>
      <td className="py-4 px-2">
        <p className="font-bold text-zinc-100 text-xs">{amount}</p>
        <p className="text-[10px] text-zinc-500">{count}</p>
      </td>
      <td className="py-4 px-2 text-right">
        <button className="p-2 text-zinc-500 hover:text-white transition-colors">
          <MoreVertical size={18}/>
        </button>
      </td>
    </tr>
  );
}

function ActivityItem({ label, value, sub, color, icon }: any) {
  return (
    <div className="bg-zinc-900/60 p-4 rounded-2xl flex items-center justify-between border border-zinc-800/50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400">{icon}</div>
        <div>
          <p className="text-xs font-bold">{label}</p>
          <p className="text-[10px] text-zinc-500">{sub}</p>
        </div>
      </div>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}