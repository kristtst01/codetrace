import { useRef } from 'react';
import type { PathfindingStep } from '../../types';
import { useGridRenderer } from '../../hooks/useGridRenderer';

interface GridVisualizerProps {
  step: PathfindingStep;
  width?: number;
  height?: number;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
}

export const GridVisualizer = ({
  step,
  width = 1000,
  height = 600,
  onCellClick,
  onStartDrag,
  onEndDrag,
}: GridVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGridRenderer({
    canvasRef,
    step,
    width,
    height,
    onCellClick,
    onStartDrag,
    onEndDrag,
  });

  return (
    <div className="flex justify-center items-center bg-card rounded-lg border p-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded cursor-pointer max-w-full max-h-[600px] w-auto h-auto"
      />
    </div>
  );
};
