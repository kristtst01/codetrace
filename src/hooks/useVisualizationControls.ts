import { useState, useCallback } from 'react';
import type { AlgorithmMode } from '../types';
import { useArrayManagement } from './useArrayManagement';
import { useGridManagement } from './useGridManagement';
import { useAlgorithmExecution } from './useAlgorithmExecution';
import { usePlaybackAnimation } from './usePlaybackAnimation';
import {
  generateRecursiveDivision,
  generateRandomizedPrims,
  generateRandomWalls,
} from '../utils/mazeGeneration';

export const useVisualizationControls = () => {
  const [mode, setMode] = useState<AlgorithmMode>('sorting');
  const [speed, setSpeed] = useState(500);

  const arrayManagement = useArrayManagement();
  const gridManagement = useGridManagement();

  const sortingExecution = useAlgorithmExecution(arrayManagement.array);
  const pathfindingExecution = useAlgorithmExecution(gridManagement.gridData);

  const steps = mode === 'sorting' ? sortingExecution.steps : pathfindingExecution.steps;
  const selectedAlgorithm = mode === 'sorting' ? sortingExecution.selectedAlgorithm : pathfindingExecution.selectedAlgorithm;
  const executeAlgorithm = mode === 'sorting' ? sortingExecution.executeAlgorithm : pathfindingExecution.executeAlgorithm;

  const playback = usePlaybackAnimation({ totalSteps: steps.length, speed });

  const handleModeChange = useCallback((newMode: AlgorithmMode) => {
    setMode(newMode);
    playback.reset();
  }, [playback]);

  const handleAlgorithmChange = useCallback(
    (algorithmKey: string) => {
      executeAlgorithm(algorithmKey);
      playback.setCurrentStep(0);
    },
    [executeAlgorithm, playback]
  );

  const handleReset = useCallback(() => {
    playback.reset();
  }, [playback]);

  const handleGenerateArray = useCallback(() => {
    playback.reset();
    arrayManagement.generateArray();
    if (selectedAlgorithm) {
      sortingExecution.executeAlgorithm(selectedAlgorithm);
    }
  }, [playback, arrayManagement, selectedAlgorithm, sortingExecution]);

  const handleGenerateMaze = useCallback((type: string) => {
    playback.reset();
    let newGridData;

    if (type === 'recursive-division') {
      newGridData = generateRecursiveDivision(gridManagement.rows, gridManagement.cols);
    } else if (type === 'randomized-prims') {
      newGridData = generateRandomizedPrims(gridManagement.rows, gridManagement.cols);
    } else {
      newGridData = generateRandomWalls(gridManagement.rows, gridManagement.cols, 0.3);
    }

    gridManagement.setGridData(newGridData);

    if (selectedAlgorithm) {
      pathfindingExecution.executeAlgorithm(selectedAlgorithm);
    }
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  const handleClearWalls = useCallback(() => {
    playback.reset();
    gridManagement.clearWalls();
    if (selectedAlgorithm) {
      pathfindingExecution.executeAlgorithm(selectedAlgorithm);
    }
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  return {
    mode,
    setMode: handleModeChange,
    array: arrayManagement.array,
    size: arrayManagement.size,
    gridData: gridManagement.gridData,
    rows: gridManagement.rows,
    cols: gridManagement.cols,
    steps,
    currentStep: playback.currentStep,
    isPlaying: playback.isPlaying,
    speed,
    selectedAlgorithm,
    play: playback.play,
    pause: playback.pause,
    stepForward: playback.stepForward,
    stepBackward: playback.stepBackward,
    setSpeed,
    setSize: arrayManagement.setSize,
    setRows: gridManagement.setRows,
    setCols: gridManagement.setCols,
    toggleWall: gridManagement.toggleWall,
    setStart: gridManagement.setStart,
    setEnd: gridManagement.setEnd,
    handleAlgorithmChange,
    handleReset,
    handleGenerateArray,
    handleGenerateMaze,
    handleClearWalls,
  };
};
