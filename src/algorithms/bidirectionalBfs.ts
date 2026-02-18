import type { Algorithm, PathfindingStep, GridData, Cell } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';
import { cellKey, getNeighbors } from '../utils/pathfindingUtils';

function reconstructBidirectionalPath(
  forwardPrev: Map<string, Cell>,
  backwardPrev: Map<string, Cell>,
  startCell: Cell,
  endCell: Cell,
  meetingCell: Cell
): [number, number][] {
  // Forward half: start -> meeting point
  const forwardPath: [number, number][] = [];
  let current: Cell | undefined = meetingCell;
  while (current && current !== startCell) {
    forwardPath.unshift([current.row, current.col]);
    current = forwardPrev.get(cellKey(current));
  }
  if (current) {
    forwardPath.unshift([startCell.row, startCell.col]);
  }

  // Backward half: meeting point -> end
  current = backwardPrev.get(cellKey(meetingCell));
  while (current && current !== endCell) {
    forwardPath.push([current.row, current.col]);
    current = backwardPrev.get(cellKey(current));
  }
  if (current) {
    forwardPath.push([endCell.row, endCell.col]);
  }

  return forwardPath;
}

export const bidirectionalBfs: Algorithm = {
  name: 'Bidirectional BFS',
  category: 'pathfinding',
  description: 'Explores from both start and end simultaneously, meeting in the middle',
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  code: `function bidirectionalBfs(grid, start, end) {
  const forwardQueue = [start];
  const backwardQueue = [end];
  const forwardVisited = new Set([start]);
  const backwardVisited = new Set([end]);
  const forwardPrev = new Map();
  const backwardPrev = new Map();

  while (forwardQueue.length > 0 || backwardQueue.length > 0) {
    // Expand forward frontier
    if (forwardQueue.length > 0) {
      const fCurrent = forwardQueue.shift();
      for (const neighbor of getNeighbors(fCurrent)) {
        if (isWall(neighbor) || forwardVisited.has(neighbor)) continue;
        forwardVisited.add(neighbor);
        forwardPrev.set(neighbor, fCurrent);
        if (backwardVisited.has(neighbor))
          return buildPath(forwardPrev, backwardPrev, neighbor);
        forwardQueue.push(neighbor);
      }
    }

    // Expand backward frontier
    if (backwardQueue.length > 0) {
      const bCurrent = backwardQueue.shift();
      for (const neighbor of getNeighbors(bCurrent)) {
        if (isWall(neighbor) || backwardVisited.has(neighbor)) continue;
        backwardVisited.add(neighbor);
        backwardPrev.set(neighbor, bCurrent);
        if (forwardVisited.has(neighbor))
          return buildPath(forwardPrev, backwardPrev, neighbor);
        backwardQueue.push(neighbor);
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
      const fQueue: Cell[] = [startCell];
      const bQueue: Cell[] = [endCell];
      const fVisited = new Set<string>([cellKey(startCell)]);
      const bVisited = new Set<string>([cellKey(endCell)]);

      while (fQueue.length > 0 || bQueue.length > 0) {
        if (fQueue.length > 0) {
          const fCur = fQueue.shift()!;
          for (const nb of getNeighbors(fCur, cells)) {
            if (nb.type === 'wall' || fVisited.has(cellKey(nb))) continue;
            fVisited.add(cellKey(nb));
            if (bVisited.has(cellKey(nb))) return;
            fQueue.push(nb);
          }
        }
        if (bQueue.length > 0) {
          const bCur = bQueue.shift()!;
          for (const nb of getNeighbors(bCur, cells)) {
            if (nb.type === 'wall' || bVisited.has(cellKey(nb))) continue;
            bVisited.add(cellKey(nb));
            if (fVisited.has(cellKey(nb))) return;
            bQueue.push(nb);
          }
        }
      }
    });

    const steps: PathfindingStep[] = [];

    steps.push({
      type: 'pathfinding',
      grid: gridData,
      message: 'Starting Bidirectional BFS',
      stats: { nodesVisited: 0, pathLength: 0, executionTime: 0 },
    });

    const forwardQueue: Cell[] = [startCell];
    const backwardQueue: Cell[] = [endCell];
    const forwardVisited = new Set<string>([cellKey(startCell)]);
    const backwardVisited = new Set<string>([cellKey(endCell)]);
    const forwardPrev = new Map<string, Cell>();
    const backwardPrev = new Map<string, Cell>();
    const visitedCells: [number, number][] = [];
    let meetingCell: Cell | null = null;

    while (forwardQueue.length > 0 || backwardQueue.length > 0) {
      // Forward expansion
      if (forwardQueue.length > 0) {
        const current = forwardQueue.shift()!;
        visitedCells.push([current.row, current.col]);

        const exploringCells: [number, number][] = [];

        for (const neighbor of getNeighbors(current, cells)) {
          if (neighbor.type === 'wall' || forwardVisited.has(cellKey(neighbor))) continue;

          forwardVisited.add(cellKey(neighbor));
          forwardPrev.set(cellKey(neighbor), current);

          if (backwardVisited.has(cellKey(neighbor))) {
            meetingCell = neighbor;
            visitedCells.push([neighbor.row, neighbor.col]);
            break;
          }

          forwardQueue.push(neighbor);
          exploringCells.push([neighbor.row, neighbor.col]);
        }

        steps.push({
          type: 'pathfinding',
          grid: gridData,
          visited: [...visitedCells],
          exploring: exploringCells,
          message: `Forward BFS: exploring from (${current.row}, ${current.col})`,
          stats: { nodesVisited: visitedCells.length, pathLength: 0, executionTime: 0 },
        });

        if (meetingCell) break;
      }

      // Backward expansion
      if (backwardQueue.length > 0) {
        const current = backwardQueue.shift()!;
        visitedCells.push([current.row, current.col]);

        const exploringCells: [number, number][] = [];

        for (const neighbor of getNeighbors(current, cells)) {
          if (neighbor.type === 'wall' || backwardVisited.has(cellKey(neighbor))) continue;

          backwardVisited.add(cellKey(neighbor));
          backwardPrev.set(cellKey(neighbor), current);

          if (forwardVisited.has(cellKey(neighbor))) {
            meetingCell = neighbor;
            visitedCells.push([neighbor.row, neighbor.col]);
            break;
          }

          backwardQueue.push(neighbor);
          exploringCells.push([neighbor.row, neighbor.col]);
        }

        steps.push({
          type: 'pathfinding',
          grid: gridData,
          visited: [...visitedCells],
          exploring: exploringCells,
          message: `Backward BFS: exploring from (${current.row}, ${current.col})`,
          stats: { nodesVisited: visitedCells.length, pathLength: 0, executionTime: 0 },
        });

        if (meetingCell) break;
      }
    }

    if (meetingCell) {
      const finalPath = reconstructBidirectionalPath(
        forwardPrev, backwardPrev, startCell, endCell, meetingCell
      );
      steps.push({
        type: 'pathfinding',
        grid: gridData,
        visited: visitedCells,
        path: finalPath,
        message: `Path found! Frontiers met at (${meetingCell.row}, ${meetingCell.col}). Length: ${finalPath.length}`,
        stats: { nodesVisited: visitedCells.length, pathLength: finalPath.length, executionTime: avgExecutionTime },
      });
      distributeExecutionTime(steps, avgExecutionTime);
    } else {
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
