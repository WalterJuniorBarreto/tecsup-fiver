"use client";

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ShieldAlert,
  X,
  Check,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

export default function CentroDisputas() {
  const [activeTab, setActiveTab] = useState<'activas' | 'historial'>('activas');
  const [selectedId, setSelectedId] = useState<string | null>("DIS001");
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [resolutionType, setResolutionType] = useState('Reembolso total');

  // Datos exactos de tus capturas
  const [disputas, setDisputas] = useState([
    {
      id: "DIS001",
      title: "Trabajo no entregado",
      category: "Desarrollo Web",
      amount: "$500",
      status: "Abierta",
      priority: "Alta",
      comprador: "Maria Garcia",
      vendedor: "Juan Perez",
      descripcion: "El vendedor no entrego el trabajo en el plazo acordado y no responde mensajes."
    },
    {
      id: "DIS002",
      title: "Calidad no satisfactoria",
      category: "Diseño de Logo",
      amount: "$150",
      status: "En revision",
      priority: "Media",
      comprador: "Carlos R.",
      vendedor: "Ana M.",
      descripcion: "El diseño entregado no coincide con las referencias enviadas inicialmente."
    },
    {
        id: "DIS003",
        title: "Solicitud de reembolso",
        category: "SEO Audit",
        amount: "$300",
        status: "Abierta",
        priority: "Baja",
        comprador: "Pedro L.",
        vendedor: "Sofia T.",
        descripcion: "Solicito reembolso porque el servicio no cumplió con las expectativas técnicas."
      }
  ]);

  const [historial, setHistorial] = useState([
    {
      id: "DIS002",
      title: "Calidad no satisfactoria",
      participants: "Carlos R. vs Ana M.",
      category: "Diseño de Logo",
      amount: "$150",
      date: "27 abr 2026, 18:55",
      resolvedBy: "Admin",
      type: "Reembolso total",
      note: "xd"
    },
    {
      id: "DIS001",
      title: "Trabajo no entregado",
      participants: "Maria Garcia vs Juan Perez",
      category: "Desarrollo Web",
      amount: "$500",
      date: "27 abr 2026, 18:54",
      resolvedBy: "Admin",
      type: "Reembolso total",
      note: "xd"
    }
  ]);

  const disputaSeleccionada = disputas.find(d => d.id === selectedId);

  return (
    <div className="flex min-h-screen bg-[#080808] text-white font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Centro de Disputas</h1>
          <p className="text-zinc-500 text-sm">Gestiona y resuelve conflictos entre usuarios</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Disputas abiertas" value="2" icon={<AlertTriangle size={20} className="text-amber-500" />} />
          <StatCard label="En revision" value="1" icon={<Clock size={20} className="text-sky-500" />} />
          <StatCard label="Resueltas este mes" value="18" icon={<CheckCircle2 size={20} className="text-emerald-500" />} />
          <StatCard label="Monto en disputa" value="$950" icon={<DollarSign size={20} className="text-rose-500" />} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-zinc-900/40 w-fit rounded-xl border border-zinc-800/50">
          <button 
            onClick={() => setActiveTab('activas')}
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${activeTab === 'activas' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
          >
            <ShieldAlert size={14} /> Activas <span className="bg-zinc-700/50 px-1.5 py-0.5 rounded text-[10px]">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`px-4 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${activeTab === 'historial' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
          >
            <Clock size={14} /> Historial <span className="bg-zinc-700/50 px-1.5 py-0.5 rounded text-[10px]">2</span>
          </button>
        </div>

        {activeTab === 'activas' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Lista Activas */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 mb-4">Disputas activas</h3>
              {disputas.map((d) => (
                <div 
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className={`p-5 rounded-[20px] border transition-all cursor-pointer ${selectedId === d.id ? 'bg-[#0c0c0e] border-emerald-500/40' : 'bg-[#0c0c0e] border-zinc-800/50 hover:border-zinc-700'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] font-mono text-zinc-600">{d.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${d.priority === 'Alta' ? 'bg-rose-500/10 text-rose-500' : d.priority === 'Media' ? 'bg-sky-500/10 text-sky-500' : 'bg-zinc-500/10 text-zinc-500'}`}>
                        {d.priority}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{d.amount}</span>
                  </div>
                  <h4 className="font-bold text-zinc-200 mb-1">{d.title}</h4>
                  <p className="text-xs text-zinc-500 mb-4">{d.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-zinc-400">{d.comprador} → {d.vendedor}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-bold ${d.status === 'Abierta' ? 'border-amber-500/30 text-amber-500' : 'border-sky-500/30 text-sky-500'}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detalle Activa */}
            <div className="lg:col-span-3">
              <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[24px] p-8 min-h-[500px]">
                {disputaSeleccionada ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-zinc-600 mb-2 block">{disputaSeleccionada.id}</span>
                        <h2 className="text-2xl font-bold">{disputaSeleccionada.title}</h2>
                        <p className="text-sm text-zinc-500">Servicio: {disputaSeleccionada.category}</p>
                      </div>
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-bold px-3 py-1 rounded-full border border-rose-500/20">Prioridad alta</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">MG</div>
                        <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Comprador</p>
                          <p className="text-sm font-bold">{disputaSeleccionada.comprador}</p>
                        </div>
                      </div>
                      <div className="bg-zinc-900/30 border border-zinc-800/50 p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">JP</div>
                        <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Vendedor</p>
                          <p className="text-sm font-bold">{disputaSeleccionada.vendedor}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-zinc-500 uppercase">Descripcion del problema</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">{disputaSeleccionada.descripcion}</p>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl flex justify-between items-center">
                      <span className="text-zinc-500 text-sm">Monto en disputa</span>
                      <span className="text-3xl font-bold">{disputaSeleccionada.amount}</span>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                        <MessageSquare size={16} /> Ver chat
                      </button>
                      <button 
                        onClick={() => setIsResolveModalOpen(true)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Resolver
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                    <AlertTriangle size={40} className="opacity-20" />
                    <p className="text-sm">Selecciona una disputa para ver los detalles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VISTA HISTORIAL (Full Width) */
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[24px] p-8">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="text-zinc-500" size={20} />
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Historial de resoluciones</h3>
                  <p className="text-xs text-zinc-500">Disputas resueltas recientemente</p>
                </div>
              </div>

              <div className="space-y-4">
                {historial.map((item) => (
                  <div key={item.id} className="bg-zinc-900/20 border border-zinc-800/50 rounded-[20px] p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-zinc-600">{item.id}</span>
                          <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-emerald-500/20">
                            <Check size={10} strokeWidth={3} /> Resuelta
                          </span>
                          <span className="bg-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-md font-bold">
                            {item.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-zinc-100">{item.title}</h4>
                        <p className="text-xs text-zinc-500 font-medium">{item.participants} - {item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white mb-1">{item.amount}</p>
                        <p className="text-[10px] text-zinc-600">{item.date}</p>
                        <p className="text-[10px] text-zinc-600">por {item.resolvedBy}</p>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 border border-zinc-800/50 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2 tracking-widest">Nota de resolucion:</p>
                      <p className="text-sm text-zinc-400 font-mono italic">"{item.note}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL RESOLVER */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-md rounded-[28px] overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white tracking-tight">Resolver disputa</h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="px-6 pb-8 space-y-6">
              <p className="text-xs text-zinc-500 -mt-4">Indica la resolucion de esta disputa. Ambas partes seran notificadas.</p>
              
              <div className="flex gap-2 p-1 bg-zinc-950 border border-zinc-900 rounded-xl">
                {['Reembolso total', 'Reembolso parcial', 'Sin reembolso'].map((t) => (
                  <button key={t} onClick={() => setResolutionType(t)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${resolutionType === t ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <textarea 
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-sm text-zinc-300 min-h-[100px] focus:outline-none focus:border-emerald-500/50" 
                placeholder="Escribe el motivo..."
                defaultValue="xd"
              />

              <div className="flex gap-3">
                <button onClick={() => setIsResolveModalOpen(false)} className="flex-1 bg-zinc-900 py-3 rounded-xl font-bold text-xs">Cancelar</button>
                <button onClick={() => {setIsResolveModalOpen(false); setIsConfirmModalOpen(true);}} className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-bold text-xs">Continuar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACION */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0c0c0e] border border-zinc-800 w-full max-w-md rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-zinc-100 mb-2">Confirmar resolucion</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Revisa los detalles antes de confirmar. Esta accion no se puede deshacer.</p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-zinc-900/40 border border-zinc-800/60 rounded-[24px] p-6 mb-6">
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block">Disputa</span>
                <span className="text-sm font-bold text-zinc-200">{disputaSeleccionada?.id}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block">Monto</span>
                <span className="text-sm font-bold text-zinc-200">{disputaSeleccionada?.amount}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block">Comprador</span>
                <span className="text-sm font-bold text-zinc-200">{disputaSeleccionada?.comprador}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block">Vendedor</span>
                <span className="text-sm font-bold text-zinc-200">{disputaSeleccionada?.vendedor}</span>
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[24px] p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-zinc-200">Resolucion aplicada</span>
              </div>
              <span className="bg-emerald-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block mb-3">
                {resolutionType}
              </span>
              <p className="text-sm text-zinc-500 italic font-medium">"xd"</p>
            </div>

            <div className="space-y-2 mb-8">
               <li className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                  <div className="w-1 h-1 rounded-full bg-zinc-700" /> Se enviara notificacion por email a ambas partes
               </li>
               <li className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                  <div className="w-1 h-1 rounded-full bg-zinc-700" /> Se procesara el reembolso correspondiente
               </li>
               <li className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                  <div className="w-1 h-1 rounded-full bg-zinc-700" /> La disputa se marcara como resuelta
               </li>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsConfirmModalOpen(false)} className="flex-1 bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl font-bold text-xs text-zinc-400">Volver</button>
              <button onClick={() => setIsConfirmModalOpen(false)} className="flex-[2] bg-emerald-500 text-black py-3.5 rounded-2xl font-bold text-xs">Confirmar y resolver</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-[20px] p-6 flex items-start justify-between">
      <div>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
        <span className="text-2xl font-bold text-white block">{value}</span>
      </div>
      <div className="bg-zinc-900 p-2.5 rounded-xl border border-white/5">{icon}</div>
    </div>
  );
}