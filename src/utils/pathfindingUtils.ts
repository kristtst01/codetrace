import type { Cell } from '../types';

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

export function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

export function getCost(from: Cell, to: Cell): number {
  const isDiagonal = from.row !== to.row && from.col !== to.col;
  return isDiagonal ? Math.SQRT2 : 1;
}

export function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const { row, col } = cell;
  const neighbors: Cell[] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[0].length) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
}

export function reconstructPath(
  previous: Map<string, Cell>,
  start: Cell,
  end: Cell
): [number, number][] {
  const path: [number, number][] = [];
  let current: Cell | undefined = end;

  while (current && current !== start) {
    path.unshift([current.row, current.col]);
    current = previous.get(cellKey(current));
  }

  if (current === start) {
    path.unshift([start.row, start.col]);
  }

  return path;
}
