'use client';
import { useGithubCallback } from '../../../../hooks/useGithubCallback';
import { Suspense } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

function GithubCallbackContent() {
  const { status, error } = useGithubCallback();

  return (
    <div className="w-full max-w-[400px] bg-[#0c0c0e] border border-zinc-900 p-8 rounded-3xl shadow-2xl text-center">
      <div className="flex justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-[#00e676] animate-spin mb-4" />
          <h1 className="text-xl font-bold mb-2">Conectando con GitHub</h1>
          <p className="text-zinc-500 text-sm">Autenticando tus credenciales de forma segura...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-red-500 font-bold text-xl">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Error de autenticación</h1>
          <p className="text-zinc-500 text-sm mb-6">{error}</p>
          <Link 
            href="/auth/login" 
            className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition text-sm"
          >
            Volver al Login
          </Link>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#00e676]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">¡Autenticado!</h1>
          <p className="text-zinc-500 text-sm">Redirigiendo a tu panel...</p>
        </div>
      )}
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Suspense fallback={<div>Cargando...</div>}>
        <GithubCallbackContent />
      </Suspense>
    </div>
  );
}