"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Search, MoreVertical,   Download, Edit, Ban, Plus, Loader2, ShieldAlert, CheckCircle2
} from 'lucide-react';
import AdminSidebar from "../../../../components/admin/AdminSidebar";
import { adminService } from '../../../../services/admin.service';

export default function AdminUsersPage() {
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState<any[]>([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'CLIENT',
    password: ''
  });

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      showToast('Error al cargar los usuarios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.email) {
      return showToast('Nombre y correo son obligatorios', 'error');
    }

    try {
      setIsProcessing(true);
      if (showEditModal && selectedUser) {
        await adminService.updateUser(selectedUser.id, formData);
        showToast('Usuario actualizado correctamente', 'success');
      } else {
        if (!formData.password) return showToast('La contraseña es obligatoria para nuevos usuarios', 'error');
        await adminService.createUser(formData);
        showToast('Usuario creado con éxito', 'success');
      }

      setShowCreateModal(false);
      setShowEditModal(false);
      loadUsers();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Hubo un error en la operación', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspendToggle = async () => {
    if (!selectedUser) return;
    
    try {
      setIsProcessing(true);
      await adminService.toggleUserStatus(selectedUser.id);
      showToast(`Usuario ${selectedUser.isActive ? 'suspendido' : 'reactivado'} correctamente.`, 'success');
      setShowSuspendModal(false);
      loadUsers(); 
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Error al cambiar el estado', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // 🚀 PREPARAR FORMULARIO
  const openCreateModal = () => {
    setFormData({ name: '', email: '', role: 'CLIENT', password: '' });
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
    setShowEditModal(true);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center ml-64"><Loader2 className="w-12 h-12 text-[#00e676] animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white selection:bg-[#00e676]/30">
      <AdminSidebar />

      <main className="flex-1 p-8 md:p-10 ml-64 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Gestión de Usuarios</h2>
            <p className="text-zinc-500 text-sm">Crea, edita y administra los accesos de la plataforma.</p>
          </div>
          <div className="flex gap-3">
         
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-[#00e676] hover:bg-[#00c853] text-black px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)]"
            >
              <Plus size={18} /> Crear Usuario
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <UserStatCard title="Total usuarios" value={users.length.toString()} icon={<Users />} color="blue" />
          <UserStatCard title="Usuarios activos" value={users.filter(u => u.isActive).length.toString()} icon={<UserCheck />} color="emerald" />
          <UserStatCard title="Suspendidos" value={users.filter(u => !u.isActive).length.toString()} icon={<UserX />} color="red" />
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 rounded-[2rem] p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <h3 className="text-xl font-bold text-white">Directorio</h3>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o email..." 
                  className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00e676]/50 transition-all text-white placeholder:text-zinc-600" 
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-zinc-500 text-[10px] font-black uppercase tracking-widest px-4">
                  <th className="pb-4 pl-4">Usuario</th>
                  <th className="pb-4 text-center">Rol</th>
                  <th className="pb-4 text-center">Proveedor</th>
                  <th className="pb-4 text-center">Estado</th>
                  <th className="pb-4 text-center">Servicios</th>
                  <th className="pb-4 text-center">Ganancias</th>
                  <th className="pb-4 text-center">Registro</th>
                  <th className="pb-4 text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-zinc-500 font-bold">No hay usuarios registrados.</td></tr>
                ) : (
                  users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map((user) => (
                    <UserDetailRow 
                      key={user.id} 
                      user={user} 
                      onEdit={() => openEditModal(user)}
                      onSuspend={() => { setSelectedUser(user); setShowSuspendModal(true); }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-2">{showEditModal ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <p className="text-sm text-zinc-400 mb-6">{showEditModal ? 'Modifica los datos del usuario seleccionado.' : 'Crea un acceso manual a la plataforma.'}</p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#00e676]" 
                  />
                </div>
                <div className="flex justify-between items-end mb-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Correo Electrónico</label>
                    {showEditModal && <span className="text-[9px] text-amber-500 font-bold uppercase">No editable</span>}
                  </div>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={showEditModal} 
                    className={`w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#00e676] transition-all ${
                      showEditModal ? 'opacity-50 cursor-not-allowed bg-zinc-900/50' : ''
                    }`} 
                  />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Rol</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#00e676] cursor-pointer"
                    >
                      <option value="CLIENT">Cliente</option>
                      <option value="FREELANCER">Freelancer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Contraseña</label>
                    <input 
                      type="password" 
                      placeholder={showEditModal ? "(Sin cambios)" : "••••••••"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-[#00e676] placeholder:text-zinc-600" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button disabled={isProcessing} onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-300 disabled:opacity-50">Cancelar</button>
                <button disabled={isProcessing} onClick={handleSaveUser} className="flex-[2] py-3.5 rounded-xl text-sm font-black text-black bg-[#00e676] hover:bg-[#00c853] transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Guardar Datos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuspendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#121214] border border-zinc-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl scale-in-95">
            <div className="p-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border ${selectedUser?.isActive ? 'bg-red-500/10 border-red-500/20' : 'bg-[#00e676]/10 border-[#00e676]/20'}`}>
                {selectedUser?.isActive ? <ShieldAlert size={20} className="text-red-500" /> : <CheckCircle2 size={20} className="text-[#00e676]" />}
              </div>
              <h3 className="text-xl font-black text-white mb-2">¿{selectedUser?.isActive ? 'Suspender' : 'Reactivar'} a {selectedUser?.name}?</h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                {selectedUser?.isActive 
                  ? 'El usuario no podrá iniciar sesión ni acceder a la plataforma hasta que un administrador lo reactive. Sus pedidos y datos se mantendrán intactos.' 
                  : 'El usuario recuperará el acceso total a su cuenta y a la plataforma inmediatamente.'}
              </p>
              
              <div className="flex gap-3 justify-end">
                <button disabled={isProcessing} onClick={() => setShowSuspendModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50">Cancelar</button>
                <button disabled={isProcessing} onClick={handleSuspendToggle} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 ${selectedUser?.isActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#00e676] hover:bg-[#00c853] text-black'}`}>
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : (selectedUser?.isActive ? 'Sí, suspender' : 'Sí, reactivar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-5 fade-out duration-300">
          <div className={`px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border bg-[#121214] ${toast.type === 'error' ? 'text-red-400 border-red-500/30' : 'text-[#00e676] border-[#00e676]/30'}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00e676] shadow-[0_0_8px_#00e676]'}`} />
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}


function UserStatCard({ title, value, icon, color }: any) {
  const colorStyles: any = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-[#00e676] bg-[#00e676]/10 border-[#00e676]/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  return (
    <div className="bg-[#121214] border border-zinc-800/80 p-8 rounded-[2rem] flex items-center gap-5 shadow-lg">
      <div className={`p-4 rounded-2xl border ${colorStyles[color]}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-3xl font-black text-white">{value}</h4>
      </div>
    </div>
  );
}

function UserDetailRow({ user, onEdit, onSuspend }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => (name || 'US').substring(0, 2).toUpperCase();

  return (
    <tr className="bg-[#0a0a0a] hover:bg-zinc-900/50 transition-colors group">
      <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-zinc-800/50 group-hover:border-zinc-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-sm text-zinc-300">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{user.name}</p>
            <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
        <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          user.role === 'FREELANCER' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 
          user.role === 'ADMIN' ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' :
          'text-zinc-300 bg-zinc-800 border-zinc-700'
        }`}>
          {user.role}
        </span>
      </td>

      <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
        <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          user.provider === 'GOOGLE' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 
          user.provider === 'GITHUB' ? 'text-white bg-zinc-800 border-zinc-700' :
          'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' // LOCAL
        }`}>
          {user.provider || 'LOCAL'}
        </span>
      </td>

      <td className="py-4 text-center border-y border-zinc-800/50 group-hover:border-zinc-700">
        <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-widest border ${
          user.isActive ? 'text-[#00e676] bg-[#00e676]/10 border-[#00e676]/20' : 'text-red-500 bg-red-500/10 border-red-500/20'
        }`}>
          {user.isActive ? 'Activo' : 'Suspendido'}
        </span>
      </td>
      <td className="py-4 text-center font-bold text-zinc-300 border-y border-zinc-800/50 group-hover:border-zinc-700">{user.services}</td>
      <td className="py-4 text-center font-black text-[#00e676] border-y border-zinc-800/50 group-hover:border-zinc-700">S/ {user.earnings?.toLocaleString('en-US')}</td>
      <td className="py-4 text-center text-zinc-500 text-xs font-medium border-y border-zinc-800/50 group-hover:border-zinc-700">{user.date}</td>
      
      <td className="py-4 pr-4 text-right rounded-r-2xl border-y border-r border-zinc-800/50 group-hover:border-zinc-700 relative">
        {/* ... (Tu menú de acciones sigue exactamente igual) ... */}
        <div ref={menuRef} className="relative inline-block text-left">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl transition-all border ${isOpen ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-[#0a0a0a] text-zinc-500 border-zinc-800 hover:text-white hover:bg-zinc-900'}`}
          >
            <MoreVertical size={18}/>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#121214] border border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] p-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <button onClick={() => { setIsOpen(false); onEdit(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-zinc-800 rounded-xl transition-colors text-zinc-300 hover:text-white">
                <Edit size={16} className="text-zinc-400"/> Editar datos
              </button>
              <div className="h-[1px] bg-zinc-800/80 my-1 mx-2"></div>
              <button onClick={() => { setIsOpen(false); onSuspend(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-colors ${user.isActive ? 'hover:bg-red-500/10 text-red-500' : 'hover:bg-[#00e676]/10 text-[#00e676]'}`}>
                {user.isActive ? <><Ban size={16}/> Suspender</> : <><CheckCircle2 size={16}/> Reactivar</>}
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}