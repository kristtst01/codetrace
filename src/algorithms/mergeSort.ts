import type { Algorithm, AlgorithmStep } from '../types';

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
  generate: (input: number[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const arr = [...input];

    steps.push({ array: [...arr], message: 'Starting Merge Sort' });

    const merge = (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          array: [...arr],
          comparing: [left + i, mid + 1 + j],
          message: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        });

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }

        steps.push({
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
        });
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        steps.push({
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        steps.push({
          array: [...arr],
          swapping: [k],
          message: `Placing ${arr[k]} at position ${k}`,
        });
        j++;
        k++;
      }
    };

    const mergeSortHelper = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);

        steps.push({
          array: [...arr],
          comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
          message: `Dividing array from ${left} to ${right}`,
        });

        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        merge(left, mid, right);
      }
    };

    mergeSortHelper(0, arr.length - 1);

    steps.push({
      array: [...arr],
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      message: 'Array is sorted!',
    });

    return steps;
  },
};
