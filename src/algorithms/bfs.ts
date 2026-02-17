import type { Algorithm, PathfindingStep, GridData, Cell } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';
import { cellKey, getNeighbors, reconstructPath } from '../utils/pathfindingUtils';

export const bfs: Algorithm = {
  name: 'Breadth-First Search',
  category: 'pathfinding',
  description: 'Explores nodes level by level, guarantees shortest path in unweighted graphs',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  code: `function bfs(grid, start, end) {
  const queue = [start];
  const visited = new Set([start]);
  const previous = new Map();

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === end) {
      return reconstructPath(previous, start, end);
    }

    for (const neighbor of getNeighbors(current)) {
      if (isWall(neighbor) || visited.has(neighbor)) continue;

      visited.add(neighbor);
      previous.set(neighbor, current);
      queue.push(neighbor);
    }
  }

  return null;
}`,
  generate: (input: number[] | GridData): PathfindingStep[] => {
    const gridData = input as GridData;
    const { cells, start: startPos, end: endPos } = gridData;
    const startCell = cells[startPos.row][startPos.col];
    const endCell = cells[endPos.row][endPos.col];

    // Benchmark the algorithm to get accurate execution time
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const queue: Cell[] = [startCell];
      const visited = new Set<string>();
      visited.add(cellKey(startCell));

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (cellKey(current) === cellKey(endCell)) break;

        const neighbors = getNeighbors(current, cells);
        for (const neighbor of neighbors) {
          if (neighbor.type === 'wall' || visited.has(cellKey(neighbor))) continue;
          visited.add(cellKey(neighbor));
          queue.push(neighbor);
        }
      }
    });

    const steps: PathfindingStep[] = [];

    steps.push({
      type: 'pathfinding',
      grid: gridData,
      message: 'Starting Breadth-First Search',
      stats: { nodesVisited: 0, pathLength: 0, executionTime: 0 }
    });

    const queue: Cell[] = [startCell];
    const visited = new Set<string>();
    const previous = new Map<string, Cell>();
    const visitedCells: [number, number][] = [];

    visited.add(cellKey(startCell));

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (cellKey(current) === cellKey(endCell)) {
        const finalPath = reconstructPath(previous, startCell, endCell);
        steps.push({
          type: 'pathfinding',
          grid: gridData,
          visited: visitedCells,
          path: finalPath,
          message: `Path found! Length: ${finalPath.length}`,
          stats: {
            nodesVisited: visitedCells.length,
            pathLength: finalPath.length,
            executionTime: avgExecutionTime
          }
        });

        distributeExecutionTime(steps, avgExecutionTime);
        break;
      }

      visitedCells.push([current.row, current.col]);

      const neighbors = getNeighbors(current, cells);
      const exploringCells: [number, number][] = [];

      for (const neighbor of neighbors) {
        if (neighbor.type === 'wall' || visited.has(cellKey(neighbor))) continue;

        visited.add(cellKey(neighbor));
        previous.set(cellKey(neighbor), current);
        queue.push(neighbor);
        exploringCells.push([neighbor.row, neighbor.col]);
      }

      if (exploringCells.length > 0) {
        steps.push({
          type: 'pathfinding',
          grid: gridData,
          visited: [...visitedCells],
          exploring: exploringCells,
          message: `Exploring level from (${current.row}, ${current.col})`,
          stats: {
            nodesVisited: visitedCells.length,
            pathLength: 0,
            executionTime: 0
          }
        });
      }
    }

    if (steps.length === 1 || !steps[steps.length - 1].path) {
      steps.push({
        type: 'pathfinding',
        grid: gridData,
        visited: visitedCells,
        message: 'No path found',
        stats: {
          nodesVisited: visitedCells.length,
          pathLength: 0,
          executionTime: avgExecutionTime
        }
      });

      distributeExecutionTime(steps, avgExecutionTime);
    }

    return steps;
  },
};
