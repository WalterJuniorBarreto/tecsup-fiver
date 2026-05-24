'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BriefcaseBusiness, Check, Loader2, Search, UserRound } from 'lucide-react';
import usernameImage from '../../../../username.png';
import { authService } from '../../../services/auth.service';
import { clearAuthSession, getStoredUser, saveAuthSession } from '../../../lib/auth';

type Step = 'username' | 'role';
type RoleChoice = 'CLIENT' | 'FREELANCER' | '';

const usernamePattern = /^[a-zA-Z0-9_]{3,24}$/;

export default function OAuthOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('username');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<RoleChoice>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    const isTemporaryUsername = user.username?.startsWith('google_') || user.username?.startsWith('github_');
    if (user.username && !isTemporaryUsername) {
      setUsername(user.username);
    }
  }, [router]);

  const usernameValue = username.trim().toLowerCase();
  const canContinueUsername = usernamePattern.test(usernameValue);
  const canFinish = canContinueUsername && !!role && !isSubmitting;

  const displayName = useMemo(() => usernameValue || 'tu cuenta', [usernameValue]);

  const handleUsernameSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!canContinueUsername) {
      setError('El username debe tener de 3 a 24 caracteres y solo usar letras, numeros o guion bajo.');
      return;
    }

    setStep('role');
  };

  const handleBack = () => {
    setError('');

    if (step === 'role') {
      setStep('username');
      return;
    }

    clearAuthSession();
    router.replace('/auth/login');
  };

  const handleFinish = async () => {
    if (!canFinish) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await authService.completeOAuthOnboarding({
        username: usernameValue,
        role
      });

      if (response.data) {
        saveAuthSession(response.data.token, response.data.user);
        router.replace(response.data.user.role === 'FREELANCER' ? '/dashboard/seller' : '/');
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo configurar tu perfil.');
      setStep('username');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950/80 px-4 py-6 flex items-center justify-center">
      <section className="w-full max-w-5xl min-h-[640px] bg-white text-zinc-950 rounded-[10px] overflow-hidden shadow-2xl grid lg:grid-cols-[1.05fr_1fr]">
        {step === 'username' ? (
          <>
            <div className="relative hidden lg:block bg-[#8d2944]">
              <Image
                src={usernameImage}
                alt="Persona configurando su cuenta"
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute left-20 top-16 rounded-full bg-white px-5 py-3 shadow-xl flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-emerald-600 text-white grid place-items-center text-sm font-black">DM</span>
                <span className="font-semibold text-zinc-800">Faith</span>
                <Check className="text-emerald-500" size={22} strokeWidth={3} />
              </div>
              <div className="absolute left-32 top-40 rounded-full bg-white px-5 py-3 shadow-xl flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-zinc-900 text-white grid place-items-center text-sm font-black">JC</span>
                <span className="font-semibold text-zinc-800">jonthan_coleman</span>
                <Check className="text-emerald-500" size={22} strokeWidth={3} />
              </div>
            </div>

            <div className="px-8 sm:px-12 py-8 lg:py-10 flex flex-col">
              <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-bold mb-8 w-fit hover:text-emerald-600 transition">
                <ArrowLeft size={18} /> Back
              </button>

              <div className="max-w-md">
                <h1 className="text-3xl font-black tracking-tight mb-3">Get your profile started</h1>
                <p className="text-zinc-600 text-lg leading-relaxed mb-3">
                  Add a username that's unique to you, this is how you'll appear to others.
                </p>
                <p className="text-zinc-700 text-sm font-bold mb-9">You can't change your username, so choose wisely.</p>

                <form onSubmit={handleUsernameSubmit}>
                  <label htmlFor="username" className="block text-base font-bold mb-2">Choose a username</label>
                  <input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="john_smith"
                    autoFocus
                    className="w-full rounded-lg border-2 border-zinc-900 px-4 py-3 text-lg outline-none focus:border-emerald-500 transition"
                  />
                  <p className="text-zinc-500 text-sm mt-2 mb-8">Build trust by using your full name or business name.</p>

                  {error && <p className="text-red-600 text-sm font-semibold mb-4">{error}</p>}

                  <button
                    type="submit"
                    disabled={!canContinueUsername}
                    className="w-full rounded-lg py-3.5 font-bold bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400 hover:bg-emerald-500 hover:text-black disabled:hover:bg-zinc-200 disabled:hover:text-zinc-400 transition"
                  >
                    Create my account
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2 px-8 sm:px-14 py-8 flex flex-col min-h-[640px]">
            <button onClick={handleBack} className="inline-flex items-center gap-2 text-sm font-bold mb-10 w-fit hover:text-emerald-600 transition">
              <ArrowLeft size={18} /> Back
            </button>

            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
                {displayName}, your account has been created! What brings you to DevMarket?
              </h1>
              <p className="text-zinc-500 text-lg">We'll tailor your experience to fit your needs.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl w-full mx-auto">
              <RoleCard
                title="I am a client"
                selected={role === 'CLIENT'}
                onClick={() => setRole('CLIENT')}
                icon={<Search size={34} />}
              />
              <RoleCard
                title="I'm a freelancer"
                selected={role === 'FREELANCER'}
                onClick={() => setRole('FREELANCER')}
                icon={<UserRound size={36} />}
              />
            </div>

            {error && <p className="text-red-600 text-sm font-semibold text-center mt-8">{error}</p>}

            <div className="mt-auto flex justify-end">
              <button
                onClick={handleFinish}
                disabled={!canFinish}
                className="min-w-24 rounded-lg px-6 py-3 font-bold bg-zinc-900 text-white disabled:bg-zinc-200 disabled:text-zinc-400 hover:bg-emerald-500 hover:text-black disabled:hover:bg-zinc-200 disabled:hover:text-zinc-400 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Next'}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function RoleCard({
  title,
  selected,
  onClick,
  icon
}: {
  title: string;
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-48 text-left rounded-lg border p-7 transition ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-zinc-300 hover:border-zinc-500'
      }`}
    >
      <span className={`absolute right-6 top-5 h-5 w-5 rounded border grid place-items-center ${
        selected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-zinc-900'
      }`}>
        {selected && <Check size={14} strokeWidth={3} />}
      </span>

      <span className="mb-7 inline-grid h-16 w-16 place-items-center rounded-full bg-[#5a9916] text-white shadow-[0_0_0_6px_rgba(90,153,22,0.12)] relative">
        {icon}
        <span className="absolute -right-1 bottom-0 h-6 w-6 rounded-full bg-white shadow grid place-items-center text-zinc-900">
          <BriefcaseBusiness size={13} fill="currentColor" />
        </span>
      </span>

      <span className="block text-lg font-black">{title}</span>
    </button>
  );
}
