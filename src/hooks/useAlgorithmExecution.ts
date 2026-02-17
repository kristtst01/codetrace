import { useState, useCallback, useEffect, useRef } from 'react';
import { getAlgorithm } from '../algorithms';
import type { AlgorithmStep, GridData } from '../types';

function createInitialStep(input: number[] | GridData | null): AlgorithmStep {
  if (Array.isArray(input)) {
    return { type: 'sorting', array: input };
  }
  if (input) {
    return { type: 'pathfinding', grid: input };
  }
  return { type: 'sorting', array: [] };
}

export const useAlgorithmExecution = (input: number[] | GridData | null) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [steps, setSteps] = useState<AlgorithmStep[]>([createInitialStep(input)]);
  const selectedAlgorithmRef = useRef<string | null>(null);

  // Re-execute when input changes (but NOT when selectedAlgorithm changes — that's handled by executeAlgorithm)
  useEffect(() => {
    if (selectedAlgorithmRef.current && input) {
      const algorithm = getAlgorithm(selectedAlgorithmRef.current);
      if (algorithm) {
        setSteps(algorithm.generate(input));
        return;
      }
    }

    setSteps([createInitialStep(input)]);
  }, [input]);

  const executeAlgorithm = useCallback((algorithmKey: string, directInput?: number[] | GridData | null) => {
    setSelectedAlgorithm(algorithmKey);
    selectedAlgorithmRef.current = algorithmKey;
    const algorithm = getAlgorithm(algorithmKey);
    const effectiveInput = directInput ?? input;
    if (algorithm && effectiveInput) {
      setSteps(algorithm.generate(effectiveInput));
    }
  }, [input]);

  const resetSteps = useCallback(() => {
    setSteps([createInitialStep(input)]);
  }, [input]);

  return {
    selectedAlgorithm,
    steps,
    setSteps,
    executeAlgorithm,
    resetSteps,
  };
};
