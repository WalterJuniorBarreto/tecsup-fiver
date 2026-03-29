'use client';

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  User, 
  Search, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/client' },
    { label: 'Mis pedidos', icon: ShoppingBag, href: '/dashboard/client/orders' },
    { label: 'Favoritos', icon: Heart, href: '/dashboard/client/favorites' },
    { label: 'Mensajes', icon: MessageSquare, href: '/dashboard/client/messages' },
    { label: 'Mi perfil', icon: User, href: '/dashboard/client/profile' },
  ];

  return (
    <aside className="w-64 border-r border-zinc-900 flex flex-col p-6 gap-8 fixed h-full bg-black z-20">
      {/* LOGO */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#00e676] text-black font-black px-2 py-1 rounded text-sm">FH</div>
        <span className="font-bold text-lg text-white">FreelanceHub</span>
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                isActive 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
              }`}
            >
              <item.icon size={18} /> 
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ACCIONES INFERIORES */}
      <div className="space-y-4">
        {/* CORRECCIÓN AQUÍ: Cambiamos button por Link */}
        <Link 
          href="/dashboard/client/explore" 
          className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition text-sm shadow-lg shadow-emerald-500/10"
        >
          <Search size={18} /> Buscar servicios
        </Link>
        
        <div className="bg-zinc-900/30 rounded-2xl p-4 border border-zinc-800/50 text-center">
          <p className="text-[10px] text-zinc-600 uppercase font-bold mb-2 tracking-widest">¿Eres freelancer?</p>
          <Link href="/dashboard/seller" className="text-[11px] font-bold text-zinc-400 border border-zinc-800 w-full py-2 rounded-lg flex items-center justify-center hover:bg-zinc-800 hover:text-white transition">
            Ir al panel de vendedor
          </Link>
        </div>
      </div>

      {/* PERFIL DE USUARIO */}
      <div className="pt-6 border-t border-zinc-900 mt-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            <img src="https://i.pravatar.cc/100?u=maria" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Maria Garcia</p>
            <p className="text-[10px] text-zinc-500 truncate font-mono">maria@email.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 text-xs font-bold transition-colors">
            <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}