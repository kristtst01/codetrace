import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { AlgorithmMode } from '../../types';

interface ModeSelectorProps {
  mode: AlgorithmMode;
  onModeChange: (mode: AlgorithmMode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Visualization Mode</label>
      <Select value={mode} onValueChange={onModeChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sorting">Sorting Algorithms</SelectItem>
          <SelectItem value="pathfinding">Pathfinding Algorithms</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
