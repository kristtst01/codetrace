import { useRef } from 'react';
import { useVisualizerRenderer } from '../../hooks/useVisualizerRenderer';
import { useContainerSize } from '../../hooks/useContainerSize';
import type { AlgorithmStep } from '../../types';

interface SortingVisualizerProps {
  step: AlgorithmStep;
}

export const SortingVisualizer = ({ step }: SortingVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useContainerSize(containerRef);
  const canvasWidth = Math.max(0, width - 32);
  const canvasHeight = Math.max(0, height - 32);

  useVisualizerRenderer({ canvasRef, step, width: canvasWidth, height: canvasHeight });

  return (
    <div ref={containerRef} className="w-full h-full bg-card rounded-lg border p-4">
      {width > 0 && height > 0 && (
        <canvas
          ref={canvasRef}
          width={width - 32}
          height={height - 32}
          className="rounded"
        />
      )}
    </div>
  );
};
