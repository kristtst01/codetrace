import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { AlgorithmInfoCard } from './AlgorithmInfoCard';
import type { AlgorithmStep, Algorithm } from '../types';

interface VisualizationAreaProps {
  currentStepData: AlgorithmStep;
  algorithm: Algorithm | null | undefined;
}

export const VisualizationArea = ({ currentStepData, algorithm }: VisualizationAreaProps) => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-0">
        <SortingVisualizer step={currentStepData} />
      </div>
      {algorithm && (
        <AlgorithmInfoCard algorithm={algorithm} currentMessage={currentStepData.message} />
      )}
    </div>
  );
};
