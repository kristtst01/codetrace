import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePlaybackAnimationProps {
  totalSteps: number;
  speed: number;
}

export const usePlaybackAnimation = ({ totalSteps, speed }: UsePlaybackAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && totalSteps > 0) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
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
  }, [isPlaying, speed, totalSteps]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setCurrentStep,
  };
};
