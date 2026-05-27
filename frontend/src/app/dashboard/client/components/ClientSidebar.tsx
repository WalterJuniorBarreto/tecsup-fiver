'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  User, 
  Search, 
  LogOut,
  Home,
  Loader2,        
  ArrowRightLeft,  
  Sparkles         
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { 
  clearAuthSession, 
  getStoredUser, 
  getAuthToken, 
  updateStoredUser, 
  type AuthUser 
} from '../../../../lib/auth';
import { useChatStore } from '../../../../store/chatStore';
import { chatService } from '../../../../services/chat.service'; 
import { io } from 'socket.io-client';
import { api } from '../../../../config/axios';

export default function ClientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  const globalUnreadCount = useChatStore(state => state.getTotalUnread());
  const [isUpgrading, setIsUpgrading] = useState(false);

  // 🚀 LÓGICA DE CAMBIO DE ROL
  const handleRoleSwitch = async () => {
    if (user?.role === 'FREELANCER' || user?.role === 'ADMIN') {
      router.push('/dashboard/seller');
      return;
    }

    try {
      setIsUpgrading(true);
      const res = await api.post('/api/profile/become-freelancer');
      
      if (res.data.success) {
        updateStoredUser({ role: 'FREELANCER' });
        router.push('/dashboard/seller');
      }
    } catch (error) {
      console.error("Error al convertirse en freelancer", error);
      alert("Hubo un error al intentar cambiar de rol.");
    } finally {
      setIsUpgrading(false);
    }
  };

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    if (currentUser) {
      const fetchInitialChats = async () => {
        try {
          const chats = await chatService.getMyChats();
          
          const counts: Record<string, number> = {};
          chats.forEach((chat: any) => {
            counts[chat.id] = chat.unreadCount || 0; 
          });

          useChatStore.getState().setInitialCounts(counts);
        } catch (error) {
          console.error('Error cargando notificaciones de mensajes:', error);
        }
      };

      fetchInitialChats();

      const token = getAuthToken(); 
      
      const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
        auth: { token }, 
        withCredentials: true 
      });

      socket.on('new_message', (message: any) => {
        if (message.senderId !== currentUser.id) {
          const chatId = message.conversationId || message.chatId;
          if (chatId) {
            useChatStore.getState().incrementUnread(chatId);
          }
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

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

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium text-sm ${
                isActive 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} /> 
                {item.label}
              </div>

              {item.label === 'Mensajes' && globalUnreadCount > 0 && (
                <span className="bg-[#00e676] text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(0,230,118,0.3)] animate-in zoom-in duration-300">
                  {globalUnreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ACCIONES INFERIORES */}
      <div className="space-y-4">
        <Link
          href="/"
          className="w-full border border-zinc-800 bg-[#121214] text-zinc-300 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition text-sm"
        >
          <Home size={18} /> Página principal
        </Link>

        <Link 
          href="/explore" 
          className="w-full bg-[#00e676] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition text-sm shadow-lg shadow-emerald-500/10"
        >
          <Search size={18} /> Buscar servicios
        </Link>
        
        <div className="bg-gradient-to-br from-zinc-900/50 to-black rounded-2xl p-4 border border-zinc-800/50 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#00e676]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <p className="text-[10px] text-zinc-500 uppercase font-bold mb-3 tracking-widest relative z-10">
            {user?.role === 'FREELANCER' || user?.role === 'ADMIN' ? 'Modo de Trabajo' : 'Gana dinero con nosotros'}
          </p>
          
          <button 
            onClick={handleRoleSwitch}
            disabled={isUpgrading}
            className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all relative z-10 ${
              user?.role === 'FREELANCER' || user?.role === 'ADMIN'
                ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700' 
                : 'bg-[#00e676] text-black hover:bg-[#00c853] shadow-[0_0_15px_rgba(0,230,118,0.2)]'
            }`}
          >
            {isUpgrading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : user?.role === 'FREELANCER' || user?.role === 'ADMIN' ? (
              <>Cambiar a Vendedor <ArrowRightLeft size={14} /></>
            ) : (
              <>Ser Freelancer <Sparkles size={14} /></>
            )}
          </button>
        </div>
      </div>

      {/* PERFIL DE USUARIO */}
      <div className="pt-6 border-t border-zinc-900 mt-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=121214&color=00e676`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || user?.username || 'Cliente'}</p>
            <p className="text-[10px] text-zinc-500 truncate font-mono">{user?.email || 'cliente@email.com'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 text-xs font-bold transition-colors">
            <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
