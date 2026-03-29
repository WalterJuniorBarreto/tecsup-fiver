'use client';

import { useState, useRef } from 'react';
import { 
  Plus, MoreVertical, Star, X, Eye, Pencil, 
  PauseCircle, Trash2, Image as ImageIcon,
  ChevronDown, PlayCircle
} from 'lucide-react';

export default function MyServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filter, setFilter] = useState('Todos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado de la lista de servicios
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Desarrollo de sitio web responsive con Next.js y Tailwind',
      category: 'Programación',
      price: 500,
      rating: 5.0,
      reviews: 89,
      orders: 124,
      earned: 62000,
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    },
    {
      id: 2,
      title: 'Desarrollo de API REST con Node.js y MongoDB',
      category: 'Programación',
      price: 600,
      rating: 4.9,
      reviews: 67,
      orders: 89,
      earned: 53400,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    }
  ]);

  // Estado para el formulario (Incluye imagen)
  const [formData, setFormData] = useState({
    title: '',
    category: 'Programación',
    description: '',
    price: '',
    deliveryTime: '',
    image: '' 
  });

  // --- LÓGICA DE SIMULACIÓN ---

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulamos la carga creando una URL local
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      id: Date.now(),
      title: formData.title || 'Servicio sin título',
      category: formData.category,
      price: Number(formData.price) || 0,
      rating: 0,
      reviews: 0,
      orders: 0,
      earned: 0,
      // Si no subió imagen, ponemos una por defecto
      image: formData.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop',
      status: 'Activo'
    };
    setServices([newService, ...services]);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'Programación', description: '', price: '', deliveryTime: '', image: '' });
  };

  const toggleStatus = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, status: s.status === 'Activo' ? 'Pausado' : 'Activo' } : s
    ));
    setActiveMenu(null);
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    setActiveMenu(null);
  };

  const filteredServices = services.filter(s => filter === 'Todos' ? true : s.status === filter);

  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis servicios</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona tus servicios publicados</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-[#00e676] text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:scale-105 transition shadow-lg shadow-emerald-500/10"
        >
          <Plus size={18} /> Crear servicio
        </button>
      </header>

      {/* FILTROS */}
      <div className="flex gap-4 mb-8">
        {['Todos', 'Activo', 'Pausado'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition ${
              filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {f} ({f === 'Todos' ? services.length : services.filter(s => s.status === f).length})
          </button>
        ))}
      </div>

      {/* LISTA DE SERVICIOS */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-6 flex gap-6 items-center relative group hover:border-zinc-700 transition">
            <div className="w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-800 border border-zinc-800">
              <img src={service.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${service.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  {service.status}
                </span>
                <span className="bg-zinc-900 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{service.category}</span>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-400 transition">{service.title}</h3>
              <div className="flex items-center gap-6 text-xs text-zinc-500">
                <span className="text-white font-bold text-xl">${service.price}</span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star size={14} fill="currentColor"/> {service.rating} ({service.reviews})</span>
                <span className="flex items-center gap-1 font-medium underline italic">{service.orders} pedidos</span>
                <span className="text-emerald-500 font-bold">${service.earned.toLocaleString()} ganados</span>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setActiveMenu(activeMenu === service.id ? null : service.id)} className="p-2 hover:bg-zinc-900 rounded-full transition">
                <MoreVertical size={20} className="text-zinc-500" />
              </button>
              {activeMenu === service.id && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121212] border border-zinc-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300 text-left"><Eye size={16} /> Ver servicio</button>
                  <button onClick={() => toggleStatus(service.id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800 transition text-zinc-300 text-left">
                    {service.status === 'Activo' ? <><PauseCircle size={16} /> Pausar</> : <><PlayCircle size={16} /> Activar</>}
                  </button>
                  <div className="h-[1px] bg-zinc-900 my-1" />
                  <button onClick={() => deleteService(service.id)} className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 transition text-left"><Trash2 size={16} /> Eliminar</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PARA CREAR SERVICIO CON SUBIDA DE IMAGEN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-black border border-zinc-900 w-full max-w-3xl rounded-[40px] p-10 relative my-auto shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition">
              <X size={24} />
            </button>
            
            <form className="space-y-8" onSubmit={handleCreateService}>
              {/* Información básica */}
              <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 space-y-6">
                <h3 className="font-bold text-sm">Informacion basica</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Titulo del servicio</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} type="text" placeholder="Ej: Diseno de logo profesional" className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-emerald-500 transition text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Categoria</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-emerald-500 transition text-zinc-400 text-sm appearance-none cursor-pointer">
                    <option>Programación</option>
                    <option>Diseño Gráfico</option>
                    <option>Marketing Digital</option>
                  </select>
                </div>
              </div>

              {/* SECCIÓN DE IMAGEN */}
              <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 space-y-6">
                <h3 className="font-bold text-sm">Galeria de imagenes</h3>
                <div className="grid grid-cols-4 gap-4">
                  {formData.image ? (
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="text-white" size={20} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square bg-black border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500 transition group text-zinc-500 hover:text-emerald-500"
                    >
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Subir</span>
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              {/* Precio y Entrega */}
              <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Precio base (USD)</label>
                    <input required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} type="number" placeholder="50" className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-emerald-500 transition text-white text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entrega (dias)</label>
                    <input required value={formData.deliveryTime} onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})} type="number" placeholder="5" className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-emerald-500 transition text-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-zinc-800 rounded-2xl text-white font-bold text-sm">Cancelar</button>
                <button type="submit" className="flex-[2] bg-[#00e676] text-black font-extrabold py-4 rounded-2xl hover:bg-emerald-400 transition">Publicar servicio</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}