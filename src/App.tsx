import { useState, useEffect, useRef } from 'react';
import { SortingVisualizer } from './components/visualizers/SortingVisualizer';
import { Controls } from './components/Controls';
import { getAlgorithm } from './algorithms';
import type { AlgorithmStep } from './types';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Code } from 'lucide-react';

function App() {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Generate random array on mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Playback logic
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const generateRandomArray = (size: number = 20) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSteps([{ array: newArray }]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleAlgorithmChange = (algorithmKey: string) => {
    setSelectedAlgorithm(algorithmKey);
    const algorithm = getAlgorithm(algorithmKey);
    if (algorithm) {
      const newSteps = algorithm.generate(array);
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    generateRandomArray();
    if (selectedAlgorithm) {
      const algorithm = getAlgorithm(selectedAlgorithm);
      if (algorithm) {
        const newSteps = algorithm.generate(array);
        setSteps(newSteps);
      }
    }
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep] || { array };
  const algorithm = selectedAlgorithm ? getAlgorithm(selectedAlgorithm) : null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">CodeTrace</h1>
          <p className="text-muted-foreground">
            Visualize algorithms in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualization Area */}
          <div className="lg:col-span-2 space-y-4">
            <SortingVisualizer step={currentStepData} width={800} height={400} />

            {/* Algorithm Info */}
            {algorithm && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>{algorithm.name}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    {showCode ? 'Hide Code' : 'View Code'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{algorithm.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-medium">Time: </span>
                      <span className="text-muted-foreground">{algorithm.timeComplexity}</span>
                    </div>
                    <div>
                      <span className="font-medium">Space: </span>
                      <span className="text-muted-foreground">{algorithm.spaceComplexity}</span>
                    </div>
                  </div>

                  {/* Code Display */}
                  {showCode && (
                    <div className="mt-4">
                      <div className="bg-muted p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
                          <code>{algorithm.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {currentStepData.message && (
                    <div className="mt-4 p-3 bg-secondary rounded-md">
                      <p className="text-sm font-mono">{currentStepData.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Controls */}
          <div>
            <Controls
              isPlaying={isPlaying}
              speed={speed}
              currentStep={currentStep}
              totalSteps={steps.length}
              selectedAlgorithm={selectedAlgorithm}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onAlgorithmChange={handleAlgorithmChange}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
