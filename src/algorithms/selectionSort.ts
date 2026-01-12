import type { Algorithm, AlgorithmStep } from '../types';

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
  generate: (input: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({ array: [...arr], message: 'Starting Selection Sort' });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      steps.push({
        array: [...arr],
        comparing: [i],
        message: `Finding minimum in unsorted portion starting at ${i}`,
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...arr],
          comparing: [minIdx, j],
          message: `Comparing ${arr[minIdx]} with ${arr[j]}`,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            array: [...arr],
            comparing: [minIdx],
            message: `New minimum found: ${arr[minIdx]}`,
          });
        }
      }

      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          array: [...arr],
          swapping: [i, minIdx],
          message: `Swapping ${arr[minIdx]} and ${arr[i]}`,
        });
      }

      steps.push({
        array: [...arr],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Element at position ${i} is now in its final position`,
      });
    }

    steps.push({
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
    });

    return steps;
  },
};
