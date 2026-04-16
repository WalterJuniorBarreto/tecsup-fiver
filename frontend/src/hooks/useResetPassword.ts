import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export const useResetPassword = () => {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('reset_email');
    if (!savedEmail) {
      router.push('/auth/forgot-password');
    } else {
      setEmail(savedEmail);
    }
    
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend, router]);

  const handleResendCode = async () => {
    if (!email || !canResend) return;
    try {
      await authService.forgotPassword({ email });
      setTimer(59);
      setCanResend(false);
      setError('');
    } catch (err: any) {
      setError('No se pudo reenviar el código');
    }
  };

  const handleValidateCodeStep = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Ingresa los 6 dígitos.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authService.verifyResetCode({ email: email!, code: fullCode });
      setStep(2); 
    } catch (err: any) {
      setError(err.message || 'El código es incorrecto o ha expirado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
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

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifícalas.');
      return;
    }
    
    if (!email) return;

    setError('');
    setIsSubmitting(true);

    try {
      await authService.resetPassword({ 
        email, 
        code: fullCode, 
        newPassword 
      });

      sessionStorage.removeItem('reset_email');
      router.push('/auth/login?reset=success');
      
    } catch (err: any) {
      setError(err.message);
      
      if (err.message.toLowerCase().includes('código') || err.message.toLowerCase().includes('expirado')) {
        setStep(1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    step,
    setStep,
    email,
    code,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    error,
    isSubmitting,
    inputRefs,
    timer,
    canResend,
    handleResendCode,
    handleCodeChange,
    handleKeyDown,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleValidateCodeStep,
    handleSubmit
  };
};