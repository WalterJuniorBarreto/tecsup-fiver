'use client';

import Link from 'next/link';
import { useVerifyEmail } from '../../../hooks/useVerifyEmail';

export default function VerifyEmailPage() {
  const {
    email,
    code,
    error,
    isSubmitting,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleSubmit,
    canResend,
    handleResendCode,
    timer
  } = useVerifyEmail();

  if (!email) return null; 

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      
      <div className="w-full max-w-md mb-8">
        <Link href="/auth/register" className="text-zinc-400 hover:text-white text-sm flex items-center gap-2 transition">
          <span>←</span> Back
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#121212] p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        
        <h1 className="text-3xl font-bold mb-3 text-center">Confirma tu email</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">
          Entra tu codigo que se envio a tu correo:
          <br/>
          <span className="text-white font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-bold bg-transparent border border-zinc-600 rounded-lg outline-none focus:border-[#00e676] focus:shadow-[0_0_10px_rgba(0,230,118,0.2)] transition-all"
                required
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}

          <div className="flex justify-between items-center text-sm font-medium pt-4">
            {canResend ? (
              <button 
                type="button" 
                onClick={handleResendCode}
                className="text-zinc-400 hover:text-white hover:underline transition"
              >
                Reenviar código
              </button>
            ) : (
              <p className="text-zinc-500">
                Reenviar código en <span className="text-white font-mono">{timer}s</span>
              </p>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#00e676] text-black px-8 py-3 rounded-xl hover:bg-emerald-400 transition shadow-lg disabled:opacity-50 font-bold"
            >
              {isSubmitting ? 'Validating...' : 'Submit'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}