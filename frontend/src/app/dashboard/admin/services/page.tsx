"use client";

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Star, Package, 
  Eye, Ban, CheckCircle2, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { adminService } from '../../../../services/admin.service';
import Link from 'next/link';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 8 });

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getServices(page, meta.limit, search);
      setServices(data.services);
      setMeta(data.meta);
    } catch (error) {
      console.error("Error cargando servicios:", error);
      showToast('Error al cargar los servicios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [page, search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); 
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setIsProcessing(id);
      await adminService.toggleServiceStatus(id);
      showToast(`Servicio ${currentStatus ? 'suspendido' : 'reactivado'} correctamente`, 'success');
      loadServices(); 
    } catch (error) {
      showToast('Error al cambiar el estado del servicio', 'error');
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
            <h2 className="text-4xl font-black tracking-tight mb-2">Gestión de Servicios</h2>
            <p className="text-zinc-500 text-sm">Administra y modera el catálogo de la plataforma.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] flex items-center gap-5 shadow-lg">
            <div className="p-4 rounded-2xl border text-blue-400 bg-blue-500/10 border-blue-500/20">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Servicios</p>
              <h4 className="text-4xl font-black text-white">{meta.total}</h4>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar servicio o vendedor..." 
              className="w-full bg-[#121214] border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00e676]/50 transition-all text-white placeholder:text-zinc-600 shadow-sm" 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-[#00e676] animate-spin" /></div>
        ) : services.length === 0 ? (
          <div className="bg-[#121214] border border-dashed border-zinc-800 rounded-[2rem] p-20 text-center flex flex-col items-center">
            <Briefcase size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">No se encontraron servicios</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {services.map((service) => (
                <div key={service.id} className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg flex flex-col">
                  {/* IMAGEN Y BADGE */}
                  <div className="h-48 relative overflow-hidden bg-zinc-900 border-b border-zinc-800">
                    <img 
                      src={service.image || 'https://via.placeholder.com/600x400/0a0a0a/3f3f46?text=Sin+Imagen'} 
                      alt={service.title} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!service.isPublished ? 'grayscale opacity-70' : ''}`}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg ${
                        service.isPublished ? 'bg-[#00e676] text-black' : 'bg-red-500 text-white'
                      }`}>
                        {service.isPublished ? 'Activo' : 'Suspendido'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 leading-tight" title={service.title}>{service.title}</h3>
                    <p className="text-xs text-zinc-500 mb-4">por <span className="text-zinc-300 font-medium">{service.sellerName}</span></p>
                    
                    <div className="flex justify-between items-end mb-4 flex-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                        {service.categoryName}
                      </span>
                      <span className="font-black text-xl text-[#00e676]">S/ {service.price}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold text-zinc-400 border-t border-zinc-800/80 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        {service.averageRating.toFixed(1)} <span className="text-zinc-600">({service.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package size={14} /> {service.ordersCount} pedidos
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0a0a0a] border-t border-zinc-800/80 flex gap-2">
                    <Link 
  href={`/explore/${service.id}`}
  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
>
  <Eye size={14} /> Ver detalles
</Link>
                    <button 
                      onClick={() => handleToggleStatus(service.id, service.isPublished)}
                      disabled={isProcessing === service.id}
                      className={`w-12 flex items-center justify-center rounded-xl transition-colors border disabled:opacity-50 ${
                        service.isPublished 
                          ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' 
                          : 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676] hover:bg-[#00e676] hover:text-black'
                      }`}
                      title={service.isPublished ? "Suspender servicio" : "Reactivar servicio"}
                    >
                      {isProcessing === service.id ? <Loader2 size={16} className="animate-spin" /> : (service.isPublished ? <Ban size={16} /> : <CheckCircle2 size={16} />)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 bg-[#121214] border border-zinc-800/80 rounded-2xl py-3 px-6 w-fit mx-auto">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-zinc-400">
                  Página <span className="text-white">{page}</span> de {meta.totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
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