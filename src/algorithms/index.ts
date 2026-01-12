import type { Algorithm } from '../types';
import { bubbleSort } from './bubbleSort';

export const algorithms: Record<string, Algorithm> = {
  bubbleSort,
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};

export const getAlgorithmsByCategory = (category: string): Algorithm[] => {
  return Object.values(algorithms).filter((algo) => algo.category === category);
};
