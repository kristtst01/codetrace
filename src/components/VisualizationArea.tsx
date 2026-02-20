import { SortingVisualizer } from './visualizers/SortingVisualizer';
import { GridVisualizer } from './visualizers/GridVisualizer';
import { AlgorithmInfoCard } from './AlgorithmInfoCard';
import type { AlgorithmStep, Algorithm } from '../types';

interface VisualizationAreaProps {
  currentStepData: AlgorithmStep;
  algorithm: Algorithm | null | undefined;
  soundEnabled?: boolean;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onWeightPlace?: (row: number, col: number, weight: number) => void;
  selectedWeight?: number;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
  fogOfWar?: boolean;
}

export const VisualizationArea = ({
  currentStepData,
  algorithm,
  soundEnabled,
  onCellClick,
  onWeightPlace,
  selectedWeight,
  onStartDrag,
  onEndDrag,
  fogOfWar,
}: VisualizationAreaProps) => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 min-h-[300px]">
        {currentStepData.type === 'sorting' ? (
          <SortingVisualizer step={currentStepData} soundEnabled={soundEnabled} />
        ) : (
          <GridVisualizer
            step={currentStepData}
            onCellClick={onCellClick}
            onWeightPlace={onWeightPlace}
            selectedWeight={selectedWeight}
            onStartDrag={onStartDrag}
            onEndDrag={onEndDrag}
            fogOfWar={fogOfWar}
          />
        )}
      </div>
      {algorithm && (
        <AlgorithmInfoCard algorithm={algorithm} currentMessage={currentStepData.message} />
      )}
    </div>
  );
};
