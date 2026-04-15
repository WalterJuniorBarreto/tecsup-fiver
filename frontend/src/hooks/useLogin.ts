import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { saveAuthSession } from '../lib/auth';

export const useLogin = () => {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await authService.login(formData);

      // Verificamos que data exista
      if (response.data) {
        const authData = response.data;
        
        // Guardamos la sesión
        saveAuthSession(authData.token, authData.user);
        
        // Redirección inteligente basada en el rol de la BD
        router.push(authData.user.role === 'FREELANCER' ? '/dashboard/seller' : '/');
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    showPassword,
    error,
    isSubmitting,
    handleChange,
    togglePasswordVisibility,
    handleSubmit
  };
};