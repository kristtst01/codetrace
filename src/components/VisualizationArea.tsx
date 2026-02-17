import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { GridVisualizer } from './visualizers/GridVisualizer';
import { AlgorithmInfoCard } from './AlgorithmInfoCard';
import type { AlgorithmStep, Algorithm } from '../types';

interface VisualizationAreaProps {
  currentStepData: AlgorithmStep;
  algorithm: Algorithm | null | undefined;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
}

export const VisualizationArea = ({
  currentStepData,
  algorithm,
  onCellClick,
  onStartDrag,
  onEndDrag,
}: VisualizationAreaProps) => {
  return (
    <div className="space-y-4">
      {currentStepData.type === 'sorting' ? (
        <SortingVisualizer step={currentStepData} width={800} height={400} />
      ) : (
        <GridVisualizer
          step={currentStepData}
          onCellClick={onCellClick}
          onStartDrag={onStartDrag}
          onEndDrag={onEndDrag}
        />
      )}
      {algorithm && (
        <AlgorithmInfoCard algorithm={algorithm} currentMessage={currentStepData.message} />
      )}
    </div>
  );
};
