import { useState, useCallback, useEffect } from 'react';
import { getAlgorithm } from '../algorithms';
import type { AlgorithmStep } from '../types';

export const useAlgorithmExecution = (array: number[]) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([{ array }]);

  useEffect(() => {
    setSteps([{ array }]);
  }, [array]);

  const executeAlgorithm = useCallback((algorithmKey: string) => {
    setSelectedAlgorithm(algorithmKey);
    const algorithm = getAlgorithm(algorithmKey);
    if (algorithm) {
      const newSteps = algorithm.generate(array);
      setSteps(newSteps);
    }
  }, [array]);

  const resetSteps = useCallback(() => {
    setSteps([{ array }]);
  }, [array]);

  return {
    selectedAlgorithm,
    steps,
    executeAlgorithm,
    resetSteps,
  };
};
