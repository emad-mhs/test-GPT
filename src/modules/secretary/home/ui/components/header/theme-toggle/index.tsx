'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from './icons';
import { cn } from '@/lib/utils';

const THEMES = [
  { name: 'light', Icon: Sun },
  { name: 'dark', Icon: Moon },
];

export function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`تبديل إلى وضع ${theme === 'dark' ? 'النهار' : 'الليل'}`}
      aria-pressed={theme === 'dark'}
      className='group flex items-center gap-1 rounded-full bg-accent p-1 transition-colors hover:bg-muted focus:outline-none focus-visible:ring focus-visible:ring-primary/50'
    >
      {THEMES.map(({ name, Icon }) => (
        <span
          key={name}
          className={cn(
            'grid h-9 w-9 place-items-center rounded-full transition-colors',
            theme === name
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className='size-5' />
        </span>
      ))}
    </button>
  );
}
