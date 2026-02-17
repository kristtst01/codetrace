import { useState, useCallback, useRef } from 'react';
import type { AlgorithmMode, MazeType } from '../types';
import { useArrayManagement } from './useArrayManagement';
import type { ArrayPreset } from './useArrayManagement';
import { useGridManagement } from './useGridManagement';
import { useAlgorithmExecution } from './useAlgorithmExecution';
import { usePlaybackAnimation } from './usePlaybackAnimation';

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

  const handleGenerateArray = useCallback((preset: ArrayPreset = 'random') => {
    playback.reset();
    arrayManagement.generateArray(undefined, preset);
    if (selectedAlgorithm) {
      sortingExecution.executeAlgorithm(selectedAlgorithm);
    }
  }, [playback, arrayManagement, selectedAlgorithm, sortingExecution]);

  const handleSetCustomArray = useCallback((arr: number[]) => {
    playback.reset();
    arrayManagement.setCustomArray(arr);
    if (selectedAlgorithm) {
      sortingExecution.executeAlgorithm(selectedAlgorithm);
    }
  }, [playback, arrayManagement, selectedAlgorithm, sortingExecution]);

  const handleGenerateMaze = useCallback((type: MazeType) => {
    playback.reset();
    const newGridData = gridManagement.generateMaze(type);

    if (selectedAlgorithm) {
      pathfindingExecution.executeAlgorithm(selectedAlgorithm, newGridData);
    }
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  const handleClearWalls = useCallback(() => {
    playback.reset();
    const clearedGrid = gridManagement.clearWalls();
    if (selectedAlgorithm && clearedGrid) {
      pathfindingExecution.executeAlgorithm(selectedAlgorithm, clearedGrid);
    }
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  const [displayRows, setDisplayRows] = useState(gridManagement.rows);
  const [displayCols, setDisplayCols] = useState(gridManagement.cols);
  const gridDebounceRef = useRef<number | null>(null);

  const handleRowsChange = useCallback((newRows: number) => {
    playback.reset();
    setDisplayRows(newRows);
    if (gridDebounceRef.current !== null) {
      clearTimeout(gridDebounceRef.current);
    }
    gridDebounceRef.current = window.setTimeout(() => {
      gridManagement.setRows(newRows);
      if (selectedAlgorithm) {
        pathfindingExecution.executeAlgorithm(selectedAlgorithm);
      }
    }, 300);
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  const handleColsChange = useCallback((newCols: number) => {
    playback.reset();
    setDisplayCols(newCols);
    if (gridDebounceRef.current !== null) {
      clearTimeout(gridDebounceRef.current);
    }
    gridDebounceRef.current = window.setTimeout(() => {
      gridManagement.setCols(newCols);
      if (selectedAlgorithm) {
        pathfindingExecution.executeAlgorithm(selectedAlgorithm);
      }
    }, 300);
  }, [playback, gridManagement, selectedAlgorithm, pathfindingExecution]);

  const sizeDebounceRef = useRef<number | null>(null);
  const handleSizeChange = useCallback((newSize: number) => {
    playback.reset();
    arrayManagement.setSize(newSize);
    if (sizeDebounceRef.current !== null) {
      clearTimeout(sizeDebounceRef.current);
    }
    sizeDebounceRef.current = window.setTimeout(() => {
      arrayManagement.generateArray(newSize);
      if (selectedAlgorithm) {
        sortingExecution.executeAlgorithm(selectedAlgorithm);
      }
    }, 300);
  }, [playback, arrayManagement, selectedAlgorithm, sortingExecution]);

  return {
    mode,
    setMode: handleModeChange,
    array: arrayManagement.array,
    size: arrayManagement.size,
    gridData: gridManagement.gridData,
    rows: displayRows,
    cols: displayCols,
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
    setSize: handleSizeChange,
    setRows: handleRowsChange,
    setCols: handleColsChange,
    setWall: gridManagement.setWall,
    setStart: gridManagement.setStart,
    setEnd: gridManagement.setEnd,
    handleAlgorithmChange,
    handleReset,
    handleGenerateArray,
    handleSetCustomArray,
    handleGenerateMaze,
    handleClearWalls,
  };
};
