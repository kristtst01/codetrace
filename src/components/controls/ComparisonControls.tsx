import { AlgorithmSelector } from './AlgorithmSelector';
import { ArraySizeControl } from './ArraySizeControl';
import { GenerateArrayButton } from './GenerateArrayButton';
import { ArrayInput } from './ArrayInput';
import { PlaybackControls } from './PlaybackControls';
import { SpeedControl } from './SpeedControl';
import { SoundToggle } from './SoundToggle';
import { StatisticsDisplay } from '../StatisticsDisplay';
import type { ArrayPreset } from '../../hooks/useArrayManagement';
import type { SortingStep } from '../../types';

interface ComparisonControlsProps {
  leftAlgorithm: string | null;
  rightAlgorithm: string | null;
  onLeftAlgorithmChange: (algorithm: string) => void;
  onRightAlgorithmChange: (algorithm: string) => void;
  size: number;
  onSizeChange: (size: number) => void;
  onGenerate: (preset?: ArrayPreset) => void;
  onSetCustomArray: (arr: number[]) => void;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  leftStepData: SortingStep | null;
  rightStepData: SortingStep | null;
  leftAlgorithmName: string | undefined;
  rightAlgorithmName: string | undefined;
  leftTotalSteps: number;
  rightTotalSteps: number;
}

export const ComparisonControls = ({
  leftAlgorithm,
  rightAlgorithm,
  onLeftAlgorithmChange,
  onRightAlgorithmChange,
  size,
  onSizeChange,
  onGenerate,
  onSetCustomArray,
  isPlaying,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  onSpeedChange,
  soundEnabled,
  onToggleSound,
  leftStepData,
  rightStepData,
  leftAlgorithmName,
  rightAlgorithmName,
  leftTotalSteps,
  rightTotalSteps,
}: ComparisonControlsProps) => {
  const canPlay = leftAlgorithm && rightAlgorithm;

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Left Algorithm</label>
        <AlgorithmSelector
          selectedAlgorithm={leftAlgorithm}
          onAlgorithmChange={onLeftAlgorithmChange}
          mode="sorting"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Right Algorithm</label>
        <AlgorithmSelector
          selectedAlgorithm={rightAlgorithm}
          onAlgorithmChange={onRightAlgorithmChange}
          mode="sorting"
        />
      </div>

      <ArraySizeControl size={size} onSizeChange={onSizeChange} />
      <ArrayInput onSetCustomArray={onSetCustomArray} />
      <GenerateArrayButton onGenerate={onGenerate} />

      <PlaybackControls
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={totalSteps}
        selectedAlgorithm={canPlay ? 'comparison' : null}
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
      />

      <SpeedControl speed={speed} onSpeedChange={onSpeedChange} />
      <SoundToggle soundEnabled={soundEnabled} onToggle={onToggleSound} />

      {canPlay && (
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground text-center">
          <span>{leftAlgorithmName}: Step {Math.min(currentStep + 1, leftTotalSteps)} of {leftTotalSteps}</span>
          <span>{rightAlgorithmName}: Step {Math.min(currentStep + 1, rightTotalSteps)} of {rightTotalSteps}</span>
        </div>
      )}

      {leftStepData && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{leftAlgorithmName ?? 'Left'}</p>
          <StatisticsDisplay step={leftStepData} />
        </div>
      )}

      {rightStepData && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{rightAlgorithmName ?? 'Right'}</p>
          <StatisticsDisplay step={rightStepData} />
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Keyboard Shortcuts</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <kbd className="font-mono">Space</kbd><span>Play / Pause</span>
          <kbd className="font-mono">◀ ▶</kbd><span>Step</span>
          <kbd className="font-mono">R</kbd><span>Reset</span>
        </div>
      </div>
    </>
  );
};
