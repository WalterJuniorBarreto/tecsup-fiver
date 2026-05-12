'use client';

import { useState, useMemo, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Star, Search, Loader2 , Heart} from 'lucide-react';
import { freelanceService } from '../../services/freelance.service';
import { useSearchParams } from 'next/navigation';
import { categoryService } from '../../services/category.service';
import Link from 'next/link';
import { useFavorites } from '../../hooks/useFavorites';


interface RealService {
  id: string;
  title: string;
  price: number;
  image: string | null;
  seller: { name: string; username: string; avatar: string | null };
  category?: { id: string; name: string; slug: string } | null;
}

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minimumRating, setMinimumRating] = useState('0');
  const [sortBy, setSortBy] = useState('relevance');

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || ''; 
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [services, setServices] = useState<RealService[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const initialCategory = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );

  const { isServiceFavorited, toggleFavorite } = useFavorites();

// 2. Dentro del .map(), cuando renderizas cada servicio 's':

  useEffect(() => {
    const loadMarketplace = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          freelanceService.getExploreServices(),
          categoryService.getAllCategories()
        ]);
        
        setServices(servicesData);
        setCategoriesList(categoriesData);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMarketplace();
  }, []);

  const filteredServices = useMemo(() => {
    const filtered = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategories.length === 0 || 
        (service.category && selectedCategories.includes(service.category.name));

    
      const matchesMinPrice = minPrice === '' || service.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || service.price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });

    const sorted = [...filtered];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return sorted;
  }, [services, searchQuery, selectedCategories, minPrice, maxPrice, sortBy]);

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
    setMinimumRating('0');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 w-full flex-1">
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Explorar servicios</h1>
          <p className="text-zinc-500 mb-8">Encuentra el servicio perfecto para tu proyecto</p>
          
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
          
          <aside className="w-full lg:w-64 space-y-10 shrink-0">
            <div>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">Categorías</h3>
              <div className="space-y-4">
                {categoriesList.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 checked:bg-emerald-500 transition cursor-pointer accent-emerald-500"
                    />
                    <span className="text-zinc-400 font-medium group-hover:text-white transition">{cat.name}</span>
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

            <div>
              <h3 className="font-bold text-lg mb-6">Calificación mínima</h3>
              <div className="space-y-3">
                {[
                  { value: '0', label: 'Todas' },
                  { value: '4', label: '4+ estrellas' },
                  { value: '4.5', label: '4.5+ estrellas' },
                  { value: '4.8', label: '4.8+ estrellas' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="minimum-rating"
                      value={option.value}
                      checked={minimumRating === option.value}
                      onChange={(e) => setMinimumRating(e.target.value)}
                      className="w-4 h-4 border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-3 text-zinc-400 text-sm font-bold hover:text-white transition border border-zinc-800 rounded-xl hover:bg-zinc-900 active:scale-95"
            >
              Limpiar filtros
            </button>
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <span className="text-zinc-500 font-medium">{filteredServices.length} servicios disponibles</span>
              
              <label className="flex items-center gap-3 bg-[#121212] border border-zinc-800 px-4 py-2 rounded-lg text-sm hover:border-zinc-600 transition">
                <span className="text-zinc-400 whitespace-nowrap">Ordenar por</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer"
                >
                  <option value="relevance" className="bg-zinc-950">Relevancia</option>
                  <option value="rating-desc" className="bg-zinc-950">Mejor calificación</option>
                  <option value="reviews-desc" className="bg-zinc-950">Más reseñas</option>
                  <option value="price-asc" className="bg-zinc-950">Menor precio</option>
                  <option value="price-desc" className="bg-zinc-950">Mayor precio</option>
                </select>
              </label>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 border border-zinc-900 rounded-3xl bg-[#0c0c0e]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-zinc-500 font-medium">Cargando el marketplace...</p>
              </div>
            ) : filteredServices.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((s) => {
                  
                  const authorName = s.seller?.name || s.seller?.username || 'Usuario Anónimo';
                  const authorAvatar = s.seller?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
                  const serviceImage = s.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';

                  // 🚀 AQUÍ VERIFICAMOS SI ESTE SERVICIO ES FAVORITO
                  const favorited = isServiceFavorited(s.id);

                  return (
                    <Link href={`/explore/${s.id}`} key={s.id} className="block group">
                      <div className="bg-[#121214] rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(0,230,118,0.05)] transition-all flex flex-col cursor-pointer h-full relative">
                        
                        <div className="relative h-48 overflow-hidden bg-zinc-900">
                          <img src={serviceImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-40" />
                          
                          <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-xl">
                            {s.category?.name || 'General'}
                          </span>

                          {/* 🚀 BOTÓN DE FAVORITO DINÁMICO AQUÍ */}
                          <button 
                            onClick={(e) => {
                              e.preventDefault(); // EVITA QUE TE LLEVE A LA VISTA DEL SERVICIO
                              toggleFavorite(s.id); // LLAMA AL HOOK
                            }}
                            className={`absolute top-3 right-3 p-2.5 backdrop-blur-md border rounded-full transition-all active:scale-90 z-10 ${
                              favorited 
                                ? 'bg-[#00e676] text-black border-transparent shadow-[0_0_15px_rgba(0,230,118,0.4)]' 
                                : 'bg-black/40 text-zinc-400 border-zinc-700/50 hover:bg-[#00e676] hover:text-black hover:border-transparent'
                            }`}
                            title={favorited ? "Quitar de favoritos" : "Guardar en favoritos"}
                          >
                            <Heart 
                              size={18} 
                              fill={favorited ? "currentColor" : "none"} 
                              className={favorited ? "animate-in zoom-in-125 duration-300" : ""}
                            />
                          </button>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 mb-4">
                            <img src={authorAvatar} className="w-7 h-7 rounded-full border border-zinc-800 object-cover" alt={authorName} />
                            <span className="text-zinc-400 text-xs font-bold truncate group-hover:text-white transition">{authorName}</span>
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