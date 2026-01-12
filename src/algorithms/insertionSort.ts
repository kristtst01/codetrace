import type { Algorithm, AlgorithmStep } from '../types';

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
  generate: (input: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...input];
    const n = arr.length;

    steps.push({ array: [...arr], message: 'Starting Insertion Sort' });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        array: [...arr],
        comparing: [i],
        message: `Inserting ${key} into sorted portion`,
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          message: `Comparing ${arr[j]} with ${key}`,
        });

        arr[j + 1] = arr[j];
        steps.push({
          array: [...arr],
          swapping: [j, j + 1],
          message: `Shifting ${arr[j + 1]} to the right`,
        });

        j--;
      }

      arr[j + 1] = key;
      steps.push({
        array: [...arr],
        swapping: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        message: `Placed ${key} at position ${j + 1}`,
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
