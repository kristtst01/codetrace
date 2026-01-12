import { Header } from './components/Header';
import { VisualizationArea } from './components/VisualizationArea';
import { Controls } from './components/controls/Controls';
import { useVisualizationControls } from './hooks/useVisualizationControls';
import { getAlgorithm } from './algorithms';

function App() {
  const {
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
  } = useVisualizationControls();

  const currentStepData = steps[currentStep] || { array };
  const algorithm = selectedAlgorithm ? getAlgorithm(selectedAlgorithm) : null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VisualizationArea currentStepData={currentStepData} algorithm={algorithm} />

          <Controls
            isPlaying={isPlaying}
            speed={speed}
            currentStep={currentStep}
            totalSteps={steps.length}
            selectedAlgorithm={selectedAlgorithm}
            onPlay={play}
            onPause={pause}
            onReset={handleReset}
            onSpeedChange={setSpeed}
            onAlgorithmChange={handleAlgorithmChange}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
