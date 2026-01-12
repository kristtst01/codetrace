export const VISUALIZER_COLORS = {
  default: '#3b82f6',    // Blue - default state
  comparing: '#eab308',  // Yellow - being compared
  swapping: '#ef4444',   // Red - being swapped
  sorted: '#22c55e',     // Green - sorted
} as const;

export const getBarColor = (
  index: number,
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = []
): string => {
  if (sorted.includes(index)) {
    return VISUALIZER_COLORS.sorted;
  }
  if (swapping.includes(index)) {
    return VISUALIZER_COLORS.swapping;
  }
  if (comparing.includes(index)) {
    return VISUALIZER_COLORS.comparing;
  }
  return VISUALIZER_COLORS.default;
};
