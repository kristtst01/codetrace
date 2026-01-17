import type { Algorithm } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { dijkstra } from './dijkstra';
import { aStar } from './aStar';
import { bfs } from './bfs';
import { dfs } from './dfs';

export const algorithms: Record<string, Algorithm> = {
  bubbleSort,
  quickSort,
  mergeSort,
  insertionSort,
  selectionSort,
  dijkstra,
  aStar,
  bfs,
  dfs,
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};

export const getAlgorithmsByCategory = (category: string): Algorithm[] => {
  return Object.values(algorithms).filter((algo) => algo.category === category);
};
