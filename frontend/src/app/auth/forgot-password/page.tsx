'use client';

import Link from 'next/link';
import { Mail, ChevronLeft } from 'lucide-react';
import { useForgotPassword } from '../../../hooks/useForgotPassword';

export default function ForgotPasswordPage() {
  const { email, setEmail, error, isSubmitting, handleSubmit } = useForgotPassword();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      
      <Link 
        href="/auth/login" 
        className="absolute top-8 left-8 flex items-center gap-1 text-zinc-500 hover:text-white transition text-sm"
      >
        <ChevronLeft size={16} />
        Volver a iniciar sesión
      </Link>

      <div className="w-full max-w-[400px] bg-[#0c0c0e] border border-zinc-900 p-8 rounded-3xl shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-xs">FH</div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Recuperar contraseña</h1>
          <p className="text-zinc-500 text-sm">
            Ingresa tu correo y te enviaremos un código de 6 dígitos para restablecer tu acceso.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
              <input 
                type="email"
                placeholder="tu@email.com" 
                required
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting || !email} 
            className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando código...' : 'Enviar código'}
          </button>
        </form>
      </div>
    </div>
  );
}