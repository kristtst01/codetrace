import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const selectionSort: Algorithm = {
  name: 'Selection Sort',
  category: 'sorting',
  description: 'Finds the minimum element from the unsorted portion and swaps it with the first unsorted element.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: `function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      for (let i = 0; i < benchArr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < benchArr.length; j++) { if (benchArr[j] < benchArr[minIdx]) minIdx = j; }
        if (minIdx !== i) [benchArr[i], benchArr[minIdx]] = [benchArr[minIdx], benchArr[i]];
      }
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    steps.push({ type: 'sorting', array: [...arr], message: 'Starting Selection Sort', stats: { comparisons, swaps, executionTime: 0 } });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        type: 'sorting',
        array: [...arr],
        comparing: [i],
        message: `Finding minimum in unsorted portion starting at ${i}`,
        stats: { comparisons, swaps, executionTime: 0 },
      });

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [minIdx, j],
          message: `Comparing ${arr[minIdx]} with ${arr[j]}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'sorting',
            array: [...arr],
            comparing: [minIdx],
            message: `New minimum found: ${arr[minIdx]}`,
            stats: { comparisons, swaps, executionTime: 0 },
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swaps++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [i, minIdx],
          message: `Swapping ${arr[minIdx]} and ${arr[i]}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
      }

      steps.push({
        type: 'sorting',
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Element at position ${i} is now in its final position`,
        stats: { comparisons, swaps, executionTime: 0 },
      });
    }

    steps.push({
      type: 'sorting',
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
      stats: { comparisons, swaps, executionTime: avgExecutionTime },
    });

    distributeExecutionTime(steps, avgExecutionTime);

    return steps;
  },
};
