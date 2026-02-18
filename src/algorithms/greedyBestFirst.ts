import type { Algorithm, PathfindingStep, GridData, Cell } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';
import { cellKey, getNeighbors, reconstructPath } from '../utils/pathfindingUtils';

function octileDistance(from: Cell, to: Cell): number {
  const dx = Math.abs(from.col - to.col);
  const dy = Math.abs(from.row - to.row);
  return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}

export const greedyBestFirst: Algorithm = {
  name: 'Greedy Best-First Search',
  category: 'pathfinding',
  description: 'Uses only heuristic to guide search — fast but not optimal',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  code: `function greedyBestFirst(grid, start, end) {
  const openSet = [start];
  const closedSet = new Set();
  const hScore = new Map([[start, heuristic(start, end)]]);
  const previous = new Map();

  while (openSet.length > 0) {
    const current = getLowestHScore(openSet, hScore);

    if (current === end) {
      return reconstructPath(previous, start, end);
    }

    openSet.delete(current);
    closedSet.add(current);

    for (const neighbor of getNeighbors(current)) {
      if (isWall(neighbor) || closedSet.has(neighbor)) continue;

      if (!openSet.includes(neighbor)) {
        previous.set(neighbor, current);
        hScore.set(neighbor, heuristic(neighbor, end));
        openSet.push(neighbor);
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

    const avgExecutionTime = benchmarkAlgorithm(() => {
      const openSet: Cell[] = [startCell];
      const closedSet = new Set<string>();
      const hScore = new Map<string, number>();
      hScore.set(cellKey(startCell), octileDistance(startCell, endCell));

      while (openSet.length > 0) {
        let minH = Infinity, minI = 0;
        for (let i = 0; i < openSet.length; i++) {
          const s = hScore.get(cellKey(openSet[i])) ?? Infinity;
          if (s < minH) { minH = s; minI = i; }
        }
        const cur = openSet[minI];
        openSet.splice(minI, 1);
        if (cellKey(cur) === cellKey(endCell)) break;
        closedSet.add(cellKey(cur));
        for (const nb of getNeighbors(cur, cells)) {
          if (nb.type === 'wall' || closedSet.has(cellKey(nb))) continue;
          if (!openSet.find(c => cellKey(c) === cellKey(nb))) {
            hScore.set(cellKey(nb), octileDistance(nb, endCell));
            openSet.push(nb);
          }
        }
      }
    });

    const steps: PathfindingStep[] = [];

    steps.push({
      type: 'pathfinding',
      grid: gridData,
      message: 'Starting Greedy Best-First Search',
      stats: { nodesVisited: 0, pathLength: 0, executionTime: 0 },
    });

    const openSet: Cell[] = [startCell];
    const closedSet = new Set<string>();
    const hScore = new Map<string, number>();
    const previous = new Map<string, Cell>();
    const visitedCells: [number, number][] = [];

    hScore.set(cellKey(startCell), octileDistance(startCell, endCell));

    while (openSet.length > 0) {
      let minHScore = Infinity;
      let minIndex = 0;

      for (let i = 0; i < openSet.length; i++) {
        const score = hScore.get(cellKey(openSet[i])) ?? Infinity;
        if (score < minHScore) {
          minHScore = score;
          minIndex = i;
        }
      }

      const current = openSet[minIndex];
      openSet.splice(minIndex, 1);

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

      closedSet.add(cellKey(current));
      visitedCells.push([current.row, current.col]);

      const neighbors = getNeighbors(current, cells);
      const exploringCells: [number, number][] = [];

      for (const neighbor of neighbors) {
        if (neighbor.type === 'wall' || closedSet.has(cellKey(neighbor))) continue;

        if (!openSet.find(c => cellKey(c) === cellKey(neighbor))) {
          previous.set(cellKey(neighbor), current);
          hScore.set(cellKey(neighbor), octileDistance(neighbor, endCell));
          openSet.push(neighbor);
          exploringCells.push([neighbor.row, neighbor.col]);
        }
      }

      const currentH = octileDistance(current, endCell);

      steps.push({
        type: 'pathfinding',
        grid: gridData,
        visited: [...visitedCells],
        exploring: exploringCells,
        message: `Exploring (${current.row}, ${current.col}), h=${currentH.toFixed(2)}`,
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
