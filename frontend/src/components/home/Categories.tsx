'use client';

interface CategoriesProps {
  onSelectCategory: (category: string) => void;
}

export default function Categories({ onSelectCategory }: CategoriesProps) {
  const cats = [
    { title: "Diseño", icon: "🎨", color: "bg-purple-500/10", text: "text-purple-500" },
    { title: "Programacion", icon: "💻", color: "bg-blue-500/10", text: "text-blue-500" },
    { title: "Video", icon: "🎥", color: "bg-red-500/10", text: "text-red-500" },
    { title: "Marketing", icon: "📢", color: "bg-green-500/10", text: "text-green-500" },
    { title: "Escritura", icon: "📝", color: "bg-yellow-500/10", text: "text-yellow-500" },
    { title: "Música", icon: "🎵", color: "bg-pink-500/10", text: "text-pink-500" },
  ];

  return (
    <section className="py-24 px-10 bg-[#060606]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Explora por categoría</h2>
          <div className="w-20 h-1.5 bg-[#00e676] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((c) => (
            <div 
              key={c.title} 
              onClick={() => onSelectCategory(c.title)}
              className="bg-[#0c0c0e] border border-zinc-900 p-8 rounded-[2rem] hover:border-[#00e676]/50 hover:bg-zinc-900/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${c.color} flex items-center justify-center text-3xl ${c.text} group-hover:scale-110 transition-transform`}>
                  {c.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-black group-hover:text-[#00e676] transition-colors">{c.title}</h3>
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mt-1">Ver servicios</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}