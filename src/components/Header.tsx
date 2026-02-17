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
  comparisonMode?: boolean;
  onComparisonModeChange?: (enabled: boolean) => void;
}

export const Header = ({ mode, onModeChange, comparisonMode, onComparisonModeChange }: HeaderProps) => {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex justify-between items-center px-4 py-2">
      <h1 className="text-2xl font-bold tracking-tight">CodeTrace</h1>
      <div className="flex items-center gap-4">
        {mode === 'sorting' && onComparisonModeChange && (
          <button
            onClick={() => onComparisonModeChange(!comparisonMode)}
            className={`inline-flex items-center justify-center rounded-md border border-input p-2 hover:bg-accent hover:text-accent-foreground ${
              comparisonMode ? 'bg-accent text-accent-foreground' : 'bg-background'
            }`}
            aria-label="Toggle comparison mode"
            title="Compare two algorithms"
          >
            <span className="text-xs font-bold">VS</span>
          </button>
        )}
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
