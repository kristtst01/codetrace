import type { Algorithm, AlgorithmStep, GridData, Cell } from '../types';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function getCost(from: Cell, to: Cell): number {
  const isDiagonal = from.row !== to.row && from.col !== to.col;
  return isDiagonal ? Math.SQRT2 : 1;
}

function octileDistance(from: Cell, to: Cell): number {
  const dx = Math.abs(from.col - to.col);
  const dy = Math.abs(from.row - to.row);
  return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}

function getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
  const { row, col } = cell;
  const neighbors: Cell[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (newRow >= 0 && newRow < grid.length &&
        newCol >= 0 && newCol < grid[0].length) {
      neighbors.push(grid[newRow][newCol]);
    }
  }

  return neighbors;
}

function reconstructPath(
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

export const aStar: Algorithm = {
  name: 'A* (A-star)',
  category: 'pathfinding',
  description: 'Optimal pathfinding using heuristics to guide search',
  timeComplexity: 'O(b^d) where b is branching factor',
  spaceComplexity: 'O(b^d)',
  code: `function aStar(grid, start, end) {
  const openSet = new Set([start]);
  const closedSet = new Set();
  const gScore = new Map([[start, 0]]);
  const fScore = new Map([[start, heuristic(start, end)]]);
  const previous = new Map();

  while (openSet.size > 0) {
    const current = getLowestFScore(openSet, fScore);

    if (current === end) {
      return reconstructPath(previous, start, end);
    }

    openSet.delete(current);
    closedSet.add(current);

    for (const neighbor of getNeighbors(current)) {
      if (isWall(neighbor) || closedSet.has(neighbor)) continue;

      const tentativeGScore = gScore.get(current) + cost(current, neighbor);

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        previous.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
        openSet.add(neighbor);
      }
    }
  }

  return null;
}`,
  generate: (input: any): AlgorithmStep[] => {
    const gridData = input as GridData;
    const steps: AlgorithmStep[] = [];
    const { cells, start: startPos, end: endPos } = gridData;

    const startCell = cells[startPos.row][startPos.col];
    const endCell = cells[endPos.row][endPos.col];

    steps.push({
      array: [],
      grid: gridData,
      message: 'Starting A* Algorithm',
    });

    const openSet: Cell[] = [startCell];
    const closedSet = new Set<string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const previous = new Map<string, Cell>();
    const visitedCells: [number, number][] = [];

    gScore.set(cellKey(startCell), 0);
    fScore.set(cellKey(startCell), octileDistance(startCell, endCell));

    while (openSet.length > 0) {
      let minFScore = Infinity;
      let minIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        const score = fScore.get(cellKey(openSet[i])) || Infinity;
        if (score < minFScore) {
          minFScore = score;
          minIndex = i;
        }
      }

      const current = openSet[minIndex];
      openSet.splice(minIndex, 1);

      if (cellKey(current) === cellKey(endCell)) {
        const finalPath = reconstructPath(previous, startCell, endCell);
        steps.push({
          array: [],
          grid: gridData,
          visited: visitedCells,
          path: finalPath,
          message: `Path found! Length: ${finalPath.length}`,
        });
        break;
      }

      closedSet.add(cellKey(current));
      visitedCells.push([current.row, current.col]);

      const neighbors = getNeighbors(current, cells);
      const exploringCells: [number, number][] = [];

      for (const neighbor of neighbors) {
        if (neighbor.type === 'wall' || closedSet.has(cellKey(neighbor))) continue;

        const tentativeGScore = (gScore.get(cellKey(current)) || 0) + getCost(current, neighbor);
        const neighborGScore = gScore.get(cellKey(neighbor)) || Infinity;

        if (tentativeGScore < neighborGScore) {
          previous.set(cellKey(neighbor), current);
          gScore.set(cellKey(neighbor), tentativeGScore);
          fScore.set(cellKey(neighbor), tentativeGScore + octileDistance(neighbor, endCell));

          if (!openSet.find(c => cellKey(c) === cellKey(neighbor))) {
            openSet.push(neighbor);
          }

          exploringCells.push([neighbor.row, neighbor.col]);
        }
      }

      const currentG = gScore.get(cellKey(current)) || 0;
      const currentH = octileDistance(current, endCell);

      steps.push({
        array: [],
        grid: gridData,
        visited: [...visitedCells],
        exploring: exploringCells,
        message: `Exploring (${current.row}, ${current.col}), g=${currentG.toFixed(2)}, h=${currentH.toFixed(2)}, f=${(currentG + currentH).toFixed(2)}`,
      });
    }

    if (steps.length === 1 || !steps[steps.length - 1].path) {
      steps.push({
        array: [],
        grid: gridData,
        visited: visitedCells,
        message: 'No path found',
      });
    }

    return steps;
  },
};
