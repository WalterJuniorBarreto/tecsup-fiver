"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearAuthSession, getRoleFromUser, getStoredUser } from '../../lib/auth';

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'client' | 'freelancer' | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setUserRole(user ? getRoleFromUser(user) : null);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUserRole(null);
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-black text-white w-full border-b border-zinc-900 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* LOGO - Ahora te lleva a la home */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-sm">
            FH
          </div>
          <span className="text-xl font-bold tracking-tight">FreelanceHub</span>
        </Link>

        {/* LINKS IZQUIERDA */}
        <div className="hidden md:flex gap-6 text-zinc-400 text-sm font-medium">
          {/* CAMBIO AQUÍ: href="/explore" */}
          <Link href="/explore" className="hover:text-white transition">Explorar</Link>
          
          <Link href="/" className="hover:text-white transition">Categorias</Link>
          <Link href="/" className="hover:text-white transition">Como funciona</Link>
        </div>
      </div>

      {/* BOTONES DERECHA */}
      <div className="flex items-center gap-6 font-medium">
        <button className="text-zinc-400 hover:text-white text-lg">
          🌙
        </button>
        {userRole ? (
          <>
            <Link
              href={userRole === 'freelancer' ? '/dashboard/seller' : '/'}
              className="text-sm text-white hover:text-zinc-300 transition"
            >
              {userRole === 'freelancer' ? 'Dashboard' : 'Inicio'}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#00e676] text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-400 transition"
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-sm text-white hover:text-zinc-300 transition">
              Iniciar sesion
            </Link>
            <Link href="/auth/register" className="bg-[#00e676] text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-400 transition">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
