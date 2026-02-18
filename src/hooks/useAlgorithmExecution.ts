import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const selectedAlgorithmRef = useRef<string | null>(null);

  // Derive display steps: show the current grid immediately (smooth drawing),
  // preserving message/stats from the last algorithm run to avoid UI jumping.
  const steps = useMemo(() => {
    if (algorithmSteps.length > 0) {
      const first = algorithmSteps[0];
      if (first.type === 'pathfinding' && input && !Array.isArray(input) && first.grid !== input) {
        // Grid modified since last algorithm run — show current grid with preserved message/stats
        return [{ ...first, grid: input, visited: undefined, exploring: undefined, path: undefined }];
      }
      return algorithmSteps;
    }
    return [createInitialStep(input)];
  }, [algorithmSteps, input]);

  // Debounce algorithm re-execution when input changes to avoid lag during drag drawing.
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    if (selectedAlgorithmRef.current && input) {
      debounceRef.current = window.setTimeout(() => {
        const algorithm = getAlgorithm(selectedAlgorithmRef.current!);
        if (algorithm && input) {
          setAlgorithmSteps(algorithm.generate(input));
        }
      }, 150);
    } else {
      // No algorithm selected — clear algorithm steps immediately
      debounceRef.current = window.setTimeout(() => {
        setAlgorithmSteps([]);
      }, 0);
    }

    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [input]);

  const executeAlgorithm = useCallback((algorithmKey: string, directInput?: number[] | GridData | null) => {
    setSelectedAlgorithm(algorithmKey);
    selectedAlgorithmRef.current = algorithmKey;
    const algorithm = getAlgorithm(algorithmKey);
    const effectiveInput = directInput ?? input;
    if (algorithm && effectiveInput) {
      setAlgorithmSteps(algorithm.generate(effectiveInput));
    }
  }, [input]);

  const resetSteps = useCallback(() => {
    setAlgorithmSteps([]);
  }, []);

  return {
    selectedAlgorithm,
    steps,
    setSteps: setAlgorithmSteps,
    executeAlgorithm,
    resetSteps,
  };
};
