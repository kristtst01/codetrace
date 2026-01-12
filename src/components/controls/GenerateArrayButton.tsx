import { Button } from '../ui/button';
import { Shuffle } from 'lucide-react';

interface GenerateArrayButtonProps {
  onGenerate: () => void;
}

export const GenerateArrayButton = ({ onGenerate }: GenerateArrayButtonProps) => {
  return (
    <Button onClick={onGenerate} variant="outline" className="w-full">
      <Shuffle className="mr-2 h-4 w-4" />
      Generate New Array
    </Button>
  );
};
