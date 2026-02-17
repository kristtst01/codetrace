import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ModeSelector } from './controls/ModeSelector';
import type { AlgorithmMode } from '../types';

const THEME_KEY = 'codetrace-theme';

function getInitialDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface HeaderProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
}

export const Header = ({ mode, onModeChange }: HeaderProps) => {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <h1 className="text-2xl font-bold tracking-tight">CodeTrace</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark((d) => !d)}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <ModeSelector mode={mode} onModeChange={onModeChange} />
      </div>
    </div>
  );
};
