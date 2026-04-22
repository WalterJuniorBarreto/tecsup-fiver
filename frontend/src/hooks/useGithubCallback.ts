import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '../services/auth.service';
import { saveAuthSession } from '../lib/auth';
import { UserRole } from '../types/auth.types';

export const useGithubCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  
  const hasProcessed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setStatus('error');
      setError('No se proporcionó un código de autorización.');
      return;
    }

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processGithubLogin = async () => {
      try {
        const savedRole = sessionStorage.getItem('github_intended_role') as UserRole | null;
        
        const response = await authService.githubLogin({ 
          code, 
          role: savedRole || undefined 
        });

        if (response.data) {
          const { token, user } = response.data;
          saveAuthSession(token, user);
          sessionStorage.removeItem('github_intended_role');
          
          setStatus('success');
          router.push(user.role === 'FREELANCER' ? '/dashboard/seller' : '/');
        }
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Error al conectar con GitHub');
      }
    };

    processGithubLogin();
  }, [searchParams, router]);

  return { status, error };
};