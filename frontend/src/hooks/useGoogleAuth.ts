// src/hooks/useGoogleAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { saveAuthSession } from '../lib/auth';
import { CredentialResponse } from '@react-oauth/google';

// 🚀 AHORA ACEPTA EL ROL COMO PARÁMETRO
export const useGoogleAuth = (selectedRole?: 'CLIENT' | 'FREELANCER') => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsGoogleLoading(true);
    setGoogleError('');

    try {
      const token = credentialResponse.credential;
      if (!token) throw new Error('Google no devolvió un token.');

      // 🛠️ Armamos el payload dinámicamente
      const payload: { token: string; role?: 'CLIENT' | 'FREELANCER' } = { token };
      
      // Si el componente le pasó un rol (ej: desde el RegisterPage), lo incluimos
      if (selectedRole) {
        payload.role = selectedRole;
      }

      const response = await authService.googleLogin(payload);

      if (response.data) {
        const authData = response.data;
        saveAuthSession(authData.token, authData.user);
        
        // Redirección inteligente basada en el rol real del usuario
        router.push(authData.user.role === 'FREELANCER' ? '/dashboard/seller' : '/');
      }
      
    } catch (err: any) {
      setGoogleError(err.message || 'Error al autenticar con Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleError('La autenticación con Google fue cancelada.');
  };

  return { isGoogleLoading, googleError, handleGoogleSuccess, handleGoogleError };
};