import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { MazeType } from '../../types';

interface MazeControlsProps {
  onGenerateMaze: (type: MazeType) => void;
}

const mazeOptions: { value: MazeType; label: string }[] = [
  { value: 'recursive-division', label: "Recursive Division" },
  { value: 'randomized-prims', label: "Randomized Prim's" },
  { value: 'random-walls', label: "Random Walls" },
  { value: 'ellers', label: "Eller's" },
  { value: 'kruskals', label: "Kruskal's" },
  { value: 'wilsons', label: "Wilson's" },
  { value: 'aldous-broder', label: "Aldous-Broder" },
];

export const MazeControls = ({ onGenerateMaze }: MazeControlsProps) => {
  const [selected, setSelected] = useState<MazeType>('recursive-division');

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Maze Patterns</label>
      <Select value={selected} onValueChange={(v) => setSelected(v as MazeType)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {mazeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() => onGenerateMaze(selected)}
        variant="outline"
        className="w-full"
      >
        Generate Maze
      </Button>
    </div>
  );
};
