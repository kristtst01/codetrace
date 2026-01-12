export interface AlgorithmStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  message?: string;
}

export interface Algorithm {
  name: string;
  category: 'sorting' | 'pathfinding' | 'graph';
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  generate: (input: number[]) => AlgorithmStep[];
}

export type AlgorithmCategory = 'sorting' | 'pathfinding' | 'graph';

export interface VisualizationState {
  array: number[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  algorithm: string | null;
}
