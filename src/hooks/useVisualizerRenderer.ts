import { useEffect } from 'react';
import { getBarColor } from '../utils/colorUtils';
import type { AlgorithmStep } from '../types';

interface UseVisualizerRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  step: AlgorithmStep;
  width: number;
  height: number;
}

export const useVisualizerRenderer = ({
  canvasRef,
  step,
  width,
  height,
}: UseVisualizerRendererProps) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    const { array, comparing = [], swapping = [], sorted = [] } = step;
    const barWidth = width / array.length;
    const maxValue = Math.max(...array);
    const padding = 20;

    array.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - padding * 2);
      const x = index * barWidth;
      const y = height - barHeight - padding;

      const color = getBarColor(index, comparing, swapping, sorted);

      ctx.fillStyle = color;
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  }, [canvasRef, step, width, height]);
};
