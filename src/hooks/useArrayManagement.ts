import { useState, useCallback, useRef } from 'react';

const createRandomArray = (size: number) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

export const useArrayManagement = (initialSize: number = 20) => {
  const [array, setArray] = useState<number[]>(() => createRandomArray(initialSize));
  const [size, setSize] = useState(initialSize);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const generateArray = useCallback((customSize?: number) => {
    const arraySize = customSize ?? sizeRef.current;
    const newArray = createRandomArray(arraySize);
    setArray(newArray);
    if (customSize !== undefined) {
      setSize(customSize);
    }
    return newArray;
  }, []);

  return {
    array,
    size,
    setSize,
    generateArray,
  };
};
