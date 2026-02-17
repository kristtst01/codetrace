import type { Algorithm, SortingStep, GridData } from '../types';
import { benchmarkAlgorithm, distributeExecutionTime } from '../utils/benchmark';

const DIGIT_NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];

function getDigitName(d: number): string {
  return d < DIGIT_NAMES.length ? DIGIT_NAMES[d] : `10^${d}`;
}

export const radixSort: Algorithm = {
  name: 'Radix Sort',
  category: 'sorting',
  description: 'A non-comparison sort that processes individual digits from least significant to most significant, using counting sort as a sub-routine for each digit position.',
  timeComplexity: 'O(d × n)',
  spaceComplexity: 'O(n + k)',
  code: `function radixSort(arr) {
  const max = Math.max(...arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);

    // Count occurrences of each digit
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }

    // Cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output (right to left for stability)
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    // Copy output back to arr
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
  }

  return arr;
}`,
  generate: (input: number[] | GridData): SortingStep[] => {
    const inputArr = input as number[];
    const avgExecutionTime = benchmarkAlgorithm(() => {
      const benchArr = [...inputArr];
      const max = Math.max(...benchArr);
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const output = new Array(benchArr.length);
        const count = new Array(10).fill(0);
        for (let i = 0; i < benchArr.length; i++) {
          count[Math.floor(benchArr[i] / exp) % 10]++;
        }
        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }
        for (let i = benchArr.length - 1; i >= 0; i--) {
          const digit = Math.floor(benchArr[i] / exp) % 10;
          output[count[digit] - 1] = benchArr[i];
          count[digit]--;
        }
        for (let i = 0; i < benchArr.length; i++) {
          benchArr[i] = output[i];
        }
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
      message: 'Starting Radix Sort (LSD)',
      stats: { comparisons: reads, swaps: writes, executionTime: 0 },
    });

    const max = Math.max(...arr);
    const totalDigits = max > 0 ? Math.floor(Math.log10(max)) + 1 : 1;
    let digitPosition = 0;

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const isLastPass = digitPosition === totalDigits - 1;
      const digitName = getDigitName(digitPosition);

      steps.push({
        type: 'sorting',
        array: [...arr],
        message: `Processing ${digitName} digit (position ${digitPosition + 1} of ${totalDigits})`,
        stats: { comparisons: reads, swaps: writes, executionTime: 0 },
      });

      const count = new Array(10).fill(0);

      // Count digits
      for (let i = 0; i < n; i++) {
        reads++;
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
        steps.push({
          type: 'sorting',
          array: [...arr],
          comparing: [i],
          message: `Placing ${arr[i]} into bucket ${digit}`,
          stats: { comparisons: reads, swaps: writes, executionTime: 0 },
        });
      }

      // Cumulative count
      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
      }

      // Build output
      const output = new Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        reads++;
        const digit = Math.floor(arr[i] / exp) % 10;
        const pos = count[digit] - 1;
        output[pos] = arr[i];
        count[digit]--;
        writes++;
      }

      // Copy back
      for (let i = 0; i < n; i++) {
        arr[i] = output[i];
      }

      steps.push({
        type: 'sorting',
        array: [...arr],
        sorted: isLastPass ? Array.from({ length: n }, (_, i) => i) : undefined,
        message: `${digitName.charAt(0).toUpperCase() + digitName.slice(1)} digit pass complete`,
        stats: { comparisons: reads, swaps: writes, executionTime: 0 },
      });

      digitPosition++;
    }

    // Final sorted array
    steps.push({
      type: 'sorting',
      array: [...arr],
      sorted: Array.from({ length: n }, (_, i) => i),
      message: 'Array is sorted!',
      stats: { comparisons: reads, swaps: writes, executionTime: avgExecutionTime },
    });

    distributeExecutionTime(steps, avgExecutionTime);

    return steps;
  },
};
