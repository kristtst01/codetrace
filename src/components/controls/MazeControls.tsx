import { Button } from '../ui/button';

interface MazeControlsProps {
  onGenerateMaze: (type: string) => void;
}

export const MazeControls = ({ onGenerateMaze }: MazeControlsProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Maze Patterns</label>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => onGenerateMaze('recursive-division')}
          variant="outline"
          className="w-full"
        >
          Recursive Division
        </Button>
        <Button
          onClick={() => onGenerateMaze('randomized-prims')}
          variant="outline"
          className="w-full"
        >
          Randomized Prim's
        </Button>
        <Button
          onClick={() => onGenerateMaze('random-walls')}
          variant="outline"
          className="w-full"
        >
          Random Walls
        </Button>
      </div>
    </div>
  );
};
