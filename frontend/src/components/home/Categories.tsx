'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { categoryService } from '../../services/category.service'; 
import { useRouter } from 'next/navigation'; 

const getCategoryStyle = (name: string, index: number) => {
  const colorPalette = [
    { color: "bg-purple-500/10", text: "text-purple-500", fallbackIcon: "✨" },
    { color: "bg-blue-500/10", text: "text-blue-500", fallbackIcon: "🚀" },
    { color: "bg-red-500/10", text: "text-red-500", fallbackIcon: "⚡" },
    { color: "bg-green-500/10", text: "text-green-500", fallbackIcon: "🌟" },
    { color: "bg-yellow-500/10", text: "text-yellow-500", fallbackIcon: "💡" },
    { color: "bg-pink-500/10", text: "text-pink-500", fallbackIcon: "🎯" },
    { color: "bg-emerald-500/10", text: "text-emerald-500", fallbackIcon: "🔥" },
    { color: "bg-cyan-500/10", text: "text-cyan-500", fallbackIcon: "💎" },
  ];

  const nameLower = name.toLowerCase();
  const theme = colorPalette[index % colorPalette.length]; 
  let icon = theme.fallbackIcon;

  if (nameLower.includes('diseño') || nameLower.includes('design')) icon = '🎨';
  else if (nameLower.includes('programacion') || nameLower.includes('desarrollo') || nameLower.includes('dev')) icon = '💻';
  else if (nameLower.includes('video') || nameLower.includes('animacion')) icon = '🎥';
  else if (nameLower.includes('marketing') || nameLower.includes('seo')) icon = '📢';
  else if (nameLower.includes('escritura') || nameLower.includes('redaccion')) icon = '📝';
  else if (nameLower.includes('musica') || nameLower.includes('audio')) icon = '🎵';

  return { ...theme, icon };
};


export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data.slice(0, 8));
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/explore?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="theme-section py-24 px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="theme-text text-4xl font-black uppercase tracking-tighter italic">Explora por categoría</h2>
          <div className="w-20 h-1.5 bg-[#00e676] mx-auto mt-4 rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-zinc-500 font-medium tracking-widest uppercase text-sm">Cargando categorías...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-zinc-500">Aún no hay categorías disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((c, index) => {
              const style = getCategoryStyle(c.name, index);

              return (
              <div 
                key={c.id} 
                onClick={() => handleCategoryClick(c.name)} 
                className="theme-card p-8 rounded-[2rem] border hover:border-[#00e676]/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-16 h-16 rounded-2xl ${style.color} flex items-center justify-center text-3xl ${style.text} group-hover:scale-110 transition-transform`}>
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="theme-text text-xl font-black group-hover:text-[#00e676] transition-colors line-clamp-1" title={c.name}>
                        {c.name}
                      </h3>
                      <p className="theme-muted text-xs font-bold uppercase tracking-widest mt-1">Ver servicios</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}