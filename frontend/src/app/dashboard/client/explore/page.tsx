'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  Filter,
  X,
  ChevronDown
} from 'lucide-react';

export default function ExploreServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('relevance');

  const categories = [
    'Diseño', 'Programacion', 'Video', 'Redaccion', 'Marketing', 'Traduccion'
  ];

  const allServices = [
    { id: 1, category: 'Diseño', title: 'Diseño de logo profesional con guía de marca completa', author: 'Maria G.', rating: 4.9, reviews: 234, price: 150, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=500' },
    { id: 2, category: 'Programacion', title: 'Desarrollo de sitio web responsive con Next.js y Tailwind', author: 'Carlos R.', rating: 5.0, reviews: 89, price: 500, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500' },
    { id: 3, category: 'Video', title: 'Edicion de video profesional para YouTube y redes sociales', author: 'Ana L.', rating: 4.8, reviews: 156, price: 200, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=500' },
    { id: 4, category: 'Redaccion', title: 'Redaccion de contenido SEO optimizado para tu blog', author: 'Pedro M.', rating: 4.7, reviews: 312, price: 80, image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=500' },
    { id: 5, category: 'Marketing', title: 'Estrategia de marketing digital completa para tu negocio', author: 'Laura S.', rating: 4.9, reviews: 78, price: 350, image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=500' },
    { id: 6, category: 'Traduccion', title: 'Traduccion profesional ingles-español de documentos', author: 'Sofia T.', rating: 5.0, reviews: 445, price: 50, image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=500' },
    { id: 7, category: 'Diseño', title: 'Diseño de interfaz UI/UX para aplicaciones moviles', author: 'Diego F.', rating: 4.8, reviews: 123, price: 450, image: 'https://images.unsplash.com/photo-1581291518062-c9a79e7e9f33?auto=format&fit=crop&q=80&w=500' },
    { id: 8, category: 'Programacion', title: 'Desarrollo de API REST con Node.js y MongoDB', author: 'Roberto K.', rating: 4.9, reviews: 67, price: 300, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500' },
    { id: 9, category: 'Video', title: 'Animacion motion graphics para presentaciones', author: 'Carmen V.', rating: 4.6, reviews: 89, price: 180, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=500' }
  ];

  const filteredAndSortedServices = useMemo(() => {
    let result = allServices.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            service.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category);
      const min = priceRange.min === '' ? 0 : parseInt(priceRange.min);
      const max = priceRange.max === '' ? Infinity : parseInt(priceRange.max);
      return matchesSearch && matchesCategory && (service.price >= min && service.price <= max);
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchTerm, selectedCategories, priceRange, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  return (
    <div className="animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explorar servicios</h1>
        <p className="text-zinc-500 text-sm font-medium">Encuentra el servicio perfecto para tu proyecto</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué servicio buscas hoy?" 
            className="w-full bg-[#0c0c0e] border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00e676] transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-[#0c0c0e] border border-zinc-900 px-6 py-4 rounded-2xl text-white font-bold text-sm cursor-pointer hover:bg-zinc-900 transition focus:outline-none"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="rating">Mayor calificación</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-64 space-y-8">
          <div>
            <h3 className="text-white font-bold mb-4">Categorías</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="peer appearance-none w-5 h-5 border border-zinc-800 rounded bg-zinc-900 checked:bg-[#00e676] checked:border-[#00e676]" 
                    />
                    <X className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 left-1" />
                  </div>
                  <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-[#00e676]' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900">
            <h3 className="text-white font-bold mb-4">Precio</h3>
            <div className="flex items-center gap-3 mb-6">
              <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:outline-none" />
              <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white focus:outline-none" />
            </div>
            <button onClick={() => {setSearchTerm(''); setSelectedCategories([]); setPriceRange({min:'', max:''});}} className="w-full py-3 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:bg-zinc-900">Limpiar filtros</button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedServices.map((service) => (
              <Link key={service.id} href={`/dashboard/client/explore/${service.id}`} className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl overflow-hidden group hover:border-zinc-700 transition">
                <div className="relative h-44">
                  <img src={service.image} className="w-full h-full object-cover transition group-hover:scale-105" alt="" />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{service.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 rounded-full bg-zinc-800" />
                    <span className="text-[11px] text-zinc-500 font-bold">{service.author}</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-200 mb-6 group-hover:text-[#00e676] line-clamp-2 h-10">{service.title}</h4>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-white">{service.rating}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white">${service.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}