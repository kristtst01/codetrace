import { LabeledSlider } from './LabeledSlider';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl = ({ speed, onSpeedChange }: SpeedControlProps) => {
  return (
    <LabeledSlider
      label="Speed"
      value={speed}
      onValueChange={onSpeedChange}
      min={50}
      max={2000}
      step={50}
      displayValue={`${speed}ms`}
    />
  );
};
