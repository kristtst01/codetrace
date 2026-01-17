export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'exploring' | 'path';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
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

export interface AlgorithmStep {
  array: number[];
  grid?: GridData;
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  visited?: [number, number][];
  exploring?: [number, number][];
  path?: [number, number][];
  message?: string;
}

export interface Algorithm {
  name: string;
  category: 'sorting' | 'pathfinding' | 'graph';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  generate: (input: any) => AlgorithmStep[];
}

export type AlgorithmCategory = 'sorting' | 'pathfinding' | 'graph';

export type AlgorithmMode = 'sorting' | 'pathfinding';

export interface VisualizationState {
  array: number[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  algorithm: string | null;
}
