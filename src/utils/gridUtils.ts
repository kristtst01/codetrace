import type { GridData, Cell } from '../types';
import { DIRECTIONS } from './pathfindingUtils';

export function createEmptyGrid(rows: number, cols: number): Cell[][] {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = {
        row,
        col,
        type: 'empty',
        weight: 1,
      };
    }
  }
  return cells;
}

export function setStartEnd(
  cells: Cell[][],
  rows: number,
  cols: number
): { start: { row: number; col: number }; end: { row: number; col: number } } {
  const startRow = Math.floor(rows / 2);
  const startCol = Math.floor(cols / 4);
  const endRow = Math.floor(rows / 2);
  const endCol = Math.floor((cols * 3) / 4);

  cells[startRow][startCol].type = 'start';
  cells[endRow][endCol].type = 'end';

  return {
    start: { row: startRow, col: startCol },
    end: { row: endRow, col: endCol },
  };
}

export function createGridData(rows: number, cols: number): GridData {
  const cells = createEmptyGrid(rows, cols);
  const positions = setStartEnd(cells, rows, cols);

  return {
    rows,
    cols,
    cells,
    ...positions,
  };
}

/**
 * Removes random walls until a path exists from start to end.
 * Uses BFS with 8-directional movement to check connectivity.
 */
export function ensureSolvable(
  cells: Cell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
  maxAttempts: number = 100
): void {
  let attempts = 0;
  while (!hasPath(cells, start, end) && attempts < maxAttempts) {
    const wallCells: { row: number; col: number }[] = [];
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[0].length; col++) {
        if (cells[row][col].type === 'wall') {
          wallCells.push({ row, col });
        }
      }
    }

    if (wallCells.length > 0) {
      const randomWall = wallCells[Math.floor(Math.random() * wallCells.length)];
      cells[randomWall.row][randomWall.col].type = 'empty';
    }

    attempts++;
  }
}

function hasPath(
  cells: Cell[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): boolean {
  const rows = cells.length;
  const cols = cells[0].length;
  const visited = new Set<string>();
  const queue: { row: number; col: number }[] = [start];
  visited.add(`${start.row},${start.col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      return true;
    }

    for (const [dr, dc] of DIRECTIONS) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;
      const key = `${newRow},${newCol}`;

      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        !visited.has(key) &&
        cells[newRow][newCol].type !== 'wall'
      ) {
        visited.add(key);
        queue.push({ row: newRow, col: newCol });
      }
    }
  }

  return false;
}
