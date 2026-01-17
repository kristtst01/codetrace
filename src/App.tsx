import { Header } from './components/Header';
import { VisualizationArea } from './components/VisualizationArea';
import { GridVisualizer } from './components/visualizers/GridVisualizer';
import { AlgorithmInfoCard } from './components/AlgorithmInfoCard';
import { Card, CardContent } from './components/ui/card';
import { ModeSelector } from './components/controls/ModeSelector';
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {mode === 'sorting' ? (
              <VisualizationArea currentStepData={currentStepData} algorithm={algorithm} />
            ) : (
              <>
                <GridVisualizer
                  step={currentStepData}
                  onCellClick={controls.toggleWall}
                  onStartDrag={controls.setStart}
                  onEndDrag={controls.setEnd}
                />
                {algorithm && <AlgorithmInfoCard algorithm={algorithm} />}
              </>
            )}
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <ModeSelector mode={mode} onModeChange={controls.setMode} />

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
