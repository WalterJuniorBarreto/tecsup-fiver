'use client';

import { 
  LayoutDashboard, Briefcase, Inbox, DollarSign, 
  BarChart3, MessageSquare, User, Plus, LogOut, Moon 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
      {/* SIDEBAR ÚNICO */}
      <aside className="w-64 border-r border-zinc-900 flex flex-col p-6 fixed h-full bg-black z-20">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-xs">FH</div>
          <span className="font-bold text-lg tracking-tight">FreelanceHub</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === item.href 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-900 space-y-4">
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-center">
            <p className="text-[10px] text-zinc-500 mb-2 italic">Modo Vendedor</p>
            <Link href="/" className="text-xs font-bold text-white border border-zinc-700 w-full block py-2 rounded-lg hover:bg-zinc-800 transition">
              Panel Comprador
            </Link>
          </div>

          <div className="flex items-center justify-between px-2 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=juan" alt="User" />
              </div>
              <div>
                <p className="text-xs font-bold">Juan Doe</p>
                <p className="text-[10px] text-zinc-500 italic">juan@email.com</p>
              </div>
            </div>
            <Moon size={16} className="text-zinc-500 cursor-pointer hover:text-white" />
          </div>

          <button className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition px-2">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* AQUÍ SE CARGAN LAS PÁGINAS (Dashboard, Servicios, etc.) */}
      <main className="ml-64 flex-1 p-10">
        {children}
      </main>
    </div>
  );
}