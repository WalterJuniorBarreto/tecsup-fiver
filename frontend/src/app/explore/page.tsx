'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar'; // Ajusta tu ruta
import { Star, Search, Loader2 } from 'lucide-react';
import { freelanceService } from '../../services/freelance.service'; // Ajusta tu ruta

// Definimos cómo luce un servicio que viene de Prisma
interface RealService {
  id: string;
  title: string;
  price: number;
  image: string | null;
  seller: { name: string; username: string; avatar: string | null };
}

export default function ExplorePage() {
  const [services, setServices] = useState<RealService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ESTADOS DE FILTROS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const loadMarketplace = async () => {
      try {
        const data = await freelanceService.getExploreServices();
        
        // 🚀 EL DETECTOR DE MENTIRAS
        console.log("👀 Servicios recibidos del Backend:", data);
        
        setServices(data);
      } catch (error) {
        console.error("💥 Error cargando servicios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMarketplace();
  }, []);

  // LÓGICA DE FILTRADO FUNCIONAL (Con datos reales)
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Nota: Como Prisma aún no tiene campo "category", ignoramos este filtro temporalmente 
      // o asumimos que todos son de la categoría seleccionada para que no se rompa tu UI
      const categoryMock = "Programacion"; 
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(categoryMock);
      
      const matchesMinPrice = minPrice === '' || service.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || service.price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [services, searchQuery, selectedCategories, minPrice, maxPrice]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 w-full flex-1">
        
        {/* TÍTULO Y BUSCADOR */}
        <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Explorar servicios</h1>
          <p className="text-zinc-500 mb-8 font-medium">Encuentra el talento perfecto para tu proyecto</p>
          
          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="¿Qué servicio estás buscando hoy?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium"
            />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR DE FILTROS */}
          <aside className="w-full lg:w-64 space-y-10 shrink-0">
            <div>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                Categorías <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">Próximamente</span>
              </h3>
              <div className="space-y-4">
                {['Diseño', 'Programacion', 'Video', 'Redaccion', 'Marketing', 'Traduccion'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 checked:bg-emerald-500 transition cursor-pointer accent-emerald-500"
                    />
                    <span className="text-zinc-400 font-medium group-hover:text-white transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Precio (S/)</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 transition"
                />
                <span className="text-zinc-700 font-bold">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-3 text-zinc-400 text-sm font-bold hover:text-white transition border border-zinc-800 rounded-xl hover:bg-zinc-900 active:scale-95"
            >
              Limpiar filtros
            </button>
          </aside>

          {/* GRID DE RESULTADOS */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <span className="text-zinc-500 font-medium">{filteredServices.length} servicios disponibles</span>
              <div className="flex items-center gap-2 bg-[#121212] border border-zinc-800 px-4 py-2 rounded-xl text-sm cursor-pointer hover:border-emerald-500/50 transition">
                <span className="text-zinc-400 font-medium">Relevancia</span>
                <span className="text-zinc-600 text-xs">▼</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 border border-zinc-900 rounded-3xl bg-[#0c0c0e]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-zinc-500 font-medium">Cargando el marketplace...</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((s) => {
                  
                  // Extraemos datos reales o usamos fallbacks atractivos
                  const authorName = s.seller?.name || s.seller?.username || 'Usuario Anónimo';
                  const authorAvatar = s.seller?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
                  const serviceImage = s.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';

                  return (
                    <div key={s.id} className="bg-[#121214] rounded-2xl overflow-hidden border border-zinc-800/50 group hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(0,230,118,0.05)] transition-all flex flex-col cursor-pointer">
                      
                      {/* Imagen de Portada */}
                      <div className="relative h-48 overflow-hidden bg-zinc-900">
                        <img src={serviceImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-xl">
                          Programacion {/* Mockeado hasta que agregues categoría a Prisma */}
                        </span>
                      </div>
                      
                      {/* Contenido de la Tarjeta */}
                      <div className="p-5 flex flex-col flex-grow">
                        
                        {/* Autor */}
                        <div className="flex items-center gap-3 mb-4">
                          <img src={authorAvatar} className="w-7 h-7 rounded-full border border-zinc-800 object-cover" alt={authorName} />
                          <span className="text-zinc-400 text-xs font-bold truncate hover:text-white transition">{authorName}</span>
                        </div>
                        
                        {/* Título */}
                        <h4 className="text-white text-base font-bold mb-4 line-clamp-2 group-hover:text-emerald-400 transition leading-snug">
                          {s.title}
                        </h4>
                        
                        {/* Footer (Precio y Rating) */}
                        <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                            <span className="text-sm font-bold text-white">5.0</span>
                            <span className="text-zinc-600 text-[11px] font-medium">(0)</span>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Desde</span>
                            <span className="text-white font-extrabold text-lg">S/ {s.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 border border-dashed border-zinc-800 rounded-3xl bg-[#0c0c0e]">
                <p className="text-zinc-500 font-medium">No se encontraron servicios con esos filtros.</p>
                <button onClick={clearFilters} className="mt-4 text-emerald-500 font-bold hover:underline">
                  Ver todos los servicios
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}