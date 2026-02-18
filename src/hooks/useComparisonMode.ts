import { useState, useCallback, useMemo, useRef } from 'react';
import { useArrayManagement, type ArrayPreset } from './useArrayManagement';
import { usePlaybackAnimation } from './usePlaybackAnimation';
import { algorithms } from '../algorithms';
import type { SortingStep } from '../types';

export const useComparisonMode = () => {
  const { array, size, setSize, generateArray, setCustomArray } = useArrayManagement();

  const [leftAlgorithm, setLeftAlgorithm] = useState<string | null>(null);
  const [rightAlgorithm, setRightAlgorithm] = useState<string | null>(null);
  const [speed, setSpeed] = useState(200);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem('codetrace-sound') === 'true'
  );

  const { leftSteps, rightSteps } = useMemo(() => {
    if (!leftAlgorithm || !rightAlgorithm) {
      return { leftSteps: [] as SortingStep[], rightSteps: [] as SortingStep[] };
    }
    const leftAlgo = algorithms[leftAlgorithm];
    const rightAlgo = algorithms[rightAlgorithm];
    if (!leftAlgo || !rightAlgo) {
      return { leftSteps: [] as SortingStep[], rightSteps: [] as SortingStep[] };
    }
    const snapshot = [...array];
    return {
      leftSteps: leftAlgo.generate(snapshot) as SortingStep[],
      rightSteps: rightAlgo.generate(snapshot) as SortingStep[],
    };
  }, [leftAlgorithm, rightAlgorithm, array]);

  const totalSteps = Math.max(leftSteps.length, rightSteps.length);

  const playback = usePlaybackAnimation({ totalSteps, speed });

  const handleSetLeftAlgorithm = useCallback((algo: string | null) => {
    setLeftAlgorithm(algo);
    playback.reset();
  }, [playback]);

  const handleSetRightAlgorithm = useCallback((algo: string | null) => {
    setRightAlgorithm(algo);
    playback.reset();
  }, [playback]);

  const sizeDebounceRef = useRef<number | null>(null);
  const handleSizeChange = useCallback((newSize: number) => {
    playback.reset();
    setSize(newSize);
    if (sizeDebounceRef.current !== null) {
      clearTimeout(sizeDebounceRef.current);
    }
    sizeDebounceRef.current = window.setTimeout(() => {
      generateArray(newSize);
    }, 300);
  }, [playback, setSize, generateArray]);

  const handleReset = useCallback(() => {
    playback.reset();
  }, [playback]);

  const handleGenerateArray = useCallback((preset?: ArrayPreset) => {
    generateArray(undefined, preset);
    playback.reset();
  }, [generateArray, playback]);

  const handleSetCustomArray = useCallback((arr: number[]) => {
    setCustomArray(arr);
    playback.reset();
  }, [setCustomArray, playback]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('codetrace-sound', String(next));
      return next;
    });
  }, []);

  return {
    leftAlgorithm,
    rightAlgorithm,
    setLeftAlgorithm: handleSetLeftAlgorithm,
    setRightAlgorithm: handleSetRightAlgorithm,
    array,
    size,
    setSize: handleSizeChange,
    generateArray: handleGenerateArray,
    setCustomArray: handleSetCustomArray,
    leftSteps,
    rightSteps,
    totalSteps,
    currentStep: playback.currentStep,
    isPlaying: playback.isPlaying,
    play: playback.play,
    pause: playback.pause,
    stepForward: playback.stepForward,
    stepBackward: playback.stepBackward,
    reset: handleReset,
    speed,
    setSpeed,
    soundEnabled,
    toggleSound,
  };
};
