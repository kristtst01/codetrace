import type { Algorithm, PathfindingStep, GridData, Cell } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';
import { cellKey, getNeighbors, reconstructPath } from '../utils/pathfindingUtils';

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
  generate: (input: number[] | GridData): PathfindingStep[] => {
    const gridData = input as GridData;
    const { cells, start: startPos, end: endPos } = gridData;
    const startCell = cells[startPos.row][startPos.col];
    const endCell = cells[endPos.row][endPos.col];

    const avgExecutionTime = benchmarkAlgorithm(() => {
      const stack: Cell[] = [startCell];
      const visited = new Set<string>();
      while (stack.length > 0) {
        const cur = stack.pop()!;
        if (visited.has(cellKey(cur))) continue;
        visited.add(cellKey(cur));
        if (cellKey(cur) === cellKey(endCell)) break;
        for (const nb of getNeighbors(cur, cells)) {
          if (nb.type === 'wall' || visited.has(cellKey(nb))) continue;
          stack.push(nb);
        }
      }
    });

    const steps: PathfindingStep[] = [];

    steps.push({
      type: 'pathfinding',
      grid: gridData,
      message: 'Starting Depth-First Search',
      stats: { nodesVisited: 0, pathLength: 0, executionTime: 0 },
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
          type: 'pathfinding',
          grid: gridData,
          visited: visitedCells,
          path: finalPath,
          message: `Path found! Length: ${finalPath.length}`,
          stats: { nodesVisited: visitedCells.length, pathLength: finalPath.length, executionTime: avgExecutionTime },
        });
        distributeExecutionTime(steps, avgExecutionTime);
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
          type: 'pathfinding',
          grid: gridData,
          visited: [...visitedCells],
          exploring: exploringCells,
          message: `Exploring deeply from (${current.row}, ${current.col})`,
          stats: { nodesVisited: visitedCells.length, pathLength: 0, executionTime: 0 },
        });
      }
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
