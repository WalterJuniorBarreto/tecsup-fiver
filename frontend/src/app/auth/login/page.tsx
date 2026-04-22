// src/app/auth/login/page.tsx
'use client';

import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import { useLogin } from '../../../hooks/useLogin';

import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../../../hooks/useGoogleAuth';

export default function LoginPage() {
  const { isGoogleLoading, googleError, handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  const {
    formData,
    showPassword,
    error,
    isSubmitting,
    handleChange,
    togglePasswordVisibility,
    handleSubmit
  } = useLogin();

  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) {
      console.error('Falta NEXT_PUBLIC_GITHUB_CLIENT_ID en el .env.local');
      return;
    }
    
    sessionStorage.removeItem('github_intended_role');
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-1 text-zinc-500 hover:text-white transition text-sm"
      >
        <ChevronLeft size={16} />
        Volver al inicio
      </Link>

      <div className="w-full max-w-[400px] bg-[#0c0c0e] border border-zinc-900 p-8 rounded-3xl shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-xs">FH</div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h1>
          <p className="text-zinc-500 text-sm">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input 
                type="email"
                name="email" 
                placeholder="tu@email.com" 
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-zinc-400">Contraseña</label>
              <Link href="/auth/forgot-password" className="text-[11px] text-emerald-500 hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                placeholder="********" 
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                value={formData.password}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#0c0c0e] px-2 text-zinc-600 tracking-widest">O CONTINUA CON</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          
          <div className="flex flex-col items-center w-full">
            {googleError && <p className="text-[10px] text-red-400 mb-1 text-center absolute -mt-4">{googleError}</p>}
            <div className="w-full relative h-[40px] flex items-center justify-center rounded-xl overflow-hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="rectangular"
                text="continue_with"
                size="large"
                width="100%"
              />
            </div>
          </div>
          
          <button 
            onClick={handleGithubLogin}
            type="button"
            className="flex items-center justify-center gap-2 h-[40px] w-full border border-zinc-800 rounded-xl hover:bg-[#121212] transition text-sm font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>

        </div>

        <p className="text-center mt-8 text-xs text-zinc-500">
          ¿No tienes una cuenta? <Link href="/auth/register" className="text-emerald-500 font-bold hover:underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}