import { Slider } from '../ui/slider';

interface ArraySizeControlProps {
  size: number;
  onSizeChange: (size: number) => void;
}

export const ArraySizeControl = ({ size, onSizeChange }: ArraySizeControlProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Array Size</label>
        <span className="text-sm text-muted-foreground">{size}</span>
      </div>
      <Slider
        value={[size]}
        onValueChange={([value]) => onSizeChange(value)}
        min={5}
        max={100}
        step={5}
        className="w-full"
      />
    </div>
  );
};
