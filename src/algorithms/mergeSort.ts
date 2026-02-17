import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const mergeSort: Algorithm = {
  name: 'Merge Sort',
  category: 'sorting',
  description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves back together.',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const mergeSort = (arr: number[], l: number, r: number) => {
        if (l < r) {
          const m = Math.floor((l + r) / 2);
          mergeSort(arr, l, m);
          mergeSort(arr, m + 1, r);
          const left = arr.slice(l, m + 1);
          const right = arr.slice(m + 1, r + 1);
          let i = 0, j = 0, k = l;
          while (i < left.length && j < right.length) arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
          while (i < left.length) arr[k++] = left[i++];
          while (j < right.length) arr[k++] = right[j++];
        }
      };
      mergeSort(benchArr, 0, benchArr.length - 1);
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    let comparisons = 0;
    let swaps = 0;

    steps.push({ type: 'sorting', array: [...arr], message: 'Starting Merge Sort', stats: { comparisons, swaps, executionTime: 0 } });

    const merge = (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        comparisons++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          message: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }

        swaps++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        swaps++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        swaps++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });
        j++;
        k++;
      }
    };

    const mergeSortHelper = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          message: `Dividing array from ${left} to ${right}`,
          stats: { comparisons, swaps, executionTime: 0 },
        });

        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        merge(left, mid, right);
      }
    };

    mergeSortHelper(0, arr.length - 1);

    steps.push({
      type: 'sorting',
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      message: 'Array is sorted!',
      stats: { comparisons, swaps, executionTime: avgExecutionTime },
    });

    distributeExecutionTime(steps, avgExecutionTime);

    return steps;
  },
};
