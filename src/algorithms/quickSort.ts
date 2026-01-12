import type { Algorithm, AlgorithmStep } from '../types';

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
  generate: (input: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({ array: [...arr], message: 'Starting Quick Sort' });

    const partition = (low: number, high: number): number => {
      const pivot = arr[high];
      steps.push({
        array: [...arr],
        comparing: [high],
        message: `Pivot: ${pivot}`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arr],
          comparing: [j, high],
          message: `Comparing ${arr[j]} with pivot ${pivot}`,
        });

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            swapping: [i, j],
            message: `Swapping ${arr[j]} and ${arr[i]}`,
          });
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        array: [...arr],
        swapping: [i + 1, high],
        message: `Placing pivot ${pivot} at position ${i + 1}`,
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
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
    });

    return steps;
  },
};
