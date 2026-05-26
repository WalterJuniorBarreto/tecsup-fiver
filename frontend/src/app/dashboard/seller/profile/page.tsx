'use client';

import { useState, useRef } from 'react';
import { 
  Mail, MapPin, DollarSign, Star, Loader2, Save, 
  Trash2, PlusCircle, Camera, Lock, CheckCircle2, 
  AlertCircle, Package, Calendar, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';
import { useProfile } from '../../../../hooks/useProfile';
import { LanguageLevel } from '../../../../types/profile.types';

const ALLOWED_LEVELS: LanguageLevel[] = ['BÁSICO', 'INTERMEDIO', 'AVANZADO', 'NATIVO'];
const COUNTRIES = [
  'Perú', 'Colombia', 'México', 'Argentina', 'Chile', 'Ecuador', 
  'España', 'Estados Unidos', 'Bolivia', 'Uruguay', 'Paraguay', 'Venezuela'
];
const AVAILABLE_LANGUAGES = [
  'Español', 'Inglés', 'Portugués', 'Alemán', 'Francés', 'Italiano', 'Chino', 'Japonés'
];

export default function ProfilePage() {
  const { profile, isLoading, isSaving, error, successMsg, handleChange, handleSave, setProfile, setSelectedFile, uploadStatus } = useProfile();

  // 🚀 TABS AMPLIADOS
  const [activeTab, setActiveTab] = useState<'profesional' | 'habilidades' | 'seguridad'>('profesional');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState<LanguageLevel>('BÁSICO');
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState(''); 

  // 🚀 ESTADOS PARA LA CONTRASEÑA
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passStatus, setPassStatus] = useState({ error: '', success: '', loading: false });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setSelectedFile(file); 
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    setProfile(profile ? { ...profile, avatar: '' } : null); 
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addLanguage = () => {
    if (!newLangName.trim() || !profile) return;
    const exists = profile.languages?.some(l => l.name.toLowerCase() === newLangName.trim().toLowerCase());
    if (exists) return;
    setProfile({ ...profile, languages: [...(profile.languages || []), { name: newLangName.trim(), level: newLangLevel }] });
    setNewLangName(''); setNewLangLevel('BÁSICO');
  };
  
  const removeLanguage = (langName: string) => {
    if (!profile) return;
    setProfile({ ...profile, languages: profile.languages?.filter(l => l.name !== langName) || [] });
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    const exists = profile.skills?.some(s => s.toLowerCase() === newSkill.trim().toLowerCase());
    if (exists) return;
    setProfile({ ...profile, skills: [...(profile.skills || []), newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills?.filter(s => s !== skillToRemove) || [] });
  };

  const addEducation = () => {
    if (!newEducation.trim() || !profile) return;
    const exists = profile.education?.some(e => e.toLowerCase() === newEducation.trim().toLowerCase());
    if (exists) return;
    setProfile({ ...profile, education: [...(profile.education || []), newEducation.trim()] });
    setNewEducation('');
  };

  const removeEducation = (eduToRemove: string) => {
    if (!profile) return;
    setProfile({ ...profile, education: profile.education?.filter(e => e !== eduToRemove) || [] });
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
      }, 1500);
    } catch (error: any) {
      setPassStatus({ error: error.message || 'Error al actualizar', success: '', loading: false });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00e676] animate-spin" />
      </div>
    );
  }

  if (!profile) return <div className="text-center mt-20 text-red-500 font-bold">Error cargando perfil.</div>;

  const stats = {
    rating: (profile as any).averageRating || 5.0,
    reviews: (profile as any).reviewsCount || 0,
    memberSince: new Date(profile.createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
    totalEarnings: 'S/ 0',
    completedOrders: (profile as any).completedOrders || 0,
  };
  const isGoogleAccount = profile.provider === 'GOOGLE';

  return (
    <div className="p-6 md:p-10 text-white max-w-[1280px] mx-auto font-sans bg-[#0c0c0e] min-h-screen selection:bg-[#00e676]/30">
      <form onSubmit={(e) => handleSave(e) }> 
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-[40px] font-black tracking-tight mb-2">Mi perfil profesional</h1>
            <p className="text-zinc-500 text-sm">Gestiona tu escaparate como vendedor y atrae a más clientes.</p>
          </div>
          
          <button 
            type="submit"
            disabled={isSaving || activeTab === 'seguridad'}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] ${activeTab === 'seguridad' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' : 'bg-[#00e676] text-black hover:bg-[#00c853] disabled:opacity-50'}`}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            {isSaving ? 'GUARDANDO...' : 'GUARDAR PERFIL'}
          </button>
        </header>

        {activeTab !== 'seguridad' && (
          <div className="space-y-4 mb-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
                <AlertCircle size={18} /> <span className="font-medium">{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
                <CheckCircle2 size={18} /> <span className="font-medium">{successMsg}</span>
              </div>
            )}
            {uploadStatus && (
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
                <Loader2 size={18} className="animate-spin" /> <span className="font-medium">{uploadStatus}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 text-center shadow-lg sticky top-24">
              
              <div className="relative w-36 h-36 mx-auto mb-6 group">
                <img 
                  src={avatarPreview || profile.avatar || `https://ui-avatars.com/api/?name=${profile.name}&background=0a0a0a&color=00e676&size=200`} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover border-[3px] border-[#00e676] shadow-[0_0_20px_rgba(0,230,118,0.15)]" 
                />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                
                {(avatarPreview || profile.avatar) && (
                  <button type="button" onClick={removeAvatar} className="absolute bottom-1 left-0 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md border border-[#121214]" title="Eliminar foto">
                    <Trash2 size={16} />
                  </button>
                )}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-0 p-2.5 bg-[#00e676] text-black rounded-full hover:bg-[#00c853] transition-colors shadow-md border border-[#121214]" title="Cambiar foto">
                  <Camera size={16} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black mb-1 truncate">{profile.name}</h2>
              <p className="text-[#00e676] text-sm font-bold mb-4 tracking-wide uppercase">{profile.professionalTitle || 'Freelancer Profesional'}</p>
              
              {isGoogleAccount && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                  <ShieldCheck size={14} /> Google Account
                </div>
              )}

              <div className="flex justify-center items-center gap-4 mb-6">
                 <div className="flex flex-col items-center">
                    <span className="flex items-center gap-1 text-white font-black"><Star size={16} className="text-[#00e676] fill-[#00e676]" /> {stats.rating.toFixed(1)}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">({stats.reviews} res.)</span>
                 </div>
                 <div className="w-[1px] h-8 bg-zinc-800"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-white font-black">{stats.completedOrders}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Proyectos</span>
                 </div>
                 <div className="w-[1px] h-8 bg-zinc-800"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-white font-black capitalize flex items-center gap-1"><Calendar size={14} className="text-zinc-500"/> {stats.memberSince.split(' ')[2]}</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Ingreso</span>
                 </div>
              </div>

              <div className="h-[1px] w-full bg-zinc-800/60 my-6"></div>

              <div className="space-y-4 text-left px-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300 truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300">{profile.location || 'No especificada'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign size={16} className="text-[#00e676] shrink-0" /> <span className="text-zinc-300 font-bold">S/ {profile.hourlyRate || 0} <span className="font-normal text-zinc-500">/ hora</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#121214] border border-zinc-800/60 rounded-[2rem] p-8 md:p-10 shadow-lg min-h-[600px] flex flex-col">
              
              <div className="flex flex-wrap p-1.5 bg-[#0a0a0a] border border-zinc-800/50 rounded-2xl w-fit mb-8 gap-1">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('profesional')} 
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all ${activeTab === 'profesional' ? 'bg-[#1f1f22] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  PROFESIONAL
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('habilidades')} 
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all ${activeTab === 'habilidades' ? 'bg-[#1f1f22] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  HABILIDADES
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('seguridad')} 
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-widest transition-all ${activeTab === 'seguridad' ? 'bg-[#1f1f22] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  SEGURIDAD
                </button>
              </div>

              {activeTab === 'profesional' && (
                <div className="space-y-6 flex-1 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Correo electrónico (Fijo)</label>
                      <div className="w-full bg-[#0a0a0a] border border-zinc-800/40 p-3.5 rounded-xl text-sm font-medium text-zinc-600 flex items-center justify-between cursor-not-allowed">
                        {profile.email}
                        <Lock size={14} className="text-zinc-700" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nombre completo</label>
                      <input name="name" value={profile.name || ''} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Título profesional</label>
                      <input name="professionalTitle" value={profile.professionalTitle || ''} onChange={handleChange} placeholder="Ej: Desarrollador Full Stack" className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">País</label>
                        <select name="location" value={profile.location || ''} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all cursor-pointer appearance-none">
                          <option value="">Seleccionar</option>
                          {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Tarifa (S/)</label>
                        <input name="hourlyRate" type="number" value={profile.hourlyRate || ''} onChange={handleChange} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Biografía / Descripción profesional</label>
                    <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows={5} placeholder="Cuéntale a los clientes sobre tu experiencia y cómo puedes ayudarlos..." className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all resize-none"></textarea>
                  </div>

                  <div className="pt-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 block mb-3">Idiomas que dominas</label>
                    <div className="flex flex-col md:flex-row gap-3 bg-[#0a0a0a] p-3 rounded-2xl border border-zinc-800/80">
                      <select value={newLangName} onChange={(e) => setNewLangName(e.target.value)} className="flex-1 bg-[#121214] border border-zinc-800/80 p-3 rounded-xl text-sm text-white outline-none focus:border-[#00e676] transition cursor-pointer">
                        <option value="" disabled>Seleccionar idioma</option>
                        {AVAILABLE_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                      </select>
                      
                      <select value={newLangLevel} onChange={(e) => setNewLangLevel(e.target.value as LanguageLevel)} className="w-full md:w-40 bg-[#121214] border border-zinc-800/80 p-3 rounded-xl text-xs font-bold text-zinc-300 outline-none focus:border-[#00e676] transition cursor-pointer">
                        {ALLOWED_LEVELS.map(level => <option key={level} value={level} className="capitalize">{level.toLowerCase()}</option>)}
                      </select>
                      
                      <button type="button" onClick={addLanguage} className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-3 rounded-xl text-xs font-bold transition-colors">
                        Agregar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {profile.languages && profile.languages.length > 0 ? (
                        profile.languages.map((lang) => (
                          <div key={lang.name} className="group bg-[#121214] border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3">
                            <span className="text-sm font-bold text-white">{lang.name}</span>
                            <span className="text-[10px] text-[#00e676] font-bold uppercase tracking-widest bg-[#00e676]/10 px-2 py-0.5 rounded-md border border-[#00e676]/20">{lang.level}</span>
                            <button type="button" onClick={() => removeLanguage(lang.name)} className="text-zinc-600 hover:text-red-400 transition ml-1"><Trash2 size={14} /></button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-600 italic pl-1">No has agregado idiomas aún.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'habilidades' && (
                <div className="space-y-8 flex-1 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Años de Experiencia</label>
                      <input name="yearsOfExperience" type="number" value={profile.yearsOfExperience || ''} onChange={handleChange} placeholder="Ej: 3" className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Portafolio Web o GitHub</label>
                      <input name="portfolioUrl" value={profile.portfolioUrl || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 block">Educación e Instituciones</label>
                    <div className="flex gap-3">
                      <input value={newEducation} onChange={(e) => setNewEducation(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())} placeholder="Ej: Tecsup - Diseño de Software" className="flex-1 bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                      <button type="button" onClick={addEducation} className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-3 rounded-xl text-xs font-bold transition-colors">Agregar</button>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      {profile.education && profile.education.length > 0 ? (
                        profile.education.map((edu) => (
                          <div key={edu} className="group bg-[#0a0a0a] border border-zinc-800/80 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-zinc-300">{edu}</span>
                            <button type="button" onClick={() => removeEducation(edu)} className="text-zinc-600 hover:text-red-400 transition"><Trash2 size={16} /></button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-600 italic pl-1">Añade tus estudios o certificaciones.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 block">Habilidades Técnicas</label>
                    <div className="flex gap-3">
                      <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Ej: React, Figma, Spring Boot..." className="flex-1 bg-[#0a0a0a] border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                      <button type="button" onClick={addSkill} className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-3 rounded-xl text-xs font-bold transition-colors">Agregar</button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <div key={skill} className="group bg-[#00e676]/10 border border-[#00e676]/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <span className="text-xs font-black tracking-wide text-[#00e676]">{skill}</span>
                            <button type="button" onClick={() => removeSkill(skill)} className="text-[#00e676]/50 hover:text-red-400 transition">✕</button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-600 italic pl-1">Las habilidades ayudan a los clientes a encontrarte.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seguridad' && (
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
                          <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Nueva Contraseña</label>
                        <div className="relative">
                          <input type={showPass.new ? "text" : "password"} placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                          <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                        </div>
                      </div>

                      <div className="space-y-2 relative mb-6">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Confirmar Contraseña</label>
                        <div className="relative">
                          <input type={showPass.confirm ? "text" : "password"} placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:border-[#00e676] focus:ring-1 focus:ring-[#00e676] outline-none transition-all" />
                          <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><Eye size={18} /></button>
                        </div>
                      </div>

                      <button type="button" onClick={handlePasswordSave} disabled={passStatus.loading} className="w-full bg-[#00e676] text-black font-bold py-3.5 rounded-xl hover:bg-[#00c853] transition-colors flex justify-center items-center gap-2 text-sm shadow-[0_4px_14px_0_rgba(0,230,118,0.2)] disabled:opacity-50">
                        {passStatus.loading ? <Loader2 size={16} className="animate-spin" /> : 'ACTUALIZAR CONTRASEÑA'}
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}