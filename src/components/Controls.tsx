import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import { algorithms } from '../algorithms';

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
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Algorithm</label>
          <Select value={selectedAlgorithm || undefined} onValueChange={onAlgorithmChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an algorithm" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(algorithms).map(([key, algo]) => (
                <SelectItem key={key} value={key}>
                  {algo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Playback Controls */}
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

        {/* Speed Control */}
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

        {/* Step Counter */}
        <div className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </CardContent>
    </Card>
  );
};
