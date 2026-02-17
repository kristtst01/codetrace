import { LabeledSlider } from './LabeledSlider';

interface ArraySizeControlProps {
  size: number;
  onSizeChange: (size: number) => void;
}

export const ArraySizeControl = ({ size, onSizeChange }: ArraySizeControlProps) => {
  return (
    <LabeledSlider
      label="Array Size"
      value={size}
      onValueChange={onSizeChange}
      min={5}
      max={100}
      step={5}
    />
  );
};
