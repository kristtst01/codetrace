import { useState, useCallback, useEffect, useRef } from 'react';
import { useArrayManagement, type ArrayPreset } from './useArrayManagement';
import { usePlaybackAnimation } from './usePlaybackAnimation';
import { algorithms } from '../algorithms';
import type { SortingStep } from '../types';

export const useComparisonMode = () => {
  const { array, size, setSize, generateArray, setCustomArray } = useArrayManagement();

  const [leftAlgorithm, setLeftAlgorithm] = useState<string | null>(null);
  const [rightAlgorithm, setRightAlgorithm] = useState<string | null>(null);
  const [leftSteps, setLeftSteps] = useState<SortingStep[]>([]);
  const [rightSteps, setRightSteps] = useState<SortingStep[]>([]);
  const [speed, setSpeed] = useState(200);
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem('codetrace-sound') === 'true'
  );

  const totalSteps = Math.max(leftSteps.length, rightSteps.length);

  const playback = usePlaybackAnimation({ totalSteps, speed });

  // Auto-generate steps when both algorithms are selected or array changes
  const prevLeftRef = useRef(leftAlgorithm);
  const prevRightRef = useRef(rightAlgorithm);
  const prevArrayRef = useRef(array);

  useEffect(() => {
    const algoChanged = prevLeftRef.current !== leftAlgorithm || prevRightRef.current !== rightAlgorithm;
    const arrayChanged = prevArrayRef.current !== array;
    prevLeftRef.current = leftAlgorithm;
    prevRightRef.current = rightAlgorithm;
    prevArrayRef.current = array;

    if (!leftAlgorithm || !rightAlgorithm) return;
    if (!algoChanged && !arrayChanged) return;

    const leftAlgo = algorithms[leftAlgorithm];
    const rightAlgo = algorithms[rightAlgorithm];
    if (!leftAlgo || !rightAlgo) return;

    const snapshot = [...array];
    setLeftSteps(leftAlgo.generate(snapshot) as SortingStep[]);
    setRightSteps(rightAlgo.generate(snapshot) as SortingStep[]);
    playback.reset();
  }, [leftAlgorithm, rightAlgorithm, array, playback]);

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
    setLeftSteps([]);
    setRightSteps([]);
    playback.reset();
  }, [generateArray, playback]);

  const handleSetCustomArray = useCallback((arr: number[]) => {
    setCustomArray(arr);
    setLeftSteps([]);
    setRightSteps([]);
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
    setLeftAlgorithm,
    setRightAlgorithm,
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
