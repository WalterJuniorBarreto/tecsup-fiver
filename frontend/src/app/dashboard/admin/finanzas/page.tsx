"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, Download, 
  Search, Loader2, Calendar as CalendarIcon, CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { adminService } from '../../../../services/admin.service';

export default function AdminFinancesPage() {
  const [finances, setFinances] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadFinances = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getFinances();
        setFinances(data);
      } catch (error) {
        console.error("Error cargando finanzas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFinances();
  }, []);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PEN' }).format(amount).replace('PEN', 'S/');
  };

  if (isLoading || !finances) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <AdminSidebar />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#00e676] animate-spin mb-4" />
          {!isLoading && !finances && (
            <p className="text-red-400 font-bold">Error: No se pudieron cargar las finanzas.</p>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00e676]/30 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-10 ml-64 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto w-full">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tight mb-2">Finanzas</h2>
              <p className="text-zinc-500 text-sm">Resumen financiero y ganancias netas de la plataforma.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-[#121214] border border-zinc-800 text-zinc-400 px-4 py-2.5 rounded-xl text-sm font-bold">
                <CalendarIcon size={16} /> Marzo 2026
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group hover:border-[#00e676]/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00e676]/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-[#00e676]/10 text-[#00e676] rounded-xl border border-[#00e676]/20"><DollarSign size={24} /></div>
                <span className="text-[10px] font-black text-[#00e676] bg-[#00e676]/10 px-2.5 py-1 rounded-md border border-[#00e676]/20 flex items-center gap-1">
                  <TrendingUp size={12}/> +12.5%
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Ingresos Totales</p>
              <h4 className="text-4xl font-black text-white">{formatMoney(finances.stats.ingresosTotales)}</h4>
            </div>

            <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><TrendingUp size={24} /></div>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Comisiones (10%)</p>
              <h4 className="text-4xl font-black text-white">{formatMoney(finances.stats.comisiones)}</h4>
            </div>

            <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20"><CreditCard size={24} /></div>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Suscripciones PRO/ELITE</p>
              <h4 className="text-4xl font-black text-white">{formatMoney(finances.stats.suscripciones)}</h4>
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl mb-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-1">Ingresos mensuales</h3>
              <p className="text-xs text-zinc-500 font-medium">Comparativa de ingresos (comisiones) de los últimos 6 meses</p>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={finances.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '1rem', color: '#fff', fontWeight: 'bold' }}
                    itemStyle={{ color: '#00e676' }}
                    formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ingresos']}
                  />
                  <Area type="monotone" dataKey="ingresos" stroke="#00e676" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Transacciones recientes</h3>
                <p className="text-xs text-zinc-500 font-medium">Historial de movimientos financieros</p>
              </div>
              
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar descripción..." 
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#00e676]/50 transition-all text-white placeholder:text-zinc-600" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4">
                    <th className="pb-4 pl-4">ID Transacción</th>
                    <th className="pb-4">Descripción</th>
                    <th className="pb-4 text-center">Tipo</th>
                    <th className="pb-4 text-center">Monto</th>
                    <th className="pb-4 text-center">Fecha</th>
                    <th className="pb-4 text-right pr-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {finances.recentTransactions.length === 0 ? (
                     <tr><td colSpan={6} className="text-center py-10 text-zinc-500 font-bold">No hay transacciones registradas aún.</td></tr>
                  ) : (
                    finances.recentTransactions.map((tx: any) => (
                      <tr key={tx.id} className="bg-[#0a0a0a] hover:bg-zinc-900/50 transition-colors group">
                        <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-800/50 group-hover:border-zinc-700 text-zinc-500 font-mono text-xs">
                          {tx.id.split('-')[0].toUpperCase()}
                        </td>
                        <td className="py-4 font-bold text-zinc-300 border-y border-zinc-800/50 group-hover:border-zinc-700">
                          {tx.description}
                        </td>
                        <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
                          <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
                            tx.type === 'COMISION' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 text-center font-black text-[#00e676] border-y border-zinc-800/50 group-hover:border-zinc-700">
                          +{formatMoney(tx.amount)}
                        </td>
                        <td className="py-4 text-center text-zinc-500 text-xs font-medium border-y border-zinc-800/50 group-hover:border-zinc-700">
                          {new Date(tx.createdAt).toISOString().split('T')[0]}
                        </td>
                        <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-zinc-800/50 group-hover:border-zinc-700">
                          <div className="flex justify-end">
                            <span className="text-[10px] font-black text-[#00e676] flex items-center gap-1 uppercase tracking-widest bg-[#00e676]/10 px-2.5 py-1 rounded-md border border-[#00e676]/20 w-fit">
                              <CheckCircle2 size={12}/> {tx.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        
        </div>
      </main>
    </div>
  );
}