import { ModeSelector } from './controls/ModeSelector';
import type { AlgorithmMode } from '../types';

interface HeaderProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
}

export const Header = ({ mode, onModeChange }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <h1 className="text-2xl font-bold tracking-tight">CodeTrace</h1>
      <ModeSelector mode={mode} onModeChange={onModeChange} />
    </div>
  );
};
