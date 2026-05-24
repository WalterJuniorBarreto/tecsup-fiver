'use client';

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Star, Search, Loader2, Heart, Users, Briefcase, ArrowRight } from 'lucide-react';
import { freelanceService } from '../../services/freelance.service';
import { useSearchParams } from 'next/navigation';
import { categoryService } from '../../services/category.service';
import Link from 'next/link';
import { useFavorites } from '../../hooks/useFavorites';
import { useReviews } from '../../hooks/useReviews';
import { useFreelancer } from '../../hooks/useFreelancer';
import { reviewService } from '../../services/review.service';

interface RealService {
  id: string;
  title: string;
  description?: string;
  price: number;
  image: string | null;
  seller: { id: string; name: string; username: string; avatar: string | null }; 
  category?: { id: string; name: string; slug: string } | null;
}

const repairMojibake = (value: string) => {
  if (!/[ÃÂ]/.test(value)) return value;

  try {
    const bytes = Uint8Array.from(value.split(''), (char) => char.charCodeAt(0) & 0xff);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
};

const normalizeFilterText = (value?: string | null) =>
  repairMojibake(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const categoryMatchesSelection = (
  category: RealService['category'],
  selectedCategories: string[]
) => {
  if (selectedCategories.length === 0) return true;
  if (!category) return false;

  const categoryValues = [category.id, category.slug, category.name].map(normalizeFilterText);
  return selectedCategories.some((selected) => categoryValues.includes(normalizeFilterText(selected)));
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExplorePageContent />
    </Suspense>
  );
}

function ExplorePageFallback() {
  return (
    <div className="theme-page min-h-screen flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="w-12 h-12 text-[#00e676] animate-spin mb-4" />
        <p className="theme-muted font-bold tracking-widest uppercase text-sm">Buscando...</p>
      </div>
    </div>
  );
}

function ExplorePageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchMode, setSearchMode] = useState<'services' | 'freelancers'>('services');

  // Filtros
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minimumRating, setMinimumRating] = useState('0');
  
  // Ordenamiento
  const [sortBy, setSortBy] = useState('relevance');
  const [freelancerSortBy, setFreelancerSortBy] = useState('relevance');

  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [services, setServices] = useState<RealService[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );

  const availableCategories = useMemo(() => {
    if (categoriesList.length > 0) return categoriesList;

    const categoriesByKey = new Map<string, { id: string; name: string; slug: string }>();
    services.forEach((service) => {
      if (!service.category) return;

      const key = service.category.id || service.category.slug || normalizeFilterText(service.category.name);
      if (!categoriesByKey.has(key)) {
        categoriesByKey.set(key, {
          id: service.category.id || key,
          name: service.category.name,
          slug: service.category.slug || key
        });
      }
    });

    return Array.from(categoriesByKey.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesList, services]);

  const { isServiceFavorited, toggleFavorite } = useFavorites();

  // 🚀 LA MAGIA: Mapas de estado para guardar las notas que las tarjetas nos van reportando
  const [serviceRatings, setServiceRatings] = useState<Record<string, { average: number, total: number }>>({});
  const [freelancerRatings, setFreelancerRatings] = useState<Record<string, number>>({});

  // Funciones para que las tarjetas nos avisen cuando ya tienen su nota
  const handleServiceRatingLoaded = useCallback((id: string, average: number, total: number) => {
    setServiceRatings(prev => {
      if (prev[id]?.average === average && prev[id]?.total === total) return prev;
      return { ...prev, [id]: { average, total } };
    });
  }, []);

  const handleFreelancerRatingLoaded = useCallback((id: string, average: number) => {
    setFreelancerRatings(prev => {
      if (prev[id] === average) return prev;
      return { ...prev, [id]: average };
    });
  }, []);

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

  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategories(categoryParam ? [categoryParam] : []);
  }, [queryParam, categoryParam]);

  // 🚀 LÓGICA DE FILTRADO Y ORDENAMIENTO (SERVICIOS)
  const filteredServices = useMemo(() => {
    const normalizedQuery = normalizeFilterText(searchQuery);

    const filtered = services.filter(service => {
      const searchableText = [
        service.title,
        service.description,
        service.category?.name,
        service.category?.slug,
        service.seller?.name,
        service.seller?.username
      ].map(normalizeFilterText).join(' ');

      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesCategory = categoryMatchesSelection(service.category, selectedCategories);
      const matchesMinPrice = minPrice === '' || service.price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || service.price <= Number(maxPrice);
      
      // 🚀 Usamos la nota que la tarjeta nos reportó (si aún no reporta, asumimos 5 para que no desaparezca de golpe)
      const serviceRating = serviceRatings[service.id]?.average !== undefined ? serviceRatings[service.id].average : 5; 
      const matchesRating = minimumRating === '0' || serviceRating >= Number(minimumRating);

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price-desc': sorted.sort((a, b) => b.price - a.price); break;
      // 🚀 Ordenamos usando el mapa de estados
      case 'rating-desc': sorted.sort((a, b) => (serviceRatings[b.id]?.average || 0) - (serviceRatings[a.id]?.average || 0)); break;
      case 'reviews-desc': sorted.sort((a, b) => (serviceRatings[b.id]?.total || 0) - (serviceRatings[a.id]?.total || 0)); break;
      default: break;
    }
    return sorted;
  }, [services, searchQuery, selectedCategories, minPrice, maxPrice, minimumRating, sortBy, serviceRatings]);

  // 🚀 LÓGICA DE FILTRADO Y ORDENAMIENTO (FREELANCERS)
  const filteredFreelancers = useMemo(() => {
    const uniqueSellers = new Map();
    
    services.forEach(s => {
      if (s.seller) {
        const sellerKey = s.seller.id || s.seller.username; 
        if (sellerKey) {
          if (!uniqueSellers.has(sellerKey)) {
            uniqueSellers.set(sellerKey, { ...s.seller, id: sellerKey, serviceCount: 1 });
          } else {
            uniqueSellers.get(sellerKey).serviceCount += 1;
          }
        }
      }
    });

    const q = searchQuery.toLowerCase().trim();
    let result = Array.from(uniqueSellers.values()).filter(seller => {
      if (!q) return true; 
      const name = seller.name || '';
      const username = seller.username || '';
      return name.toLowerCase().includes(q) || username.toLowerCase().includes(q);
    });

    // 🚀 Ordenamiento de Freelancers usando el mapa
    switch (freelancerSortBy) {
      case 'services-desc': result.sort((a, b) => b.serviceCount - a.serviceCount); break;
      case 'rating-desc': result.sort((a, b) => (freelancerRatings[b.id] || 0) - (freelancerRatings[a.id] || 0)); break;
      default: break;
    }

    return result;
  }, [services, searchQuery, freelancerSortBy, freelancerRatings]);

  const toggleCategory = (catId: string) => setSelectedCategories(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
  const clearFilters = () => { setSelectedCategories([]); setMinPrice(''); setMaxPrice(''); setSearchQuery(''); setMinimumRating('0'); setSortBy('relevance'); setFreelancerSortBy('relevance'); };

  return (
    <div className="theme-page min-h-screen flex flex-col font-sans selection:bg-[#00e676]/30">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 w-full flex-1">
        
        <header className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Explora el talento</h1>
          <p className="theme-secondary mb-10 max-w-xl text-lg">Encuentra el servicio perfecto o descubre a los mejores profesionales para llevar tu proyecto al siguiente nivel.</p>
          
          <div className="relative w-full max-w-2xl group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00e676]/40 to-emerald-900/40 rounded-3xl blur-md opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 theme-muted w-6 h-6 group-focus-within:text-[#00e676] transition-colors" />
              <input 
                type="text"
                placeholder={searchMode === 'services' ? "¿Qué servicio necesitas hoy?" : "Busca a un freelancer por su nombre..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="theme-input w-full border rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#00e676]/50 transition-all text-base font-medium shadow-2xl"
              />
            </div>
          </div>

          <div className="theme-quiet-panel flex p-1.5 rounded-2xl border inline-flex shadow-lg">
            <button onClick={() => setSearchMode('services')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${searchMode === 'services' ? 'theme-soft theme-text shadow-md' : 'theme-muted hover:text-[var(--text-secondary)] hover:bg-zinc-900/50'}`}>
              <Briefcase size={16} /> Servicios
            </button>
            <button onClick={() => setSearchMode('freelancers')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${searchMode === 'freelancers' ? 'bg-[#00e676] text-black shadow-md shadow-[#00e676]/20' : 'theme-muted hover:text-[var(--text-secondary)] hover:bg-zinc-900/50'}`}>
              <Users size={16} /> Freelancers
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {searchMode === 'services' && (
            <aside className="theme-quiet-panel w-full lg:w-72 space-y-8 shrink-0 p-6 border rounded-[2rem] h-fit sticky top-24">
              <div>
                <h3 className="theme-text font-bold text-lg mb-4">Categorías</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-track]:bg-transparent">
                  {availableCategories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={categoryMatchesSelection(cat, selectedCategories)} onChange={() => toggleCategory(cat.id)} className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 checked:bg-[#00e676] transition cursor-pointer accent-[#00e676]"/>
                      <span className="theme-secondary text-sm font-medium group-hover:text-[var(--text-primary)] transition">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="theme-divider h-[1px] w-full"></div>

              <div>
                <h3 className="theme-text font-bold text-lg mb-4">Precio (S/)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="theme-quiet-control w-full border rounded-xl p-2.5 text-sm outline-none focus:border-[#00e676]/50 transition"/>
                  <span className="theme-muted font-bold">-</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="theme-quiet-control w-full border rounded-xl p-2.5 text-sm outline-none focus:border-[#00e676]/50 transition"/>
                </div>
              </div>

              <div className="theme-divider h-[1px] w-full"></div>

              <div>
                <h3 className="theme-text font-bold text-lg mb-4">Calificación mínima</h3>
                <div className="space-y-3">
                  {[
                    { value: '0', label: 'Todas' },
                    { value: '4', label: '4+ estrellas' },
                    { value: '4.5', label: '4.5+ estrellas' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="minimum-rating"
                        value={option.value}
                        checked={minimumRating === option.value}
                        onChange={(e) => setMinimumRating(e.target.value)}
                        className="w-4 h-4 border-zinc-700 bg-zinc-900 checked:bg-[#00e676] accent-[#00e676] cursor-pointer"
                      />
                      <span className="theme-secondary flex items-center gap-2 text-sm group-hover:text-[var(--text-primary)] transition">
                        {option.value !== '0' && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={clearFilters} className="theme-secondary theme-border w-full py-3 text-xs uppercase tracking-widest font-bold hover:text-[var(--text-primary)] transition border rounded-xl hover:bg-[var(--bg-soft)] active:scale-95">
                Limpiar filtros
              </button>
            </aside>
          )}

          <main className="flex-1 min-w-0">
            <div className="theme-quiet-panel flex justify-between items-center mb-8 p-4 rounded-2xl border">
              <span className="theme-secondary font-medium text-sm">
                <strong className="theme-text">
                  {searchMode === 'services' ? filteredServices.length : filteredFreelancers.length}
                </strong> resultados encontrados
              </span>
              
              <div className="flex items-center gap-3">
                <span className="theme-muted text-sm hidden sm:block">Ordenar por:</span>
                
                {searchMode === 'services' ? (
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="theme-quiet-control border text-sm rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#00e676]/50">
                    <option value="relevance">Relevancia</option>
                    <option value="rating-desc">Mejor calificación</option>
                    <option value="reviews-desc">Más reseñas</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                  </select>
                ) : (
                  <select value={freelancerSortBy} onChange={(e) => setFreelancerSortBy(e.target.value)} className="theme-quiet-control border text-sm rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-[#00e676]/50">
                    <option value="relevance">Relevancia</option>
                    <option value="rating-desc">Mejor calificación</option>
                    <option value="services-desc">Más servicios</option>
                  </select>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="theme-quiet-panel flex flex-col items-center justify-center py-32 border rounded-[2rem] shadow-xl">
                <Loader2 className="w-12 h-12 text-[#00e676] animate-spin mb-4" />
                <p className="theme-muted font-bold tracking-widest uppercase text-sm">Buscando...</p>
              </div>
            ) : searchMode === 'services' ? (
              filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredServices.map((s) => (
                    <ServiceCardItem key={s.id} s={s} favorited={isServiceFavorited(s.id)} onToggleFavorite={toggleFavorite} onRatingLoaded={handleServiceRatingLoaded} />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={clearFilters} message="No encontramos servicios que coincidan con tu búsqueda." />
              )
            ) : (
              filteredFreelancers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFreelancers.map((freelancer) => (
                    <FreelancerCardItem key={freelancer.id} freelancer={freelancer} onRatingLoaded={handleFreelancerRatingLoaded} />
                  ))}
                </div>
              ) : (
                <EmptyState onClear={() => setSearchQuery('')} message="No encontramos ningún freelancer con ese nombre." />
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// 🧩 MINI-COMPONENTES
// --------------------------------------------------------------------------------------

function EmptyState({ onClear, message }: { onClear: () => void, message: string }) {
  return (
    <div className="theme-quiet-panel text-center py-24 border border-dashed rounded-[2rem]">
      <Search className="w-12 h-12 theme-muted mx-auto mb-4" />
      <p className="theme-secondary font-medium mb-6">{message}</p>
      <button onClick={onClear} className="text-[#00e676] font-bold hover:underline">Limpiar búsqueda</button>
    </div>
  );
}

function ServiceCardItem({ s, favorited, onToggleFavorite, onRatingLoaded }: { s: any, favorited: boolean, onToggleFavorite: (id: string) => void, onRatingLoaded: (id: string, avg: number, total: number) => void }) {
  const { stats, isLoading } = useReviews(s.id); 
  
  // 🚀 LA TARJETA REPORTA SU NOTA AL PADRE
  useEffect(() => {
    if (!isLoading && stats) {
      onRatingLoaded(s.id, stats.average || 0, stats.total || 0);
    }
  }, [isLoading, stats, s.id, onRatingLoaded]);

  const authorName = s.seller?.name || s.seller?.username || 'Usuario Anónimo';
  const authorAvatar = s.seller?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=0a0a0a&color=00e676`;
  const serviceImage = s.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80';

  return (
    <Link href={`/explore/${s.id}`} className="block group">
      <div className="theme-card rounded-3xl overflow-hidden border hover:border-[#00e676]/50 hover:shadow-[0_0_30px_rgba(0,230,118,0.1)] transition-all flex flex-col cursor-pointer h-full relative">
        <div className="theme-soft relative h-48 overflow-hidden">
          <img src={serviceImage} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-40" />
          <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-lg text-[#00e676] uppercase tracking-wider border border-white/5">{s.category?.name || 'General'}</span>
          <button onClick={(e) => { e.preventDefault(); onToggleFavorite(s.id); }} className={`absolute top-4 right-4 p-2.5 backdrop-blur-md border rounded-full transition-all active:scale-90 z-10 ${favorited ? 'bg-[#00e676] text-black border-transparent shadow-[0_0_15px_rgba(0,230,118,0.4)]' : 'bg-[var(--bg-overlay)] theme-secondary theme-border-soft hover:bg-[#00e676] hover:text-black hover:border-transparent'}`}>
            <Heart size={18} fill={favorited ? "currentColor" : "none"} className={favorited ? "animate-in zoom-in-125 duration-300" : ""} />
          </button>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-4">
            <img src={authorAvatar} className="w-8 h-8 rounded-full border theme-border object-cover" alt={authorName} />
            <span className="theme-secondary text-xs font-bold truncate group-hover:text-[var(--text-primary)] transition">{authorName}</span>
          </div>
          <h4 className="theme-text text-lg font-bold mb-6 line-clamp-2 group-hover:text-[#00e676] transition leading-tight">{s.title}</h4>
          <div className="mt-auto pt-4 border-t theme-border flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#00e676] fill-[#00e676]" />
              <span className="theme-text text-sm font-bold">{stats?.average?.toFixed(1) || '0.0'}</span>
              <span className="theme-muted text-[10px] font-bold">({stats?.total || 0})</span>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="theme-muted text-[10px] block uppercase tracking-widest font-bold">Desde</span>
              <span className="theme-text font-black text-xl">S/ {s.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 🚀 TARJETA DE FREELANCER CON SUS RESEÑAS REALES 
function FreelancerCardItem({ freelancer, onRatingLoaded }: { freelancer: any, onRatingLoaded: (id: string, avg: number) => void }) {
  const { profile, loading } = useFreelancer(freelancer.id);
  
  // 🚀 NUEVO ESTADO: Guardamos las notas reales calculadas desde MongoDB
  const [realStats, setRealStats] = useState({ average: 0, total: 0, isCalculated: false });
  
  useEffect(() => {
    const fetchRealReviews = async () => {
      // Si el perfil no tiene servicios publicados, su nota es 0
      if (!profile?.services || profile.services.length === 0) {
        setRealStats({ average: 0, total: 0, isCalculated: true });
        onRatingLoaded(freelancer.id, 0);
        return;
      }

      try {
        // Buscamos las reseñas de TODOS sus servicios
        const promises = profile.services.map((service: any) => 
          reviewService.getServiceReviews(service.id)
        );
        const results = await Promise.all(promises);
        
        // Juntamos todas las reseñas en una sola lista
        const allReviews = results.flatMap(res => res.reviews);
        
        // Calculamos el total y el promedio REAL
        const total = allReviews.length;
        const average = total > 0 ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / total) : 0;
        
        // Guardamos los datos reales para pintarlos en la tarjeta
        setRealStats({ average, total, isCalculated: true });
        
        // Le avisamos al filtro de la página principal cuál es la nota real
        onRatingLoaded(freelancer.id, average);

      } catch (error) {
        console.error("Error calculando reseñas reales para la tarjeta:", error);
        setRealStats({ average: 0, total: 0, isCalculated: true });
        onRatingLoaded(freelancer.id, 0);
      }
    };

    if (!loading && profile) {
      fetchRealReviews();
    }
  }, [loading, profile, freelancer.id, onRatingLoaded]);

  const avatar = freelancer.avatar || `https://ui-avatars.com/api/?name=${freelancer.name}&background=0a0a0a&color=00e676&size=150`;

  // Mientras calcula, mostramos 0 para que no salte el diseño
  const displayRating = realStats.isCalculated ? realStats.average : 0;
  const displayReviewsCount = realStats.isCalculated ? realStats.total : 0;

  return (
    <Link href={`/freelancer/${freelancer.id}`} className="block group">
      <div className="theme-card border rounded-3xl p-6 text-center hover:border-[#00e676]/50 hover:shadow-[0_0_30px_rgba(0,230,118,0.1)] transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-800/30 to-transparent"></div>
        <img src={avatar} alt={freelancer.name} className="w-20 h-20 rounded-full object-cover border-4 border-[var(--bg-page)] mx-auto mb-4 relative z-10 group-hover:scale-105 transition-transform" />
        <h3 className="theme-text text-xl font-black truncate mb-1">{freelancer.name}</h3>
        <p className="theme-muted text-sm font-medium mb-6">@{freelancer.username}</p>
        <div className="flex items-center justify-center gap-4 mb-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="theme-text font-bold">{freelancer.serviceCount}</span>
            <span className="theme-muted text-[10px] uppercase tracking-widest font-bold">Servicios</span>
          </div>
          <div className="theme-divider w-[1px] h-6"></div>
          <div className="flex flex-col items-center">
            <span className="text-[#00e676] font-bold flex items-center gap-1">
              {/* 🚀 AQUÍ IMPRIMIMOS EL RATING REAL */}
              <Star size={12} className="fill-[#00e676]"/> {displayRating.toFixed(1)}
            </span>
            {/* 🚀 AQUÍ IMPRIMIMOS EL TOTAL REAL DE OPINIONES */}
            <span className="theme-muted text-[10px] uppercase tracking-widest font-bold">({displayReviewsCount} op.)</span>
          </div>
        </div>
        <div className="theme-border theme-secondary w-full py-2.5 rounded-xl border text-sm font-bold group-hover:bg-[#00e676] group-hover:text-black group-hover:border-transparent transition-all flex justify-center items-center gap-2">
          Ver Perfil <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}
