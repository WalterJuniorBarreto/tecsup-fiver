'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Star, Calendar, ShoppingBag, Check, Pencil, X
} from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal');
  const [isEditing, setIsEditing] = useState(false);
  const [orderCount, setOrderCount] = useState(24); // Valor base por defecto

  // ESTADO DE LOS DATOS DEL PERFIL
  const [profileData, setProfileData] = useState({
    name: 'Maria Garcia',
    company: 'Garcia Digital SL',
    email: 'maria@email.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    bio: 'Emprendedora digital buscando los mejores freelancers para mis proyectos.'
  });

  // Lógica para contar pedidos reales del localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('simulated_orders') || '[]');
    // Sumamos los pedidos estáticos iniciales (4) + los nuevos comprados
    setOrderCount(4 + savedOrders.length);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // Aquí podrías agregar una lógica de guardado en base de datos o localStorage
    alert('¡Perfil actualizado con éxito!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
      
      {/* Header de Perfil */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Mi perfil</h1>
          <p className="text-zinc-500 text-sm mt-1">Gestiona tu información personal</p>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-zinc-400 hover:text-white transition flex items-center gap-2"
            >
              <X size={16} /> Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-[#00e676] rounded-xl text-sm font-bold text-black hover:bg-emerald-400 transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Check size={16} /> Guardar cambios
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-white hover:bg-zinc-800 transition flex items-center gap-2"
          >
            <Pencil size={16} /> Editar perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TARJETA IZQUIERDA: RESUMEN VISUAL */}
        <div className="lg:col-span-4 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#00e676] to-emerald-900 p-1">
              <img 
                src="https://i.pravatar.cc/300?u=maria" 
                className="w-full h-full rounded-full object-cover border-4 border-[#0c0c0e]" 
                alt="Profile"
              />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white">{profileData.name}</h2>
          <p className="text-zinc-500 text-sm mb-8 font-medium">{profileData.company}</p>

          <div className="w-full space-y-4 mb-10 border-t border-zinc-900 pt-8">
            <ContactItem icon={<Mail size={16}/>} text={profileData.email} />
            <ContactItem icon={<Phone size={16}/>} text={profileData.phone} />
            <ContactItem icon={<MapPin size={16}/>} text={profileData.location} />
          </div>

          {/* Stats Reales */}
          <div className="w-full grid grid-cols-3 gap-2 pt-6 border-t border-zinc-900">
            <StatItem icon={<ShoppingBag size={18}/>} value={orderCount.toString()} label="Pedidos" />
            <StatItem icon={<Star size={18}/>} value="18" label="Reseñas" />
            <StatItem icon={<Calendar size={18}/>} value="Mar 2024" label="Miembro" />
          </div>
        </div>

        {/* TARJETA DERECHA: FORMULARIO INTERACTIVO */}
        <div className="lg:col-span-8 bg-[#0c0c0e] border border-zinc-900 rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold text-white mb-2">Información {activeTab.toLowerCase()}</h3>
          <p className="text-zinc-500 text-sm mb-8">Esta información será visible para los freelancers con los que trabajes.</p>

          {/* Pestañas de Navegación */}
          <div className="flex bg-zinc-900/50 p-1 rounded-xl w-fit mb-10 gap-1">
            {['Personal', 'Empresa', 'Seguridad'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Inputs Dinámicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputField 
              label="Nombre completo" 
              name="name"
              value={profileData.name} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
            <InputField 
              label="Email" 
              name="email"
              value={profileData.email} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
            <InputField 
              label="Teléfono" 
              name="phone"
              value={profileData.phone} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
            <InputField 
              label="Ubicación" 
              name="location"
              value={profileData.location} 
              isEditing={isEditing} 
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Biografía</label>
            <textarea 
              name="bio"
              readOnly={!isEditing}
              value={profileData.bio}
              onChange={handleChange}
              className={`w-full bg-[#0c0c0e] border rounded-2xl p-4 text-sm transition-all h-32 focus:outline-none ${
                isEditing 
                ? 'border-[#00e676]/30 text-white focus:border-[#00e676]' 
                : 'border-zinc-900 text-zinc-400'
              }`}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function ContactItem({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 text-zinc-400 group cursor-default">
      <div className="text-zinc-600 group-hover:text-[#00e676] transition-colors">{icon}</div>
      <span className="text-sm font-medium truncate">{text}</span>
    </div>
  );
}

function StatItem({ icon, value, label }: { icon: any, value: string, label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-zinc-600 mb-2">{icon}</div>
      <p className="text-lg font-black text-white leading-none mb-1">{value}</p>
      <p className="text-[9px] text-zinc-500 uppercase font-black tracking-tighter">{label}</p>
    </div>
  );
}

function InputField({ label, name, value, isEditing, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-black tracking-widest text-zinc-600">{label}</label>
      <input 
        type="text" 
        name={name}
        readOnly={!isEditing}
        value={value}
        onChange={onChange}
        className={`w-full bg-[#0c0c0e] border rounded-xl py-3 px-4 text-sm transition-all focus:outline-none ${
          isEditing 
          ? 'border-[#00e676]/30 text-white focus:border-[#00e676]' 
          : 'border-zinc-900 text-zinc-400'
        }`}
      />
    </div>
  );
}