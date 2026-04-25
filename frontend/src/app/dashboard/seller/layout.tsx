'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Briefcase, Inbox, DollarSign, 
  BarChart3, MessageSquare, User, LogOut, Moon, Star
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthSession, getStoredUser, type AuthUser } from '../../../lib/auth';
import { useChat } from '../../../hooks/useChat';
import { useChatStore } from '../../../store/chatStore';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCounts } = useChat();
  const [user, setUser] = useState<AuthUser | null>(null);
  const getTotalUnread = useChatStore(state => state.getTotalUnread);
  const globalUnreadCount = getTotalUnread();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/seller' },
    { name: 'Mis servicios', icon: Briefcase, href: '/dashboard/seller/services' },
    { name: 'Pedidos recibidos', icon: Inbox, href: '/dashboard/seller/orders' },
    { name: 'Ganancias', icon: DollarSign, href: '/dashboard/seller/earnings' },
    { name: 'Estadisticas', icon: BarChart3, href: '/dashboard/seller/stats' },
    { name: 'Mensajes', icon: MessageSquare, href: '/dashboard/seller/messages' },
    { name: 'Mi perfil', icon: User, href: '/dashboard/seller/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <aside className="w-64 border-r border-zinc-900 flex flex-col p-6 fixed h-full bg-black z-20">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-xs">FH</div>
          <span className="font-bold text-lg tracking-tight">FreelanceHub</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.name}
                </div>
                
                {item.name === 'Mensajes' && globalUnreadCount > 0 && (
      <span className="bg-[#00e676] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,230,118,0.3)]">
        {globalUnreadCount}
      </span>
    )}
              </Link>
            );
          })}
          <div className="pt-6">
            <Link href="/dashboard/seller/membership" className="block group">
              <div className="p-4 bg-transparent border border-emerald-500/30 rounded-2xl group-hover:border-emerald-500 transition-colors duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Tu membresía</span>
                  <div className="flex items-center gap-1 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-lg">
                    <Star size={10} fill="currentColor" className="text-yellow-500" /> Plan Gratuito
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400">Actualiza para más servicios</p>
              </div>
            </Link>
          </div>
        </nav>

        <div className="pt-6 border-t border-zinc-900 space-y-4">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center">
            <p className="text-[11px] text-zinc-400 mb-2">¿Quieres comprar servicios?</p>
            <Link href="/" className="text-xs font-bold text-white bg-zinc-800/80 w-full block py-2.5 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-700">
              Ir al panel de comprador
            </Link>
          </div>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=juan" alt="User" />
              </div>
              <div>
                <p className="text-xs font-bold">{user?.name || user?.username || 'Juan Doe'}</p>
                <p className="text-[10px] text-zinc-500 italic">{user?.email || 'juan@email.com'}</p>
              </div>
            </div>
            <Moon size={16} className="text-zinc-500 cursor-pointer hover:text-white" />
          </div>

          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition px-2">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="ml-64 flex-1 p-10">
        {children}
      </main>
    </div>
  );
}