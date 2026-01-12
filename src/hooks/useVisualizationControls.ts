import { useState, useEffect, useCallback } from 'react';
import { useArrayManagement } from './useArrayManagement';
import { useAlgorithmExecution } from './useAlgorithmExecution';
import { usePlaybackAnimation } from './usePlaybackAnimation';

export const useVisualizationControls = () => {
  const [speed, setSpeed] = useState(500);

  const { array, generateArray } = useArrayManagement();
  const { selectedAlgorithm, steps, executeAlgorithm } = useAlgorithmExecution(array);
  const { currentStep, isPlaying, play, pause, reset, stepForward, stepBackward, setCurrentStep } =
    usePlaybackAnimation({ totalSteps: steps.length, speed });

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const handleAlgorithmChange = useCallback(
    (algorithmKey: string) => {
      executeAlgorithm(algorithmKey);
      setCurrentStep(0);
    },
    [executeAlgorithm, setCurrentStep]
  );

  const handleReset = useCallback(() => {
    reset();
    generateArray();
    if (selectedAlgorithm) {
      executeAlgorithm(selectedAlgorithm);
    }
  }, [reset, generateArray, selectedAlgorithm, executeAlgorithm]);

  return {
    array,
    steps,
    currentStep,
    isPlaying,
    speed,
    selectedAlgorithm,
    play,
    pause,
    stepForward,
    stepBackward,
    setSpeed,
    handleAlgorithmChange,
    handleReset,
  };
};
