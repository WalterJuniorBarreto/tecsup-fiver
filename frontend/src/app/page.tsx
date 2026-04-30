'use client';

import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Categories from '../components/home/Categories';
import FeaturedServices from '../components/home/FeaturedServices';
import Footer from '../components/layout/Footer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (searchTerm.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/explore'); 
    }
  };

  return (
    <main className="theme-page min-h-screen selection:bg-[#00e676] selection:text-black">
      <Navbar />
      
      <section className="flex flex-col items-center justify-center pt-32 pb-16 px-4">
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black text-center max-w-4xl leading-[1.1] tracking-tighter italic uppercase">
            Encuentra el talento <br /> <span className="text-[#00e676]">perfecto</span> ahora
          </h1>
          
          <p className="theme-secondary mt-8 text-center max-w-2xl text-lg font-medium">
            Conecta con freelancers expertos. Tu próximo proyecto comienza aquí.
          </p>

         <form onSubmit={handleSearch} className="mt-12 w-full max-w-2xl group">
      <div className="theme-card flex items-center border rounded-2xl p-2 pl-6 focus-within:border-[#00e676]/50 focus-within:ring-4 focus-within:ring-[#00e676]/10 transition-all">
        <span className="theme-muted"></span>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="¿Qué servicio estás buscando?" 
          className="theme-input bg-transparent border-none outline-none w-full px-4 font-medium"
        />
        <button type="submit" className="bg-[#00e676] text-black px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all">
          Buscar
        </button>
      </div>
    </form>

         <div className="flex flex-wrap gap-2 mt-8 items-center justify-center">
            <span className="theme-muted text-[10px] font-black uppercase tracking-widest mr-2">
              Popular:
            </span>
            {['Diseño', 'Programacion', 'Video'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => {
                  router.push(`/explore?category=${encodeURIComponent(tag)}`);
                }}
                className="theme-soft theme-border-soft px-4 py-1.5 border rounded-full text-[11px] font-bold theme-secondary hover:border-[#00e676] hover:text-[#00e676] transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="theme-border flex flex-wrap gap-10 md:gap-24 mt-32 border-t pt-16 w-full max-w-5xl justify-center">
          <StatItem value="50K+" label="Freelancers" />
          <StatItem value="120K+" label="Proyectos" />
          <StatItem value="98%" label="Satisfacción" />
        </div>
      </section>

      <Categories />

      <div id="servicios-destacados">
        <FeaturedServices 
          activeCategory={selectedCategory} 
          searchTerm={searchTerm} 
          onReset={() => {
            setSelectedCategory('Todos');
            setSearchTerm('');
          }}
        />
      </div>

      <Footer />
    </main>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center group cursor-default">
      <h4 className="text-5xl font-black mb-1 group-hover:text-[#00e676] transition-colors tracking-tighter">{value}</h4>
      <p className="theme-muted text-[10px] uppercase tracking-[0.2em] font-black">{label}</p>
    </div>
  );
}
