'use client';

import { Star, Heart, Search, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFavorites } from '../../../../hooks/useFavorites';

export default function FavoritesPage() {
  // 🚀 Usamos nuestro Hook personalizado
  const { favorites, loading, error, removeFavorite } = useFavorites();

  const handleToggleFavorite = (e: React.MouseEvent, serviceId: string) => {
    e.preventDefault(); // 🚀 EVITA QUE EL <Link> SE ACTIVE AL DAR CLIC AL CORAZÓN
    removeFavorite(serviceId);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#00e676] mb-4" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Cargando tus favoritos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-rose-500 font-bold">{error}</div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 px-4 pt-6">
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Mis favoritos</h1>
            <Sparkles className="text-[#00e676]" size={24} />
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            {favorites.length > 0 
              ? `Tienes ${favorites.length} servicios guardados en tu lista.` 
              : "No tienes servicios guardados por ahora."}
          </p>
        </div>
      </header>

      {/* GRID DE FAVORITOS */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const s = fav.service;
            return (
              <Link href={`/explore/${s.id}`} key={fav.id} className="block group">
                <div className="bg-[#121214] rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(0,230,118,0.05)] transition-all flex flex-col cursor-pointer h-full relative">
                  
                  {/* Imagen del Servicio */}
                  <div className="relative h-48 overflow-hidden bg-zinc-900">
                    <img 
                      src={s.image || `https://placehold.co/600x400/0a0a0a/00e676?text=Servicio`} 
                      alt={s.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60" />
                    
                    {/* Badge Categoría */}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-xl">
                      {s.category?.name || 'General'}
                    </span>

                    {/* 🚀 BOTÓN DE CORAZÓN (Con preventDefault) */}
                    <button 
                      onClick={(e) => handleToggleFavorite(e, s.id)}
                      className="absolute top-3 right-3 p-2.5 bg-black/50 backdrop-blur-md border border-zinc-700/50 rounded-full text-[#00e676] shadow-xl hover:bg-[#00e676] hover:text-black transition-all active:scale-90"
                      title="Quitar de favoritos"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  
                  {/* Detalles del Servicio */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={s.seller?.avatar || `https://ui-avatars.com/api/?name=${s.seller?.name}&background=0a0a0a&color=00e676`} 
                        className="w-7 h-7 rounded-full border border-zinc-800 object-cover" 
                        alt={s.seller?.name || 'Autor'} 
                      />
                      <span className="text-zinc-400 text-xs font-bold truncate group-hover:text-white transition">
                        {s.seller?.name || 'Freelancer'}
                      </span>
                    </div>
                    
                    <h4 className="text-white text-base font-bold mb-4 line-clamp-2 group-hover:text-emerald-400 transition leading-snug">
                      {s.title}
                    </h4>
                    
                    <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        <span className="text-sm font-bold text-white">5.0</span>
                        <span className="text-zinc-600 text-[11px] font-medium">(0)</span>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-zinc-600 text-[10px] block uppercase tracking-widest">Desde</span>
                        <span className="text-white font-extrabold text-lg">S/ {s.price}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE PREMIUM */
        <div className="py-24 text-center bg-[#121214] border border-zinc-800/60 rounded-[3rem] animate-in fade-in zoom-in-95 shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-8 flex justify-center items-center">
             <Heart size={80} className="text-[#00e676]/20 absolute animate-ping" />
             <Heart size={64} className="text-[#00e676] relative z-10" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Tu lista está vacía</h2>
          <p className="text-zinc-400 max-w-sm mx-auto mb-10 font-medium">
            Parece que aún no has guardado ningún servicio. ¡Explora el mercado y encuentra el talento perfecto!
          </p>
          <Link 
            href="/explore" 
            className="inline-flex items-center gap-3 bg-[#00e676] text-black px-10 py-4 rounded-[1.5rem] font-black text-sm hover:bg-[#00c853] transition-all group shadow-[0_0_20px_rgba(0,230,118,0.2)]"
          >
            EXPLORAR SERVICIOS <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}