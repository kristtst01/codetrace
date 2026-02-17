import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const insertionSort: Algorithm = {
  name: 'Insertion Sort',
  category: 'sorting',
  description: 'Builds the sorted array one element at a time by inserting each element into its correct position.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: `function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      for (let i = 1; i < benchArr.length; i++) {
        const key = benchArr[i];
        let j = i - 1;
        while (j >= 0 && benchArr[j] > key) { benchArr[j + 1] = benchArr[j]; j--; }
        benchArr[j + 1] = key;
      }
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    steps.push({ type: 'sorting', array: [...arr], message: 'Starting Insertion Sort', stats: { comparisons, swaps, executionTime: 0 } });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        type: 'sorting',
        array: [...arr],
        comparing: [i],
        message: `Inserting ${key} into sorted portion`,
        stats: { comparisons, swaps, executionTime: 0 },
      });

      while (j >= 0 && arr[j] > key) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [j, j + 1],
          message: `Comparing ${arr[j]} with ${key}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });

        arr[j + 1] = arr[j];
        swaps++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [j, j + 1],
          message: `Shifting ${arr[j + 1]} to the right`,
          stats: { comparisons, swaps, executionTime: 0 },
        });

        j--;
      }

      arr[j + 1] = key;
      swaps++;
      steps.push({
        type: 'sorting',
        array: [...arr],
        swapping: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Placed ${key} at position ${j + 1}`,
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
