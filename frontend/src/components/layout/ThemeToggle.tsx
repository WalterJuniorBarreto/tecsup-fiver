'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const nextTheme: Theme = storedTheme === 'light' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
      className="theme-toggle-button"
    >
      {isDark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
    </button>
  );
}
