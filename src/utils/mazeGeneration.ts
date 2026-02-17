import type { GridData, Cell } from '../types';
import { createEmptyGrid, setStartEnd, ensureSolvable } from './gridUtils';

export function generateRecursiveDivision(rows: number, cols: number): GridData {
  const cells = createEmptyGrid(rows, cols);
  const positions = setStartEnd(cells, rows, cols);

  const MIN_CHAMBER_SIZE = 5;

  function divide(rowStart: number, rowEnd: number, colStart: number, colEnd: number) {
    const height = rowEnd - rowStart;
    const width = colEnd - colStart;

    if (height < MIN_CHAMBER_SIZE || width < MIN_CHAMBER_SIZE) return;

    const horizontal = height > width;

    if (horizontal) {
      const wallRow = rowStart + Math.floor(Math.random() * (height - 1)) + 1;

      const numGaps = Math.max(1, Math.floor(width * (0.2 + Math.random() * 0.2)));
      const gapPositions = new Set<number>();
      for (let i = 0; i < numGaps; i++) {
        gapPositions.add(colStart + Math.floor(Math.random() * width));
      }

      for (let col = colStart; col < colEnd; col++) {
        if (!gapPositions.has(col) && cells[wallRow][col].type === 'empty') {
          cells[wallRow][col].type = 'wall';
        }
      }

      divide(rowStart, wallRow, colStart, colEnd);
      divide(wallRow, rowEnd, colStart, colEnd);
    } else {
      const wallCol = colStart + Math.floor(Math.random() * (width - 1)) + 1;

      const numGaps = Math.max(1, Math.floor(height * (0.2 + Math.random() * 0.2)));
      const gapPositions = new Set<number>();
      for (let i = 0; i < numGaps; i++) {
        gapPositions.add(rowStart + Math.floor(Math.random() * height));
      }

      for (let row = rowStart; row < rowEnd; row++) {
        if (!gapPositions.has(row) && cells[row][wallCol].type === 'empty') {
          cells[row][wallCol].type = 'wall';
        }
      }

      divide(rowStart, rowEnd, colStart, wallCol);
      divide(rowStart, rowEnd, wallCol, colEnd);
    }
  }

  divide(0, rows, 0, cols);
  ensureSolvable(cells, positions.start, positions.end);

  return {
    rows,
    cols,
    cells,
    ...positions,
  };
}

export function generateRandomizedPrims(rows: number, cols: number): GridData {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = {
        row,
        col,
        type: 'wall',
      };
    }
  }

  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  cells[startRow][startCol].type = 'empty';

  const frontiers: { row: number; col: number }[] = [];

  function addFrontiers(row: number, col: number) {
    const directions = [
      [-2, 0], [2, 0], [0, -2], [0, 2],
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (cells[newRow][newCol].type === 'wall') {
          frontiers.push({ row: newRow, col: newCol });
        }
      }
    }
  }

  addFrontiers(startRow, startCol);

  while (frontiers.length > 0) {
    const index = Math.floor(Math.random() * frontiers.length);
    const frontier = frontiers[index];
    frontiers.splice(index, 1);

    const neighbors: { row: number; col: number }[] = [];
    const directions = [
      [-2, 0], [2, 0], [0, -2], [0, 2],
    ];

    for (const [dr, dc] of directions) {
      const newRow = frontier.row + dr;
      const newCol = frontier.col + dc;

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (cells[newRow][newCol].type === 'empty') {
          neighbors.push({ row: newRow, col: newCol });
        }
      }
    }

    if (neighbors.length > 0) {
      const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

      cells[frontier.row][frontier.col].type = 'empty';

      const wallRow = Math.floor((frontier.row + neighbor.row) / 2);
      const wallCol = Math.floor((frontier.col + neighbor.col) / 2);
      cells[wallRow][wallCol].type = 'empty';

      addFrontiers(frontier.row, frontier.col);
    }
  }

  const positions = setStartEnd(cells, rows, cols);

  return {
    rows,
    cols,
    cells,
    ...positions,
  };
}

export function generateRandomWalls(
  rows: number,
  cols: number,
  wallDensity: number = 0.25
): GridData {
  const cells = createEmptyGrid(rows, cols);
  const positions = setStartEnd(cells, rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (cells[row][col].type === 'empty' && Math.random() < wallDensity) {
        cells[row][col].type = 'wall';
      }
    }
  }

  ensureSolvable(cells, positions.start, positions.end);

  return {
    rows,
    cols,
    cells,
    ...positions,
  };
}
