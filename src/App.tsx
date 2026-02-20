import { useCallback, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { VisualizationArea } from './components/VisualizationArea';
import { ComparisonView } from './components/ComparisonView';
import { StatisticsDisplay } from './components/StatisticsDisplay';
import { Card, CardContent } from './components/ui/card';
import { AlgorithmSelector } from './components/controls/AlgorithmSelector';
import { ArraySizeControl } from './components/controls/ArraySizeControl';
import { GenerateArrayButton } from './components/controls/GenerateArrayButton';
import { ArrayInput } from './components/controls/ArrayInput';
import { GridSizeControl } from './components/controls/GridSizeControl';
import { MazeControls } from './components/controls/MazeControls';
import { ClearGridButton } from './components/controls/ClearGridButton';
import { WeightControl } from './components/controls/WeightControl';
import { FogOfWarToggle } from './components/controls/FogOfWarToggle';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { SpeedControl } from './components/controls/SpeedControl';
import { StepCounter } from './components/controls/StepCounter';
import { SoundToggle } from './components/controls/SoundToggle';
import { ComparisonControls } from './components/controls/ComparisonControls';
import { useVisualizationControls } from './hooks/useVisualizationControls';
import { useComparisonMode } from './hooks/useComparisonMode';
import { getAlgorithm } from './algorithms';
import type { SortingStep } from './types';


function App() {
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem('codetrace-sound') === 'true'
  );
  const [comparisonMode, setComparisonMode] = useState(false);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('codetrace-sound', String(next));
      return next;
    });
  }, []);

  const controls = useVisualizationControls();
  const comparison = useComparisonMode();
  const { mode, steps, currentStep, selectedAlgorithm, array, gridData } = controls;

  const currentStepData = steps[currentStep] ?? (
    mode === 'sorting'
      ? { type: 'sorting' as const, array }
      : { type: 'pathfinding' as const, grid: gridData! }
  );
  const algorithm = selectedAlgorithm ? getAlgorithm(selectedAlgorithm) : null;

  // Comparison mode step data
  const leftStepData: SortingStep = comparison.leftSteps.length > 0
    ? comparison.leftSteps[Math.min(comparison.currentStep, comparison.leftSteps.length - 1)]
    : { type: 'sorting' as const, array: comparison.array };

  const rightStepData: SortingStep = comparison.rightSteps.length > 0
    ? comparison.rightSteps[Math.min(comparison.currentStep, comparison.rightSteps.length - 1)]
    : { type: 'sorting' as const, array: comparison.array };

  // Use comparison controls when in comparison mode, otherwise normal controls
  const activePlay = comparisonMode ? comparison.play : controls.play;
  const activePause = comparisonMode ? comparison.pause : controls.pause;
  const activeStepForward = comparisonMode ? comparison.stepForward : controls.stepForward;
  const activeStepBackward = comparisonMode ? comparison.stepBackward : controls.stepBackward;
  const activeReset = comparisonMode ? comparison.reset : controls.handleReset;
  const activeIsPlaying = comparisonMode ? comparison.isPlaying : controls.isPlaying;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (activeIsPlaying) {
            activePause();
          } else {
            activePlay();
          }
          break;
        case 'ArrowRight':
          activeStepForward();
          break;
        case 'ArrowLeft':
          activeStepBackward();
          break;
        case 'KeyR':
          activeReset();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlay, activePause, activeStepForward, activeStepBackward, activeReset, activeIsPlaying]);

  const handleModeChange = useCallback((newMode: 'sorting' | 'pathfinding') => {
    controls.setMode(newMode);
    if (newMode !== 'sorting') {
      setComparisonMode(false);
    }
  }, [controls]);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        comparisonMode={comparisonMode}
        onComparisonModeChange={setComparisonMode}
      />

      <ErrorBoundary>
      <div className="flex-1 flex gap-4 overflow-hidden p-4 pt-0">
        {/* Visualizer area */}
        <div className="flex-1 min-w-0">
          {comparisonMode ? (
            <ComparisonView
              leftAlgorithm={comparison.leftAlgorithm}
              rightAlgorithm={comparison.rightAlgorithm}
              leftStepData={leftStepData}
              rightStepData={rightStepData}
              soundEnabled={comparison.soundEnabled}
            />
          ) : (
            <VisualizationArea
              currentStepData={currentStepData}
              algorithm={algorithm}
              soundEnabled={mode === 'sorting' && soundEnabled}
              onCellClick={controls.setWall}
              onWeightPlace={controls.setWeight}
              selectedWeight={controls.selectedWeight}
              onStartDrag={controls.setStart}
              onEndDrag={controls.setEnd}
              fogOfWar={controls.fogOfWar}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          <Card className="h-fit">
            <CardContent className="pt-6 space-y-6">
              {comparisonMode ? (
                <ComparisonControls
                  leftAlgorithm={comparison.leftAlgorithm}
                  rightAlgorithm={comparison.rightAlgorithm}
                  onLeftAlgorithmChange={comparison.setLeftAlgorithm}
                  onRightAlgorithmChange={comparison.setRightAlgorithm}
                  size={comparison.size}
                  onSizeChange={comparison.setSize}
                  onGenerate={comparison.generateArray}
                  onSetCustomArray={comparison.setCustomArray}
                  isPlaying={comparison.isPlaying}
                  currentStep={comparison.currentStep}
                  totalSteps={comparison.totalSteps}
                  onPlay={comparison.play}
                  onPause={comparison.pause}
                  onReset={comparison.reset}
                  onStepForward={comparison.stepForward}
                  onStepBackward={comparison.stepBackward}
                  speed={comparison.speed}
                  onSpeedChange={comparison.setSpeed}
                  soundEnabled={comparison.soundEnabled}
                  onToggleSound={comparison.toggleSound}
                  leftStepData={comparison.leftSteps.length > 0 ? leftStepData : null}
                  rightStepData={comparison.rightSteps.length > 0 ? rightStepData : null}
                  leftAlgorithmName={comparison.leftAlgorithm ? getAlgorithm(comparison.leftAlgorithm)?.name : undefined}
                  rightAlgorithmName={comparison.rightAlgorithm ? getAlgorithm(comparison.rightAlgorithm)?.name : undefined}
                  leftTotalSteps={comparison.leftSteps.length}
                  rightTotalSteps={comparison.rightSteps.length}
                />
              ) : (
                <>
                  <AlgorithmSelector
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={controls.handleAlgorithmChange}
                    mode={mode}
                  />

                  {mode === 'sorting' ? (
                    <>
                      <ArraySizeControl size={controls.size} onSizeChange={controls.setSize} />
                      <ArrayInput onSetCustomArray={controls.handleSetCustomArray} />
                      <GenerateArrayButton onGenerate={controls.handleGenerateArray} />
                    </>
                  ) : (
                    <>
                      <GridSizeControl
                        rows={controls.rows}
                        cols={controls.cols}
                        onRowsChange={controls.setRows}
                        onColsChange={controls.setCols}
                      />
                      <MazeControls onGenerateMaze={controls.handleGenerateMaze} />
                      <WeightControl
                        selectedWeight={controls.selectedWeight}
                        onWeightChange={controls.setSelectedWeight}
                      />
                      <FogOfWarToggle fogOfWar={controls.fogOfWar} onToggle={controls.toggleFogOfWar} />
                      <ClearGridButton onClear={controls.handleClearWalls} />
                    </>
                  )}

                  <PlaybackControls
                    isPlaying={controls.isPlaying}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    selectedAlgorithm={selectedAlgorithm}
                    onPlay={controls.play}
                    onPause={controls.pause}
                    onReset={controls.handleReset}
                    onStepForward={controls.stepForward}
                    onStepBackward={controls.stepBackward}
                  />

                  <SpeedControl speed={controls.speed} onSpeedChange={controls.setSpeed} />

                  {mode === 'sorting' && (
                    <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
                  )}

                  <StepCounter currentStep={currentStep} totalSteps={steps.length} />

                  {selectedAlgorithm && <StatisticsDisplay step={currentStepData} />}

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Keyboard Shortcuts</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                      <kbd className="font-mono">Space</kbd><span>Play / Pause</span>
                      <kbd className="font-mono">◀ ▶</kbd><span>Step</span>
                      <kbd className="font-mono">R</kbd><span>Reset</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
