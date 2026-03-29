'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importamos el router para la navegación
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter(); // Inicializamos el router
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos capturados:", { ...formData, role });

    // Lógica de redirección basada en el rol seleccionado
    if (role === 'freelancer') {
      router.push('/dashboard/seller'); // Redirige al panel de vendedor
    } else {
      router.push('/dashboard/client'); // Los clientes vuelven al inicio o a su panel específico
    }
  };

  // Función para actualizar el estado de los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 cursor-pointer">
        <div className="bg-[#00e676] text-black font-extrabold px-2 py-1 rounded text-sm">FH</div>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-zinc-500 text-sm italic">Unete a la comunidad de freelancers mas grande</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NOMBRE COMPLETO */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre" 
                required 
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-11 outline-none focus:border-emerald-500 transition" 
              />
            </div>
          </div>

          {/* CORREO */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Correo electronico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com" 
                required 
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-11 outline-none focus:border-emerald-500 transition" 
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Contrasena</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimo 8 caracteres" 
                required 
                className="w-full bg-[#121212] border border-zinc-800 rounded-xl py-3 px-11 outline-none focus:border-emerald-500 transition" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* SELECCIÓN DE ROL */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-zinc-400 block text-center">¿Como quieres usar FreelanceHub?</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Opción Cliente */}
              <div 
                onClick={() => setRole('client')} 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${role === 'client' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-[#121212] hover:border-zinc-700'}`}
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-bold text-sm">Cliente</div>
                <div className="text-[10px] text-zinc-500">Contratar servicios</div>
              </div>
              {/* Opción Freelancer */}
              <div 
                onClick={() => setRole('freelancer')} 
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${role === 'freelancer' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-[#121212] hover:border-zinc-700'}`}
              >
                <div className="text-2xl mb-1">💼</div>
                <div className="font-bold text-sm">Freelancer</div>
                <div className="text-[10px] text-zinc-500">Ofrecer servicios</div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#00e676] text-black font-bold py-3.5 rounded-xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/10">
            Crear cuenta
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black px-2 text-zinc-600 tracking-widest">O REGISTRATE CON</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-zinc-800 rounded-xl hover:bg-[#121212] transition text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-zinc-800 rounded-xl hover:bg-[#121212] transition text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.61-4.041-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Iniciar sesion</Link>
        </p>
      </div>
    </div>
  );
}