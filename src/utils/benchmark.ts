/**
 * Benchmarks an algorithm by running it repeatedly for a fixed time budget
 * Needed to get accurate execution time on fast running algorithms because of 
 * performance.now() only incrementing in ms
 * @param algorithmFn - The algorithm function to benchmark
 * @param timeBudgetMs - How long to run the benchmark (default 150ms)
 * @returns Average execution time per run in milliseconds
 */
export function distributeExecutionTime(
  steps: { stats?: { executionTime?: number } }[],
  avgExecutionTime: number
): void {
  if (steps.length <= 1) return;
  const timePerStep = avgExecutionTime / (steps.length - 1);
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].stats) {
      steps[i].stats!.executionTime = timePerStep * i;
    }
  }
}

export function benchmarkAlgorithm(
  algorithmFn: () => void,
  timeBudgetMs: number = 150
): number {
  const benchStart = performance.now();
  let iterations = 0;

  while (performance.now() - benchStart < timeBudgetMs) {
    algorithmFn();
    iterations++;
  }

  const totalTime = performance.now() - benchStart;
  return totalTime / iterations;
}
