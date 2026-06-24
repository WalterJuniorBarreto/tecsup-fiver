import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';
import { RegisterData, UserRole } from '../types/auth.types';

export const useRegister = () => {
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
      const response = await authService.register(payload);

      const token = response.data?.token;
      
      if (token) {
        localStorage.setItem('token', token);
      }

      router.push('/');
      
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.issues?.[0] || 
        'Error de conexión con el servidor';
        
      setError(errorMessage);
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