import { Header } from './components/Header';
import { VisualizationArea } from './components/VisualizationArea';
import { GridVisualizer } from './components/visualizers/GridVisualizer';
import { AlgorithmInfoCard } from './components/AlgorithmInfoCard';
import { StatisticsDisplay } from './components/StatisticsDisplay';
import { Card, CardContent } from './components/ui/card';
import { AlgorithmSelector } from './components/controls/AlgorithmSelector';
import { ArraySizeControl } from './components/controls/ArraySizeControl';
import { GenerateArrayButton } from './components/controls/GenerateArrayButton';
import { GridSizeControl } from './components/controls/GridSizeControl';
import { MazeControls } from './components/controls/MazeControls';
import { ClearGridButton } from './components/controls/ClearGridButton';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { SpeedControl } from './components/controls/SpeedControl';
import { StepCounter } from './components/controls/StepCounter';
import { useVisualizationControls } from './hooks/useVisualizationControls';
import { getAlgorithm } from './algorithms';

function App() {
  const controls = useVisualizationControls();
  const { mode, steps, currentStep, selectedAlgorithm, array, gridData } = controls;

  const currentStepData = steps[currentStep] ||
    (mode === 'sorting' ? { array } : { array: [], grid: gridData || undefined });
  const algorithm = selectedAlgorithm ? getAlgorithm(selectedAlgorithm) : null;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <Header mode={mode} onModeChange={controls.setMode} />

      <div className="flex-1 flex gap-4 overflow-hidden p-4 pt-0">
        {/* Visualizer area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            {mode === 'sorting' ? (
              <VisualizationArea currentStepData={currentStepData} algorithm={algorithm} />
            ) : (
              <div className="flex flex-col h-full gap-4">
                <div className="flex-1 min-h-0">
                  <GridVisualizer
                    step={currentStepData}
                    onCellClick={controls.setWall}
                    onStartDrag={controls.setStart}
                    onEndDrag={controls.setEnd}
                  />
                </div>
                {algorithm && <AlgorithmInfoCard algorithm={algorithm} />}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          <Card className="h-fit">
            <CardContent className="pt-6 space-y-6">
              <AlgorithmSelector
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmChange={controls.handleAlgorithmChange}
                mode={mode}
              />

              {mode === 'sorting' ? (
                <>
                  <ArraySizeControl size={controls.size} onSizeChange={controls.setSize} />
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

              <StepCounter currentStep={currentStep} totalSteps={steps.length} />

              {selectedAlgorithm && <StatisticsDisplay step={currentStepData} mode={mode} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
