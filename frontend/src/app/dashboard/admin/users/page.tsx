"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, UserMinus, 
  Search, MoreVertical, Download, 
  Eye, Mail, Ban, Trash2, ChevronDown
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export default function AdminUsersPage() {
  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h2>
            <p className="text-zinc-500 text-sm">Administra todos los usuarios de la plataforma</p>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition-all">
            <Download size={18} /> Exportar CSV
          </button>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <UserStatCard title="Total usuarios" value="12,847" icon={<Users className="text-blue-400" />} bgColor="bg-blue-500/10" />
          <UserStatCard title="Usuarios activos" value="10,234" icon={<UserCheck className="text-emerald-400" />} bgColor="bg-emerald-500/10" />
          <UserStatCard title="Suspendidos" value="156" icon={<UserX className="text-red-400" />} bgColor="bg-red-500/10" />
          <UserStatCard title="Pendientes" value="89" icon={<UserMinus className="text-amber-400" />} bgColor="bg-amber-500/10" />
        </div>

        {/* TABLA */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[32px] p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <h3 className="text-xl font-bold">Usuarios registrados</h3>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o email..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all" 
                />
              </div>
              <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900">
                Todos los roles <ChevronDown size={16} />
              </button>
              <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-900">
                Todos <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-zinc-500 text-xs font-bold uppercase tracking-wider px-4">
                  <th className="pb-4 pl-4">Usuario</th>
                  <th className="pb-4 text-center">Rol</th>
                  <th className="pb-4 text-center">Estado</th>
                  <th className="pb-4 text-center">Servicios</th>
                  <th className="pb-4 text-center">Ganancias</th>
                  <th className="pb-4 text-center">Registro</th>
                  <th className="pb-4 text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <UserDetailRow id={1} name="Carlos Rodriguez" email="carlos@email.com" role="Freelancer" status="Activo" services="5" earnings="$2,450" date="2024-01-15" initial="CR" color="bg-cyan-500" />
                <UserDetailRow id={2} name="Maria Garcia" email="maria@email.com" role="Cliente" status="Activo" services="0" earnings="$0" date="2024-02-20" initial="MG" color="bg-emerald-500" />
                <UserDetailRow id={3} name="Juan Perez" email="juan@email.com" role="Freelancer" status="Suspendido" services="3" earnings="$890" date="2024-01-10" initial="JP" color="bg-blue-600" />
                <UserDetailRow id={4} name="Ana Martinez" email="ana@email.com" role="Cliente" status="Activo" services="0" earnings="$0" date="2024-03-01" initial="AM" color="bg-teal-500" />
                <UserDetailRow id={5} name="Pedro Lopez" email="pedro@email.com" role="Freelancer" status="Activo" services="8" earnings="$5,200" date="2023-11-05" initial="PL" color="bg-sky-500" />
                <UserDetailRow id={6} name="Laura Sanchez" email="laura@email.com" role="Freelancer" status="Pendiente" services="0" earnings="$0" date="2024-03-10" initial="LS" color="bg-indigo-500" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserStatCard({ title, value, icon, bgColor }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[28px] flex items-center gap-6">
      <div className={`p-4 rounded-2xl ${bgColor}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
      </div>
    </div>
  );
}

function UserDetailRow({ id, name, email, role, status, services, earnings, date, initial, color }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusStyles: any = {
    'Activo': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    'Pendiente': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'Suspendido': 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  return (
    <tr className="bg-zinc-900/20 hover:bg-zinc-800/40 transition-all group">
      <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-transparent group-hover:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold text-xs text-white uppercase`}>
            {initial}
          </div>
          <div>
            <p className="font-bold text-zinc-100">{name}</p>
            <p className="text-xs text-zinc-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 text-center border-y border-transparent group-hover:border-zinc-800">
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${
          role === 'Freelancer' ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 'text-blue-400 bg-blue-400/5 border-blue-400/20'
        }`}>
          {role}
        </span>
      </td>
      <td className="py-4 text-center border-y border-transparent group-hover:border-zinc-800">
        <span className={`text-[10px] px-3 py-1 rounded-full font-bold border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="py-4 text-center font-medium text-zinc-300 border-y border-transparent group-hover:border-zinc-800">{services}</td>
      <td className="py-4 text-center font-bold text-zinc-100 border-y border-transparent group-hover:border-zinc-800">{earnings}</td>
      <td className="py-4 text-center text-zinc-500 text-xs border-y border-transparent group-hover:border-zinc-800">{date}</td>
      
      {/* CELDA DE ACCIONES CON LÓGICA DE CLICK */}
      <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-zinc-800 relative">
        <div ref={menuRef} className="relative inline-block text-left">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
          >
            <MoreVertical size={20}/>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#121214] border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] p-1.5 animate-in fade-in zoom-in duration-150 origin-top-right">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-zinc-800 rounded-lg transition-colors text-zinc-300 hover:text-white">
                <Eye size={14}/> Ver perfil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-zinc-800 rounded-lg transition-colors text-zinc-300 hover:text-white">
                <Mail size={14}/> Enviar mensaje
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors">
                <Ban size={14}/> Suspender
              </button>
              <div className="h-[1px] bg-zinc-800/50 my-1 mx-1"></div>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                <Trash2 size={14}/> Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}