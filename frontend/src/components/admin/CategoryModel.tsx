import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { categoryService } from '../../services/category.service';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: any | null;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, categoryToEdit }: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        description: categoryToEdit.description || '',
        isActive: categoryToEdit.isActive
      });
    } else {
      setFormData({ name: '', description: '', isActive: true });
    }
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (categoryToEdit) {
        await categoryService.updateCategory(categoryToEdit.id, formData);
      } else {
        await categoryService.createCategory({
          name: formData.name,
          description: formData.description
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al guardar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden scale-in-95 duration-200 flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-[#0c0c0e]">
          <h2 className="text-xl font-bold text-white">
            {categoryToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Nombre de la Categoría *</label>
              <input 
                required
                type="text"
                placeholder="Ej. Diseño Gráfico"
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-wider">El slug se generará automáticamente</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-2">Descripción (Opcional)</label>
              <textarea 
                rows={3}
                placeholder="Breve descripción de esta categoría..."
                className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {categoryToEdit && (
              <div className="flex items-center justify-between p-4 bg-[#0c0c0e] border border-zinc-800 rounded-xl">
                <div>
                  <label className="block text-sm font-bold text-zinc-300">Estado de la Categoría</label>
                  <p className="text-xs text-zinc-500">¿Visible en el marketplace?</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-4 flex justify-end gap-3 border-t border-zinc-800 bg-[#0c0c0e]">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="category-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isLoading ? 'Guardando...' : 'Guardar Categoría'}
          </button>
        </div>

      </div>
    </div>
  );
}