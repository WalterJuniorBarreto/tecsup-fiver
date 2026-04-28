"use client";

import React, { useState } from 'react';
import { 
  Clock, Flag, CheckCircle2, Filter, Check, X, Star, 
  Globe, AlertTriangle, Trash2, MessageSquare, AlertCircle, 
  ShieldCheck, Briefcase, User, ChevronRight, Ban, Info, Mail
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

const INITIAL_SERVICES = [
  {
    id: 1,
    title: "Desarrollo de E-commerce",
    author: "Carlos Rodriguez",
    category: "Programacion",
    price: "$1,200",
    time: "Hace 2 horas",
    status: "pending",
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"],
    description: "Desarrollo completo de aplicaciones web modernas utilizando Next.js y Tailwind CSS."
  }
];

const INITIAL_REPORTS = [
  { id: 101, title: "Servicio sospechoso", user: "Usuario123", tag: "Contenido duplicado", time: "Hace 3 horas", icon: <Briefcase size={20}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 102, title: "Comportamiento inapropiado", user: "Maria G.", tag: "Spam en mensajes", time: "Hace 6 horas", icon: <User size={20}/>, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: 103, title: "Reseña falsa", user: "Carlos R.", tag: "Compra no verificada", time: "Hace 1 día", icon: <MessageSquare size={20}/>, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function ModerationPage() {
  const [view, setView] = useState<'pending' | 'reported'>('pending');
  // Cambio: Ahora los servicios son un estado dinámico
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(INITIAL_SERVICES[0]?.id || null);
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({
    show: false, message: '', type: 'success'
  });

  // Filtramos los servicios que aún están en estado pendiente
  const filteredServices = services.filter(s => s.status === 'pending');
  // Buscamos el detalle basado en el ID seleccionado
  const serviceDetail = services.find(s => s.id === selectedServiceId) || filteredServices[0];

  const handleAction = (message: string, type: 'success' | 'error') => {
    // Si estamos en la vista de reportes, eliminamos el reporte
    if (view === 'reported' && selectedReport) {
        setReports(prev => prev.filter(r => r.id !== selectedReport.id));
    } 
    // Si estamos en la vista de pendientes, eliminamos el servicio de la lista (o lo marcamos como procesado)
    else if (view === 'pending' && selectedServiceId) {
        setServices(prev => prev.filter(s => s.id !== selectedServiceId));
        // Resetear la selección al primer elemento disponible
        const remaining = filteredServices.filter(s => s.id !== selectedServiceId);
        setSelectedServiceId(remaining.length > 0 ? remaining[0].id : null);
    }

    setToast({ show: true, message, type });
    setIsRejectModalOpen(false);
    setIsReviewModalOpen(false);
    setRejectionReason("");
    setSelectedAction(null);
    setSelectedReport(null);
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const handleDiscard = (reportId: number) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    setToast({ show: true, message: "Reporte descartado", type: 'success' });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto relative">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Centro de Moderación</h1>
            <p className="text-zinc-500 text-sm">Gestiona la integridad de la plataforma</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Pendientes" value={filteredServices.length.toString()} icon={<Clock className="text-orange-500" size={24} />} borderColor="border-l-orange-500" />
          <StatCard label="Reportados" value={reports.length.toString()} icon={<Flag className="text-red-500" size={24} />} borderColor="border-l-red-500" />
          <StatCard label="Aprobados" value="24" icon={<CheckCircle2 className="text-emerald-500" size={24} />} borderColor="border-l-emerald-500" />
        </div>

        <div className="flex gap-3 bg-[#0c0c0e] p-1.5 rounded-2xl w-fit border border-zinc-800/50 shadow-inner">
          <button 
            onClick={() => setView('pending')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'pending' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Clock size={14} /> Pendientes <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${view === 'pending' ? 'bg-emerald-500 text-black font-bold' : 'bg-zinc-800'}`}>{filteredServices.length}</span>
          </button>
          <button 
            onClick={() => setView('reported')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'reported' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Flag size={14} /> Reportados <span className="ml-1 px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">{reports.length}</span>
          </button>
        </div>

        {view === 'pending' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-500">
            {filteredServices.length > 0 ? (
              <>
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6 px-2">
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cola de revisión</h2>
                      <Filter size={16} className="text-zinc-600" />
                    </div>
                    <div className="space-y-3">
                      {filteredServices.map((service) => (
                        <div 
                          key={service.id}
                          onClick={() => setSelectedServiceId(service.id)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                            selectedServiceId === service.id 
                              ? 'bg-emerald-500/5 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                              : 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <h3 className="text-sm font-bold truncate pr-4 text-zinc-200">{service.title}</h3>
                          </div>
                          <p className="text-[11px] text-zinc-500 mb-4 tracking-tight">{service.author}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md bg-zinc-800 text-zinc-400">
                              {service.category}
                            </span>
                            <span className="text-emerald-500 text-xs font-black tracking-tight">{service.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl relative">
                    <div className="aspect-[21/9] w-full bg-zinc-900 relative">
                      <img src={serviceDetail.images[0]} className="w-full h-full object-cover opacity-40" alt="Cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-10">
                        <div className="flex gap-2 mb-3">
                          <span className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{serviceDetail.category}</span>
                        </div>
                        <h3 className="text-4xl font-bold tracking-tighter leading-none text-zinc-100">{serviceDetail.title}</h3>
                      </div>
                    </div>

                    <div className="p-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-10">
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.25em] mb-4 px-1">Descripción detallada</h4>
                            <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6">
                              <p className="text-zinc-400 text-sm leading-relaxed">{serviceDetail.description}</p>
                            </div>
                          </div>
                          
                          <div className="pt-8 border-t border-zinc-800/50">
                            <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.25em] mb-4 px-1">Resolución final</h4>
                            <div className="flex gap-4">
                              <button onClick={() => setIsRejectModalOpen(true)} className="flex-1 py-4 bg-zinc-900 border border-zinc-800 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/10 transition-all">Rechazar</button>
                              <button onClick={() => handleAction("Servicio aprobado con éxito", "success")} className="flex-[2] py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 transition-all">Aprobar servicio</button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[28px] p-6 space-y-6 self-start">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-500 text-xl">{serviceDetail.author[0]}</div>
                            <div>
                              <p className="text-sm font-bold text-zinc-200">{serviceDetail.author}</p>
                              <p className="text-[9px] text-zinc-600 font-black tracking-widest uppercase">Vendedor</p>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-zinc-800/50 space-y-4">
                            <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Precio</span><span className="text-emerald-500 font-black">{serviceDetail.price}</span></div>
                            <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Ubicación</span><span className="text-zinc-300 font-medium">España</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="col-span-12 py-20 text-center">
                <p className="text-zinc-500 text-sm">No hay servicios pendientes de aprobación.</p>
              </div>
            )}
          </div>
        ) : (
          /* ... Resto del código de Reportados (sin cambios) ... */
          <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] p-8 shadow-xl animate-in fade-in duration-500">
             {/* ... (Contenido de reportados igual al original) ... */}
             <div className="mb-8 px-2 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-zinc-100 leading-tight">Contenido reportado</h2>
                <p className="text-zinc-500 text-sm">Revisa los reportes de la comunidad</p>
              </div>
              <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
                <Filter size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-6 rounded-[24px] bg-zinc-900/20 border border-zinc-800/60 hover:bg-zinc-900/40 hover:border-zinc-700 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl ${report.bg} border border-white/5 flex items-center justify-center ${report.color} shadow-inner`}>
                      {report.icon}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-zinc-200 text-base">{report.title}</h3>
                      <p className="text-xs text-zinc-500">
                        Reportado por: <span className="text-zinc-400 font-medium underline underline-offset-4 decoration-zinc-800">{report.user}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-black text-zinc-500 uppercase tracking-tighter border border-zinc-700/50">
                          {report.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <span className="text-xs text-zinc-600 font-bold uppercase tracking-widest">{report.time}</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDiscard(report.id)}
                        className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all"
                      >
                        Descartar
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedReport(report);
                          setIsReviewModalOpen(true);
                        }}
                        className="px-6 py-3 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
                      >
                        Revisar <ChevronRight size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-zinc-500 text-sm">No hay reportes pendientes de revisión.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ... (Modales y Toasts se mantienen igual) ... */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsReviewModalOpen(false)} />
            <div className="relative bg-[#0c0c0e] border border-zinc-800 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-8 border-b border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Revisar reporte</h3>
                    <p className="text-zinc-500 text-xs">Analiza la infracción y toma una medida correctiva</p>
                  </div>
                </div>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      <Info size={12} /> Detalles del reporte
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">ID Reporte:</span> <span className="text-zinc-200 font-mono">#{selectedReport?.id}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">Motivo:</span> <span className="text-red-400 font-bold">{selectedReport?.tag}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">Informante:</span> <span className="text-zinc-200 underline">{selectedReport?.user}</span></div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                      <Clock size={12} /> Historial del Usuario
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">Reportes previos:</span> <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">0</span></div>
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">Advertencias:</span> <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">0</span></div>
                      <div className="flex justify-between text-xs"><span className="text-zinc-500">Estado cuenta:</span> <span className="text-emerald-500 font-bold">Limpia</span></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest px-1">Seleccionar acción disciplinaria</h4>
                  {[
                    { id: 'discard', label: 'Descartar reporte', desc: 'No se encontró infracción. Cerrar caso.', icon: <CheckCircle2 size={18}/>, color: 'text-zinc-400' },
                    { id: 'warn', label: 'Enviar advertencia', desc: 'Notificar al usuario sobre la conducta.', icon: <Mail size={18}/>, color: 'text-orange-400' },
                    { id: 'suspend', label: 'Suspender contenido', desc: 'Ocultar servicio hasta que sea corregido.', icon: <AlertCircle size={18}/>, color: 'text-orange-600' },
                    { id: 'delete', label: 'Eliminar permanentemente', desc: 'Remover el contenido de la base de datos.', icon: <Trash2 size={18}/>, color: 'text-red-500' },
                    { id: 'ban', label: 'Baneo de usuario', desc: 'Restringir acceso total a la plataforma.', icon: <Ban size={18}/>, color: 'text-red-700' },
                  ].map((action) => (
                    <label 
                      key={action.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAction === action.id 
                          ? 'bg-emerald-500/5 border-emerald-500/50 ring-1 ring-emerald-500/20' 
                          : 'bg-zinc-950 border-zinc-800/60 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedAction === action.id ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-zinc-700'
                        }`}>
                          {selectedAction === action.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                        </div>
                        <div className={`p-2 rounded-xl bg-zinc-900 ${action.color}`}>
                          {action.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-100">{action.label}</p>
                          <p className="text-[10px] text-zinc-500 font-medium">{action.desc}</p>
                        </div>
                      </div>
                      <input 
                        type="radio" 
                        name="moderationAction" 
                        className="hidden" 
                        onChange={() => setSelectedAction(action.id)} 
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase text-zinc-400 tracking-widest px-1">Justificación del moderador</h4>
                  <textarea 
                    placeholder="Escribe el motivo de la decisión para el registro interno..."
                    className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/40 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-zinc-900/30 border-t border-zinc-800/50 flex gap-4">
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!selectedAction}
                  onClick={() => handleAction("Resolución aplicada con éxito", "success")}
                  className="flex-[2] py-4 bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Confirmar y aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)} />
            <div className="relative bg-[#0c0c0e] border border-zinc-800 w-full max-w-lg rounded-[40px] p-12 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[28px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8">
                  <AlertTriangle size={40} />
                </div>
                <h3 className="text-2xl font-black mb-3 text-white uppercase">¿Confirmar rechazo?</h3>
                <p className="text-zinc-500 text-sm mb-8 px-4">Explica el motivo para notificar al autor.</p>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Motivo del rechazo..."
                  className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 text-sm text-zinc-300 focus:outline-none focus:border-red-500/50 transition-all resize-none mb-8"
                />
                <button onClick={() => handleAction("Servicio rechazado", "error")} className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em]">Confirmar decisión</button>
                <button onClick={() => setIsRejectModalOpen(false)} className="w-full py-4 text-zinc-600 font-black uppercase text-[10px] mt-2">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {toast.show && (
          <div className="fixed bottom-10 right-10 z-[120] animate-in slide-in-from-right-full fade-in duration-500">
            <div className={`flex items-center gap-4 px-8 py-5 rounded-[28px] border shadow-2xl backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                {toast.type === 'success' ? <Check size={14} className="text-black" strokeWidth={4} /> : <X size={14} className="text-white" strokeWidth={4} />}
              </div>
              <p className="text-sm font-black tracking-widest uppercase">{toast.message}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, borderColor }: any) {
  return (
    <div className={`bg-[#0c0c0e] p-7 rounded-[32px] border border-zinc-800 border-l-4 ${borderColor} flex justify-between items-center transition-all hover:bg-zinc-900/50 shadow-sm`}>
      <div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
        <span className="text-4xl font-bold tracking-tighter">{value}</span>
      </div>
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-inner">{icon}</div>
    </div>
  );
}