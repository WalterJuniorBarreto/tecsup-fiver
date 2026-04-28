"use client";

import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  DollarSign, 
  Calendar,
  PieChart,
  TrendingUp,
  RefreshCcw,
  Globe,
  Plus
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-[#080808] text-white font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Reportes y Analíticas</h1>
            <p className="text-zinc-500 text-sm">Genera y descarga reportes de la plataforma</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/10">
            <Plus size={16} /> Crear reporte
          </button>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportStatCard label="Reportes generados" value="156" subtext="Este mes" />
          <ReportStatCard label="Descargas" value="89" subtext="Esta semana" />
          <ReportStatCard label="Programados" value="12" subtext="Activos" />
        </div>

        {/* Charts Section (Placeholders como en tu imagen) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[24px] p-6 min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold text-zinc-200">Ventas por categoría</h3>
            </div>
            <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl">
               <BarChart3 size={48} className="text-zinc-800 opacity-20" />
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[24px] p-6 min-h-[300px] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={18} className="text-sky-500" />
              <h3 className="text-sm font-bold text-zinc-200">Distribución de usuarios</h3>
            </div>
            <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl">
               <PieChart size={48} className="text-zinc-800 opacity-20" />
            </div>
          </div>
        </div>

        {/* Downloadable Reports Section */}
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-zinc-100">Reportes disponibles</h2>
            <p className="text-zinc-500 text-xs">Selecciona un reporte para generar o descargar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DownloadCard 
              title="Reporte de ventas mensual" 
              category="Finanzas" 
              date="2024-03-10" 
              icon={<DollarSign size={20} className="text-emerald-500" />}
            />
            <DownloadCard 
              title="Analisis de usuarios activos" 
              category="Usuarios" 
              date="2024-03-09" 
              icon={<Users size={20} className="text-sky-500" />}
            />
            <DownloadCard 
              title="Rendimiento de categorías" 
              category="Servicios" 
              date="2024-03-08" 
              icon={<FileText size={20} className="text-orange-500" />}
            />
            <DownloadCard 
              title="Tasa de conversion" 
              category="Marketing" 
              date="2024-03-07" 
              icon={<TrendingUp size={20} className="text-emerald-400" />}
            />
            <DownloadCard 
              title="Reporte de reembolsos" 
              category="Finanzas" 
              date="2024-03-06" 
              icon={<RefreshCcw size={20} className="text-red-400" />}
            />
            <DownloadCard 
              title="Distribucion geografica" 
              category="Usuarios" 
              date="2024-03-05" 
              icon={<Globe size={20} className="text-indigo-400" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* Sub-componente para las estadísticas superiores */
function ReportStatCard({ label, value, subtext }: { label: string, value: string, subtext: string }) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[24px] p-8 text-center hover:bg-zinc-900/50 transition-colors group cursor-default">
      <span className="text-4xl font-bold tracking-tighter text-white block mb-2">{value}</span>
      <p className="text-zinc-300 text-sm font-bold mb-1">{label}</p>
      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{subtext}</p>
    </div>
  );
}

/* Sub-componente para las tarjetas de descarga */
function DownloadCard({ title, category, date, icon }: { title: string, category: string, date: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-between hover:border-zinc-700 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-zinc-200 mb-1">{title}</h4>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
              {category}
            </span>
            <span className="text-[10px] text-zinc-600 font-medium flex items-center gap-1">
              Ultimo: {date}
            </span>
          </div>
        </div>
      </div>
      <button className="p-2 text-zinc-500 hover:text-white transition-colors">
        <Download size={18} />
      </button>
    </div>
  );
}