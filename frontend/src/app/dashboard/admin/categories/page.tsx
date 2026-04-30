"use client";

import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { useCategories } from "../../../../hooks/useCategories";
import CategoryModal from '../../../../components/admin/CategoryModel';
import ConfirmModal from '../../../../components/ui/ConfirmModel';


export default function AdminCategoriesPage() {
  const { categories, isLoading, removeCategory, refreshCategories } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [catToDelete, setCatToDelete] = useState<{id: string, name: string} | null>(null);
const [isDeleting, setIsDeleting] = useState(false);
  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string, name: string) => {
  setCatToDelete({ id, name });
  setIsConfirmOpen(true);
};

const handleConfirmDelete = async () => {
  if (!catToDelete) return;
  setIsDeleting(true);
  try {
    await removeCategory(catToDelete.id);
    setIsConfirmOpen(false);
  } catch (error) {
    console.error(error);
  } finally {
    setIsDeleting(false);
    setCatToDelete(null);
  }
};
  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h2>
            <p className="text-zinc-500 text-sm mt-1">Administra los rubros disponibles para los freelancers</p>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#00e676] text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(0,230,118,0.2)]"
          >
            <Plus size={18} /> Nueva Categoría
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Categorías" value={totalCategories} icon={<Layers className="text-cyan-400" />} />
          <StatCard title="Categorías Activas" value={activeCategories} icon={<CheckCircle2 className="text-emerald-400" />} />
          <StatCard title="Inactivas (Soft Deleted)" value={totalCategories - activeCategories} icon={<XCircle className="text-red-400" />} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
          </div>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-[24px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-5 text-zinc-400 font-medium text-sm">Nombre</th>
                  <th className="p-5 text-zinc-400 font-medium text-sm">Slug URL</th>
                  <th className="p-5 text-zinc-400 font-medium text-sm">Servicios Asociados</th>
                  <th className="p-5 text-zinc-400 font-medium text-sm">Estado</th>
                  <th className="p-5 text-right text-zinc-400 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="p-10 text-center text-zinc-500">
                       No hay categorías creadas aún.
                     </td>
                   </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors group">
                      <td className="p-5 font-bold">{cat.name}</td>
                      <td className="p-5 text-zinc-500 text-sm">/{cat.slug}</td>
                      <td className="p-5 text-sm">
                        <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">
                          {cat._count?.services || 0} servicios
                        </span>
                      </td>
                      <td className="p-5">
                        {cat.isActive ? (
                          <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-lg">ACTIVA</span>
                        ) : (
                          <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-lg">INACTIVA</span>
                        )}
                      </td>
                      <td className="p-5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
  onClick={() => handleOpenDelete(cat.id, cat.name)} 
  className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
>
  <Trash2 size={16} />
</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshCategories}
        categoryToEdit={editingCategory}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="¿Eliminar categoría?"
        description={`Estás a punto de eliminar "${catToDelete?.name}". Si tiene servicios asociados, solo se desactivará.`}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        confirmText="Eliminar"
      />

    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[24px] flex items-center gap-5">
      <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div>
        <p className="text-zinc-500 text-xs font-medium mb-0.5">{title}</p>
        <h4 className="text-2xl font-bold">{value}</h4>
      </div>
    </div>
  );
}