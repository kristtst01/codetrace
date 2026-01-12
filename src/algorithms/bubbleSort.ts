import type { Algorithm, AlgorithmStep } from '../types';

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
  generate: (input: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...input];
    const n = arr.length;

    // Initial state
    steps.push({ array: [...arr], message: 'Starting Bubble Sort' });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing elements
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          message: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            array: [...arr],
            swapping: [j, j + 1],
            message: `Swapping ${arr[j + 1]} and ${arr[j]}`,
          });
        }
      }

      // Mark the last element as sorted
      const sortedIndices = Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx);
      steps.push({
        array: [...arr],
        sorted: sortedIndices,
        message: `Element at position ${n - 1 - i} is now in its final position`,
      });
    }

    // Final sorted array
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
    });

    return steps;
  },
};
