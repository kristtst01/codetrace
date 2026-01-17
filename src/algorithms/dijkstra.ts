import type { Algorithm, AlgorithmStep, GridData, Cell } from '../types';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function getCost(from: Cell, to: Cell): number {
  const isDiagonal = from.row !== to.row && from.col !== to.col;
  return isDiagonal ? Math.SQRT2 : 1;
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

export const dijkstra: Algorithm = {
  name: "Dijkstra's Algorithm",
  category: 'pathfinding',
  description: 'Finds shortest path by exploring nodes in order of distance from start',
  timeComplexity: 'O(V²) or O((V+E)log V) with priority queue',
  spaceComplexity: 'O(V)',
  code: `function dijkstra(grid, start, end) {
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();

  // Initialize distances
  distances.set(start, 0);
  unvisited.add(start);

  while (unvisited.size > 0) {
    // Get node with minimum distance
    const current = getMinDistance(unvisited, distances);

    if (current === end) break;

    // Visit neighbors
    for (const neighbor of getNeighbors(current)) {
      if (isWall(neighbor)) continue;

      const distance = distances.get(current) + cost(current, neighbor);
      if (distance < (distances.get(neighbor) || Infinity)) {
        distances.set(neighbor, distance);
        previous.set(neighbor, current);
        unvisited.add(neighbor);
      }
    }

    unvisited.delete(current);
  }

  return reconstructPath(previous, start, end);
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
      message: 'Starting Dijkstra\'s Algorithm',
    });

    const distances = new Map<string, number>();
    const previous = new Map<string, Cell>();
    const unvisited: Cell[] = [];
    const visitedCells: [number, number][] = [];

    distances.set(cellKey(startCell), 0);
    unvisited.push(startCell);

    while (unvisited.length > 0) {
      let minDistance = Infinity;
      let minIndex = 0;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = distances.get(cellKey(unvisited[i])) || Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          minIndex = i;
        }
      }

      const current = unvisited[minIndex];
      unvisited.splice(minIndex, 1);

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
        if (neighbor.type === 'wall') continue;

        const alt = (distances.get(cellKey(current)) || 0) + getCost(current, neighbor);
        const currentDist = distances.get(cellKey(neighbor)) || Infinity;

        if (alt < currentDist) {
          distances.set(cellKey(neighbor), alt);
          previous.set(cellKey(neighbor), current);

          if (!unvisited.find(c => cellKey(c) === cellKey(neighbor))) {
            unvisited.push(neighbor);
          }

          exploringCells.push([neighbor.row, neighbor.col]);
        }
      }

      steps.push({
        array: [],
        grid: gridData,
        visited: [...visitedCells],
        exploring: exploringCells,
        message: `Exploring from (${current.row}, ${current.col}), distance: ${(distances.get(cellKey(current)) || 0).toFixed(2)}`,
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
