import { Slider } from '../ui/slider';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl = ({ speed, onSpeedChange }: SpeedControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Speed</label>
        <span className="text-sm text-muted-foreground">{speed}ms</span>
      </div>
      <Slider
        value={[speed]}
        onValueChange={([value]) => onSpeedChange(value)}
        min={50}
        max={2000}
        step={50}
        className="w-full"
      />
    </div>
  );
};
