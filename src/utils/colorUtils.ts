import type { Cell } from '../types';

export const VISUALIZER_COLORS = {
  default: '#3b82f6',    // Blue - default state
  comparing: '#eab308',  // Yellow - being compared
  swapping: '#ef4444',   // Red - being swapped
  sorted: '#22c55e',     // Green - sorted
} as const;

function getCssColor(variable: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return value ? `hsl(${value})` : fallback;
}

function isDark(): boolean {
  return document.documentElement.classList.contains('dark');
}

export const getGridColors = () => {
  const dark = isDark();
  return {
    empty: getCssColor('--background', dark ? '#0a0a0a' : '#ffffff'),
    wall: dark ? '#6b7280' : '#1e293b',       // Gray-500 in dark, dark slate in light
    weight: dark ? '#7c3aed' : '#a78bfa',     // Purple/indigo for weighted cells
    start: dark ? '#4ade80' : '#22c55e',       // Brighter green in dark
    end: dark ? '#f87171' : '#ef4444',         // Brighter red in dark
    visited: dark ? '#1e3a5f' : '#bfdbfe',     // Deep blue in dark, light blue in light
    exploring: dark ? '#ca8a04' : '#fbbf24',   // Darker yellow in dark to avoid glare
    path: dark ? '#60a5fa' : '#3b82f6',        // Brighter blue in dark
    fog: dark ? '#111827' : '#d1d5db',          // Dark in dark mode, gray in light
  };
};


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
  const colors = getGridColors();

  if (pathSet.has(key)) return colors.path;
  if (exploringSet.has(key)) return colors.exploring;
  if (visitedSet.has(key)) return colors.visited;

  if (cell.type === 'weight') return colors.weight;
  return colors[cell.type as keyof typeof colors] ?? colors.empty;
};
