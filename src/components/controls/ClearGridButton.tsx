import { Button } from '../ui/button';
import { Eraser } from 'lucide-react';

interface ClearGridButtonProps {
  onClear: () => void;
}

export const ClearGridButton = ({ onClear }: ClearGridButtonProps) => {
  return (
    <Button onClick={onClear} variant="outline" className="w-full">
      <Eraser className="mr-2 h-4 w-4" />
      Clear Walls
    </Button>
  );
};
