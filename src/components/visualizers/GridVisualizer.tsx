import { useRef } from 'react';
import type { PathfindingStep } from '../../types';
import { useGridRenderer } from '../../hooks/useGridRenderer';
import { useContainerSize } from '../../hooks/useContainerSize';

interface GridVisualizerProps {
  step: PathfindingStep;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onWeightPlace?: (row: number, col: number, weight: number) => void;
  selectedWeight?: number;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
  fogOfWar?: boolean;
}

export const GridVisualizer = ({
  step,
  onCellClick,
  onWeightPlace,
  selectedWeight,
  onStartDrag,
  onEndDrag,
  fogOfWar,
}: GridVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const canvasWidth = width;
  const canvasHeight = height;

  useGridRenderer({
    canvasRef,
    step,
    width: canvasWidth,
    height: canvasHeight,
    onCellClick,
    onWeightPlace,
    selectedWeight,
    onStartDrag,
    onEndDrag,
    fogOfWar,
  });

  return (
    <div ref={containerRef} className="w-full h-full bg-card rounded-lg border p-4">
      {canvasWidth > 0 && canvasHeight > 0 && (
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="rounded cursor-pointer"
        />
      )}
    </div>
  );
};
