import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { AlgorithmInfoCard } from './AlgorithmInfoCard';
import type { AlgorithmStep, Algorithm } from '../types';

interface VisualizationAreaProps {
  currentStepData: AlgorithmStep;
  algorithm: Algorithm | null | undefined;
}

export const VisualizationArea = ({ currentStepData, algorithm }: VisualizationAreaProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <SortingVisualizer step={currentStepData} width={800} height={400} />
      {algorithm && (
        <AlgorithmInfoCard algorithm={algorithm} currentMessage={currentStepData.message} />
      )}
    </div>
  );
};
