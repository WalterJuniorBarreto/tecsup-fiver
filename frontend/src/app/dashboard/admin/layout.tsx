'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredUser } from '../../../lib/auth'; 

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.replace('/auth/login');
    } else if (user.role !== 'ADMIN') {
      router.replace('/explore');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  
  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#0c0c0e]" />;
  }

  return (
    <>
      {children}
    </>
  );
}