import { useEffect, useRef } from 'react';
import type { AlgorithmStep } from '../types';
import { getCellColor } from '../utils/colorUtils';

interface UseGridRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  step: AlgorithmStep;
  width: number;
  height: number;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
}

export const useGridRenderer = ({
  canvasRef,
  step,
  width,
  height,
  onCellClick,
  onStartDrag,
  onEndDrag,
}: UseGridRendererProps) => {
  const dragStateRef = useRef<{
    isDragging: boolean;
    isDrawingWalls: boolean;
    dragType: 'start' | 'end' | null;
    drawMode: 'add' | 'remove' | null;
    lastRow: number | null;
    lastCol: number | null;
  }>({
    isDragging: false,
    isDrawingWalls: false,
    dragType: null,
    drawMode: null,
    lastRow: null,
    lastCol: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !step.grid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { grid } = step;
    const cellWidth = width / grid.cols;
    const cellHeight = height / grid.rows;

    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row][col];
        const x = col * cellWidth;
        const y = row * cellHeight;

        const color = getCellColor(
          cell,
          step.visited,
          step.exploring,
          step.path
        );

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }, [step, width, height, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !step.grid) return;

    const { grid } = step;
    const cellWidth = width / grid.cols;
    const cellHeight = height / grid.rows;

    const getCellFromMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      return { row, col };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { row, col } = getCellFromMouse(e);

      if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return;

      const cell = grid.cells[row][col];

      if (cell.type === 'start') {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.dragType = 'start';
      } else if (cell.type === 'end') {
        dragStateRef.current.isDragging = true;
        dragStateRef.current.dragType = 'end';
      } else {
        // Determine drawing mode based on first cell clicked
        const isCurrentlyWall = cell.type === 'wall';
        dragStateRef.current.isDrawingWalls = true;
        dragStateRef.current.drawMode = isCurrentlyWall ? 'remove' : 'add';
        dragStateRef.current.lastRow = row;
        dragStateRef.current.lastCol = col;
        onCellClick?.(row, col, !isCurrentlyWall);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { row, col } = getCellFromMouse(e);

      if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return;

      if (dragStateRef.current.isDragging) {
        if (dragStateRef.current.dragType === 'start') {
          onStartDrag?.(row, col);
        } else if (dragStateRef.current.dragType === 'end') {
          onEndDrag?.(row, col);
        }
      } else if (dragStateRef.current.isDrawingWalls) {
        // Only modify wall if we moved to a different cell
        if (row !== dragStateRef.current.lastRow || col !== dragStateRef.current.lastCol) {
          dragStateRef.current.lastRow = row;
          dragStateRef.current.lastCol = col;
          // Apply the draw mode consistently throughout the drag
          const shouldBeWall = dragStateRef.current.drawMode === 'add';
          onCellClick?.(row, col, shouldBeWall);
        }
      }
    };

    const handleMouseUp = () => {
      dragStateRef.current.isDragging = false;
      dragStateRef.current.isDrawingWalls = false;
      dragStateRef.current.dragType = null;
      dragStateRef.current.drawMode = null;
      dragStateRef.current.lastRow = null;
      dragStateRef.current.lastCol = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [step, width, height, canvasRef, onCellClick, onStartDrag, onEndDrag]);
};
