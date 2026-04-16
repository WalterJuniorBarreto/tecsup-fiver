// src/app/auth/reset-password/page.tsx
'use client';

import Link from 'next/link';
import { Lock, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useResetPassword } from '../../../hooks/useResetPassword';

export default function ResetPasswordPage() {
  const {
    step,
    setStep,
    email,
    code,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isSubmitting,
    inputRefs,
    handleCodeChange,
    handleKeyDown,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleValidateCodeStep,
    handleSubmit
  } = useResetPassword();

  if (!email) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      
      {step === 2 ? (
        <button 
          onClick={() => setStep(1)} 
          className="absolute top-8 left-8 flex items-center gap-1 text-zinc-500 hover:text-white transition text-sm"
        >
          <ChevronLeft size={16} /> Volver al código
        </button>
      ) : (
        <Link 
          href="/auth/forgot-password" 
          className="absolute top-8 left-8 flex items-center gap-1 text-zinc-500 hover:text-white transition text-sm"
        >
          <ChevronLeft size={16} /> Cambiar correo
        </Link>
      )}

      <div className="w-full max-w-[450px] bg-[#0c0c0e] border border-zinc-900 p-8 rounded-3xl shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {step === 1 ? 'Verifica tu identidad' : 'Crea una nueva contraseña'}
          </h1>
          <p className="text-zinc-500 text-sm">
            {step === 1 ? (
              <>Ingresa el código que enviamos a <span className="text-white font-medium">{email}</span></>
            ) : (
              'Asegúrate de que tu nueva contraseña sea segura.'
            )}
          </p>
        </div>

   
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 text-center block">Código de 6 dígitos</label>
              <div className="flex justify-between gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-[#121212] border border-zinc-800 rounded-xl outline-none focus:border-[#00e676] focus:shadow-[0_0_10px_rgba(0,230,118,0.1)] transition-all"
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button 
              type="button" 
              onClick={handleValidateCodeStep}
              className="w-full bg-[#00e676] text-black font-bold py-3.5 rounded-xl hover:bg-emerald-400 transition text-sm shadow-lg shadow-emerald-500/10"
            >
              Validar código
            </button>
          </div>
        )}

        
        {step === 2 && (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres" 
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400">Confirmar nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña" 
                  className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-emerald-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#00e676] text-black font-bold py-3.5 rounded-xl hover:bg-emerald-400 transition text-sm shadow-lg shadow-emerald-500/10 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}