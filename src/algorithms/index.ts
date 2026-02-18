import type { Algorithm } from '../types';
import { bubbleSort } from './bubbleSort';
import { quickSort } from './quickSort';
import { mergeSort } from './mergeSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { countingSort } from './countingSort';
import { radixSort } from './radixSort';
import { dijkstra } from './dijkstra';
import { aStar } from './aStar';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { greedyBestFirst } from './greedyBestFirst';
import { bidirectionalBfs } from './bidirectionalBfs';

export const algorithms: Record<string, Algorithm> = {
  bubbleSort,
  quickSort,
  mergeSort,
  insertionSort,
  selectionSort,
  heapSort,
  shellSort,
  countingSort,
  radixSort,
  dijkstra,
  aStar,
  bfs,
  dfs,
  greedyBestFirst,
  bidirectionalBfs,
};

export const getAlgorithm = (name: string): Algorithm | undefined => {
  return algorithms[name];
};
