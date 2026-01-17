import type { GridData, Cell } from '../types';

function createEmptyGrid(rows: number, cols: number): Cell[][] {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = {
        row,
        col,
        type: 'empty',
      };
    }
  }
  return cells;
}

// BFS to check if there's a path from start to end
function hasPath(cells: Cell[][], start: { row: number; col: number }, end: { row: number; col: number }): boolean {
  const rows = cells.length;
  const cols = cells[0].length;
  const visited = new Set<string>();
  const queue: { row: number; col: number }[] = [start];
  visited.add(`${start.row},${start.col}`);

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      return true;
    }

    for (const [dr, dc] of directions) {
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

function setStartEnd(cells: Cell[][], rows: number, cols: number): { start: { row: number; col: number }; end: { row: number; col: number } } {
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

export function generateRecursiveDivision(rows: number, cols: number): GridData {
  const cells = createEmptyGrid(rows, cols);
  const positions = setStartEnd(cells, rows, cols);

  // Minimum chamber size - stops dividing when chamber is smaller than this
  const MIN_CHAMBER_SIZE = 5;

  function divide(rowStart: number, rowEnd: number, colStart: number, colEnd: number) {
    const height = rowEnd - rowStart;
    const width = colEnd - colStart;

    // Stop dividing if chamber is too small
    if (height < MIN_CHAMBER_SIZE || width < MIN_CHAMBER_SIZE) return;

    const horizontal = height > width;

    if (horizontal) {
      const wallRow = rowStart + Math.floor(Math.random() * (height - 1)) + 1;

      // Create multiple gaps for better connectivity (20-40% of the wall)
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

      // Create multiple gaps for better connectivity (20-40% of the wall)
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

  // Verify maze is solvable, if not add gaps until it is
  let attempts = 0;
  while (!hasPath(cells, positions.start, positions.end) && attempts < 100) {
    // Remove random walls to create paths
    const wallCells: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
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

  // Randomly place walls
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (cells[row][col].type === 'empty' && Math.random() < wallDensity) {
        cells[row][col].type = 'wall';
      }
    }
  }

  // Ensure maze is solvable - remove walls until path exists
  let attempts = 0;
  while (!hasPath(cells, positions.start, positions.end) && attempts < 100) {
    const wallCells: { row: number; col: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
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

  return {
    rows,
    cols,
    cells,
    ...positions,
  };
}
