import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';

interface FogOfWarToggleProps {
  fogOfWar: boolean;
  onToggle: () => void;
}

export const FogOfWarToggle = ({ fogOfWar, onToggle }: FogOfWarToggleProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Fog of War</label>
      <Button
        onClick={onToggle}
        variant={fogOfWar ? 'default' : 'outline'}
        className="w-full flex items-center gap-2"
      >
        {fogOfWar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {fogOfWar ? 'Fog Enabled' : 'Fog Disabled'}
      </Button>
    </div>
  );
};
