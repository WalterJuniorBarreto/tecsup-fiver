import { useState, useRef, useEffect } from 'react'; // 🚀 Añadido useEffect
import { X, Loader2, Save, ImagePlus } from 'lucide-react';
import { freelanceService } from '../services/freelance.service';
import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceToEdit?: any | null; // 🚀 AÑADIMOS ESTA PROP PARA EDITAR
}

export default function CreateServiceModal({ isOpen, onClose, onSuccess, serviceToEdit }: CreateServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryDays: '1',
  });

  // 🚀 EFECTO MAGICO: Llena los datos si estamos editando, los limpia si estamos creando
  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        title: serviceToEdit.title,
        description: serviceToEdit.description,
        price: serviceToEdit.price.toString(),
        deliveryDays: serviceToEdit.deliveryDays.toString(),
      });
      setImagePreview(serviceToEdit.image); // Mostramos la foto que ya tenía
      setSelectedFile(null); // No hay archivo nuevo aún
    } else {
      setFormData({ title: '', description: '', price: '', deliveryDays: '1' });
      setImagePreview(null);
      setSelectedFile(null);
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError('La imagen es muy pesada. Máximo 5MB.');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); 
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Por defecto, usamos la imagen que ya existía (si estamos editando)
      let finalImageUrl = serviceToEdit?.image || null; 

      // Si el usuario seleccionó una NUEVA foto, la subimos a Cloudinary
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        
        const uploadRes = await api.post('/api/chats/upload', uploadData, {
          headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.fileUrl;
      }

      const serviceDataPayload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        deliveryDays: Number(formData.deliveryDays),
        image: finalImageUrl 
      };

      // 🚀 DECIDIMOS SI CREAR O ACTUALIZAR
      if (serviceToEdit) {
        await freelanceService.updateService(serviceToEdit.id, serviceDataPayload);
      } else {
        await freelanceService.createService(serviceDataPayload);
      }

      onSuccess();
      onClose();
      
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden scale-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-[#0c0c0e] shrink-0">
          {/* 🚀 TÍTULO DINÁMICO */}
          <h2 className="text-xl font-bold text-white">
            {serviceToEdit ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form id="service-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Portada del servicio *</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
                  imagePreview ? 'border-emerald-500/50' : 'border-zinc-800 hover:border-emerald-500 hover:bg-emerald-500/5'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-bold text-sm bg-black/80 px-3 py-1 rounded-full">Cambiar foto</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-2">
                      <ImagePlus size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-zinc-400">Haz clic para subir una foto</p>
                    <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">PNG, JPG hasta 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Título del servicio *</label>
              <input 
                required
                type="text"
                placeholder="Ej. Desarrollo de sitio web con Next.js"
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Descripción *</label>
              <textarea 
                required
                rows={4}
                placeholder="Explica detalladamente qué incluye tu servicio..."
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Precio (S/) *</label>
                <input 
                  required
                  type="number"
                  min="1"
                  placeholder="0.00"
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-2">Días de entrega *</label>
                <input 
                  required
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                  value={formData.deliveryDays}
                  onChange={(e) => setFormData({...formData, deliveryDays: e.target.value})}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 flex justify-end gap-3 border-t border-zinc-800 bg-[#0c0c0e] shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="service-form"
            disabled={isLoading || (!selectedFile && !imagePreview)} 
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isLoading ? 'Guardando...' : (serviceToEdit ? 'Guardar Cambios' : 'Publicar Servicio')}
          </button>
        </div>

      </div>
    </div>
  );
}