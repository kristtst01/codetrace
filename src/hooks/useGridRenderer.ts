import { useEffect, useRef } from 'react';
import type { PathfindingStep } from '../types';
import { getCellColor } from '../utils/colorUtils';
import { useTheme } from './useTheme';

interface UseGridRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  step: PathfindingStep;
  width: number;
  height: number;
  onCellClick?: (row: number, col: number, isWall: boolean) => void;
  onWeightPlace?: (row: number, col: number, weight: number) => void;
  selectedWeight?: number;
  onStartDrag?: (row: number, col: number) => void;
  onEndDrag?: (row: number, col: number) => void;
}

export const useGridRenderer = ({
  canvasRef,
  step,
  width,
  height,
  onCellClick,
  onWeightPlace,
  selectedWeight = 3,
  onStartDrag,
  onEndDrag,
}: UseGridRendererProps) => {
  const dark = useTheme();
  const dragStateRef = useRef<{
    isDragging: boolean;
    isDrawingWalls: boolean;
    isDrawingWeights: boolean;
    dragType: 'start' | 'end' | null;
    drawMode: 'add' | 'remove' | null;
    lastRow: number | null;
    lastCol: number | null;
  }>({
    isDragging: false,
    isDrawingWalls: false,
    isDrawingWeights: false,
    dragType: null,
    drawMode: null,
    lastRow: null,
    lastCol: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || width === 0 || height === 0) return;

    const { grid } = step;
    const cellWidth = width / grid.cols;
    const cellHeight = height / grid.rows;

    const toSet = (arr?: [number, number][]): Set<string> => {
      const s = new Set<string>();
      if (arr) for (const [r, c] of arr) s.add(`${r},${c}`);
      return s;
    };
    const visitedSet = toSet(step.visited);
    const exploringSet = toSet(step.exploring);
    const pathSet = toSet(step.path);

    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row][col];
        const x = col * cellWidth;
        const y = row * cellHeight;

        const color = getCellColor(
          cell,
          visitedSet,
          exploringSet,
          pathSet,
        );

        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        if (cell.type === 'weight' && cell.weight && cell.weight > 1) {
          const fontSize = Math.max(8, Math.min(cellWidth, cellHeight) * 0.55);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(cell.weight), x + cellWidth / 2, y + cellHeight / 2);
        }

        const border = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
        ctx.strokeStyle = border ? `hsl(${border})` : '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);
      }
    }
  }, [step, width, height, canvasRef, dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { grid } = step;
    const cellWidth = width / grid.cols;
    const cellHeight = height / grid.rows;

    const getCellFromMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      // Account for canvas scaling (CSS size vs actual canvas size)
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);
      return { row, col };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { row, col } = getCellFromMouse(e);
      if (row < 0 || row >= grid.rows || col < 0 || col >= grid.cols) return;

      const cell = grid.cells[row][col];

      if (e.button === 2) {
        // Right-click: draw/erase weights
        if (cell.type === 'start' || cell.type === 'end') return;
        const isCurrentlyWeight = cell.type === 'weight';
        dragStateRef.current.isDrawingWeights = true;
        dragStateRef.current.drawMode = isCurrentlyWeight ? 'remove' : 'add';
        dragStateRef.current.lastRow = row;
        dragStateRef.current.lastCol = col;
        if (isCurrentlyWeight) {
          onCellClick?.(row, col, false);
        } else {
          onWeightPlace?.(row, col, selectedWeight);
        }
        return;
      }

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
      } else if (dragStateRef.current.isDrawingWeights) {
        if (row !== dragStateRef.current.lastRow || col !== dragStateRef.current.lastCol) {
          dragStateRef.current.lastRow = row;
          dragStateRef.current.lastCol = col;
          const cell = grid.cells[row][col];
          if (cell.type === 'start' || cell.type === 'end') return;
          if (dragStateRef.current.drawMode === 'add') {
            onWeightPlace?.(row, col, selectedWeight);
          } else {
            onCellClick?.(row, col, false);
          }
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
      dragStateRef.current.isDrawingWeights = false;
      dragStateRef.current.dragType = null;
      dragStateRef.current.drawMode = null;
      dragStateRef.current.lastRow = null;
      dragStateRef.current.lastCol = null;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [step, width, height, canvasRef, onCellClick, onWeightPlace, selectedWeight, onStartDrag, onEndDrag]);
};
