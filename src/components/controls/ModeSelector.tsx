import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { AlgorithmMode } from '../../types';

interface ModeSelectorProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <Select value={mode} onValueChange={onModeChange}>
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sorting">Sorting Algorithms</SelectItem>
        <SelectItem value="pathfinding">Pathfinding Algorithms</SelectItem>
      </SelectContent>
    </Select>
  );
};
