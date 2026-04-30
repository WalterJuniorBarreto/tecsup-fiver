'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Search } from 'lucide-react';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/explore'); 
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="flex items-center bg-[#121214] border border-zinc-800 rounded-2xl p-2 pl-4 w-full max-w-3xl focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-xl"
    >
      <Search className="text-zinc-500 w-5 h-5 mr-3" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿Qué servicio estás buscando?"
        className="bg-transparent border-none outline-none text-white flex-1 text-sm font-medium"
      />
      <button 
        type="submit" 
        className="bg-[#00e676] text-black font-extrabold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(0,230,118,0.2)]"
      >
        BUSCAR
      </button>
    </form>
  );
}