import type { Algorithm, PathfindingStep, GridData, Cell } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

function octileDistance(from: Cell, to: Cell): number {
  const dx = Math.abs(from.col - to.col);
  const dy = Math.abs(from.row - to.row);
  return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}

function isBlocked(grid: Cell[][], row: number, col: number): boolean {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return true;
  const t = grid[row][col].type;
  return t === 'wall' || t === 'weight';
}

function jump(
  grid: Cell[][],
  row: number,
  col: number,
  dr: number,
  dc: number,
  endRow: number,
  endCol: number,
  scanned: [number, number][]
): [number, number] | null {
  const nr = row + dr;
  const nc = col + dc;

  if (isBlocked(grid, nr, nc)) return null;

  scanned.push([nr, nc]);

  if (nr === endRow && nc === endCol) return [nr, nc];

  // Diagonal movement
  if (dr !== 0 && dc !== 0) {
    // Forced neighbors for diagonal: check if blocked neighbors create forced ones
    if (
      (isBlocked(grid, nr - dr, nc) && !isBlocked(grid, nr - dr, nc + dc)) ||
      (isBlocked(grid, nr, nc - dc) && !isBlocked(grid, nr + dr, nc - dc))
    ) {
      return [nr, nc];
    }

    // When moving diagonally, must check cardinal directions first
    if (jump(grid, nr, nc, dr, 0, endRow, endCol, scanned) !== null) return [nr, nc];
    if (jump(grid, nr, nc, 0, dc, endRow, endCol, scanned) !== null) return [nr, nc];
  } else {
    // Cardinal movement
    if (dr === 0) {
      // Horizontal
      if (
        (isBlocked(grid, nr - 1, nc) && !isBlocked(grid, nr - 1, nc + dc)) ||
        (isBlocked(grid, nr + 1, nc) && !isBlocked(grid, nr + 1, nc + dc))
      ) {
        return [nr, nc];
      }
    } else {
      // Vertical
      if (
        (isBlocked(grid, nr, nc - 1) && !isBlocked(grid, nr + dr, nc - 1)) ||
        (isBlocked(grid, nr, nc + 1) && !isBlocked(grid, nr + dr, nc + 1))
      ) {
        return [nr, nc];
      }
    }
  }

  return jump(grid, nr, nc, dr, dc, endRow, endCol, scanned);
}

function identifySuccessors(
  grid: Cell[][],
  current: [number, number],
  parent: [number, number] | null,
  endRow: number,
  endCol: number,
  scanned: [number, number][]
): [number, number][] {
  const [r, c] = current;
  const successors: [number, number][] = [];

  // Determine which directions to explore based on parent
  let directions: [number, number][];

  if (!parent) {
    // Start node: explore all 8 directions
    directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];
  } else {
    directions = [];
    const dr = Math.sign(r - parent[0]);
    const dc = Math.sign(c - parent[1]);

    if (dr !== 0 && dc !== 0) {
      // Diagonal: natural neighbors are (dr,0), (0,dc), (dr,dc)
      if (!isBlocked(grid, r + dr, c)) directions.push([dr, 0]);
      if (!isBlocked(grid, r, c + dc)) directions.push([0, dc]);
      if (!isBlocked(grid, r + dr, c + dc)) directions.push([dr, dc]);
      // Forced neighbors
      if (isBlocked(grid, r - dr, c) && !isBlocked(grid, r - dr, c + dc)) {
        directions.push([-dr, dc]);
      }
      if (isBlocked(grid, r, c - dc) && !isBlocked(grid, r + dr, c - dc)) {
        directions.push([dr, -dc]);
      }
    } else if (dr === 0) {
      // Horizontal
      if (!isBlocked(grid, r, c + dc)) directions.push([0, dc]);
      if (isBlocked(grid, r - 1, c) && !isBlocked(grid, r - 1, c + dc)) {
        directions.push([-1, dc]);
      }
      if (isBlocked(grid, r + 1, c) && !isBlocked(grid, r + 1, c + dc)) {
        directions.push([1, dc]);
      }
    } else {
      // Vertical
      if (!isBlocked(grid, r + dr, c)) directions.push([dr, 0]);
      if (isBlocked(grid, r, c - 1) && !isBlocked(grid, r + dr, c - 1)) {
        directions.push([dr, -1]);
      }
      if (isBlocked(grid, r, c + 1) && !isBlocked(grid, r + dr, c + 1)) {
        directions.push([dr, 1]);
      }
    }
  }

  for (const [ddr, ddc] of directions) {
    const jp = jump(grid, r, c, ddr, ddc, endRow, endCol, scanned);
    if (jp) {
      successors.push(jp);
    }
  }

  return successors;
}

function interpolatePath(jumpPoints: [number, number][]): [number, number][] {
  if (jumpPoints.length <= 1) return jumpPoints;
  const path: [number, number][] = [jumpPoints[0]];

  for (let i = 1; i < jumpPoints.length; i++) {
    const [pr, pc] = jumpPoints[i - 1];
    const [cr, cc] = jumpPoints[i];
    let r = pr, c = pc;
    while (r !== cr || c !== cc) {
      r += Math.sign(cr - r);
      c += Math.sign(cc - c);
      path.push([r, c]);
    }
  }

  return path;
}

export const jumpPointSearch: Algorithm = {
  name: 'Jump Point Search',
  category: 'pathfinding',
  description: 'Optimized A* that skips symmetric paths on uniform-cost grids',
  timeComplexity: 'O(V log V)',
  spaceComplexity: 'O(V)',
  code: `function jumpPointSearch(grid, start, end) {
  const openSet = [start];
  const gScore = new Map([[key(start), 0]]);
  const fScore = new Map([[key(start), heuristic(start, end)]]);
  const parent = new Map();

  while (openSet.length > 0) {
    const current = getLowestFScore(openSet, fScore);

    if (current === end) {
      return interpolatePath(reconstructPath(parent, end));
    }

    openSet.remove(current);

    for (const jp of identifySuccessors(current, parent)) {
      const dist = octileDistance(current, jp);
      const tg = gScore.get(key(current)) + dist;

      if (tg < (gScore.get(key(jp)) || Infinity)) {
        parent.set(key(jp), current);
        gScore.set(key(jp), tg);
        fScore.set(key(jp), tg + heuristic(jp, end));
        if (!openSet.includes(jp)) openSet.push(jp);
      }
    }
  }

  return null;
}`,
  generate: (input: number[] | GridData): PathfindingStep[] => {
    const gridData = input as GridData;
    const { cells, start: startPos, end: endPos } = gridData;
    const startCell = cells[startPos.row][startPos.col];
    const endCell = cells[endPos.row][endPos.col];
    const endRow = endPos.row;
    const endCol = endPos.col;

    const avgExecutionTime = benchmarkAlgorithm(() => {
      const openSet: [number, number][] = [[startPos.row, startPos.col]];
      const closedSet = new Set<string>();
      const gScore = new Map<string, number>();
      const fScore = new Map<string, number>();
      const sk = `${startPos.row},${startPos.col}`;
      gScore.set(sk, 0);
      fScore.set(sk, octileDistance(startCell, endCell));

      while (openSet.length > 0) {
        let minF = Infinity, minI = 0;
        for (let i = 0; i < openSet.length; i++) {
          const s = fScore.get(`${openSet[i][0]},${openSet[i][1]}`) ?? Infinity;
          if (s < minF) { minF = s; minI = i; }
        }
        const cur = openSet[minI];
        openSet.splice(minI, 1);
        const ck = `${cur[0]},${cur[1]}`;
        if (cur[0] === endRow && cur[1] === endCol) break;
        closedSet.add(ck);
        const parentCell = undefined as [number, number] | undefined;
        const scanned: [number, number][] = [];
        const successors = identifySuccessors(cells, cur, parentCell ?? null, endRow, endCol, scanned);
        for (const jp of successors) {
          const jk = `${jp[0]},${jp[1]}`;
          if (closedSet.has(jk)) continue;
          const dist = octileDistance(cells[cur[0]][cur[1]], cells[jp[0]][jp[1]]);
          const tg = (gScore.get(ck) ?? 0) + dist;
          if (tg < (gScore.get(jk) ?? Infinity)) {
            gScore.set(jk, tg);
            fScore.set(jk, tg + octileDistance(cells[jp[0]][jp[1]], endCell));
            if (!openSet.find(o => o[0] === jp[0] && o[1] === jp[1])) openSet.push(jp);
          }
        }
      }
    });

    const steps: PathfindingStep[] = [];

    steps.push({
      type: 'pathfinding',
      grid: gridData,
      message: 'Starting Jump Point Search',
      stats: { nodesVisited: 0, pathLength: 0, executionTime: 0 },
    });

    const openSet: [number, number][] = [[startPos.row, startPos.col]];
    const closedSet = new Set<string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const parentMap = new Map<string, [number, number]>();
    const visitedCells: [number, number][] = [];

    const sk = `${startPos.row},${startPos.col}`;
    gScore.set(sk, 0);
    fScore.set(sk, octileDistance(startCell, endCell));

    while (openSet.length > 0) {
      let minFScore = Infinity;
      let minIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        const score = fScore.get(`${openSet[i][0]},${openSet[i][1]}`) ?? Infinity;
        if (score < minFScore) {
          minFScore = score;
          minIndex = i;
        }
      }

      const current = openSet[minIndex];
      openSet.splice(minIndex, 1);
      const ck = `${current[0]},${current[1]}`;

      if (current[0] === endRow && current[1] === endCol) {
        // Reconstruct path through jump points then interpolate
        const jpPath: [number, number][] = [current];
        let trace: [number, number] | undefined = parentMap.get(ck);
        while (trace) {
          jpPath.unshift(trace);
          trace = parentMap.get(`${trace[0]},${trace[1]}`);
        }
        const finalPath = interpolatePath(jpPath);

        steps.push({
          type: 'pathfinding',
          grid: gridData,
          visited: visitedCells,
          path: finalPath,
          message: `Path found! Length: ${finalPath.length}, jump points: ${jpPath.length}`,
          stats: { nodesVisited: visitedCells.length, pathLength: finalPath.length, executionTime: avgExecutionTime },
        });
        distributeExecutionTime(steps, avgExecutionTime);
        break;
      }

      closedSet.add(ck);

      const parent = parentMap.get(ck) ?? null;
      const scanned: [number, number][] = [];
      const successors = identifySuccessors(cells, current, parent, endRow, endCol, scanned);

      // Add all scanned cells to visited for visualization
      for (const sc of scanned) {
        visitedCells.push(sc);
      }

      const exploringCells: [number, number][] = [];

      for (const jp of successors) {
        const jk = `${jp[0]},${jp[1]}`;
        if (closedSet.has(jk)) continue;

        const dist = octileDistance(cells[current[0]][current[1]], cells[jp[0]][jp[1]]);
        const tg = (gScore.get(ck) ?? 0) + dist;

        if (tg < (gScore.get(jk) ?? Infinity)) {
          parentMap.set(jk, current);
          gScore.set(jk, tg);
          fScore.set(jk, tg + octileDistance(cells[jp[0]][jp[1]], endCell));

          if (!openSet.find(o => o[0] === jp[0] && o[1] === jp[1])) {
            openSet.push(jp);
          }

          exploringCells.push(jp);
        }
      }

      const jumpDirs = successors.map(jp => {
        const dr = Math.sign(jp[0] - current[0]);
        const dc = Math.sign(jp[1] - current[1]);
        const dirName =
          dr === -1 && dc === 0 ? 'north' :
          dr === -1 && dc === 1 ? 'northeast' :
          dr === 0 && dc === 1 ? 'east' :
          dr === 1 && dc === 1 ? 'southeast' :
          dr === 1 && dc === 0 ? 'south' :
          dr === 1 && dc === -1 ? 'southwest' :
          dr === 0 && dc === -1 ? 'west' :
          'northwest';
        const dist = Math.max(Math.abs(jp[0] - current[0]), Math.abs(jp[1] - current[1]));
        return `${dirName} ${dist} cells to (${jp[0]}, ${jp[1]})`;
      });

      const msg = jumpDirs.length > 0
        ? `Jumping from (${current[0]}, ${current[1]}): ${jumpDirs.join(', ')}`
        : `Exploring (${current[0]}, ${current[1]}), no jump points found`;

      steps.push({
        type: 'pathfinding',
        grid: gridData,
        visited: [...visitedCells],
        exploring: exploringCells,
        message: msg,
        stats: { nodesVisited: visitedCells.length, pathLength: 0, executionTime: 0 },
      });
    }

    if (steps.length === 1 || !steps[steps.length - 1].path) {
      steps.push({
        type: 'pathfinding',
        grid: gridData,
        visited: visitedCells,
        message: 'No path found',
        stats: { nodesVisited: visitedCells.length, pathLength: 0, executionTime: avgExecutionTime },
      });
      distributeExecutionTime(steps, avgExecutionTime);
    }

    return steps;
  },
};
