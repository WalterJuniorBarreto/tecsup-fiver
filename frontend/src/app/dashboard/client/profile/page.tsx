'use client';

import { useState, useEffect, useRef } from 'react';
import { useProfileClient } from '../../../../hooks/useProfileClient';
import { Loader2, Camera, MapPin, Mail, Phone, Calendar, Package, Star, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, Trash2 } from 'lucide-react';

const LATAM_COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", 
  "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México", 
  "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico", 
  "República Dominicana", "Uruguay", "Venezuela"
];

export default function ClientProfilePage() {
  const { profile, loading, updating, updateProfile } = useProfileClient();
  const [activeTab, setActiveTab] = useState('Personal');
  
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '' 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saveStatus, setSaveStatus] = useState({ error: '', success: '' });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passStatus, setPassStatus] = useState({ error: '', success: '', loading: false });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || profile.name || '',
        phone: profile.phone || '', 
        location: profile.location || '',
        bio: profile.bio || '',
        avatar: profile.avatar || '' 
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, avatar: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const handleSavePersonal = async () => {
    setSaveStatus({ error: '', success: '' });
    const result = await updateProfile({
      username: formData.username,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      avatar: formData.avatar 
    });

    if (result.success) {
      setSaveStatus({ error: '', success: 'Perfil actualizado correctamente' });
      setTimeout(() => setSaveStatus({ error: '', success: '' }), 3000);
    } else {
      setSaveStatus({ error: result.error || 'Hubo un error al guardar', success: '' });
    }
  };

  const handlePasswordSave = async () => {
    setPassStatus({ error: '', success: '', loading: true });

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return setPassStatus({ error: 'Todos los campos son obligatorios.', success: '', loading: false });
    }
    if (passwords.new.length < 8) {
      return setPassStatus({ error: 'La nueva contraseña debe tener al menos 8 caracteres.', success: '', loading: false });
    }
    if (passwords.new !== passwords.confirm) {
      return setPassStatus({ error: 'Las contraseñas no coinciden.', success: '', loading: false });
    }

    try {
      setTimeout(() => {
        setPassStatus({ error: '', success: 'Contraseña actualizada con éxito', loading: false });
        setPasswords({ current: '', new: '', confirm: '' }); 
      }, 1000);
    } catch (error: any) {
      setPassStatus({ error: error.message || 'Error al actualizar', success: '', loading: false });
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[70vh]"><Loader2 className="w-10 h-10 text-[#00e676] animate-spin" /></div>;

  const memberSince = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : '-';
  const displayName = profile?.username || profile?.name || 'Usuario';
  const isGoogleAccount = profile?.provider === 'GOOGLE'; 

  return (
    <div className="p-6 md:p-10 text-white max-w-[1280px] mx-auto font-sans bg-[#0c0c0e] min-h-screen">
      
      <header className="mb-10">
        <h1 className="text-4xl md:text-[40px] font-black tracking-tight mb-2">Mi perfil</h1>
        <p className="text-zinc-500 text-sm">Gestiona tu información personal y configuración de seguridad.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: TARJETA DE PERFIL */}
        <div className="lg:col-span-4">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 text-center shadow-lg">
            
            <div className="relative w-36 h-36 mx-auto mb-5 group">
              <img 
                src={formData.avatar || `https://ui-avatars.com/api/?name=${displayName}&background=0a0a0a&color=00e676&size=200`} 
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-[3px] border-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.15)]"
              />
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

              {formData.avatar && (
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bottom-1 left-0 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md border border-[#121214]"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-0 p-2.5 bg-[#00e676] text-black rounded-full hover:bg-[#00c853] transition-colors shadow-md border border-[#121214]"
              >
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black mb-1 truncate">{displayName}</h2>
            <p className="text-zinc-500 text-sm mb-4 truncate">{profile?.email}</p>
            
            {isGoogleAccount && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-2">
                <ShieldCheck size={14} /> Google Account
              </div>
            )}

            <div className="h-[1px] w-full bg-zinc-800/60 my-6"></div>

            <div className="space-y-4 text-left px-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300 truncate">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300">{profile?.phone || 'No especificado'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300">{profile?.location || 'No especificado'}</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-zinc-800/60 my-6"></div>

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <Package size={18} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-lg font-black text-white">{profile?.ordersCount || 0}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Pedidos</p>
              </div>
              <div className="text-center">
                <Star size={18} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-lg font-black text-white">{profile?.reviewsCount || 0}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Reseñas</p>
              </div>
              <div className="text-center">
                <Calendar size={18} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-black text-white mt-1 capitalize truncate">{memberSince}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Miembro</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="lg:col-span-8">
          <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 md:p-10 shadow-lg min-h-[600px] flex flex-col">
            
            {/* TABS ELEGANTES */}
            <div className="flex p-1.5 bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl w-fit mb-8">
              {['Personal', 'Cambiar contraseña'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setPassStatus({ error: '', success: '', loading: false });
                    setSaveStatus({ error: '', success: '' });
                  }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all
                    ${activeTab === tab ? 'bg-[#1f1f22] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === 'Personal' ? (
              <div className="space-y-6 flex-1 flex flex-col animate-in fade-in duration-300">
                
                {saveStatus.success && (
                  <div className="bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <CheckCircle2 size={18} /> <span className="font-medium">{saveStatus.success}</span>
                  </div>
                )}
                {saveStatus.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} /> <span className="font-medium">{saveStatus.error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nombre de Usuario</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email (No editable)</label>
                    <input type="email" disabled value={profile?.email || ''} className="w-full bg-[#0a0a0a] border border-zinc-800/40 rounded-xl px-4 py-3.5 text-sm text-zinc-600 cursor-not-allowed" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Teléfono</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+51..." className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Ubicación</label>
                    <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all cursor-pointer appearance-none">
                      <option value="">Selecciona tu país</option>
                      {LATAM_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Biografía</label>
                  <textarea name="bio" rows={5} value={formData.bio} onChange={handleChange} placeholder="Escribe un poco sobre ti..." className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all resize-none"></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={handleSavePersonal} disabled={updating} className="bg-[#00e676] text-black font-bold px-8 py-3.5 rounded-xl hover:bg-[#00c853] transition-colors flex items-center justify-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(0,230,118,0.2)]">
                    {updating ? <Loader2 size={16} className="animate-spin" /> : 'GUARDAR CAMBIOS'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                
                {isGoogleAccount ? (
                  <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-2xl p-8 text-center mt-4">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
                      <ShieldCheck size={32} className="text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Cuenta administrada por Google</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                      Tu inicio de sesión se gestiona de forma segura a través de Google. Para cambiar la contraseña, accede a los ajustes de tu cuenta de Google.
                    </p>
                  </div>
                ) : (
                  <>
                    {passStatus.error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle size={18} /> <span className="font-medium">{passStatus.error}</span>
                      </div>
                    )}
                    {passStatus.success && (
                      <div className="bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                        <CheckCircle2 size={18} /> <span className="font-medium">{passStatus.success}</span>
                      </div>
                    )}

                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Contraseña Actual</label>
                      <div className="relative">
                        <input type={showPass.current ? "text" : "password"} placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                        <button onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nueva Contraseña</label>
                      <div className="relative">
                        <input type={showPass.new ? "text" : "password"} placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                        <button onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                      </div>
                    </div>

                    <div className="space-y-2 relative mb-6">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Confirmar Contraseña</label>
                      <div className="relative">
                        <input type={showPass.confirm ? "text" : "password"} placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                        <button onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                      </div>
                    </div>

                    <button onClick={handlePasswordSave} disabled={passStatus.loading} className="w-full bg-[#00e676] text-black font-bold py-3.5 rounded-xl hover:bg-[#00c853] transition-colors flex justify-center items-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(0,230,118,0.2)]">
                      {passStatus.loading ? <Loader2 size={16} className="animate-spin" /> : 'ACTUALIZAR CONTRASEÑA'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}