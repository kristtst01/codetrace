import { useEffect, useRef } from 'react';
import type { AlgorithmStep } from '../../types';

interface SortingVisualizerProps {
  step: AlgorithmStep;
  width?: number;
  height?: number;
}

export const SortingVisualizer = ({ step, width = 800, height = 400 }: SortingVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const { array, comparing = [], swapping = [], sorted = [] } = step;
    const barWidth = width / array.length;
    const maxValue = Math.max(...array);
    const padding = 20;

    array.forEach((value, index) => {
      const barHeight = ((value / maxValue) * (height - padding * 2));
      const x = index * barWidth;
      const y = height - barHeight - padding;

      // Determine bar color based on state
      let color = '#3b82f6'; // Default blue

      if (sorted.includes(index)) {
        color = '#22c55e'; // Green for sorted
      } else if (swapping.includes(index)) {
        color = '#ef4444'; // Red for swapping
      } else if (comparing.includes(index)) {
        color = '#eab308'; // Yellow for comparing
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  }, [step, width, height]);

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
