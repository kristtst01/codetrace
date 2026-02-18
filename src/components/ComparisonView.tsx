import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { getAlgorithm } from '../algorithms';
import type { SortingStep } from '../types';

interface ComparisonViewProps {
  leftAlgorithm: string | null;
  rightAlgorithm: string | null;
  leftStepData: SortingStep;
  rightStepData: SortingStep;
  soundEnabled: boolean;
}

export const ComparisonView = ({
  leftAlgorithm,
  rightAlgorithm,
  leftStepData,
  rightStepData,
  soundEnabled,
}: ComparisonViewProps) => {
  const leftAlgo = leftAlgorithm ? getAlgorithm(leftAlgorithm) : null;
  const rightAlgo = rightAlgorithm ? getAlgorithm(rightAlgorithm) : null;

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="flex flex-col min-h-0">
        <div className="text-sm font-medium mb-2 text-center">
          {leftAlgo?.name ?? 'Select Left Algorithm'}
        </div>
        <div className="flex-1 min-h-0">
          <SortingVisualizer step={leftStepData} soundEnabled={soundEnabled} />
        </div>
      </div>

      <div className="flex flex-col min-h-0">
        <div className="text-sm font-medium mb-2 text-center">
          {rightAlgo?.name ?? 'Select Right Algorithm'}
        </div>
        <div className="flex-1 min-h-0">
          <SortingVisualizer step={rightStepData} soundEnabled={soundEnabled} />
        </div>
      </div>
    </div>
  );
};
