'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import { getRoleFromUser, saveAuthSession } from '../../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = Array.isArray(result?.errors)
          ? result.errors.join(', ')
          : result?.message || 'No se pudo iniciar sesión';
        throw new Error(message);
      }

      const authData = result?.data;
      const role = getRoleFromUser(authData.user);

      saveAuthSession(authData.token, authData.user);
      router.push(role === 'freelancer' ? '/dashboard/seller' : '/');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      
      {/* VOLVER AL INICIO (Arriba a la izquierda) */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-1 text-zinc-500 hover:text-white transition text-sm"
      >
        <ChevronLeft size={16} />
        Volver al inicio
      </Link>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full max-w-[400px] bg-[#0c0c0e] border border-zinc-900 p-8 rounded-3xl shadow-2xl">
        
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-xs">FH</div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h1>
          <p className="text-zinc-500 text-sm">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input 
                type="email" 
                placeholder="tu@email.com" 
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-400">Contraseña</label>
              <Link href="#" className="text-[11px] text-emerald-500 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="********" 
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0c0c0e] px-2 text-zinc-600 tracking-widest">O CONTINUA CON</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-xl hover:bg-[#121212] transition text-xs font-medium">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Google
          </button>
          
          <button className="flex items-center justify-center gap-2 py-2.5 border border-zinc-800 rounded-xl hover:bg-[#121212] transition text-xs font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        <p className="text-center mt-8 text-xs text-zinc-500">
          ¿No tienes una cuenta? <Link href="/register" className="text-emerald-500 font-bold hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
