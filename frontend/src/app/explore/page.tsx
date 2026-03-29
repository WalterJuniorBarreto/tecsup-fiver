'use client';

import { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Star, Search, SlidersHorizontal } from 'lucide-react';

// Datos de ejemplo extendidos para que los filtros tengan sentido
const ALL_SERVICES = [
  { id: 1, category: "Diseño", title: "Diseño de logo profesional con guia de marca completa", author: "Maria G.", price: 150, rating: 4.9, reviews: 234, image: "https://images.unsplash.com/photo-1541462608141-ad4d619476ad?q=80&w=800" },
  { id: 2, category: "Programacion", title: "Desarrollo de sitio web responsive con Next.js y Tailwind", author: "Carlos R.", price: 500, rating: 5.0, reviews: 89, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800" },
  { id: 3, category: "Video", title: "Edicion de video profesional para YouTube y redes sociales", author: "Ana L.", price: 200, rating: 4.8, reviews: 156, image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800" },
  { id: 4, category: "Redaccion", title: "Redacción de artículos SEO optimizados", author: "Elena B.", price: 50, rating: 4.7, reviews: 42, image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800" },
  { id: 5, category: "Marketing", title: "Estrategia de Social Media Ads", author: "Luis P.", price: 300, rating: 4.9, reviews: 88, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800" },
  { id: 6, category: "Traduccion", title: "Traducción técnica Inglés a Español", author: "Jean M.", price: 80, rating: 5.0, reviews: 21, image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800" },
  { id: 7, category: "Diseño", title: "Diseño de UI/UX para Aplicaciones Móviles", author: "Sofia V.", price: 450, rating: 4.9, reviews: 105, image: "https://images.unsplash.com/photo-1586717791821-3f44a563de4c?q=80&w=800" },
  { id: 8, category: "Programacion", title: "Corrección de Bugs y Optimización de Base de Datos", author: "Miguel H.", price: 120, rating: 4.6, reviews: 54, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800" },
  { id: 9, category: "Video", title: "Animación de Motion Graphics 2D", author: "Lucas K.", price: 280, rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800" },
];

export default function ExplorePage() {
  // ESTADOS DE FILTROS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // LÓGICA DE FILTRADO FUNCIONAL
  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
      const matchesMinPrice = minPrice === '' || service.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || service.price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [searchQuery, selectedCategories, minPrice, maxPrice]);

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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-10 py-12">
        {/* TÍTULO Y BUSCADOR */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Explorar servicios</h1>
          <p className="text-zinc-500 mb-8">Encuentra el servicio perfecto para tu proyecto</p>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text"
              placeholder="Buscar servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-emerald-500 transition"
            />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR DE FILTROS (CAPTURA 5) */}
          <aside className="w-full lg:w-64 space-y-10">
            <div>
              <h3 className="font-bold text-lg mb-6">Categorias</h3>
              <div className="space-y-4">
                {['Diseño', 'Programacion', 'Video', 'Redaccion', 'Marketing', 'Traduccion'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 checked:bg-emerald-500 transition cursor-pointer"
                    />
                    <span className="text-zinc-400 group-hover:text-white transition">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6">Rango de precio</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
                />
                <span className="text-zinc-700">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#121212] border border-zinc-800 rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="w-full py-3 text-zinc-500 text-sm font-medium hover:text-white transition border border-zinc-900 rounded-xl hover:bg-zinc-900"
            >
              Limpiar filtros
            </button>
          </aside>

          {/* GRID DE RESULTADOS */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <span className="text-zinc-500">{filteredServices.length} servicios encontrados</span>
              <div className="flex items-center gap-2 bg-[#121212] border border-zinc-800 px-4 py-2 rounded-lg text-sm cursor-pointer hover:border-zinc-600">
                <span className="text-zinc-400">Relevancia</span>
                <span className="text-zinc-600 italic">v</span>
              </div>
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((s) => (
                  <div key={s.id} className="bg-[#0c0c0e] rounded-2xl overflow-hidden border border-zinc-900 group hover:border-zinc-700 transition-all flex flex-col">
                    <div className="relative h-48">
                      <img src={s.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase">{s.category}</span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <img src={`https://i.pravatar.cc/100?u=${s.author}`} className="w-6 h-6 rounded-full" />
                        <span className="text-zinc-500 text-xs">{s.author}</span>
                      </div>
                      <h4 className="text-white text-sm font-semibold mb-4 line-clamp-2 group-hover:text-emerald-400 transition">{s.title}</h4>
                      <div className="mt-auto pt-4 border-t border-zinc-900 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-white">{s.rating}</span>
                          <span className="text-zinc-600 text-[10px]">({s.reviews})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-zinc-600 text-[10px] block">Desde</span>
                          <span className="text-white font-bold">${s.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500">No se encontraron servicios con esos filtros.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
