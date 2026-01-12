import type { Algorithm } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';

export const algorithms: Record<string, Algorithm> = {
  bubbleSort,
  quickSort,
  mergeSort,
  insertionSort,
  selectionSort,
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};

export const getAlgorithmsByCategory = (category: string): Algorithm[] => {
  return Object.values(algorithms).filter((algo) => algo.category === category);
};
