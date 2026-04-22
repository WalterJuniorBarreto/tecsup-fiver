'use client';

import { useState, useRef } from 'react';
import { Mail, MapPin, DollarSign, Star, Loader2, Save, Trash2, PlusCircle, Camera, Lock } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'profesional' | 'habilidades'>('profesional');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState<LanguageLevel>('BÁSICO');
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState(''); 

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
    setNewLangName('');
    setNewLangLevel('BÁSICO');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return <div className="text-center mt-20 text-red-500">Error cargando perfil.</div>;

  const stats = {
    rating: 4.9,
    reviews: 156,
    memberSince: new Date(profile.createdAt || Date.now()).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
    totalEarnings: '$0',
    completedOrders: 0,
  };

  return (
    <form onSubmit={handleSave}> 
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mi perfil profesional</h1>
          <p className="text-zinc-500 text-sm italic">Gestiona tu perfil de vendedor</p>
        </div>
        
        <button 
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#00e676] text-black border border-[#00e676] rounded-xl text-xs font-bold hover:bg-emerald-400 transition disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </header>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
      {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm">{successMsg}</div>}
      {uploadStatus && (
        <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 rounded-xl text-xs flex items-center gap-3">
          <Loader2 size={16} className="animate-spin text-emerald-500" />
          {uploadStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 flex flex-col items-center text-center h-fit">
          <div className="relative mb-6 group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl bg-zinc-800 relative">
              {(avatarPreview || profile.avatar) ? (
                <img src={avatarPreview || profile.avatar!} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600 font-bold uppercase">
                  {profile.name?.charAt(0) || 'U'}
                </div>
              )}
              <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#0c0c0e] z-10" />
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          {(avatarPreview || profile.avatar) && (
            <button type="button" onClick={removeAvatar} className="mb-4 flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-wider hover:text-red-300 transition">
              <Trash2 size={12} /> Eliminar foto
            </button>
          )}
          
          <h2 className="text-2xl font-extrabold mb-1">{profile.name}</h2>
          <p className="text-emerald-500 text-sm font-bold mb-4">{profile.professionalTitle || 'Sin título profesional'}</p>
          
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm mb-8">
            <Star size={16} fill="currentColor" /> {stats.rating} 
            <span className="text-zinc-500 font-medium ml-1">({stats.reviews} reseñas)</span>
          </div>

          <div className="w-full space-y-4 border-t border-zinc-900 pt-8 mb-8 text-left text-xs text-zinc-400">
            <div className="flex items-center gap-3"><Mail size={16} />{profile.email}</div>
            <div className="flex items-center gap-3"><MapPin size={16} />{profile.location || 'No especificada'}</div>
            <div className="flex items-center gap-3"><DollarSign size={16} />${profile.hourlyRate || 0}/hora</div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold">{stats.totalEarnings}</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Ganancias</p>
            </div>
            <div className="text-center p-4 bg-black/40 rounded-2xl border border-zinc-900">
              <p className="text-lg font-bold capitalize">{stats.memberSince}</p>
              <p className="text-[10px] text-zinc-600 uppercase font-bold">Miembro</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-3xl p-8 space-y-8 min-h-[600px]">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h3 className="font-bold text-xl">
                {activeTab === 'profesional' ? 'Información profesional' : 'Habilidades y Experiencia'}
              </h3>
              
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-zinc-900 w-full sm:w-auto">
                <button type="button" onClick={() => setActiveTab('profesional')} className={`flex-1 sm:flex-none px-6 py-2 rounded-full text-[11px] font-bold transition-all ${activeTab === 'profesional' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>
                  Profesional
                </button>
                <button type="button" onClick={() => setActiveTab('habilidades')} className={`flex-1 sm:flex-none px-6 py-2 rounded-full text-[11px] font-bold transition-all ${activeTab === 'habilidades' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>
                  Habilidades
                </button>
              </div>
            </div>

            {activeTab === 'profesional' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Correo electrónico</label>
                    <div className="w-full bg-black/30 border border-zinc-800/50 p-4 rounded-xl text-sm font-medium text-zinc-500 flex items-center justify-between cursor-not-allowed">
                      {profile.email}
                      <Lock size={14} className="text-zinc-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Nombre completo</label>
                    <input name="name" value={profile.name || ''} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Título profesional</label>
                    <input name="professionalTitle" value={profile.professionalTitle || ''} onChange={handleChange} placeholder="Ej: Desarrollador Full Stack" className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">País de Residencia</label>
                    <select name="location" value={profile.location || ''} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition cursor-pointer appearance-none">
                      <option value="" disabled className="bg-zinc-950">Selecciona tu país</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country} className="bg-zinc-950 text-white">{country}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Tarifa por hora ($)</label>
                    <input name="hourlyRate" type="number" value={profile.hourlyRate || ''} onChange={handleChange} className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Descripción profesional</label>
                  <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows={4} className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition resize-none"></textarea>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1 block">Idiomas</label>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_auto] gap-3 bg-black/20 p-4 rounded-2xl border border-zinc-900">
                    <select value={newLangName} onChange={(e) => setNewLangName(e.target.value)} className="bg-black/50 border border-zinc-800 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition cursor-pointer">
                      <option value="" disabled className="bg-zinc-950 text-zinc-500">Seleccionar idioma</option>
                      {AVAILABLE_LANGUAGES.map(lang => (
                        <option key={lang} value={lang} className="bg-zinc-950 text-white">{lang}</option>
                      ))}
                    </select>
                    
                    <select value={newLangLevel} onChange={(e) => setNewLangLevel(e.target.value as LanguageLevel)} className="bg-black/50 border border-zinc-800 p-3 rounded-xl text-xs font-bold text-zinc-300 outline-none focus:border-emerald-500/50 transition cursor-pointer">
                      {ALLOWED_LEVELS.map(level => (
                        <option key={level} value={level} className="bg-zinc-950 text-white capitalize">{level.toLowerCase()}</option>
                      ))}
                    </select>
                    
                    <button type="button" onClick={addLanguage} className="flex items-center gap-2 px-5 py-3 bg-emerald-500/10 text-[#00e676] rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition">
                      <PlusCircle size={16} /> Añadir
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.languages && profile.languages.length > 0 ? (
                      profile.languages.map((lang) => (
                        <div key={lang.name} className="group bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
                          <span className="text-xs font-bold">{lang.name}</span>
                          <span className="text-[10px] text-zinc-500 italic capitalize">({lang.level.toLowerCase()})</span>
                          <button type="button" onClick={() => removeLanguage(lang.name)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14} /></button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500 italic ml-2">No has agregado idiomas aún.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'habilidades' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Años de Experiencia</label>
                    <input name="yearsOfExperience" type="number" value={profile.yearsOfExperience || ''} onChange={handleChange} placeholder="Ej: 3" className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1">Enlace al Portafolio o GitHub</label>
                    <input name="portfolioUrl" value={profile.portfolioUrl || ''} onChange={handleChange} placeholder="https://github.com/tu-usuario" className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1 block">Educación e Instituciones</label>
                  <div className="flex gap-3">
                    <input value={newEducation} onChange={(e) => setNewEducation(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEducation())} placeholder="Ej: Tecsup - Diseño de Software" className="flex-1 bg-black/50 border border-zinc-800 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition" />
                    <button type="button" onClick={addEducation} className="px-6 py-3 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition">Agregar</button>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {profile.education && profile.education.length > 0 ? (
                      profile.education.map((edu) => (
                        <div key={edu} className="group bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-white">{edu}</span>
                          <button type="button" onClick={() => removeEducation(edu)} className="text-zinc-500 hover:text-red-400 transition"><Trash2 size={16} /></button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500 italic">No has agregado educación aún.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-900">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest ml-1 block">Habilidades Técnicas (Skills)</label>
                  <div className="flex gap-3">
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Ej: React, Node.js, TypeScript" className="flex-1 bg-black/50 border border-zinc-800 p-3 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500/50 transition" />
                    <button type="button" onClick={addSkill} className="px-6 py-3 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition">Agregar</button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill) => (
                        <div key={skill} className="group bg-[#00e676]/10 border border-[#00e676]/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <span className="text-xs font-bold text-[#00e676]">{skill}</span>
                          <button type="button" onClick={() => removeSkill(skill)} className="text-[#00e676]/50 hover:text-red-400 transition">×</button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500 italic">No has agregado habilidades aún.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </form>
  );
}