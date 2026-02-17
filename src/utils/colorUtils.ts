import type { Cell } from '../types';

export const VISUALIZER_COLORS = {
  default: '#3b82f6',    // Blue - default state
  comparing: '#eab308',  // Yellow - being compared
  swapping: '#ef4444',   // Red - being swapped
  sorted: '#22c55e',     // Green - sorted
} as const;

export const GRID_COLORS = {
  empty: '#ffffff',      // White - empty cell
  wall: '#1e293b',       // Dark slate - wall
  start: '#22c55e',      // Green - start point
  end: '#ef4444',        // Red - end point
  visited: '#bfdbfe',    // Light blue - visited
  exploring: '#fbbf24',  // Yellow - currently exploring
  path: '#3b82f6',       // Blue - final path
} as const;

export const getBarColor = (
  index: number,
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = []
): string => {
  if (sorted.includes(index)) {
    return VISUALIZER_COLORS.sorted;
  }
  if (swapping.includes(index)) {
    return VISUALIZER_COLORS.swapping;
  }
  if (comparing.includes(index)) {
    return VISUALIZER_COLORS.comparing;
  }
  return VISUALIZER_COLORS.default;
};

export const getCellColor = (
  cell: Cell,
  visitedSet: Set<string>,
  exploringSet: Set<string>,
  pathSet: Set<string>,
): string => {
  const key = `${cell.row},${cell.col}`;

  if (pathSet.has(key)) return GRID_COLORS.path;
  if (exploringSet.has(key)) return GRID_COLORS.exploring;
  if (visitedSet.has(key)) return GRID_COLORS.visited;

  return GRID_COLORS[cell.type];
};
