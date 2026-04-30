"use client";

import React from 'react';
import { 
  Briefcase, CheckCircle2, Clock, AlertTriangle, 
  Search, ChevronDown, Star, Eye, Check, X
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export default function AdminServicesPage() {
  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h2>
          <p className="text-zinc-500 text-sm">Administra todos los servicios publicados en la plataforma</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <ServiceStatCard title="Total servicios" value="8" icon={<Briefcase className="text-cyan-400" />} />
          <ServiceStatCard title="Activos" value="5" icon={<CheckCircle2 className="text-emerald-400" />} />
          <ServiceStatCard title="Pendientes" value="2" icon={<Clock className="text-amber-400" />} />
          <ServiceStatCard title="Reportados" value="1" icon={<AlertTriangle className="text-red-400" />} />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar servicio o vendedor..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all" 
            />
          </div>
          
          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex items-center justify-between gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 min-w-[120px]">
              Todas <ChevronDown size={16} className="text-zinc-500" />
            </button>
            <button className="flex items-center justify-between gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 min-w-[120px]">
              Todos <ChevronDown size={16} className="text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ServiceCard 
            image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop"
            title="Desarrollo Web Full Stack"
            author="Carlos R."
            category="Programacion"
            price="500"
            rating="4.9"
            orders="45"
            status="Activo"
          />
          <ServiceCard 
            image="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&h=300&fit=crop"
            title="Diseño de Logos Profesional"
            author="Maria G."
            category="Diseño"
            price="150"
            rating="4.8"
            orders="120"
            status="Activo"
          />
          <ServiceCard 
            image="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&h=300&fit=crop"
            title="Edición de Video 4K"
            author="Pedro L."
            category="Video"
            price="300"
            rating="N/A"
            orders="0"
            status="Pendiente"
            isModeration
          />
          <ServiceCard 
            image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop"
            title="Traduccion EN-ES"
            author="Ana M."
            category="Escritura"
            price="50"
            rating="5"
            orders="89"
            status="Activo"
          />
          <ServiceCard 
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
            title="SEO y Marketing Digital"
            author="Sofia T."
            category="Marketing"
            price="400"
            rating="4.2"
            orders="23"
            status="Reportado"
          />
          <ServiceCard 
            image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop"
            title="Desarrollo de Apps Moviles"
            author="Juan P."
            category="Programacion"
            price="800"
            rating="4.7"
            orders="34"
            status="Activo"
          />
        </div>
      </main>
    </div>
  );
}


function ServiceStatCard({ title, value, icon }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[24px] flex items-center gap-5">
      <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div>
        <p className="text-zinc-500 text-xs font-medium mb-0.5">{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
      </div>
    </div>
  );
}

function ServiceCard({ image, title, author, category, price, rating, orders, status, isModeration }: any) {
  const statusColors: any = {
    'Activo': 'bg-emerald-500 text-white',
    'Pendiente': 'bg-amber-500 text-white',
    'Reportado': 'bg-red-500 text-white'
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-[24px] overflow-hidden group hover:border-zinc-700 transition-all flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-zinc-500 text-xs">por {author}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-3 py-1 rounded-lg border border-zinc-700">
            {category}
          </span>
          <span className="text-emerald-500 font-bold text-lg">${price}</span>
        </div>

        <div className="flex items-center justify-between text-zinc-500 text-xs mb-6">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-zinc-200 font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUpIcon />
            <span>{orders} pedidos</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 py-2.5 rounded-xl text-xs font-bold transition-colors">
            <Eye size={14} /> Ver
          </button>
          
          {isModeration && (
            <div className="flex gap-2">
              <button className="p-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded-xl transition-all">
                <Check size={18} />
              </button>
              <button className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );
}