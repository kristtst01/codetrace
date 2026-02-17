import { useEffect, useRef } from 'react';
import { getBarColor, VISUALIZER_COLORS } from '../utils/colorUtils';
import { playTone } from '../utils/audioUtils';
import type { SortingStep } from '../types';
import { useTheme } from './useTheme';

interface UseVisualizerRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  step: SortingStep;
  width: number;
  height: number;
  soundEnabled?: boolean;
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  array: number[],
  width: number,
  height: number,
  getColor: (index: number) => string
) {
  ctx.clearRect(0, 0, width, height);

  const barWidth = width / array.length;
  const maxValue = Math.max(...array);
  const padding = 20;

  const foreground = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
  const textColor = foreground ? `hsl(${foreground})` : '#ffffff';

  array.forEach((value, index) => {
    const barHeight = (value / maxValue) * (height - padding * 2);
    const x = index * barWidth;
    const y = height - barHeight - padding;

    ctx.fillStyle = getColor(index);
    ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

    ctx.fillStyle = textColor;
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
  });
}

export const useVisualizerRenderer = ({
  canvasRef,
  step,
  width,
  height,
  soundEnabled,
}: UseVisualizerRendererProps) => {
  const dark = useTheme();
  const prevStepRef = useRef<SortingStep | null>(null);
  const sweepTimersRef = useRef<number[]>([]);

  // Clean up any running sweep
  const cancelSweep = () => {
    for (const id of sweepTimersRef.current) {
      clearTimeout(id);
    }
    sweepTimersRef.current = [];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || width === 0 || height === 0) return;

    const { array, comparing = [], swapping = [], sorted = [] } = step;
    const isComplete = sorted.length === array.length && comparing.length === 0 && swapping.length === 0;
    const isNewStep = step !== prevStepRef.current;

    // Play tones for normal compare/swap steps
    if (soundEnabled && isNewStep && !isComplete) {
      const maxValue = Math.max(...array);
      const indices = swapping.length > 0 ? swapping : comparing;
      for (const idx of indices) {
        playTone(array[idx], maxValue);
      }
    }

    // If this is a new completion step with sound, run the sweep animation
    if (soundEnabled && isNewStep && isComplete) {
      cancelSweep();

      const maxValue = Math.max(...array);
      let sweepIndex = 0;

      // Draw initial state with default (blue) bars
      drawBars(ctx, array, width, height, () => VISUALIZER_COLORS.default);

      const sweepDelay = 30;
      const timers: number[] = [];

      for (let i = 0; i < array.length; i++) {
        const id = window.setTimeout(() => {
          sweepIndex = i;
          playTone(array[i], maxValue, 30);

          drawBars(ctx, array, width, height, (index) => {
            if (index < sweepIndex) return VISUALIZER_COLORS.sorted;
            if (index === sweepIndex) return VISUALIZER_COLORS.comparing;
            return VISUALIZER_COLORS.default;
          });
        }, i * sweepDelay);
        timers.push(id);
      }

      // Final frame: all green
      const finalId = window.setTimeout(() => {
        drawBars(ctx, array, width, height, () => VISUALIZER_COLORS.sorted);
        sweepTimersRef.current = [];
      }, array.length * sweepDelay);
      timers.push(finalId);

      sweepTimersRef.current = timers;
    } else if (!isComplete || !soundEnabled) {
      // Normal rendering (non-completion steps, or sound disabled)
      cancelSweep();
      drawBars(ctx, array, width, height, (index) =>
        getBarColor(index, comparing, swapping, sorted)
      );
    }

    prevStepRef.current = step;
  }, [canvasRef, step, width, height, dark, soundEnabled]);

  // Cleanup on unmount
  useEffect(() => cancelSweep, []);
};
