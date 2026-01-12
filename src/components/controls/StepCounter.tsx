interface StepCounterProps {
  currentStep: number;
  totalSteps: number;
}

export const StepCounter = ({ currentStep, totalSteps }: StepCounterProps) => {
  return (
    <div className="text-sm text-muted-foreground text-center">
      Step {currentStep + 1} of {totalSteps}
    </div>
  );
};
