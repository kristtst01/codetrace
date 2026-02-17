import { Slider } from '../ui/slider';

interface LabeledSliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue?: string;
}

export const LabeledSlider = ({
  label,
  value,
  onValueChange,
  min,
  max,
  step,
  displayValue,
}: LabeledSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">{displayValue ?? value}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onValueChange(v)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};
