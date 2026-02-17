# Issues & Feature Suggestions

---

## Phase 1 — Fix the Foundation

### - [ ] 1. Redesign layout to eliminate excessive vertical scrolling

#### Branch
`fix/layout-redesign`

#### Why
The app requires scrolling to see stats and algorithm info, which defeats the purpose of a real-time visualizer. Everything should be visible at once.

#### Files
- `src/App.tsx` — restructure the top-level grid into a full-viewport layout
- `src/components/Header.tsx` — make compact and horizontal
- `src/components/VisualizationArea.tsx` — remove redundant `lg:col-span-2`, let parent control sizing
- `src/components/visualizers/SortingVisualizer.tsx` — remove hardcoded `width={800} height={400}`, fill container
- `src/components/visualizers/GridVisualizer.tsx` — remove hardcoded `width={1000} height={600}`, fill container
- `src/hooks/useVisualizerRenderer.ts` — accept dynamic dimensions from container instead of props
- `src/hooks/useGridRenderer.ts` — accept dynamic dimensions from container instead of props
- `src/components/StatisticsDisplay.tsx` — integrate into the sidebar Card instead of a separate grid row
- `src/components/controls/ModeSelector.tsx` — move into the header bar

#### Tasks
1. [ ] Restructure `App.tsx`: replace `min-h-screen p-8` with `h-screen overflow-hidden flex flex-col`. Replace the `grid-cols-3` layout with a two-column layout (flexible visualizer + fixed-width ~300px sidebar). Move `ModeSelector` out of the sidebar Card and into the `Header`
2. [ ] Rework `Header.tsx`: change from centered vertical stack to `flex justify-between items-center` horizontal bar. Title on the left, mode selector on the right. Reduce vertical space
3. [ ] Make `SortingVisualizer.tsx` responsive: remove hardcoded width/height props. Wrap canvas in a container div that fills available space. Use `ResizeObserver` to read container dimensions and pass them to the canvas and `useVisualizerRenderer`
4. [ ] Make `GridVisualizer.tsx` responsive: same approach as task 3. Remove hardcoded width/height, use `ResizeObserver` on container
5. [ ] Update `useVisualizerRenderer.ts` and `useGridRenderer.ts` to work with dynamic dimensions from ResizeObserver rather than static props
6. [ ] Move `StatisticsDisplay` into the sidebar Card in `App.tsx` — render it as a section within `CardContent` instead of a standalone Card in a separate grid row
7. [ ] Clean up `VisualizationArea.tsx` — remove the `lg:col-span-2` class since the parent now controls the grid layout
8. [ ] Add `overflow-y-auto` to the sidebar so controls scroll internally in pathfinding mode (which has more controls) rather than pushing the page

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] No hardcoded `width` or `height` props remain on canvas visualizer components
- [ ] `StatisticsDisplay` renders inside the sidebar, not as a separate grid row
- [ ] `ModeSelector` renders inside the header, not inside the sidebar
- [ ] Root container uses `h-screen` and `overflow-hidden`
- [ ] [Visual] Entire app fits in viewport on 1920x1080 in both sorting and pathfinding modes without scrolling
- [ ] [Visual] Canvas resizes when browser window resizes

#### Constraints
- Do NOT refactor hooks beyond changing how they receive width/height
- Do NOT change algorithm execution logic, playback logic, or state management
- Do NOT change the visual appearance of controls (spacing, button styles, etc.) — only their placement
- Agent's discretion on exact Tailwind classes and whether to use `ResizeObserver` directly or a small hook wrapper

---

### - [ ] 2. Canvas overflows on smaller screens and mid-size viewports

#### Branch
`fix/canvas-overflow`

#### Why
On viewports smaller than the hardcoded canvas dimensions (800x400 sorting, 1000x600 grid), the canvas overflows its container and gets clipped or causes horizontal scroll.

#### Files
- `src/components/visualizers/SortingVisualizer.tsx` — canvas sizing
- `src/components/visualizers/GridVisualizer.tsx` — canvas sizing
- `src/hooks/useVisualizerRenderer.ts` — rendering at correct scale
- `src/hooks/useGridRenderer.ts` — rendering and mouse coordinate mapping at correct scale

#### Tasks
1. [ ] If issue #1 (layout redesign) is done first, this may already be resolved by the ResizeObserver approach. Verify by testing at 1366x768 and 1024x768 viewports
2. [ ] If not resolved: ensure canvas elements have `max-w-full` and scale down proportionally within their container using CSS `object-fit` or by setting canvas dimensions from container size
3. [ ] Verify mouse coordinate mapping in `useGridRenderer.ts` still works correctly when the canvas CSS size differs from its internal resolution (the existing `scaleX`/`scaleY` logic on lines 88-89 should handle this, but verify)

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] No horizontal scrollbar appears at any viewport width >= 1024px
- [ ] [Visual] Canvas scales down proportionally at 1366x768 viewport
- [ ] [Visual] Grid wall drawing and start/end dragging still work correctly after scaling

#### Constraints
- Do NOT change the canvas rendering logic (bar drawing, cell drawing, colors)
- Do NOT change mouse event handling logic beyond coordinate mapping
- This issue may be fully resolved by issue #1 — check first before making additional changes

---

### - [ ] 3. Algorithm code panel doesn't scroll for longer implementations

#### Branch
`fix/code-panel-scroll`

#### Why
When "View Code" is toggled on in `AlgorithmInfoCard`, longer algorithm implementations (like merge sort or A*) overflow the container and get cut off.

#### Files
- `src/components/AlgorithmInfoCard.tsx` — the code display section (lines 37-45)

#### Tasks
1. [ ] Add `max-h-64 overflow-y-auto` to the `<div>` wrapping the `<pre><code>` block (the div at line 38 with class `bg-muted p-4 rounded-md overflow-x-auto`)
2. [ ] Verify that `overflow-x-auto` (already present) still works for horizontal scroll on wide lines

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] The code block has a visible max height and scrolls vertically for long algorithms
- [ ] Horizontal scrolling still works for wide lines
- [ ] [Visual] Toggle "View Code" on merge sort and A* — both scroll rather than expanding the card indefinitely

#### Constraints
- Only touch the code display `<div>` — do NOT restructure the rest of `AlgorithmInfoCard`
- Do NOT change the code content or formatting

---

### - [ ] 4. No error boundaries — algorithm or rendering failures crash the app silently

#### Branch
`feat/error-boundary`

#### Why
If an algorithm throws (e.g., bad grid input) or canvas rendering fails, the entire React tree unmounts with a white screen and no feedback. An error boundary should catch this and show a recoverable message.

#### Files
- Create `src/components/ErrorBoundary.tsx` — new file, React error boundary class component
- `src/App.tsx` — wrap the visualization area and sidebar with the error boundary

#### Tasks
1. [ ] Create `src/components/ErrorBoundary.tsx`: a class component implementing `componentDidCatch` and `getDerivedStateFromError`. When an error is caught, render a Card with the error message and a "Reset" button that clears the error state
2. [ ] In `App.tsx`, wrap the main grid layout (visualizer + sidebar) with `<ErrorBoundary>`. Do NOT wrap the Header — it should remain visible even when the visualizer crashes
3. [ ] The reset button in the error boundary should call `setState({ hasError: false })` to re-mount the children — the hooks will re-initialize with fresh state automatically

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] `ErrorBoundary.tsx` exists and exports a class component with `componentDidCatch`
- [ ] The error boundary wraps the main content in `App.tsx` but not the Header
- [ ] [Manual] Temporarily throw an error in a sorting algorithm's `generate` function — the app shows an error message instead of a white screen, and clicking reset recovers

#### Constraints
- Do NOT add error boundaries around individual controls — one boundary around the main content is enough
- Do NOT add try/catch inside algorithm implementations — the boundary handles React rendering errors
- Do NOT install an error reporting library — just local UI recovery
- Keep the error UI minimal: use the existing `Card` component, a short message, and a reset button

---

### - [ ] 5. Add dark mode toggle

#### Branch
`feat/dark-mode`

#### Why
Dark mode CSS variables already exist in `src/index.css` (the `.dark` class on lines 34-59) but there's no way to toggle it. Most developer tools default to dark mode.

#### Files
- `src/components/Header.tsx` — add the toggle button
- `src/index.css` — dark theme variables already defined, no changes needed
- `src/hooks/useVisualizerRenderer.ts` — hardcoded `#ffffff` text color (line 43) won't work on light background in dark mode
- `src/hooks/useGridRenderer.ts` — hardcoded `#e5e7eb` grid lines (line 69) may need updating
- `src/utils/colorUtils.ts` — check if any hardcoded colors clash with dark mode

#### Tasks
1. [ ] Add a dark mode toggle button to `Header.tsx` using a Sun/Moon icon from `lucide-react`. On click, toggle the `dark` class on `document.documentElement`
2. [ ] Persist the preference to `localStorage` under key `codetrace-theme`. On mount, read from localStorage (default to system preference via `prefers-color-scheme` if no stored value)
3. [ ] Fix the hardcoded `#ffffff` fill color for bar value labels in `useVisualizerRenderer.ts` line 43 — read from a CSS variable or use a color that works on both light and dark canvas backgrounds
4. [ ] Check `useGridRenderer.ts` grid line color `#e5e7eb` (line 69) and `colorUtils.ts` — update any hardcoded colors that clash with dark mode backgrounds
5. [ ] Verify the existing `.dark` CSS variables in `index.css` produce a good result with all existing components (Cards, buttons, selects, sliders). shadcn components should inherit automatically

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] A toggle button exists in the header that switches between light and dark mode
- [ ] Preference persists across page reloads via localStorage
- [ ] No hardcoded colors in canvas renderers that break in dark mode
- [ ] [Visual] All UI elements (cards, buttons, selects, sliders) render correctly in dark mode
- [ ] [Visual] Sorting visualizer bar labels are readable in both modes
- [ ] [Visual] Grid visualizer lines and cells are visible in both modes

#### Constraints
- Do NOT install `next-themes` or similar — this is simple enough with a class toggle + localStorage
- Do NOT redesign the color palette — use the existing `.dark` variables from `index.css`
- Do NOT change component structure — only add the toggle and fix hardcoded canvas colors
- Agent's discretion on the icon used (Sun/Moon, monitor icon, etc.)

---

### - [ ] 6. Add keyboard shortcuts (spacebar play/pause, arrow keys step, R reset)

#### Branch
`feat/keyboard-shortcuts`

#### Why
Power users and anyone following along with a visualization need keyboard control. Reaching for the mouse to step forward breaks flow.

#### Files
- `src/App.tsx` — add a `useEffect` with a `keydown` listener
- `src/hooks/useVisualizationControls.ts` — provides `play`, `pause`, `stepForward`, `stepBackward`, `handleReset`, and `isPlaying` which the listener will call

#### Tasks
1. [ ] Add a `useEffect` in `App.tsx` that registers a global `keydown` event listener on `window`. Map the following keys:
   - `Space` → toggle play/pause (call `controls.play()` or `controls.pause()` based on `controls.isPlaying`)
   - `ArrowRight` → `controls.stepForward()`
   - `ArrowLeft` → `controls.stepBackward()`
   - `r` or `R` → `controls.handleReset()`
2. [ ] In the event handler, call `e.preventDefault()` for Space (to prevent page scroll) but NOT for arrow keys when an input/select is focused. Check `document.activeElement?.tagName` — if it's `INPUT`, `SELECT`, or `TEXTAREA`, ignore the keypress to avoid interfering with form controls
3. [ ] Clean up the listener in the useEffect return function

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Pressing Space toggles play/pause when no input is focused
- [ ] Arrow keys step forward/backward when no input is focused
- [ ] R key resets the visualization when no input is focused
- [ ] Keyboard shortcuts do NOT fire when a select dropdown or slider is focused
- [ ] No page scroll occurs when pressing Space

#### Constraints
- Do NOT install a keyboard shortcut library — this is a single `useEffect` with a `keydown` listener
- Do NOT modify `useVisualizationControls` or `usePlaybackAnimation` — call the existing returned functions
- Do NOT add a keyboard shortcut help overlay/modal (that's a future issue)
- Keep the listener in `App.tsx` — do NOT create a separate hook for this

---

## Phase 2 — Make Sorting Best-in-Class

### - [ ] Add sound/audio feedback mapped to array element values during sorting
### - [ ] Add statistics to all sorting algorithms
### - [ ] Let users input a custom array instead of only random generation
### - [ ] Add reverse-sorted and few-unique-values array presets
### - [ ] Add Heap Sort
### - [ ] Add Counting Sort
### - [ ] Add Radix Sort
### - [ ] Add Shell Sort
### - [ ] Side-by-side algorithm comparison mode (race two algorithms on the same data)

---

## Phase 3 — Make Pathfinding Best-in-Class

### - [ ] Add weighted terrain cells with different traversal costs
### - [ ] Add Greedy Best-First Search
### - [ ] Add Bidirectional BFS for pathfinding
### - [ ] Add Jump Point Search (JPS) for grid pathfinding
### - [ ] Add more maze generation algorithms (Eller's, Kruskal's, Wilson's, Aldous-Broder)
### - [ ] Add fog-of-war mode that only reveals cells as the algorithm visits them
### - [ ] Add maze-solving challenge mode with timer and scoring

---

## Phase 4 — New Visualization Modes

### - [ ] Tree visualization mode (BST, AVL, Red-Black, heap operations)
### - [ ] Graph visualization mode (nodes and edges, not just grids)
### - [ ] Stack and queue visualization with push/pop/enqueue/dequeue animations
### - [ ] Linked list visualization (insert, delete, reverse, merge)
### - [ ] Hash table visualization showing collision resolution strategies
### - [ ] Matrix/2D array visualization for dynamic programming problems
### - [ ] Add Floyd-Warshall (all-pairs shortest path) with matrix visualization
### - [ ] Add topological sort with DAG visualization
### - [ ] Add Tim Sort

---

## Phase 5 — Educational & Interactive Features

### - [ ] Show real-time code highlighting synced with the current algorithm step
### - [ ] Visualize auxiliary space usage (e.g., merge sort temp arrays shown separately)
### - [ ] Add complexity graph overlay showing O(n), O(n log n), O(n^2) curves alongside actual performance
### - [ ] Add tooltips explaining Big-O notation and complexity terms
### - [ ] Add a tutorial/onboarding overlay for first-time users
### - [ ] Let users write and plug in their own algorithm code (sandboxed JS editor)

---

## Phase 6 — Sharing & Export

### - [ ] Export visualization as GIF or MP4 video
### - [ ] Export visualization as a shareable URL with encoded state
### - [ ] Save and load algorithm configurations/presets
### - [ ] Import/export grid layouts as JSON or shareable URL
### - [ ] Add a gallery of community-shared mazes and configurations

---

## Phase 7 — Performance & Architecture

### - [ ] Move algorithm execution to a Web Worker to avoid blocking the UI
### - [ ] Algorithm execution blocks the main thread on large inputs
### - [ ] Virtualize rendering for very large arrays (500+ elements)
### - [ ] Use WebGL/WebGPU for grid rendering at scale (100x200+ grids)
### - [ ] Add PWA support for offline usage

---

## Phase 8 — Polish

### - [ ] Add touch support for mobile grid interaction
### - [ ] Allow users to draw custom weighted edges on the grid
### - [ ] Add Vitest unit tests for all algorithm implementations
### - [ ] Add E2E tests with Playwright for critical user flows
### - [ ] Add ARIA labels to canvas elements and all interactive controls
### - [ ] Add a colorblind-friendly palette option
### - [ ] Add screen reader descriptions for algorithm state at each step
### - [ ] Ensure full keyboard navigability throughout the app
