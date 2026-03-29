'use client';

import { 
  Mail, 
  MapPin, 
  DollarSign, 
  Star, 
  Edit3, 
  Globe,
  Award
} from 'lucide-react';

export default function ProfilePage() {
  const user = {
    name: 'Juan Doe',
    role: 'Desarrollador Full Stack',
    rating: 4.9,
    reviews: 156,
    email: 'juan@email.com',
    location: 'Barcelona, España',
    hourlyRate: 50,
    memberSince: 'Ene 2023',
    totalEarnings: '$45,200',
    completedOrders: 258,
    bio: 'Desarrollador con mas de 5 años de experiencia en React, Node.js y tecnologias web modernas. Apasionado por crear soluciones eficientes y escalables.',
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Ingles', level: 'Avanzado' },
      { name: 'Portugues', level: 'Basico' }
    ]
  };

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi perfil profesional</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona tu perfil de vendedor</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:bg-zinc-800 transition">
          <Edit3 size={16} /> Editar perfil
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TARJETA DE PRESENTACIÓN (Izquierda) */}
        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl">
              <img src="https://i.pravatar.cc/200?u=juan" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#0c0c0e]" />
          </div>

          <h2 className="text-2xl font-extrabold mb-1">{user.name}</h2>
          <p className="text-emerald-500 text-sm font-bold mb-4">{user.role}</p>
          
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm mb-8">
            <Star size={16} fill="currentColor" /> {user.rating} 
            <span className="text-zinc-500 font-medium ml-1">({user.reviews} reseñas)</span>
          </div>

          <div className="w-full space-y-4 border-t border-zinc-900 pt-8 mb-8 text-left">
            <div className="flex items-center gap-3 text-zinc-400">
              <Mail size={16} /> <span className="text-xs">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin size={16} /> <span className="text-xs">{user.location}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <DollarSign size={16} /> <span className="text-xs">${user.hourlyRate}/hora</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold">{user.totalEarnings}</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Ganancias</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold">{user.completedOrders}</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Pedidos</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold">{user.rating}</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Calificación</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold">Ene 2023</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Miembro</p>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN DETALLADA (Derecha) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold">Informacion profesional</h3>
              <div className="flex gap-2">
                {['Profesional', 'Habilidades', 'Cuenta'].map((tab, i) => (
                  <button key={tab} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition ${
                    i === 0 ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white'
                  }`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Nombre completo</label>
                <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-zinc-300">
                  {user.name}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Titulo profesional</label>
                <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-zinc-300">
                  {user.role}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Ubicacion</label>
                <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-zinc-300">
                  {user.location}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Tarifa por hora ($)</label>
                <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-zinc-300">
                  {user.hourlyRate}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Descripcion profesional</label>
              <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-zinc-300 min-h-[100px] leading-relaxed">
                {user.bio}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Idiomas</label>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3">
                    <span className="text-xs font-bold">{lang.name}</span>
                    <span className="text-[10px] text-zinc-500 italic">({lang.level})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}