import type { Algorithm } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { countingSort } from './countingSort';
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
  heapSort,
  shellSort,
  countingSort,
  dijkstra,
  aStar,
  bfs,
  dfs,
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};
