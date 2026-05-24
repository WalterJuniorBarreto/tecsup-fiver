'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Clock, 
  CreditCard, Plus, Building2, Landmark, CheckCircle2, 
  AlertCircle, ChevronRight, Download, Loader2, Trash2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { earningService } from '../../../../services/earning.service';

export default function EarningsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  
  // DATOS REALES
  const [balances, setBalances] = useState({ available: 0, pending: 0, total: 0 });
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const [paymentMethods, setPaymentMethods] = useState<{bank: string, account: string}[]>([]);
  const [newBank, setNewBank] = useState('');
  const [newAccount, setNewAccount] = useState('');
  
  // RETIRO
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadEarningsData = async () => {
      try {
        setIsLoading(true);
        const summaryData = await earningService.getSummary();
        const txData = await earningService.getTransactions();

        setBalances({
          available: summaryData.available || 0,
          pending: summaryData.pending || 0,
          total: summaryData.total || 0
        });
        setChartData(summaryData.chart || []);
        setTransactions(txData || []);
        
        const savedMethods = localStorage.getItem('devmarket_methods');
        if (savedMethods) setPaymentMethods(JSON.parse(savedMethods));

      } catch (error) {
        console.error("Error cargando ganancias:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEarningsData();
  }, []);

  const handleAddMethod = () => {
    if (!newBank || !newAccount.trim()) return;
    const newMethod = { bank: newBank, account: newAccount };
    const updatedMethods = [...paymentMethods, newMethod];
    
    setPaymentMethods(updatedMethods);
    localStorage.setItem('devmarket_methods', JSON.stringify(updatedMethods)); 
    
    setNewBank('');
    setNewAccount('');
    setShowMethodModal(false);
    
    setToast({ message: 'Cuenta bancaria agregada correctamente.', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveMethod = (index: number) => {
    const updated = paymentMethods.filter((_, i) => i !== index);
    setPaymentMethods(updated);
    localStorage.setItem('devmarket_methods', JSON.stringify(updated));
  };

  const handleWithdraw = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount <= 0) return setErrorMsg('Ingresa un monto válido.');
    if (amount > balances.available) return setErrorMsg('El monto excede tu saldo disponible.');
    if (!selectedMethod) return setErrorMsg('Debes seleccionar una cuenta de destino.');

    try {
      setIsWithdrawing(true);
      await earningService.requestWithdrawal(amount, selectedMethod);
      
      setSuccessMsg('¡Retiro solicitado con éxito!');
      setBalances(prev => ({ ...prev, available: prev.available - amount }));
      setWithdrawAmount('');
      
      const txData = await earningService.getTransactions();
      setTransactions(txData);

      setTimeout(() => {
        setShowWithdrawModal(false);
        setSuccessMsg('');
      }, 2000);
      
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatMoney = (amount: number) => amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  if (isLoading) {
    return <div className="h-[calc(100vh-100px)] flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="w-12 h-12 text-[#00e676] animate-spin" /></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto font-sans selection:bg-[#00e676]/30 animate-in fade-in duration-500 pb-20 bg-[#0a0a0a] min-h-screen relative">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Ganancias</h1>
          <p className="text-zinc-500 text-sm">Gestiona tus ingresos, métodos de pago y solicita retiros.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (paymentMethods.length === 0) {
                setToast({ message: 'Primero debes agregar una cuenta bancaria para retirar.', type: 'error' });
                setTimeout(() => setToast(null), 3000);
                setShowMethodModal(true);
              } else {
                setSelectedMethod(`${paymentMethods[0].bank} - ${paymentMethods[0].account}`);
                setShowWithdrawModal(true);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#00e676] text-black text-sm font-black hover:bg-[#00c853] hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,230,118,0.2)]"
          >
            <Wallet size={18} /> Retirar fondos
          </button>
        </div>
      </header>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#121214] border border-[#00e676]/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,230,118,0.05)]">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Balance Disponible</p>
            <div className="p-2.5 bg-[#00e676]/10 border border-[#00e676]/20 rounded-xl"><Wallet size={18} className="text-[#00e676]" /></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">S/ {formatMoney(balances.available)}</h2>
          <p className="text-xs text-[#00e676] font-bold flex items-center gap-1.5"><CheckCircle2 size={14} /> Listo para retirar</p>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pendiente</p>
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl"><Clock size={18} className="text-zinc-500" /></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">S/ {formatMoney(balances.pending)}</h2>
          <p className="text-xs text-zinc-500 font-medium">Se libera al completar pedidos</p>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8">
          <div className="flex justify-between items-start mb-6">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Histórico</p>
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl"><Landmark size={18} className="text-zinc-500" /></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">S/ {formatMoney(balances.total)}</h2>
          <p className="text-xs text-[#00e676] font-medium flex items-center gap-1.5"><ArrowUpRight size={14} /> Todas tus ventas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* GRÁFICO */}
        <div className="lg:col-span-2 bg-[#121214] border border-zinc-800/80 rounded-3xl p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white">Rendimiento (Últimos 6 meses)</h3>
            <select className="bg-[#0a0a0a] border border-zinc-800 text-xs text-zinc-400 rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-zinc-600 transition-colors">
              <option>Este año</option>
              <option>Último año</option>
            </select>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGanancias" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#00e676', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="ganancias" stroke="#00e676" strokeWidth={3} fillOpacity={1} fill="url(#colorGanancias)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 font-bold text-sm">Aún no hay datos suficientes para el gráfico</div>
            )}
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Métodos de retiro</h3>
          
          <div className="space-y-4 flex-1">
            {paymentMethods.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 border border-dashed border-zinc-800 rounded-2xl p-6 text-center">
                <CreditCard size={32} className="mb-2 opacity-50" />
                <p className="text-sm">No has agregado ninguna cuenta bancaria aún.</p>
              </div>
            ) : (
              paymentMethods.map((method, index) => (
                <div key={index} className="bg-[#0a0a0a] border border-zinc-800/80 p-4 rounded-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                      <Building2 size={20} className="text-[#00e676]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white uppercase">{method.bank}</p>
                      <p className="text-xs text-zinc-500 font-mono">{method.account}</p>
                    </div>
                    <button onClick={() => handleRemoveMethod(index)} className="p-2 text-zinc-600 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={() => setShowMethodModal(true)} className="w-full mt-6 py-4 rounded-xl border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-[#00e676] hover:bg-[#00e676]/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
            <Plus size={16} /> Agregar cuenta
          </button>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800/60 flex justify-between items-center bg-[#0c0c0e]">
          <h3 className="text-lg font-bold text-white">Historial de Movimientos</h3>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {transactions.length > 0 ? transactions.map((tx) => (
            <div key={tx.id} className="p-6 md:px-8 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'EARNING' ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-zinc-900 text-zinc-400'}`}>
                  {tx.type === 'EARNING' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{tx.title}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{tx.type === 'EARNING' ? 'DE:' : 'HACIA:'} <span className="text-zinc-400 font-medium">{tx.client}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg tracking-tight ${tx.type === 'EARNING' ? 'text-[#00e676]' : 'text-white'}`}>
                  {tx.type === 'EARNING' ? '+' : ''}S/ {formatMoney(Math.abs(tx.amount))}
                </p>
                <div className="flex items-center gap-2 justify-end mt-1">
                  <span className="text-xs text-zinc-500">{formatDate(tx.date)}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${tx.status === 'COMPLETED' ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {tx.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-zinc-500 font-bold text-sm">No hay transacciones registradas.</div>
          )}
        </div>
      </div>

  
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-2">Retirar fondos</h3>
              <p className="text-sm text-zinc-400 mb-8">Transfiere tu saldo disponible a tu cuenta bancaria.</p>
              
              {errorMsg && <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}
              {successMsg && <div className="mb-4 p-3 bg-[#00e676]/10 text-[#00e676] rounded-xl text-sm font-bold flex items-center gap-2"><CheckCircle2 size={16}/> {successMsg}</div>}

              <div className="bg-[#0a0a0a] border border-[#00e676]/30 p-4 rounded-2xl flex justify-between items-center mb-6">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Disponible</span>
                <span className="text-xl font-black text-[#00e676]">S/ {formatMoney(balances.available)}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Destino</label>
                  <select 
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-[#00e676] cursor-pointer"
                  >
                    {paymentMethods.map((m, i) => (
                      <option key={i} value={`${m.bank} - ${m.account}`}>{m.bank} - {m.account}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Monto a retirar (S/)</label>
                  <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Ej: 50.00" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-4 text-lg font-black text-white outline-none focus:border-[#00e676]" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowWithdrawModal(false)} disabled={isWithdrawing} className="flex-1 py-4 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button onClick={handleWithdraw} disabled={isWithdrawing} className="flex-[2] py-4 rounded-xl text-sm font-black text-black bg-[#00e676] hover:bg-[#00c853] flex items-center justify-center gap-2">
                  {isWithdrawing ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Retiro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

  
      {showMethodModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-2">Agregar Cuenta</h3>
              <p className="text-sm text-zinc-400 mb-8">La cuenta debe estar a tu nombre.</p>

              <div className="space-y-5 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Banco</label>
                  <select value={newBank} onChange={(e) => setNewBank(e.target.value)} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-[#00e676] cursor-pointer appearance-none">
                    <option value="" disabled>Selecciona tu banco</option>
                    <option value="BCP">BCP - Banco de Crédito</option>
                    <option value="Interbank">Interbank</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Yape/Plin">Yape / Plin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Número de Cuenta o Celular</label>
                  <input type="text" value={newAccount} onChange={(e) => setNewAccount(e.target.value)} placeholder="000-000-000" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-4 text-sm text-white outline-none focus:border-[#00e676]" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowMethodModal(false)} className="flex-1 py-4 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button onClick={handleAddMethod} className="flex-[2] py-4 rounded-xl text-sm font-black text-black bg-white hover:bg-zinc-200 transition-colors">Guardar Cuenta</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border bg-[#121214] ${
            toast.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-[#00e676] border-[#00e676]/30'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}