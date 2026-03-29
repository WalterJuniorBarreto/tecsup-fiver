'use client';

import { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingCart,
  Search,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  // ESTADO INICIAL DE FAVORITOS
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: 'Desarrollo de sitio web responsive con Next.js',
      author: 'Juan Developer',
      authorBadge: 'Top Rated',
      badgeColor: 'text-emerald-500 bg-emerald-500/10',
      rating: 5.0,
      reviews: 89,
      price: 500,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 2,
      title: 'Diseño de logo profesional y manual de marca',
      author: 'Maria Designer',
      authorBadge: 'Pro',
      badgeColor: 'text-blue-400 bg-blue-400/10',
      rating: 4.9,
      reviews: 156,
      price: 200,
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 3,
      title: 'Edición de video profesional para redes sociales',
      author: 'Carlos Editor',
      authorBadge: 'Rising Talent',
      badgeColor: 'text-orange-400 bg-orange-400/10',
      rating: 4.8,
      reviews: 234,
      price: 150,
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=500'
    },
    {
      id: 4,
      title: 'SEO y marketing digital avanzado',
      author: 'SEO Pro',
      authorBadge: 'Top Rated',
      badgeColor: 'text-emerald-500 bg-emerald-500/10',
      rating: 4.8,
      reviews: 234,
      price: 400,
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=500'
    }
  ]);

  // --- LÓGICA FUNCIONAL ---

  const removeFavorite = (id: number) => {
    // Animación simple: podrías filtrar directamente, pero aquí simulamos el proceso
    setFavorites(prev => prev.filter(service => service.id !== id));
  };

  const handleHire = (title: string) => {
    alert(`Iniciando contratación para: ${title}\nRedirigiendo a la pasarela de pago segura...`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 px-4">
      {/* HEADER DINÁMICO */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-white tracking-tight">Mis favoritos</h1>
            <Sparkles className="text-[#00e676] animate-pulse" size={24} />
          </div>
          <p className="text-zinc-500 text-sm font-medium">
            {favorites.length > 0 
              ? `Tienes ${favorites.length} servicios guardados en tu lista de deseos.` 
              : "No tienes servicios guardados por ahora."}
          </p>
        </div>

        {favorites.length > 0 && (
          <button 
            onClick={() => { if(confirm("¿Quitar todos los favoritos?")) setFavorites([]) }}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-rose-500 transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} /> Limpiar lista
          </button>
        )}
      </header>

      {/* GRID DE SERVICIOS O EMPTY STATE */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((service) => (
            <div 
              key={service.id} 
              className="animate-in zoom-in-95 duration-300 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] overflow-hidden group hover:border-zinc-700 hover:shadow-2xl hover:shadow-[#00e676]/5 transition-all"
            >
              {/* Imagen con botón de quitar */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={service.image} 
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-2" 
                  alt={service.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-60" />
                
                <button 
                  onClick={() => removeFavorite(service.id)}
                  className="absolute top-5 right-5 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-rose-500 shadow-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 group/heart"
                  title="Quitar de favoritos"
                >
                  <Heart size={20} fill="currentColor" className="group-hover/heart:scale-110 transition" />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-white font-bold">
                    {service.author.charAt(0)}
                  </div>
                  <p className="text-[11px] text-zinc-400 font-black uppercase tracking-wider">{service.author}</p>
                  <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-tighter ${service.badgeColor}`}>
                    {service.authorBadge}
                  </span>
                </div>

                <h4 className="font-black text-lg text-zinc-100 leading-tight mb-4 group-hover:text-[#00e676] transition-colors line-clamp-2 min-h-[3.5rem]">
                  {service.title}
                </h4>

                <div className="flex items-center gap-2 mb-8 bg-zinc-900/50 w-fit px-3 py-1.5 rounded-xl border border-zinc-800">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-black text-white">{service.rating.toFixed(1)}</span>
                  <span className="text-xs text-zinc-600 font-bold">({service.reviews} reviews)</span>
                </div>

                {/* Footer de la Card */}
                <div className="flex justify-between items-center pt-6 border-t border-zinc-900">
                  <div>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1">Presupuesto</p>
                    <p className="text-3xl font-black text-white tracking-tighter">${service.price}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleHire(service.title)}
                    className="flex items-center gap-2 bg-[#00e676] text-black px-6 py-4 rounded-[1.5rem] text-xs font-black hover:bg-emerald-400 hover:scale-105 transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
                  >
                    <ShoppingCart size={18} /> CONTRATAR
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Card de Explorar */}
          <Link href="/dashboard/client/explore" className="border-2 border-dashed border-zinc-900 rounded-[2.5rem] flex flex-col items-center justify-center p-12 group hover:border-[#00e676]/30 hover:bg-[#00e676]/5 transition-all cursor-pointer">
              <div className="p-5 bg-zinc-900/50 rounded-2xl mb-4 group-hover:bg-[#00e676] group-hover:text-black transition-all">
                  <Search className="text-zinc-500 group-hover:text-inherit" size={32} />
              </div>
              <p className="text-lg font-black text-zinc-500 group-hover:text-white transition-colors">Seguir explorando</p>
              <p className="text-xs text-zinc-600 font-medium mt-1">Descubre nuevos talentos</p>
          </Link>
        </div>
      ) : (
        /* EMPTY STATE - CUANDO NO HAY FAVORITOS */
        <div className="py-24 text-center bg-[#0c0c0e] border border-zinc-900 rounded-[3rem] animate-in fade-in zoom-in-95">
          <div className="relative w-24 h-24 mx-auto mb-8">
             <Heart size={96} className="text-zinc-900 absolute inset-0 scale-125" />
             <Heart size={96} className="text-zinc-800" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Tu lista está vacía</h2>
          <p className="text-zinc-500 max-w-sm mx-auto mb-10 font-medium">Parece que aún no has guardado ningún servicio. ¡Explora el mercado y encuentra el talento perfecto!</p>
          <Link 
            href="/dashboard/client/explore" 
            className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-[#00e676] transition-all group"
          >
            EXPLORAR SERVICIOS <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}