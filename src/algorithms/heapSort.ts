import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const heapSort: Algorithm = {
  name: 'Heap Sort',
  category: 'sorting',
  description: 'Builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(1)',
  code: `function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    // Benchmark the algorithm to get accurate execution time
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const n = benchArr.length;

      function heapify(arr: number[], size: number, root: number) {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;
        if (left < size && arr[left] > arr[largest]) largest = left;
        if (right < size && arr[right] > arr[largest]) largest = right;
        if (largest !== root) {
          [arr[root], arr[largest]] = [arr[largest], arr[root]];
          heapify(arr, size, largest);
        }
      }

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(benchArr, n, i);
      }
      for (let i = n - 1; i > 0; i--) {
        [benchArr[0], benchArr[i]] = [benchArr[i], benchArr[0]];
        heapify(benchArr, i, 0);
      }
    });

    // Now generate visualization steps
    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sortedIndices: number[] = [];

    // Initial state
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Starting Heap Sort',
      stats: { comparisons, swaps, executionTime: 0 },
    });

    function heapify(size: number, root: number) {
      let largest = root;
      const left = 2 * root + 1;
      const right = 2 * root + 2;

      if (left < size) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [largest, left],
          sorted: [...sortedIndices],
          message: `Heapifying subtree rooted at index ${root}: comparing indices ${largest} and ${left}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [largest, right],
          sorted: [...sortedIndices],
          message: `Heapifying subtree rooted at index ${root}: comparing indices ${largest} and ${right}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== root) {
        swaps++;
        [arr[root], arr[largest]] = [arr[largest], arr[root]];
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [root, largest],
          sorted: [...sortedIndices],
          message: `Swapping elements at indices ${root} and ${largest}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        heapify(size, largest);
      }
    }

    // Build max heap
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Building max heap',
      stats: { comparisons, swaps, executionTime: 0 },
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Max heap built. Extracting elements.',
      stats: { comparisons, swaps, executionTime: 0 },
    });

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      swaps++;
      [arr[0], arr[i]] = [arr[i], arr[0]];
      sortedIndices.push(i);
      steps.push({
        type: 'sorting',
        array: [...arr],
        swapping: [0, i],
        sorted: [...sortedIndices],
        message: `Swapping root with last unsorted element at index ${i}`,
        stats: { comparisons, swaps, executionTime: 0 },
      });

      heapify(i, 0);
    }

    // Final sorted array
    sortedIndices.push(0);
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
