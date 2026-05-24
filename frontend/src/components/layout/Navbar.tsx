"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clearAuthSession, getRoleFromUser, getStoredUser } from '../../lib/auth';
import type { AuthRole } from '../../lib/auth';
import ThemeToggle from './ThemeToggle';
import logo from '../../../logo.png';

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<AuthRole | null>(null);

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
    <nav className="theme-surface theme-border flex items-center justify-between px-10 py-5 w-full sticky top-0 z-50 backdrop-blur-xl">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <Image
            src={logo}
            alt="DevMarket logo"
            className="h-10 w-10 rounded-xl object-cover"
            priority
          />
          <span className="text-xl font-bold tracking-tight theme-text">DevMarket</span>
        </Link>

        <div className="hidden md:flex gap-6 theme-muted text-sm font-medium">
          <Link href="/explore" className="hover:text-[var(--text-primary)] transition">Explorar</Link>
          
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Categorias</Link>
          <Link href="/" className="hover:text-[var(--text-primary)] transition">Como funciona</Link>
        </div>
      </div>

      <div className="flex items-center gap-6 font-medium">
        <ThemeToggle />
        {userRole ? (
          <>
            <Link
              href={userRole === 'admin' ? '/dashboard/admin' : userRole === 'freelancer' ? '/dashboard/seller' : '/'}
              className="text-sm theme-text hover:opacity-70 transition"
            >
              {userRole === 'client' ? 'Inicio' : 'Dashboard'}
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
            <Link href="/auth/login" className="text-sm theme-text hover:opacity-70 transition">
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
