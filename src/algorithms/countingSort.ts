import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

export const countingSort: Algorithm = {
  name: 'Counting Sort',
  category: 'sorting',
  description: 'A non-comparison sorting algorithm that counts the occurrences of each value, then uses those counts to place elements directly into their correct positions.',
  timeComplexity: 'O(n + k)',
  spaceComplexity: 'O(k)',
  code: `function countingSort(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  // Compute cumulative counts
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Build output array (stable, right to left)
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }

  return output;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const max = Math.max(...benchArr);
      const min = Math.min(...benchArr);
      const range = max - min + 1;
      const count = new Array(range).fill(0);
      const output = new Array(benchArr.length);
      for (let i = 0; i < benchArr.length; i++) {
        count[benchArr[i] - min]++;
      }
      for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
      }
      for (let i = benchArr.length - 1; i >= 0; i--) {
        output[count[benchArr[i] - min] - 1] = benchArr[i];
        count[benchArr[i] - min]--;
      }
    });

    const steps: SortingStep[] = [];
    const arr = [...inputArr];
    const n = arr.length;
    let reads = 0;
    let writes = 0;

    // Initial state
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Starting Counting Sort',
      stats: { comparisons: reads, swaps: writes, executionTime: 0 },
    });

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);

    steps.push({
      type: 'sorting',
      array: [...arr],
      message: `Value range: ${min} to ${max} (${range} distinct values possible)`,
      stats: { comparisons: reads, swaps: writes, executionTime: 0 },
    });

    // Counting phase
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Phase 1: Counting occurrences of each value',
      stats: { comparisons: reads, swaps: writes, executionTime: 0 },
    });

    for (let i = 0; i < n; i++) {
      reads++;
      count[arr[i] - min]++;
      steps.push({
        type: 'sorting',
        array: [...arr],
        comparing: [i],
        message: `Reading value ${arr[i]} at index ${i} — count[${arr[i]}] = ${count[arr[i] - min]}`,
        stats: { comparisons: reads, swaps: writes, executionTime: 0 },
      });
    }

    // Cumulative count
    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];
    }

    // Placement phase
    steps.push({
      type: 'sorting',
      array: [...arr],
      message: 'Phase 2: Placing elements into sorted positions',
      stats: { comparisons: reads, swaps: writes, executionTime: 0 },
    });

    const output = new Array(n).fill(0);
    const sortedIndices: number[] = [];

    for (let i = n - 1; i >= 0; i--) {
      reads++;
      const value = arr[i];
      const pos = count[value - min] - 1;
      output[pos] = value;
      count[value - min]--;
      writes++;
      sortedIndices.push(pos);

      steps.push({
        type: 'sorting',
        array: [...output.map((v) => v ?? 0)],
        comparing: [pos],
        sorted: [...sortedIndices],
        message: `Placing ${value} at position ${pos}`,
        stats: { comparisons: reads, swaps: writes, executionTime: 0 },
      });
    }

    // Final sorted array
    steps.push({
      type: 'sorting',
      array: [...output],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
      stats: { comparisons: reads, swaps: writes, executionTime: avgExecutionTime },
    });

    distributeExecutionTime(steps, avgExecutionTime);

    return steps;
  },
};
