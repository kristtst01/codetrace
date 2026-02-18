import { LabeledSlider } from './LabeledSlider';

interface WeightControlProps {
  selectedWeight: number;
  onWeightChange: (weight: number) => void;
}

export const WeightControl = ({ selectedWeight, onWeightChange }: WeightControlProps) => {
  return (
    <div className="space-y-2">
      <LabeledSlider
        label="Weight"
        value={selectedWeight}
        onValueChange={onWeightChange}
        min={2}
        max={9}
        step={1}
      />
      <p className="text-xs text-muted-foreground">Right-click to place weighted cells</p>
    </div>
  );
};
