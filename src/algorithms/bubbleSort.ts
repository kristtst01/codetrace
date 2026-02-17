import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const bubbleSort: Algorithm = {
  name: 'Bubble Sort',
  category: 'sorting',
  description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  code: `function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return arr;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    // Benchmark the algorithm to get accurate execution time
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      // Run the actual sorting algorithm without visualization overhead
      for (let i = 0; i < benchArr.length - 1; i++) {
        for (let j = 0; j < benchArr.length - i - 1; j++) {
          if (benchArr[j] > benchArr[j + 1]) {
            [benchArr[j], benchArr[j + 1]] = [benchArr[j + 1], benchArr[j]];
          }
        }
      }
    });

    // Now generate visualization steps
    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    // Initial state (no execution time yet)
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Starting Bubble Sort',
      stats: { comparisons, swaps, executionTime: 0 }
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing elements
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [j, j + 1],
          message: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          stats: { comparisons, swaps, executionTime: 0 } // Placeholder
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          swaps++;
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            type: 'sorting',
            array: [...arr],
            swapping: [j, j + 1],
            message: `Swapping ${arr[j + 1]} and ${arr[j]}`,
            stats: { comparisons, swaps, executionTime: 0 } // Placeholder
          });
        }
      }

      // Mark the last element as sorted
      const sortedIndices = Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx);
      steps.push({
        type: 'sorting',
        array: [...arr],
        sorted: sortedIndices,
        message: `Element at position ${n - 1 - i} is now in its final position`,
        stats: { comparisons, swaps, executionTime: 0 } // Placeholder
      });
    }

    // Final sorted array - use benchmarked execution time
    steps.push({
      type: 'sorting',
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
      stats: { comparisons, swaps, executionTime: avgExecutionTime }
    });

    distributeExecutionTime(steps, avgExecutionTime);

    return steps;
  },
};
