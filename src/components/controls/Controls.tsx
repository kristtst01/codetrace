import { Card, CardContent } from '../ui/card';
import { AlgorithmSelector } from './AlgorithmSelector';
import { PlaybackControls } from './PlaybackControls';
import { SpeedControl } from './SpeedControl';
import { StepCounter } from './StepCounter';

interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  selectedAlgorithm: string | null;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onAlgorithmChange: (algorithm: string) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const Controls = ({
  isPlaying,
  speed,
  currentStep,
  totalSteps,
  selectedAlgorithm,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onAlgorithmChange,
  onStepForward,
  onStepBackward,
}: ControlsProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={onAlgorithmChange}
        />

        <PlaybackControls
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={totalSteps}
          selectedAlgorithm={selectedAlgorithm}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
          onStepForward={onStepForward}
          onStepBackward={onStepBackward}
        />

        <SpeedControl speed={speed} onSpeedChange={onSpeedChange} />

        <StepCounter currentStep={currentStep} totalSteps={totalSteps} />
      </CardContent>
    </Card>
  );
};
