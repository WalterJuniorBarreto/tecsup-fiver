import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export const useForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setIsSubmitting(true);

    try {
      await authService.forgotPassword({ email: email.trim() });

      sessionStorage.setItem('reset_email', email.trim());
      
      router.push('/auth/reset-password');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    isSubmitting,
    handleSubmit
  };
};