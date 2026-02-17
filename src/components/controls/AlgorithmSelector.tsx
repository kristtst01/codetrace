import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { algorithms } from '../../algorithms';
import type { AlgorithmMode } from '../../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string | null;
  onAlgorithmChange: (algorithm: string) => void;
  mode: AlgorithmMode;
}

export const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  mode,
}: AlgorithmSelectorProps) => {
  const filteredAlgorithms = Object.entries(algorithms).filter(
    ([_, algo]) => algo.category === mode
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Algorithm</label>
      <Select value={selectedAlgorithm ?? ''} onValueChange={onAlgorithmChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose an algorithm" />
        </SelectTrigger>
        <SelectContent>
          {filteredAlgorithms.map(([key, algo]) => (
            <SelectItem key={key} value={key}>
              {algo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
