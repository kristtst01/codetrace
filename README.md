# CodeTrace

Algorithm visualization tool for understanding sorting and pathfinding algorithms through step-by-step execution and visual feedback.

## Current Features

### Dual Mode Visualization

Switch between two visualization modes:
- **Sorting Mode**: Visualize array sorting with vertical bars
- **Pathfinding Mode**: Visualize graph traversal on an interactive grid

### Sorting Algorithms
- Bubble Sort
- Quick Sort
- Merge Sort
- Insertion Sort
- Selection Sort

### Pathfinding Algorithms
- Dijkstra's Algorithm (weighted shortest path)
- A* Algorithm (heuristic-based optimal pathfinding)
- Breadth-First Search (level-by-level exploration)
- Depth-First Search (deep exploration)

All pathfinding algorithms support 8-directional movement with proper diagonal cost calculation.

### Sorting Visualization
- Canvas-based bar chart with color-coded states
- Array size control (5-100 elements)
- Generate new random array
- Real-time comparison and swap visualization

### Pathfinding Visualization
- Interactive grid with color-coded cells
- Click and drag to draw walls
- Drag start (green) and end (red) points to reposition
- Grid size control (10-50 rows, 10-100 columns)
- Maze generation patterns:
  - Recursive Division
  - Randomized Prim's
  - Random Walls
- Visited cells (light blue), exploring cells (yellow), final path (blue)

### Shared Controls
- Play/pause animation
- Step forward/backward through execution
- Reset to beginning
- Adjustable animation speed (100ms - 1000ms)
- Algorithm information cards with time/space complexity
- Real-time execution messages

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Canvas API for visualization

## Architecture

The codebase follows clean architecture principles with separation of concerns:

- Custom hooks for state management and logic
- Dual-mode orchestration with shared playback infrastructure
- Small, focused components with single responsibility
- Utility modules for shared functionality (colors, maze generation)
- Type-safe implementation throughout
- Algorithm registry pattern for extensibility

## Installation

```bash
pnpm install
pnpm run dev
```

## Known Issues / Needs Work

### UI/UX
- **Complete UI redesign needed**: Current layout is poorly optimized for desktop - page is excessively long requiring constant scrolling between controls and visualization. Needs horizontal layout restructuring.

### Pathfinding
- **Wall drawing**: Click-and-drag repeatedly toggles the same cell when moving slowly, making it unreliable. Only works when moving mouse quickly across different cells.
- **Recursive Division maze generation**: Adds far too many walls, creating mazes that are almost always unsolvable. Algorithm needs tuning to create fewer walls and ensure paths exist.
- **Random Walls maze generation**: Currently just randomly places walls, doesn't create actual maze-like structures with guaranteed solvability. Needs pathfinding check and better distribution.
- **Grid size changes**: Changing grid dimensions while an algorithm is running may cause issues. Reset before changing size.
- **Large grids performance**: Grids larger than 40x80 may have slower step generation for Dijkstra and A*.

### General
- No keyboard shortcuts for playback controls (spacebar for play/pause, arrow keys for stepping)
- No mobile touch support for grid interaction
- Algorithm code view doesn't scroll well for long implementations
- No statistics display (nodes visited, path length, comparisons made, execution time)

## Future Enhancements

- **Node/edge graph visualization**: Add a third visualization mode with traditional graph representation (nodes as circles, edges as lines) for pathfinding algorithms
- **Keyboard shortcuts**: Spacebar for play/pause, arrow keys for stepping, R for reset
- **Export visualization**: Export algorithm execution as video/GIF for sharing
- **Save/load configurations**: Save and load custom maze patterns and grid configurations
- **Code highlighting**: Synchronized step-by-step code highlighting that shows which line is executing
- **Statistics dashboard**: Real-time display of nodes visited, path length, comparisons made, swaps, execution time
- Weighted grid cells (terrain with different costs)
- Bidirectional search algorithms
- Side-by-side algorithm comparison
- Graph algorithms (minimum spanning tree, network flow)
- Dark mode toggle
- Mobile responsive grid interaction
