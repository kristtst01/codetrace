import { Card, CardContent } from '../ui/card';
import { AlgorithmSelector } from './AlgorithmSelector';
import { PlaybackControls } from './PlaybackControls';
import { SpeedControl } from './SpeedControl';
import { ArraySizeControl } from './ArraySizeControl';
import { GenerateArrayButton } from './GenerateArrayButton';
import { StepCounter } from './StepCounter';

interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  size: number;
  currentStep: number;
  totalSteps: number;
  selectedAlgorithm: string | null;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSizeChange: (size: number) => void;
  onGenerateArray: () => void;
  onAlgorithmChange: (algorithm: string) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const Controls = ({
  isPlaying,
  speed,
  size,
  currentStep,
  totalSteps,
  selectedAlgorithm,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onSizeChange,
  onGenerateArray,
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

        <ArraySizeControl size={size} onSizeChange={onSizeChange} />

        <GenerateArrayButton onGenerate={onGenerateArray} />

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
