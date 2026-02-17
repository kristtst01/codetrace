import type { AlgorithmStep, AlgorithmMode } from '../types';

interface StatisticsDisplayProps {
  step: AlgorithmStep;
  mode: AlgorithmMode;
}

export const StatisticsDisplay = ({ step, mode }: StatisticsDisplayProps) => {
  const stats = step.stats;

  if (!stats) return null;

  const formatTime = (timeMs: number | undefined): string => {
    if (!timeMs) return '0µs';

    if (timeMs < 1) {
      return `${(timeMs * 1000).toFixed(2)}µs`;
    } else if (timeMs < 1000) {
      return `${timeMs.toFixed(3)}ms`;
    } else {
      return `${(timeMs / 1000).toFixed(3)}s`;
    }
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-4">Statistics</h3>
      <div className="space-y-3">
        {mode === 'sorting' ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Comparisons</span>
              <span className="text-sm font-semibold">{stats.comparisons ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Swaps</span>
              <span className="text-sm font-semibold">{stats.swaps ?? 0}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nodes Visited</span>
              <span className="text-sm font-semibold">{stats.nodesVisited ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Path Length</span>
              <span className="text-sm font-semibold">
                {stats.pathLength ? stats.pathLength : 'N/A'}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-sm text-muted-foreground">Execution Time</span>
          <span className="text-sm font-semibold">
            {formatTime(stats.executionTime)}
          </span>
        </div>
      </div>
    </div>
  );
};
