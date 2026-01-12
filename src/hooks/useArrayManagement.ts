import { useState, useCallback } from 'react';

export const useArrayManagement = (initialSize: number = 20) => {
  const [array, setArray] = useState<number[]>([]);

  const generateArray = useCallback((size: number = initialSize) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    return newArray;
  }, [initialSize]);

  return {
    array,
    generateArray,
  };
};
