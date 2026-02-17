import { useRef } from 'react';
import { useVisualizerRenderer } from '../../hooks/useVisualizerRenderer';
import { useContainerSize } from '../../hooks/useContainerSize';
import type { SortingStep } from '../../types';

interface SortingVisualizerProps {
  step: SortingStep;
}

export const SortingVisualizer = ({ step }: SortingVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const canvasWidth = width;
  const canvasHeight = height;

  useVisualizerRenderer({ canvasRef, step, width: canvasWidth, height: canvasHeight });

  return (
    <div ref={containerRef} className="w-full h-full bg-card rounded-lg border p-4">
      {canvasWidth > 0 && canvasHeight > 0 && (
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="rounded"
        />
      )}
    </div>
  );
};
