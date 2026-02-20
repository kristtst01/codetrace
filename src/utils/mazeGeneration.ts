import type { GridData, Cell } from '../types';
import { createEmptyGrid, setStartEnd, ensureSolvable } from './gridUtils';

// --- Union-Find for Kruskal's ---
class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;
    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA]++;
    }
    return true;
  }
}

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

export function generateEllers(rows: number, cols: number): GridData {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = { row, col, type: 'wall' };
    }
  }

  // Work on odd-indexed rows/cols as passages (even indices are walls)
  const passageRows: number[] = [];
  const passageCols: number[] = [];
  for (let r = 1; r < rows; r += 2) passageRows.push(r);
  for (let c = 1; c < cols; c += 2) passageCols.push(c);

  if (passageRows.length === 0 || passageCols.length === 0) {
    const positions = setStartEnd(cells, rows, cols);
    return { rows, cols, cells, ...positions };
  }

  // Each passage cell gets a set id
  let nextSet = 0;
  let setIds = new Array(passageCols.length).fill(-1);

  for (let ri = 0; ri < passageRows.length; ri++) {
    const r = passageRows[ri];
    const isLastRow = ri === passageRows.length - 1;

    // Assign unique sets to unassigned cells
    for (let ci = 0; ci < passageCols.length; ci++) {
      cells[r][passageCols[ci]].type = 'empty';
      if (setIds[ci] === -1) {
        setIds[ci] = nextSet++;
      }
    }

    // Randomly merge adjacent cells horizontally (bias: 60% merge for horizontal feel)
    for (let ci = 0; ci < passageCols.length - 1; ci++) {
      const shouldMerge = isLastRow
        ? setIds[ci] !== setIds[ci + 1]
        : Math.random() < 0.6 && setIds[ci] !== setIds[ci + 1];
      if (shouldMerge) {
        const wallCol = passageCols[ci] + 1;
        if (wallCol < cols) cells[r][wallCol].type = 'empty';
        const oldSet = setIds[ci + 1];
        const newSet = setIds[ci];
        for (let k = 0; k < passageCols.length; k++) {
          if (setIds[k] === oldSet) setIds[k] = newSet;
        }
      }
    }

    // Create downward connections (not on last row)
    if (!isLastRow) {
      const nextR = passageRows[ri + 1];
      const wallR = r + 1;

      // Group columns by set
      const setGroups = new Map<number, number[]>();
      for (let ci = 0; ci < passageCols.length; ci++) {
        const s = setIds[ci];
        if (!setGroups.has(s)) setGroups.set(s, []);
        setGroups.get(s)!.push(ci);
      }

      const newSetIds = new Array(passageCols.length).fill(-1);

      for (const [setId, members] of setGroups) {
        // At least one member must connect down
        const count = Math.max(1, Math.floor(Math.random() * members.length) + 1);
        const shuffled = [...members].sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
          const ci = shuffled[i];
          if (wallR < rows) cells[wallR][passageCols[ci]].type = 'empty';
          cells[nextR][passageCols[ci]].type = 'empty';
          newSetIds[ci] = setId;
        }
      }

      setIds = newSetIds;
    }
  }

  const positions = setStartEnd(cells, rows, cols);
  return { rows, cols, cells, ...positions };
}

export function generateKruskals(rows: number, cols: number): GridData {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = { row, col, type: 'wall' };
    }
  }

  const passageRows: number[] = [];
  const passageCols: number[] = [];
  for (let r = 1; r < rows; r += 2) passageRows.push(r);
  for (let c = 1; c < cols; c += 2) passageCols.push(c);

  // Open all passage cells
  for (const r of passageRows) {
    for (const c of passageCols) {
      cells[r][c].type = 'empty';
    }
  }

  // Map passage cells to indices
  const cellIndex = (ri: number, ci: number) => ri * passageCols.length + ci;
  const uf = new UnionFind(passageRows.length * passageCols.length);

  // Collect all walls between adjacent passage cells
  const walls: { ri1: number; ci1: number; ri2: number; ci2: number; wallR: number; wallC: number }[] = [];
  for (let ri = 0; ri < passageRows.length; ri++) {
    for (let ci = 0; ci < passageCols.length; ci++) {
      // Right neighbor
      if (ci + 1 < passageCols.length) {
        walls.push({
          ri1: ri, ci1: ci, ri2: ri, ci2: ci + 1,
          wallR: passageRows[ri], wallC: passageCols[ci] + 1,
        });
      }
      // Down neighbor
      if (ri + 1 < passageRows.length) {
        walls.push({
          ri1: ri, ci1: ci, ri2: ri + 1, ci2: ci,
          wallR: passageRows[ri] + 1, wallC: passageCols[ci],
        });
      }
    }
  }

  // Shuffle walls (Fisher-Yates)
  for (let i = walls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [walls[i], walls[j]] = [walls[j], walls[i]];
  }

  for (const wall of walls) {
    const a = cellIndex(wall.ri1, wall.ci1);
    const b = cellIndex(wall.ri2, wall.ci2);
    if (uf.union(a, b)) {
      cells[wall.wallR][wall.wallC].type = 'empty';
    }
  }

  const positions = setStartEnd(cells, rows, cols);
  return { rows, cols, cells, ...positions };
}

export function generateWilsons(rows: number, cols: number): GridData {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = { row, col, type: 'wall' };
    }
  }

  const passageRows: number[] = [];
  const passageCols: number[] = [];
  for (let r = 1; r < rows; r += 2) passageRows.push(r);
  for (let c = 1; c < cols; c += 2) passageCols.push(c);

  if (passageRows.length === 0 || passageCols.length === 0) {
    const positions = setStartEnd(cells, rows, cols);
    return { rows, cols, cells, ...positions };
  }

  const inMaze = Array.from({ length: passageRows.length }, () =>
    new Array(passageCols.length).fill(false)
  );

  // Neighbors in passage-grid coordinates
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function passageNeighbors(ri: number, ci: number) {
    const result: [number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = ri + dr;
      const nc = ci + dc;
      if (nr >= 0 && nr < passageRows.length && nc >= 0 && nc < passageCols.length) {
        result.push([nr, nc]);
      }
    }
    return result;
  }

  // Add first cell to maze
  const startRi = Math.floor(Math.random() * passageRows.length);
  const startCi = Math.floor(Math.random() * passageCols.length);
  inMaze[startRi][startCi] = true;
  cells[passageRows[startRi]][passageCols[startCi]].type = 'empty';

  let remaining = passageRows.length * passageCols.length - 1;

  // Collect unvisited cells
  const unvisited: [number, number][] = [];
  for (let ri = 0; ri < passageRows.length; ri++) {
    for (let ci = 0; ci < passageCols.length; ci++) {
      if (!inMaze[ri][ci]) unvisited.push([ri, ci]);
    }
  }

  while (remaining > 0) {
    // Pick a random unvisited cell
    const idx = Math.floor(Math.random() * unvisited.length);
    let [curRi, curCi] = unvisited[idx];

    // Random walk storing direction at each cell
    const direction: Map<string, [number, number]> = new Map();

    while (!inMaze[curRi][curCi]) {
      const neighbors = passageNeighbors(curRi, curCi);
      const [nextRi, nextCi] = neighbors[Math.floor(Math.random() * neighbors.length)];
      direction.set(`${curRi},${curCi}`, [nextRi, nextCi]);
      curRi = nextRi;
      curCi = nextCi;
    }

    // Trace path from start cell, carving passages
    [curRi, curCi] = unvisited[idx];
    while (!inMaze[curRi][curCi]) {
      inMaze[curRi][curCi] = true;
      cells[passageRows[curRi]][passageCols[curCi]].type = 'empty';
      remaining--;

      const [nextRi, nextCi] = direction.get(`${curRi},${curCi}`)!;
      // Carve wall between current and next
      const wallR = (passageRows[curRi] + passageRows[nextRi]) / 2;
      const wallC = (passageCols[curCi] + passageCols[nextCi]) / 2;
      cells[wallR][wallC].type = 'empty';

      curRi = nextRi;
      curCi = nextCi;
    }

    // Remove added cells from unvisited list
    for (let i = unvisited.length - 1; i >= 0; i--) {
      if (inMaze[unvisited[i][0]][unvisited[i][1]]) {
        unvisited.splice(i, 1);
      }
    }
  }

  const positions = setStartEnd(cells, rows, cols);
  return { rows, cols, cells, ...positions };
}

export function generateAldousBroder(rows: number, cols: number): GridData {
  const cells: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    cells[row] = [];
    for (let col = 0; col < cols; col++) {
      cells[row][col] = { row, col, type: 'wall' };
    }
  }

  const passageRows: number[] = [];
  const passageCols: number[] = [];
  for (let r = 1; r < rows; r += 2) passageRows.push(r);
  for (let c = 1; c < cols; c += 2) passageCols.push(c);

  const totalCells = passageRows.length * passageCols.length;
  if (totalCells === 0) {
    const positions = setStartEnd(cells, rows, cols);
    return { rows, cols, cells, ...positions };
  }

  const visited = Array.from({ length: passageRows.length }, () =>
    new Array(passageCols.length).fill(false)
  );

  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  let curRi = Math.floor(Math.random() * passageRows.length);
  let curCi = Math.floor(Math.random() * passageCols.length);
  visited[curRi][curCi] = true;
  cells[passageRows[curRi]][passageCols[curCi]].type = 'empty';
  let visitedCount = 1;

  const maxIterations = rows * cols * 10;
  let iterations = 0;

  while (visitedCount < totalCells && iterations < maxIterations) {
    iterations++;

    // Get valid neighbors
    const neighbors: [number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = curRi + dr;
      const nc = curCi + dc;
      if (nr >= 0 && nr < passageRows.length && nc >= 0 && nc < passageCols.length) {
        neighbors.push([nr, nc]);
      }
    }

    const [nextRi, nextCi] = neighbors[Math.floor(Math.random() * neighbors.length)];

    if (!visited[nextRi][nextCi]) {
      visited[nextRi][nextCi] = true;
      visitedCount++;
      cells[passageRows[nextRi]][passageCols[nextCi]].type = 'empty';

      // Carve wall between
      const wallR = (passageRows[curRi] + passageRows[nextRi]) / 2;
      const wallC = (passageCols[curCi] + passageCols[nextCi]) / 2;
      cells[wallR][wallC].type = 'empty';
    }

    curRi = nextRi;
    curCi = nextCi;
  }

  const positions = setStartEnd(cells, rows, cols);
  ensureSolvable(cells, positions.start, positions.end);
  return { rows, cols, cells, ...positions };
}
