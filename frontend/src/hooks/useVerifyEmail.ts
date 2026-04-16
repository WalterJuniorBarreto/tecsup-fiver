import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export const useVerifyEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('verify_email');
    if (!savedEmail) {
      router.push('/auth/register');
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join(''); 

    if (fullCode.length !== 6) {
      setError('Por favor, ingresa los 6 dígitos.');
      return;
    }

    if (!email) return;

    setError('');
    setIsSubmitting(true);

    try {
      const result = await authService.verifyEmail({ email, code: fullCode });

      sessionStorage.removeItem('verify_email');
      
      
      const userRole = result.data?.user.role;

      if (userRole === 'FREELANCER') {
        router.push('/dashboard/client');
      } else {
       
        const previousPage = sessionStorage.getItem('return_url') || '/';
        router.push(previousPage);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    code,
    error,
    isSubmitting,
    inputRefs,
    handleChange,
    handleKeyDown,
    handleSubmit
  };
};