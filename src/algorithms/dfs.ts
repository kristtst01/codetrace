import type { Algorithm, AlgorithmStep, GridData, Cell } from '../types';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
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

export const dfs: Algorithm = {
  name: 'Depth-First Search',
  category: 'pathfinding',
  description: 'Explores deeply before backtracking, does not guarantee shortest path',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  code: `function dfs(grid, start, end) {
  const stack = [start];
  const visited = new Set();
  const previous = new Map();

  while (stack.length > 0) {
    const current = stack.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) {
      return reconstructPath(previous, start, end);
    }

    for (const neighbor of getNeighbors(current)) {
      if (isWall(neighbor) || visited.has(neighbor)) continue;

      previous.set(neighbor, current);
      stack.push(neighbor);
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
      message: 'Starting Depth-First Search',
    });

    const stack: Cell[] = [startCell];
    const visited = new Set<string>();
    const previous = new Map<string, Cell>();
    const visitedCells: [number, number][] = [];

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (visited.has(cellKey(current))) continue;
      visited.add(cellKey(current));

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

      visitedCells.push([current.row, current.col]);

      const neighbors = getNeighbors(current, cells);
      const exploringCells: [number, number][] = [];

      for (const neighbor of neighbors) {
        if (neighbor.type === 'wall' || visited.has(cellKey(neighbor))) continue;

        if (!previous.has(cellKey(neighbor))) {
          previous.set(cellKey(neighbor), current);
        }

        stack.push(neighbor);
        exploringCells.push([neighbor.row, neighbor.col]);
      }

      if (exploringCells.length > 0) {
        steps.push({
          array: [],
          grid: gridData,
          visited: [...visitedCells],
          exploring: exploringCells,
          message: `Exploring deeply from (${current.row}, ${current.col})`,
        });
      }
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
