import { Button } from '../ui/button';
import { Shuffle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { ArrayPreset } from '../../hooks/useArrayManagement';

interface GenerateArrayButtonProps {
  onGenerate: (preset: ArrayPreset) => void;
}

const presetOptions: { value: ArrayPreset; label: string }[] = [
  { value: 'random', label: 'Random' },
  { value: 'sorted', label: 'Sorted' },
  { value: 'reverse', label: 'Reverse Sorted' },
  { value: 'nearly-sorted', label: 'Nearly Sorted' },
  { value: 'few-unique', label: 'Few Unique Values' },
];

export const GenerateArrayButton = ({ onGenerate }: GenerateArrayButtonProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Select onValueChange={(value) => onGenerate(value as ArrayPreset)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Preset: Random" />
        </SelectTrigger>
        <SelectContent>
          {presetOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => onGenerate('random')} variant="outline" className="w-full">
        <Shuffle className="mr-2 h-4 w-4" />
        Generate New Array
      </Button>
    </div>
  );
};
