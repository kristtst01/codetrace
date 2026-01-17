import { useState, useCallback, useEffect } from 'react';
import { getAlgorithm } from '../algorithms';
import type { AlgorithmStep, GridData } from '../types';

export const useAlgorithmExecution = (input: number[] | GridData | null) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([
    Array.isArray(input) ? { array: input } : { array: [], grid: input || undefined }
  ]);

  useEffect(() => {
    if (Array.isArray(input)) {
      setSteps([{ array: input }]);
    } else if (input) {
      setSteps([{ array: [], grid: input }]);
    }

    // Re-execute the selected algorithm when input changes
    if (selectedAlgorithm && input) {
      const algorithm = getAlgorithm(selectedAlgorithm);
      if (algorithm) {
        const newSteps = algorithm.generate(input);
        setSteps(newSteps);
      }
    }
  }, [input, selectedAlgorithm]);

  const executeAlgorithm = useCallback((algorithmKey: string) => {
    setSelectedAlgorithm(algorithmKey);
    const algorithm = getAlgorithm(algorithmKey);
    if (algorithm && input) {
      const newSteps = algorithm.generate(input);
      setSteps(newSteps);
    }
  }, [input]);

  const resetSteps = useCallback(() => {
    if (Array.isArray(input)) {
      setSteps([{ array: input }]);
    } else if (input) {
      setSteps([{ array: [], grid: input }]);
    }
  }, [input]);

  return {
    selectedAlgorithm,
    steps,
    setSteps,
    executeAlgorithm,
    resetSteps,
  };
};
