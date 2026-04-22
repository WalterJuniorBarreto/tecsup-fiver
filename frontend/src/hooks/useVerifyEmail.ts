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

  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('verify_email');
    if (!savedEmail) {
      router.push('/auth/register');
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleResendCode = async () => {
    if (!email || !canResend) return;
    
    try {
      console.log("Reenviando correo a:", email); 
      
      setTimer(59);
      setCanResend(false);
      setError('');
    } catch (err: any) {
      setError('Error al reenviar el código');
    }
  };

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

    if (isSubmitting) return;

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
      
      const userRole = result.data?.user?.role;

      if (userRole === 'FREELANCER') {
        router.push('/dashboard/seller');
      } else {
        const previousPage = sessionStorage.getItem('return_url') || '/';
        router.push(previousPage);
      }
      
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false); 
    } 
  };

  return {
    email,
    code,
    error,
    isSubmitting,
    inputRefs,
    timer,             
    canResend,       
    handleResendCode,  
    handleChange,
    handleKeyDown,
    handleSubmit
  };
};