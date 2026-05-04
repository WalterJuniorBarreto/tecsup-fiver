import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; 
import { authService } from '../services/auth.service';
import { saveAuthSession } from '../lib/auth';

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  
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

      if (response.data) {
        const authData = response.data;
        saveAuthSession(authData.token, authData.user);
        
        const redirectUrl = searchParams.get('redirect');
        
        if (redirectUrl) {
          router.push(redirectUrl); 
          return;
        }

        const userRole = authData.user.role;
        if (userRole === 'ADMIN') {
          router.push('/dashboard/admin'); 
        } else if (userRole === 'FREELANCER') {
          router.push('/dashboard/seller'); 
        } else {
          router.push('/explore');
        }
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