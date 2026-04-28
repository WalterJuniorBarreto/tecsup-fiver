"use client";

import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, RefreshCcw, 
  Download, Calendar, Filter, Search, ArrowUpRight, 
  ArrowDownRight, MoreHorizontal, CheckCircle2, Clock 
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";

// Datos iniciales realistas
const INITIAL_TRANSACTIONS = [
  { id: "TXN001", description: "Comisión - Servicio #4521", type: "Comision", amount: 45.00, date: "2024-03-10", status: "Completado" },
  { id: "TXN002", description: "Pago a Carlos R.", type: "Pago", amount: -450.00, date: "2024-03-10", status: "Completado" },
  { id: "TXN003", description: "Suscripción Pro - Maria G.", type: "Suscripcion", amount: 9.99, date: "2024-03-09", status: "Completado" },
  { id: "TXN004", description: "Comisión - Servicio #4520", type: "Comision", amount: 75.00, date: "2024-03-09", status: "Completado" },
  { id: "TXN005", description: "Pago a Pedro L.", type: "Pago", amount: -320.00, date: "2024-03-08", status: "Pendiente" },
  { id: "TXN006", description: "Suscripción Elite - Sofia T.", type: "Suscripcion", amount: 24.99, date: "2024-03-08", status: "Completado" },
  { id: "TXN007", description: "Reembolso - Pedido #3421", type: "Reembolso", amount: -150.00, date: "2024-03-07", status: "Completado" },
  { id: "TXN008", description: "Comisión - Servicio #4519", type: "Comision", amount: 120.00, date: "2024-03-07", status: "Completado" },
];

export default function FinancePage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica de filtrado simple
  const filteredTransactions = transactions.filter(txn => 
    txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    console.log("Exportando datos a CSV...");
    // Aquí iría la lógica de descarga
    alert("Iniciando descarga de reporte financiero...");
  };

  return (
    <div className="flex min-h-screen bg-[#080808] text-white font-sans">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Finanzas</h1>
            <p className="text-zinc-500 text-sm">Resumen financiero de la plataforma</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all">
              <Calendar size={14} /> Marzo 2024
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all"
            >
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinanceCard label="Ingresos totales" value="$124,500" change="+12.5%" icon={<DollarSign size={20}/>} color="emerald" />
          <FinanceCard label="Comisiones" value="$18,675" change="+8.2%" icon={<TrendingUp size={20}/>} color="blue" />
          <FinanceCard label="Suscripciones" value="$4,850" change="+15.3%" icon={<CreditCard size={20}/>} color="indigo" />
          <FinanceCard label="Reembolsos" value="$1,240" change="-5.1%" icon={<RefreshCcw size={20}/>} color="red" isNegative />
        </div>

        {/* Chart Section Placeholder */}
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Ingresos mensuales</h2>
              <p className="text-zinc-500 text-[11px]">Comparativa de ingresos de los últimos 6 meses</p>
            </div>
          </div>
          <div className="h-[250px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
            <TrendingUp size={48} className="text-zinc-800 mb-4" />
            <p className="text-zinc-600 text-xs font-medium tracking-widest uppercase">Gráfico de ingresos</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#0c0c0e] border border-zinc-800 rounded-[32px] overflow-hidden shadow-xl">
          <div className="p-8 border-b border-zinc-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Transacciones recientes</h2>
              <p className="text-zinc-500 text-[11px]">Historial de movimientos financieros</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text"
                placeholder="Buscar descripción o ID..."
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50 w-full md:w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-zinc-600 border-b border-zinc-800/50">
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Descripción</th>
                  <th className="px-8 py-5">Tipo</th>
                  <th className="px-8 py-5">Monto</th>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="px-8 py-5 text-xs font-mono text-zinc-500">{txn.id}</td>
                    <td className="px-8 py-5 text-xs font-bold text-zinc-200">{txn.description}</td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-bold">
                        {txn.type}
                      </span>
                    </td>
                    <td className={`px-8 py-5 text-xs font-black ${txn.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {txn.amount > 0 ? `+$${txn.amount.toFixed(2)}` : `-$${Math.abs(txn.amount).toFixed(2)}`}
                    </td>
                    <td className="px-8 py-5 text-xs text-zinc-500 font-medium">{txn.date}</td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        txn.status === 'Completado' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {txn.status === 'Completado' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                        {txn.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="py-20 text-center text-zinc-600 text-xs uppercase tracking-widest font-black">
                No se encontraron transacciones
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FinanceCard({ label, value, change, icon, color, isNegative }: any) {
  const colors: any = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20"
  };

  return (
    <div className="bg-[#0c0c0e] p-6 rounded-[32px] border border-zinc-800 hover:border-zinc-700 transition-all shadow-lg group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg bg-zinc-900 ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
          {isNegative ? <ArrowDownRight size={12}/> : <ArrowUpRight size={12}/>}
          {change}
        </div>
      </div>
      <div>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <span className="text-3xl font-bold tracking-tighter text-zinc-100">{value}</span>
      </div>
    </div>
  );
}