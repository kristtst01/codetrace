import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { algorithms } from '../../algorithms';

interface AlgorithmSelectorProps {
  selectedAlgorithm: string | null;
  onAlgorithmChange: (algorithm: string) => void;
}

export const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
}: AlgorithmSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Algorithm</label>
      <Select value={selectedAlgorithm || undefined} onValueChange={onAlgorithmChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose an algorithm" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(algorithms).map(([key, algo]) => (
            <SelectItem key={key} value={key}>
              {algo.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
