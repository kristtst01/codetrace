import { Button } from '../ui/button';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  selectedAlgorithm: string | null;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const PlaybackControls = ({
  isPlaying,
  currentStep,
  totalSteps,
  selectedAlgorithm,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
}: PlaybackControlsProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Playback</label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={currentStep === 0}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        {isPlaying ? (
          <Button onClick={onPause} className="flex-1">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
        ) : (
          <Button onClick={onPlay} className="flex-1" disabled={!selectedAlgorithm}>
            <Play className="mr-2 h-4 w-4" />
            Play
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
