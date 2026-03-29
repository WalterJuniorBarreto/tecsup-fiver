'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Download, 
  ArrowUpRight, 
  CreditCard,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function EarningsPage() {
  // --- ESTADO DE BALANCE Y ESTADÍSTICAS ---
  const [balance, setBalance] = useState(2450.00);
  const [pending, setPending] = useState(850.00);

  // --- ESTADO DE TRANSACCIONES ---
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', title: 'Pago por: Desarrollo de landing page', user: 'Carlos Lopez', amount: 500.00, date: '24 Mar 2026', status: 'Completado' },
    { id: 2, type: 'income', title: 'Diseño de Logo Startup', user: 'Maria Garcia', amount: 150.00, date: '22 Mar 2026', status: 'Completado' },
    { id: 3, type: 'withdrawal', title: 'Retiro a Cuenta Bancaria', user: 'Yo', amount: -1200.00, date: '15 Mar 2026', status: 'Enviado' },
  ]);

  // --- ESTADO DE MÉTODOS DE PAGO ---
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'bank-1', type: 'Bank', name: 'Cuenta bancaria', detail: '**** 4532', isPrimary: true },
    { id: 'paypal-1', type: 'PayPal', name: 'PayPal', detail: 'juan@email.com', isPrimary: false },
  ]);

  // --- LÓGICA DE RETIRO ---
  const handleWithdrawal = () => {
    if (balance <= 0) return alert("No tienes fondos suficientes.");
    
    const amount = prompt("¿Cuánto deseas retirar?", balance.toString());
    const numericAmount = parseFloat(amount || "0");

    if (numericAmount > 0 && numericAmount <= balance) {
      const newBalance = balance - numericAmount;
      setBalance(newBalance);
      
      // Añadir al historial
      const newTx = {
        id: Date.now(),
        type: 'withdrawal',
        title: 'Retiro solicitado',
        user: 'Yo',
        amount: -numericAmount,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pendiente'
      };
      setTransactions([newTx, ...transactions]);
      alert(`Retiro de $${numericAmount} procesado con éxito.`);
    } else {
      alert("Monto inválido.");
    }
  };

  const stats = [
    { label: 'Balance disponible', value: `$${balance.toLocaleString()}`, sub: 'Listo para retirar', icon: DollarSign },
    { label: 'Pendiente de liberación', value: `$${pending.toLocaleString()}`, sub: 'Se libera en 7-14 días', icon: Clock },
    { label: 'Ganancias del mes', value: '$3,200.00', sub: '+18.5% vs mes anterior', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Total histórico', value: '$45,200.00', sub: 'Desde Ene 2023', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-10 bg-black min-h-screen text-white">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ganancias</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona tus ingresos y retiros</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-800 transition">
            <Download size={16} /> Exportar
          </button>
          <button 
            onClick={handleWithdrawal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#00e676] text-black rounded-xl text-xs font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10"
          >
            <CreditCard size={16} /> Retirar fondos
          </button>
        </div>
      </header>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0c0c0e] border border-zinc-900 p-6 rounded-3xl relative group hover:border-zinc-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
              <stat.icon size={18} className="text-zinc-700 group-hover:text-emerald-500 transition" />
            </div>
            <p className="text-2xl font-extrabold mb-1">{stat.value}</p>
            <p className={`text-[10px] font-medium ${stat.color || 'text-zinc-500'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* GRÁFICA DE BARRAS */}
        <div className="lg:col-span-2 bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
          <h3 className="font-bold mb-8">Rendimiento</h3>
          <div className="flex items-end justify-between h-48 px-4 gap-2">
            {[24, 28, 20, 32, 24, 28].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-full group">
                <div 
                  style={{ height: `${height * 4}px` }} 
                  className="w-full max-w-[40px] bg-zinc-800 rounded-t-lg transition-all group-hover:bg-emerald-500 relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${height * 100}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500">Mes {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MÉTODOS DE PAGO FUNCIONALES */}
        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
          <h3 className="font-bold mb-6">Métodos de retiro</h3>
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div key={method.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${method.type === 'Bank' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-400'}`}>
                    {method.type === 'Bank' ? <CreditCard size={20} /> : <span className="font-bold text-xs">PP</span>}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{method.name}</p>
                    <p className="text-[10px] text-zinc-500">{method.detail}</p>
                  </div>
                </div>
                {method.isPrimary && (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">Principal</span>
                )}
              </div>
            ))}

            <button 
              onClick={() => alert("Función para agregar método de pago próximamente")}
              className="w-full py-3 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs font-bold hover:border-zinc-600 hover:text-zinc-300 transition flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Agregar método
            </button>
          </div>
        </div>
      </div>

      {/* HISTORIAL DE TRANSACCIONES DINÁMICO */}
      <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold">Historial de transacciones</h3>
          <span className="text-[10px] text-zinc-500 font-bold uppercase">{transactions.length} Movimientos</span>
        </div>
        
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/30 rounded-2xl transition group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition">{tx.title}</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                    {tx.type === 'income' ? `De ${tx.user}` : 'Transferencia saliente'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-zinc-200'}`}>
                  {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-[10px] text-zinc-500">{tx.date}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tx.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-10 text-zinc-500 text-sm italic">
              No hay transacciones recientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}