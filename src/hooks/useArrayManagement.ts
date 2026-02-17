import { useState, useCallback, useRef } from 'react';

export type ArrayPreset = 'random' | 'sorted' | 'reverse' | 'nearly-sorted' | 'few-unique';

const createRandomArray = (size: number) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

const createSortedArray = (size: number) =>
  Array.from({ length: size }, (_, i) => Math.round(((i + 1) / size) * 100));

const createReverseSortedArray = (size: number) =>
  Array.from({ length: size }, (_, i) => Math.round(((size - i) / size) * 100));

const createNearlySortedArray = (size: number) => {
  const arr = createSortedArray(size);
  const swaps = Math.max(1, Math.floor(size * 0.1));
  for (let s = 0; s < swaps; s++) {
    const i = Math.floor(Math.random() * size);
    const j = Math.floor(Math.random() * size);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const createFewUniqueArray = (size: number) => {
  const uniqueCount = 3 + Math.floor(Math.random() * 3); // 3-5 distinct values
  const values = Array.from({ length: uniqueCount }, () => Math.floor(Math.random() * 100) + 1);
  return Array.from({ length: size }, () => values[Math.floor(Math.random() * values.length)]);
};

const generators: Record<ArrayPreset, (size: number) => number[]> = {
  random: createRandomArray,
  sorted: createSortedArray,
  reverse: createReverseSortedArray,
  'nearly-sorted': createNearlySortedArray,
  'few-unique': createFewUniqueArray,
};

export const useArrayManagement = (initialSize: number = 20) => {
  const [array, setArray] = useState<number[]>(() => createRandomArray(initialSize));
  const [size, setSize] = useState(initialSize);
  const sizeRef = useRef(size);

  const handleSetSize = useCallback((newSize: number) => {
    sizeRef.current = newSize;
    setSize(newSize);
  }, []);

  const generateArray = useCallback((customSize?: number, preset: ArrayPreset = 'random') => {
    const arraySize = customSize ?? sizeRef.current;
    const newArray = generators[preset](arraySize);
    setArray(newArray);
    if (customSize !== undefined) {
      handleSetSize(customSize);
    }
    return newArray;
  }, [handleSetSize]);

  const setCustomArray = useCallback((arr: number[]) => {
    setArray(arr);
    handleSetSize(arr.length);
  }, [handleSetSize]);

  return {
    array,
    size,
    setSize: handleSetSize,
    generateArray,
    setCustomArray,
  };
};
