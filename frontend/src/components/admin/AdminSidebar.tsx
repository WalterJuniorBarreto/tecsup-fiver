"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Briefcase, ShieldCheck, 
  Wallet, BarChart3, AlertCircle, Settings, 
  Moon, LogOut
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 space-y-8 bg-[#0c0c0e] h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">DM</div>
        <div>
          <h1 className="font-bold text-lg leading-tight">DevMarket</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Admin Portal</p>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 space-y-1">
        <NavItem 
          href="/dashboard/admin" 
          icon={<LayoutDashboard size={20}/>} 
          label="Panel general" 
          active={pathname === '/dashboard/admin'} 
        />
        <NavItem 
          href="/dashboard/admin/users" 
          icon={<Users size={20}/>} 
          label="Usuarios" 
          active={pathname === '/dashboard/admin/users'} 
        />
        <NavItem 
          href="/dashboard/admin/services" 
          icon={<Briefcase size={20}/>} 
          label="Servicios" 
          active={pathname === '/dashboard/admin/services'} 
        />
        <NavItem 
          href="/dashboard/admin/moderation" 
          icon={<ShieldCheck size={20}/>} 
          label="Moderación" 
          badge="5" 
          active={pathname === '/dashboard/admin/moderation'} 
        />
        <NavItem 
          href="/dashboard/admin/finanzas" 
          icon={<Wallet size={20}/>} 
          label="Finanzas" 
          active={pathname === '/dashboard/admin/finanzas'} 
        />
        <NavItem 
          href="/dashboard/admin/reportes" 
          icon={<BarChart3 size={20}/>} 
          label="Reportes" 
          active={pathname === '/dashboard/admin/reports'} 
        />
        <NavItem 
          href="/dashboard/admin/disputas" 
          icon={<AlertCircle size={20}/>} 
          label="Disputas" 
          badge="3" 
          active={pathname === '/dashboard/admin/disputas'} 
        />
        <NavItem 
          href="/dashboard/admin/configuracion" 
          icon={<Settings size={20}/>} 
          label="Configuración" 
          active={pathname === '/dashboard/admin/configuracion'} 
        />
      </nav>

      {/* Estado del Sistema */}
      <div className="pt-6 border-t border-zinc-800 space-y-4">
        <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest px-3">Estado del Sistema</div>
        <div className="space-y-2 px-3">
          <SystemStat label="Usuarios activos" value="2,847" />
          <SystemStat label="Servicios hoy" value="24" />
          <SystemStat label="Ingresos hoy" value="$1,240" color="text-emerald-500" />
        </div>
      </div>

      {/* Perfil Admin */}
      <div className="bg-zinc-900/50 p-4 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">Administrador</p>
          <p className="text-xs text-zinc-500 truncate">admin@devmarket.com</p>
        </div>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <Moon size={16} />
        </button>
      </div>
    </aside>
  );
}

// --- Componentes Internos ---

function NavItem({ icon, label, href, active, badge }: any) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SystemStat({ label, value, color = "text-white" }: any) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="text-zinc-500">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}