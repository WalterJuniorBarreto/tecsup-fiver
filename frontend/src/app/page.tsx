'use client';

import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Categories from '../components/home/Categories';
import FeaturedServices from '../components/home/FeaturedServices';
import Footer from '../components/layout/Footer';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Función para manejar la búsqueda desde el Hero
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const element = document.getElementById('servicios-destacados');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00e676] selection:text-black">
      <Navbar />
      
      {/* SECCIÓN 1: HERO */}
      <section className="flex flex-col items-center justify-center pt-32 pb-16 px-4">
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-black text-center max-w-4xl leading-[1.1] tracking-tighter italic uppercase">
            Encuentra el talento <br /> <span className="text-[#00e676]">perfecto</span> ahora
          </h1>
          
          <p className="text-zinc-500 mt-8 text-center max-w-2xl text-lg font-medium">
            Conecta con freelancers expertos. Tu próximo proyecto comienza aquí.
          </p>

          {/* BARRA DE BÚSQUEDA FUNCIONAL */}
          <form onSubmit={handleSearch} className="mt-12 w-full max-w-2xl group">
            <div className="flex items-center bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-2 pl-6 focus-within:border-[#00e676]/50 focus-within:ring-4 focus-within:ring-[#00e676]/10 transition-all shadow-2xl">
              <span className="text-zinc-600">🔍</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="¿Qué servicio estás buscando?" 
                className="bg-transparent border-none outline-none w-full px-4 text-white placeholder:text-zinc-700 font-medium"
              />
              <button type="submit" className="bg-[#00e676] text-black px-8 py-3.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all">
                Buscar
              </button>
            </div>
          </form>

          {/* TAGS POPULARES */}
          <div className="flex flex-wrap gap-2 mt-8 items-center justify-center">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mr-2">Popular:</span>
            {['Diseño', 'Programacion', 'Video'].map((tag) => (
              <button 
                key={tag} 
                onClick={() => {
                  setSelectedCategory(tag);
                  document.getElementById('servicios-destacados')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-1.5 bg-zinc-900/30 border border-zinc-800 rounded-full text-[11px] font-bold text-zinc-400 hover:border-[#00e676] hover:text-[#00e676] transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-10 md:gap-24 mt-32 border-t border-zinc-900 pt-16 w-full max-w-5xl justify-center">
          <StatItem value="50K+" label="Freelancers" />
          <StatItem value="120K+" label="Proyectos" />
          <StatItem value="98%" label="Satisfacción" />
        </div>
      </section>

      {/* SECCIÓN 2: CATEGORÍAS */}
      <Categories onSelectCategory={(cat) => {
        setSelectedCategory(cat);
        document.getElementById('servicios-destacados')?.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* SECCIÓN 3: SERVICIOS FILTRADOS */}
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
      <p className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-black">{label}</p>
    </div>
  );
}