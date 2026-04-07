import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { RegisterData, UserRole } from '../types/auth.types';

export const  useRegister = () => {
  const router = useRouter();
  
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload: RegisterData = {
      name: formData.username, 
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: role,
    };

    try {
      await authService.register(payload);

      sessionStorage.setItem('verify_email', payload.email);
      
      router.push('/auth/verify-email');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    role,
    formData,
    showPassword,
    error,
    isSubmitting,
    handleChange,
    handleRoleSelect,
    togglePasswordVisibility,
    handleSubmit,
  };
};