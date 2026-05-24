"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, User, Briefcase, CheckCircle2, 
  XCircle, Loader2, AlertTriangle, Eye, Clock
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { adminService } from '../../../../services/admin.service';
import Link from 'next/link';

export default function AdminModerationPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  
  const [filter, setFilter] = useState<'PENDING' | 'RESOLVED' | 'DISMISSED' | 'ALL'>('PENDING');

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getReports(filter);
      setReports(data);
    } catch (error) {
      console.error("Error cargando reportes:", error);
      showToast('Error al cargar la cola de moderación', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'RESOLVED' | 'DISMISSED') => {
    try {
      setIsProcessing(id);
      await adminService.updateReportStatus(id, newStatus);
      showToast(newStatus === 'RESOLVED' ? 'Reporte marcado como RESUELTO' : 'Reporte DESCARTADO', 'success');
      loadReports();
    } catch (error) {
      showToast('Error al actualizar el reporte', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00e676]/30">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-10 ml-64 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Centro de Moderación</h2>
            <p className="text-zinc-500 text-sm">Gestiona la integridad de la plataforma revisando los reportes de los usuarios.</p>
          </div>
        </header>

        <div className="flex items-center gap-2 mb-8 bg-[#121214] border border-zinc-800/80 p-2 rounded-2xl w-fit">
          <button 
            onClick={() => setFilter('PENDING')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'PENDING' ? 'bg-[#00e676] text-black shadow-lg shadow-[#00e676]/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Pendientes
          </button>
          <button 
            onClick={() => setFilter('RESOLVED')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'RESOLVED' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Resueltos
          </button>
          <button 
            onClick={() => setFilter('DISMISSED')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'DISMISSED' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Descartados
          </button>
        </div>

        {/* LISTA DE REPORTES */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-[#00e676] animate-spin" /></div>
        ) : reports.length === 0 ? (
          <div className="bg-[#121214] border border-dashed border-zinc-800 rounded-[2rem] p-20 text-center flex flex-col items-center">
            <ShieldAlert size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">Todo en orden, Jefe</h3>
            <p className="text-zinc-600 text-sm mt-2">No hay reportes {filter === 'PENDING' ? 'pendientes por revisar' : 'en esta categoría'}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row gap-8 shadow-lg hover:border-zinc-700 transition-all">
                
                <div className="w-full lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800/80 pb-6 lg:pb-0 lg:pr-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        report.type === 'SERVICE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {report.type === 'SERVICE' ? <Briefcase size={12} /> : <User size={12} />}
                        Reporte de {report.type === 'SERVICE' ? 'Servicio' : 'Usuario'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {report.targetInfo?.title || report.targetInfo?.name || 'Recurso eliminado'}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-4">
                      {report.type === 'SERVICE' ? 'Vendedor: ' : 'Rol: '} 
                      <span className="text-zinc-300 font-medium">{report.targetInfo?.owner || report.targetInfo?.role}</span>
                    </p>
                  </div>
                  
                  {report.type === 'SERVICE' && report.targetInfo?.id && (
                    <Link 
                      href={`/explore/${report.targetInfo.id}`} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#00e676] hover:text-[#00c853] transition-colors bg-[#00e676]/10 py-2 px-4 rounded-xl w-fit"
                    >
                      <Eye size={14} /> Inspeccionar Servicio
                    </Link>
                  )}
                  {report.type === 'USER' && report.targetInfo?.id && (
                    <Link 
                      href={`/freelancer/${report.targetInfo.id}`} 
                      target="_blank"
                      className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 py-2 px-4 rounded-xl w-fit"
                    >
                      <Eye size={14} /> Inspeccionar Usuario
                    </Link>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-zinc-500 font-medium flex items-center gap-2">
                      <AlertTriangle size={14} className="text-red-500" />
                      Reportado por <span className="font-bold text-zinc-300">{report.reporterName}</span>
                    </p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase flex items-center gap-1"><Clock size={12}/> {new Date(report.date).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 mb-6 flex-1">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      "{report.reason}"
                    </p>
                  </div>

                  {filter === 'PENDING' ? (
                    <div className="flex gap-3 justify-end mt-auto">
                      <button 
                        disabled={isProcessing === report.id}
                        onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors text-zinc-400 flex items-center gap-2 disabled:opacity-50"
                      >
                        {isProcessing === report.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                        Descartar (Falsa Alarma)
                      </button>
                      <button 
                        disabled={isProcessing === report.id}
                        onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                        className="px-5 py-2.5 rounded-xl text-xs font-black text-black bg-[#00e676] hover:bg-[#00c853] transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#00e676]/20"
                      >
                        {isProcessing === report.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Marcar como Resuelto
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end mt-auto">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                        report.status === 'RESOLVED' ? 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}>
                        {report.status === 'RESOLVED' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {report.status === 'RESOLVED' ? 'Reporte Resuelto' : 'Reporte Descartado'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border bg-[#121214] ${toast.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-[#00e676] border-[#00e676]/30'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}