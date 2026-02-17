import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const shellSort: Algorithm = {
  name: 'Shell Sort',
  category: 'sorting',
  description: 'An optimization of Insertion Sort that compares elements separated by a gap, progressively reducing the gap until it performs a final insertion sort pass.',
  timeComplexity: 'O(n log² n)',
  spaceComplexity: 'O(1)',
  code: `function shellSort(arr) {
  const n = arr.length;
  // Knuth gap sequence: 1, 4, 13, 40, 121, ...
  let gap = 1;
  while (gap < Math.floor(n / 3)) {
    gap = gap * 3 + 1;
  }

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap && arr[j] < arr[j - gap]) {
        [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
        j -= gap;
      }
    }
    gap = Math.floor(gap / 3);
  }

  return arr;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const n = benchArr.length;
      let gap = 1;
      while (gap < Math.floor(n / 3)) {
        gap = gap * 3 + 1;
      }
      while (gap >= 1) {
        for (let i = gap; i < n; i++) {
          let j = i;
          while (j >= gap && benchArr[j] < benchArr[j - gap]) {
            [benchArr[j], benchArr[j - gap]] = [benchArr[j - gap], benchArr[j]];
            j -= gap;
          }
        }
        gap = Math.floor(gap / 3);
      }
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    // Initial state
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Starting Shell Sort',
      stats: { comparisons, swaps, executionTime: 0 },
    });

    // Compute Knuth gap sequence
    let gap = 1;
    while (gap < Math.floor(n / 3)) {
      gap = gap * 3 + 1;
    }

    while (gap >= 1) {
      steps.push({
        type: 'sorting',
        array: [...arr],
        message: `Gap = ${gap}: performing gapped insertion sort`,
        stats: { comparisons, swaps, executionTime: 0 },
      });

      for (let i = gap; i < n; i++) {
        let j = i;
        while (j >= gap) {
          comparisons++;
          steps.push({
            type: 'sorting',
            array: [...arr],
            comparing: [j, j - gap],
            message: `Gap = ${gap}: comparing elements at indices ${j - gap} and ${j} (${arr[j - gap]} and ${arr[j]})`,
            stats: { comparisons, swaps, executionTime: 0 },
          });

          if (arr[j] < arr[j - gap]) {
            swaps++;
            [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
            steps.push({
              type: 'sorting',
              array: [...arr],
              swapping: [j, j - gap],
              message: `Gap = ${gap}: swapping elements at indices ${j - gap} and ${j}`,
              stats: { comparisons, swaps, executionTime: 0 },
            });
            j -= gap;
          } else {
            break;
          }
        }
      }

      gap = Math.floor(gap / 3);
    }

    // Final sorted array
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
