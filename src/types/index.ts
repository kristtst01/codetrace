export type CellType = 'empty' | 'wall' | 'weight' | 'start' | 'end' | 'visited' | 'exploring' | 'path';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  weight?: number;
  distance?: number;
  heuristic?: number;
}

export interface GridData {
  rows: number;
  cols: number;
  cells: Cell[][];
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export type MazeType = 'recursive-division' | 'randomized-prims' | 'random-walls' | 'ellers' | 'kruskals' | 'wilsons' | 'aldous-broder';

export interface AlgorithmStats {
  comparisons?: number;
  swaps?: number;
  nodesVisited?: number;
  pathLength?: number;
  executionTime?: number;
}

export interface SortingStep {
  type: 'sorting';
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  message?: string;
  stats?: AlgorithmStats;
}

export interface PathfindingStep {
  type: 'pathfinding';
  grid: GridData;
  visited?: [number, number][];
  exploring?: [number, number][];
  path?: [number, number][];
  message?: string;
  stats?: AlgorithmStats;
}

export type AlgorithmStep = SortingStep | PathfindingStep;

export interface Algorithm {
  name: string;
  category: 'sorting' | 'pathfinding' | 'graph';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  generate: (input: number[] | GridData) => AlgorithmStep[];
}

export type AlgorithmMode = 'sorting' | 'pathfinding';

export interface ComparisonState {
  leftAlgorithm: string | null;
  rightAlgorithm: string | null;
  array: number[];
  leftSteps: SortingStep[];
  rightSteps: SortingStep[];
}
