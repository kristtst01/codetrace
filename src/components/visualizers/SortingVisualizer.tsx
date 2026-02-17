import { useRef } from 'react';
import { useVisualizerRenderer } from '../../hooks/useVisualizerRenderer';
import type { SortingStep } from '../../types';

interface SortingVisualizerProps {
  step: SortingStep;
  width?: number;
  height?: number;
}

export const SortingVisualizer = ({ step, width = 800, height = 400 }: SortingVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useVisualizerRenderer({ canvasRef, step, width, height });

  return (
    <div className="flex justify-center items-center bg-card rounded-lg border p-4">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded"
      />
    </div>
  );
};
