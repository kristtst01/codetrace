import { useState, useCallback } from 'react';

export const useArrayManagement = (initialSize: number = 20) => {
  const [array, setArray] = useState<number[]>([]);
  const [size, setSize] = useState(initialSize);

  const generateArray = useCallback((customSize?: number) => {
    const arraySize = customSize ?? size;
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    if (customSize !== undefined) {
      setSize(customSize);
    }
    return newArray;
  }, [size]);

  return {
    array,
    size,
    setSize,
    generateArray,
  };
};
