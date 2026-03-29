'use client';
import { Star, SearchX } from 'lucide-react';

interface FeaturedServicesProps {
  activeCategory: string;
  searchTerm: string;
  onReset: () => void;
}

export default function FeaturedServices({ activeCategory, searchTerm, onReset }: FeaturedServicesProps) {
  const services = [
    { id: 1, category: "Diseño", title: "Diseño de logo profesional con guía de marca completa", author: "Maria G.", image: "https://images.unsplash.com/photo-1541462608141-ad4d619476ad?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=maria", rating: 4.9, reviews: 234, price: 150 },
    { id: 2, category: "Programacion", title: "Desarrollo de sitio web responsive con Next.js y Tailwind", author: "Carlos R.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=carlos", rating: 5.0, reviews: 89, price: 500 },
    { id: 3, category: "Video", title: "Edicion de video profesional para YouTube y redes sociales", author: "Ana L.", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=ana", rating: 4.8, reviews: 156, price: 200 },
    { id: 4, category: "Marketing", title: "Campaña de Ads optimizada para incrementar conversiones", author: "Luis P.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=luis", rating: 4.9, reviews: 112, price: 350 },
    { id: 5, category: "Escritura", title: "Redacción de artículos SEO y posts de blog atractivos", author: "Elena B.", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=elena", rating: 5.0, reviews: 67, price: 120 },
    { id: 6, category: "Música", title: "Composición de intro musical y efectos de sonido para podcast", author: "Javier M.", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800", avatar: "https://i.pravatar.cc/150?u=javier", rating: 4.7, reviews: 94, price: 180 }
  ];

  // Lógica de Filtrado combinada
  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'Todos' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-32 px-10 bg-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#00e676] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {activeCategory}
              </span>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Servicios destacados</h2>
            </div>
            <p className="text-zinc-600 text-lg font-medium">Los mejores freelancers listos para trabajar contigo</p>
          </div>
          <button 
            onClick={onReset}
            className="text-zinc-400 border border-zinc-900 px-8 py-3 rounded-2xl hover:bg-zinc-900 hover:text-white transition-all font-bold text-sm uppercase tracking-widest"
          >
            Ver todos
          </button>
        </div>

        {/* Grid de Tarjetas */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((s) => (
              <div key={s.id} className="bg-[#0c0c0e] rounded-[2.5rem] overflow-hidden border border-zinc-900 group hover:border-[#00e676]/30 transition-all flex flex-col hover:shadow-[0_0_50px_-12px_rgba(0,230,118,0.15)]">
                <div className="relative h-64 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-6">
                    <img src={s.avatar} alt={s.author} className="w-8 h-8 rounded-full ring-2 ring-zinc-900" />
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">{s.author}</span>
                  </div>

                  <h3 className="text-white text-xl font-bold leading-tight group-hover:text-[#00e676] transition-colors mb-8 min-h-[3.5rem]">
                    {s.title}
                  </h3>

                  <div className="mt-auto pt-6 border-t border-zinc-900 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#00e676] fill-[#00e676]" />
                      <span className="text-white font-black text-sm">{s.rating.toFixed(1)}</span>
                      <span className="text-zinc-600 text-xs font-bold">({s.reviews})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-tighter">Desde</p>
                      <p className="text-white text-2xl font-black">${s.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
            <SearchX size={48} className="mx-auto text-zinc-800 mb-4" />
            <h3 className="text-zinc-500 text-xl font-bold">No encontramos servicios que coincidan.</h3>
            <button onClick={onReset} className="mt-4 text-[#00e676] font-black uppercase text-xs hover:underline tracking-widest">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}