'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Briefcase, Inbox, DollarSign, 
  MessageSquare, User, LogOut, Star, ArrowRightLeft
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import { 
  clearAuthSession, 
  getStoredUser, 
  getAuthToken, 
  subscribeToAuthUser, 
  type AuthUser 
} from '../../../lib/auth';
import { useChatStore } from '../../../store/chatStore';
import { chatService } from '../../../services/chat.service'; 
import { io } from 'socket.io-client';

import ThemeToggle from '../../../components/layout/ThemeToggle';
import logo from '../../../../logo.png';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); 

  const globalUnreadCount = useChatStore(state => state.getTotalUnread());

  useEffect(() => {
    const currentUser = getStoredUser();

    if (!currentUser) {
      router.replace('/auth/login'); 
      return;
    }
    if (currentUser.role === 'ADMIN') {
      router.replace('/dashboard/admin'); 
      return;
    }
    if (currentUser.role === 'CLIENT') {
      router.replace('/explore'); 
      return;
    }

    setIsAuthorized(true);
    setUser(currentUser);

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

    const unsubscribeAuth = subscribeToAuthUser(setUser);

    return () => {
      socket.disconnect();
      unsubscribeAuth();
    };
  }, [router]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/seller' },
    { name: 'Mis servicios', icon: Briefcase, href: '/dashboard/seller/services' },
    { name: 'Pedidos', icon: Inbox, href: '/dashboard/seller/orders' },
    { name: 'Ganancias', icon: DollarSign, href: '/dashboard/seller/earnings' },
    { name: 'Mensajes', icon: MessageSquare, href: '/dashboard/seller/messages' },
    { name: 'Mi perfil', icon: User, href: '/dashboard/seller/profile' },
  ];

  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#00e676]/30">
      
      <aside className="w-72 border-r border-zinc-800/60 flex flex-col p-6 fixed h-full bg-[#0c0c0e] z-20 shadow-2xl">
        
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
          <Image
            src={logo}
            alt="DevMarket logo"
            className="h-10 w-10 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-lg"
            priority
          />
          <span className="font-black text-xl tracking-tight">DevMarket</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#00e676]/10 to-transparent text-[#00e676] border-l-4 border-[#00e676]' 
                    : 'text-zinc-500 hover:text-white hover:bg-[#121214] border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? 'text-[#00e676]' : 'text-zinc-600 group-hover:text-zinc-400 transition-colors'} />
                  {item.name}
                </div>
                
                {item.name === 'Mensajes' && globalUnreadCount > 0 && (
                  <span className="bg-[#00e676] text-black text-[10px] font-black px-2 py-0.5 rounded-md shadow-[0_0_10px_rgba(0,230,118,0.3)] animate-in zoom-in duration-300">
                    {globalUnreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 mt-2 border-t border-zinc-800/60 mx-2">
            <Link href="/dashboard/seller/membership" className="block group">
              <div className="p-5 bg-gradient-to-br from-[#121214] to-[#0a0a0a] border border-[#00e676]/20 rounded-2xl group-hover:border-[#00e676]/50 transition-colors duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#00e676]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00e676]/10 transition-colors"></div>
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Membresía</span>
                  <div className="flex items-center gap-1 bg-white text-black text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                    <Star size={10} fill="currentColor" className="text-yellow-500" /> FREE
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium relative z-10">Actualiza para destacar más.</p>
              </div>
            </Link>
          </div>
        </nav>

        <div className="pt-6 border-t border-zinc-800/60 mt-auto space-y-5">
          
          <Link href="/" className="group flex items-center justify-between p-3.5 bg-[#121214] border border-zinc-800/80 rounded-2xl hover:border-[#00e676]/50 transition-all cursor-pointer shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-xl group-hover:bg-[#00e676]/10 transition-colors">
                <ArrowRightLeft size={16} className="text-zinc-500 group-hover:text-[#00e676] transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Cambiar modo</span>
                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">Ir a Comprar</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0 shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-black uppercase text-zinc-400 bg-zinc-800">
                    {(user?.name || user?.username || 'U').charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-white truncate">{user?.name || user?.username || 'Freelancer'}</p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">{user?.email || 'email@email.com'}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </aside>

      <main className="ml-72 flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}