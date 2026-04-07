'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useRegister } from '../../../hooks/useRegister';


export default function RegisterPage() {
  const {
    role,
    formData,
    showPassword,
    error,
    isSubmitting,
    handleChange,
    handleRoleSelect,
    togglePasswordVisibility,
    handleSubmit,
  } = useRegister();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      
      {/* Logo */}
      <Link href="/" className="mb-6 cursor-pointer">
        <div className="bg-[#00e676] text-black font-extrabold px-3 py-1.5 rounded text-sm tracking-wider">
          FH
        </div>
      </Link>

      <div className="w-full max-w-md">
        
        {/* Header Compacto */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">Crear cuenta</h1>
          <p className="text-zinc-500 text-xs italic">Únete a la comunidad de freelancers más grande</p>
        </div>

       <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Input Username */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Nombre de usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Tu usuario"
                required
                minLength={3}
                className="w-full bg-[#121212] border border-zinc-800 rounded-lg py-2.5 px-10 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-lg py-2.5 px-10 text-sm outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-400">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                className="w-full bg-[#121212] border border-zinc-800 rounded-lg py-2.5 px-10 text-sm outline-none focus:border-emerald-500 transition"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Selector de Rol Compacto */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-zinc-400 block text-center">¿Cómo quieres usar FreelanceHub?</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => handleRoleSelect('CLIENT')}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${role === 'CLIENT' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-800 bg-[#121212] hover:border-zinc-700 text-zinc-300'}`}
              >
                <div className="font-bold text-xs">Cliente</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">Contratar servicios</div>
              </div>
              <div
                onClick={() => handleRoleSelect('FREELANCER')}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${role === 'FREELANCER' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-800 bg-[#121212] hover:border-zinc-700 text-zinc-300'}`}
              >
                <div className="font-bold text-xs">Freelancer</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">Ofrecer servicios</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-xs text-red-400 text-center bg-red-400/10 p-2 rounded">{error}</p>}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full mt-2 bg-[#00e676] text-black font-bold py-3 rounded-lg text-sm hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-widest"><span className="bg-black px-2 text-zinc-600">O REGÍSTRATE CON</span></div>
        </div>

        {/* Botones Sociales (Listos para conectar tu endpoint de Google) */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-lg hover:bg-[#121212] transition text-xs font-medium">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-lg hover:bg-[#121212] transition text-xs font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-zinc-500">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}