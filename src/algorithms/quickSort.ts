import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const quickSort: Algorithm = {
  name: 'Quick Sort',
  category: 'sorting',
  description: 'Picks a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(log n)',
  code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    // Benchmark the algorithm to get accurate execution time
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const quickSort = (arr: number[], low: number, high: number) => {
        if (low < high) {
          const pivot = arr[high];
          let i = low - 1;
          for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          const pi = i + 1;
          quickSort(arr, low, pi - 1);
          quickSort(arr, pi + 1, high);
        }
      };
      quickSort(benchArr, 0, benchArr.length - 1);
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Starting Quick Sort',
      stats: { comparisons, swaps, executionTime: 0 }
    });

    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      steps.push({
        type: 'sorting',
        array: [...arr],
        comparing: [high],
        message: `Pivot: ${pivot}`,
        stats: { comparisons, swaps, executionTime: 0 }
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [j, high],
          message: `Comparing ${arr[j]} with pivot ${pivot}`,
          stats: { comparisons, swaps, executionTime: 0 }
        });

        if (arr[j] < pivot) {
          i++;
          swaps++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'sorting',
            array: [...arr],
            swapping: [i, j],
            message: `Swapping ${arr[j]} and ${arr[i]}`,
            stats: { comparisons, swaps, executionTime: 0 }
          });
        }
      }

      swaps++;
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        type: 'sorting',
        array: [...arr],
        swapping: [i + 1, high],
        message: `Placing pivot ${pivot} at position ${i + 1}`,
        stats: { comparisons, swaps, executionTime: 0 }
      });

      return i + 1;
    };

    const quickSortHelper = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };

    quickSortHelper(0, n - 1);

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
