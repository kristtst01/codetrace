# Issues & Feature Suggestions

---

## Phase 1 — Fix the Foundation (COMPLETED)

### - [x] 1. Redesign layout to eliminate excessive vertical scrolling

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

### - [x] 2. Canvas overflows on smaller screens and mid-size viewports

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
3. [ ] Verify mouse coordinate mapping in `useGridRenderer.ts` still works correctly when the canvas CSS size differs from its internal resolution (the existing `scaleX`/`scaleY` logic should handle this, but verify)

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

### - [x] 3. Algorithm code panel doesn't scroll for longer implementations

#### Branch
`fix/code-panel-scroll`

#### Why
When "View Code" is toggled on in `AlgorithmInfoCard`, longer algorithm implementations (like merge sort or A*) overflow the container and get cut off.

#### Files
- `src/components/AlgorithmInfoCard.tsx` — the code display section

#### Tasks
1. [ ] Add `max-h-64 overflow-y-auto` to the `<div>` wrapping the `<pre><code>` block (the div with class `bg-muted p-4 rounded-md overflow-x-auto`)
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

### - [x] 4. No error boundaries — algorithm or rendering failures crash the app silently

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

### - [x] 5. Add dark mode toggle

#### Branch
`feat/dark-mode`

#### Why
Dark mode CSS variables already exist in `src/index.css` (the `.dark` class) but there's no way to toggle it. Most developer tools default to dark mode.

#### Files
- `src/components/Header.tsx` — add the toggle button
- `src/index.css` — dark theme variables already defined, no changes needed
- `src/hooks/useVisualizerRenderer.ts` — hardcoded `#ffffff` text color won't work on light background in dark mode
- `src/hooks/useGridRenderer.ts` — hardcoded `#e5e7eb` grid lines may need updating
- `src/utils/colorUtils.ts` — check if any hardcoded colors clash with dark mode

#### Tasks
1. [ ] Add a dark mode toggle button to `Header.tsx` using a Sun/Moon icon from `lucide-react`. On click, toggle the `dark` class on `document.documentElement`
2. [ ] Persist the preference to `localStorage` under key `codetrace-theme`. On mount, read from localStorage (default to system preference via `prefers-color-scheme` if no stored value)
3. [ ] Fix the hardcoded `#ffffff` fill color for bar value labels in `useVisualizerRenderer.ts` — read from a CSS variable or use a color that works on both light and dark canvas backgrounds
4. [ ] Check `useGridRenderer.ts` grid line color `#e5e7eb` and `colorUtils.ts` — update any hardcoded colors that clash with dark mode backgrounds
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

### - [x] 6. Add keyboard shortcuts (spacebar play/pause, arrow keys step, R reset)

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

### - [ ] 7. Let users input a custom array instead of only random generation

#### Branch
`feat/custom-array-input`

#### Why
Users learning algorithms often want to test specific inputs (e.g., already sorted, single duplicate, edge cases). Currently the only option is random generation.

#### Files
- `src/components/controls/ArrayInput.tsx` — new component: a text input where users type comma-separated numbers
- `src/hooks/useArrayManagement.ts` — add a `setCustomArray` function that validates and sets user-provided arrays
- `src/hooks/useVisualizationControls.ts` — wire `setCustomArray` through to the return object and re-execute the selected algorithm when a custom array is set
- `src/App.tsx` — render `ArrayInput` in the sorting sidebar, between `ArraySizeControl` and `GenerateArrayButton`

#### Tasks
1. [ ] Add a `setCustomArray` callback to `useArrayManagement` that accepts a `number[]`, validates all values are finite positive integers between 1-999, clamps length to 2-100 elements, and calls `setArray` + `setSize`
2. [ ] Create `src/components/controls/ArrayInput.tsx`: a text input with a "Set" button. On submit, parse the comma-separated string into numbers, call `setCustomArray`. Show inline validation error if parsing fails (e.g., "Enter comma-separated numbers like 5,3,8,1")
3. [ ] Wire it through `useVisualizationControls`: expose `setCustomArray`, and when called, reset playback and re-execute the current algorithm on the new array (same pattern as `handleGenerateArray`)
4. [ ] In `App.tsx`, render `<ArrayInput>` in the sorting mode sidebar section, after `ArraySizeControl` and before `GenerateArrayButton`

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Typing `5,3,8,1,9` and clicking Set visualizes that exact array
- [ ] Invalid input (e.g., `abc`, empty, `5,,3`) shows an inline error message
- [ ] Setting a custom array updates the array size display to match
- [ ] The selected algorithm (if any) re-executes on the new custom array
- [ ] [Visual] The input fits naturally in the sidebar without breaking layout

#### Constraints
- Do NOT modify existing algorithm files
- Do NOT change `GenerateArrayButton` — it should still generate random arrays as before
- Keep validation simple — no need for a library, just `split`, `map(Number)`, and `filter(isNaN)` checks
- Agent's discretion on exact styling of the input and error message

---

### - [ ] 8. Add reverse-sorted and few-unique-values array presets

#### Branch
`feat/array-presets`

#### Why
Demonstrating algorithm behavior on best/worst/special-case inputs is core to algorithm education. Random arrays don't show why Quick Sort degrades on sorted input or how few-unique values affect different strategies.

#### Files
- `src/hooks/useArrayManagement.ts` — add preset generation functions alongside `createRandomArray`
- `src/components/controls/GenerateArrayButton.tsx` — replace the single button with a dropdown that offers: Random, Sorted, Reverse-Sorted, Nearly Sorted, Few Unique Values
- `src/hooks/useVisualizationControls.ts` — update `handleGenerateArray` to accept a preset type parameter

#### Tasks
1. [ ] In `useArrayManagement.ts`, add generation functions next to the existing `createRandomArray`:
   - `createSortedArray(size)` — returns `[1, 2, 3, ..., size]` scaled to 1-100
   - `createReverseSortedArray(size)` — returns `[size, size-1, ..., 1]` scaled to 1-100
   - `createNearlySortedArray(size)` — sorted array with ~10% of elements randomly swapped
   - `createFewUniqueArray(size)` — array using only 3-5 distinct values
2. [ ] Update `generateArray` in `useArrayManagement` to accept an optional preset type parameter (default `'random'`). Use a union type: `'random' | 'sorted' | 'reverse' | 'nearly-sorted' | 'few-unique'`
3. [ ] Rework `GenerateArrayButton.tsx`: replace the single `<Button>` with a split button or dropdown (using shadcn `Select` or a `DropdownMenu`) that lists the preset options. Clicking an option calls `onGenerate(presetType)`
4. [ ] Update `handleGenerateArray` in `useVisualizationControls.ts` to pass the preset type through to `arrayManagement.generateArray`
5. [ ] Update the `onGenerate` prop type in `GenerateArrayButton` and `App.tsx` to accept the preset string

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Selecting "Reverse Sorted" generates a descending array
- [ ] Selecting "Few Unique" generates an array with at most 5 distinct values
- [ ] Selecting "Nearly Sorted" generates a mostly-sorted array with a few swaps
- [ ] The default option is still "Random"
- [ ] The selected algorithm re-executes when a preset is chosen
- [ ] [Visual] Dropdown fits in the sidebar without layout issues

#### Constraints
- Do NOT modify any algorithm files
- Do NOT remove the ability to generate random arrays — it remains the default
- Agent's discretion on whether to use `DropdownMenu` or `Select` for the preset picker

---

### - [ ] 9. Add Heap Sort algorithm

#### Branch
`feat/heap-sort`

#### Why
Heap Sort is a fundamental O(n log n) comparison sort that introduces students to the heap data structure. It fills a gap between the simple O(n²) sorts and the divide-and-conquer sorts already in the app.

#### Files
- `src/algorithms/heapSort.ts` — new file implementing the Heap Sort algorithm with step generation
- `src/algorithms/index.ts` — import and register `heapSort` in the `algorithms` record

#### Tasks
1. [ ] Create `src/algorithms/heapSort.ts` following the exact same pattern as `bubbleSort.ts`: export an `Algorithm` object with `name`, `category: 'sorting'`, `description`, `timeComplexity: 'O(n log n)'`, `spaceComplexity: 'O(1)'`, a `code` string showing the algorithm, and a `generate` function
2. [ ] The `generate` function must: use `benchmarkAlgorithm` and `distributeExecutionTime` from `../utils/benchmark`, track `comparisons` and `swaps` in `stats`, emit `SortingStep` objects with `comparing`, `swapping`, and `sorted` index arrays, and include descriptive `message` strings (e.g., "Heapifying subtree rooted at index 3", "Swapping root with last unsorted element")
3. [ ] In `src/algorithms/index.ts`, import `heapSort` from `./heapSort` and add `heapSort` to the `algorithms` record

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] "Heap Sort" appears in the algorithm selector dropdown when in sorting mode
- [ ] Selecting it generates steps and the visualization plays correctly
- [ ] Statistics (comparisons, swaps, execution time) update during playback
- [ ] The final step has all indices in the `sorted` array

#### Constraints
- Do NOT modify any existing algorithm files
- Do NOT modify types, hooks, or components — the algorithm registry pattern handles everything
- Follow the exact same `Algorithm` interface and step generation pattern as `bubbleSort.ts`

---

### - [ ] 10. Add Shell Sort algorithm

#### Branch
`feat/shell-sort`

#### Why
Shell Sort bridges Insertion Sort and the O(n log n) algorithms, showing how gap sequences dramatically improve performance. It's a natural progression from the existing Insertion Sort.

#### Files
- `src/algorithms/shellSort.ts` — new file implementing Shell Sort with step generation
- `src/algorithms/index.ts` — import and register `shellSort`

#### Tasks
1. [ ] Create `src/algorithms/shellSort.ts` following the `Algorithm` pattern. Use the Knuth gap sequence (1, 4, 13, 40, ...) or Marcin Ciura's sequence. Use `timeComplexity: 'O(n log² n)'` and `spaceComplexity: 'O(1)'`
2. [ ] The `generate` function must use `benchmarkAlgorithm` and `distributeExecutionTime`, track `comparisons` and `swaps` in stats, and emit `SortingStep` objects. Use `comparing` to highlight elements being compared across the gap, `swapping` for swaps, and `sorted` for final sorted state
3. [ ] Include descriptive messages that reference the current gap size (e.g., "Gap = 4: comparing elements at indices 0 and 4")
4. [ ] In `src/algorithms/index.ts`, import and register `shellSort`

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] "Shell Sort" appears in the sorting algorithm dropdown
- [ ] The visualization plays through correctly
- [ ] Messages reference the current gap value
- [ ] Stats (comparisons, swaps, execution time) update during playback

#### Constraints
- Do NOT modify types, existing algorithms, or components
- Follow the exact same `Algorithm` export pattern as `bubbleSort.ts`
- Agent's discretion on which gap sequence to use

---

### - [ ] 11. Add Counting Sort algorithm

#### Branch
`feat/counting-sort`

#### Why
Counting Sort is the first non-comparison sort in the app, demonstrating that O(n) sorting is possible under certain conditions. It contrasts with every other sorting algorithm and teaches students about the comparison-sort lower bound.

#### Files
- `src/algorithms/countingSort.ts` — new file implementing Counting Sort with step generation
- `src/algorithms/index.ts` — import and register `countingSort`

#### Tasks
1. [ ] Create `src/algorithms/countingSort.ts` following the same `Algorithm` pattern as existing sorts. Use `timeComplexity: 'O(n + k)'` and `spaceComplexity: 'O(k)'` where k is the range of values
2. [ ] The `generate` function must track stats. Since Counting Sort doesn't do traditional comparisons/swaps, set `comparisons` to the number of array reads and `swaps` to the number of writes to the output array. Use `benchmarkAlgorithm` and `distributeExecutionTime`
3. [ ] Generate `SortingStep` objects that visualize the process: use `comparing` to highlight which element is being counted/placed, and `sorted` to mark elements in their final position as the output array is built
4. [ ] In `src/algorithms/index.ts`, import and register `countingSort`

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] "Counting Sort" appears in the sorting algorithm dropdown
- [ ] The visualization plays through and produces a correctly sorted array
- [ ] Stats display shows reads, writes, and execution time
- [ ] Messages describe counting and placement phases

#### Constraints
- Do NOT modify types or add new step types — reuse `SortingStep` with `comparing`/`swapping`/`sorted` fields
- Do NOT modify existing algorithm files
- Follow the exact same pattern as `bubbleSort.ts` for the `Algorithm` export shape

---

### - [ ] 12. Add Radix Sort algorithm

#### Branch
`feat/radix-sort`

#### Why
Radix Sort is the most visually interesting non-comparison sort — processing digits from least to most significant. It pairs well with Counting Sort to show how sub-routines compose into faster algorithms.

#### Files
- `src/algorithms/radixSort.ts` — new file implementing LSD Radix Sort with step generation
- `src/algorithms/index.ts` — import and register `radixSort`

#### Tasks
1. [ ] Create `src/algorithms/radixSort.ts` implementing LSD (Least Significant Digit) Radix Sort. Use `timeComplexity: 'O(d × n)'` and `spaceComplexity: 'O(n + k)'` where d is digits and k is the radix (10)
2. [ ] The `generate` function must use `benchmarkAlgorithm` and `distributeExecutionTime`, track stats (`comparisons` as array reads, `swaps` as writes), and emit `SortingStep` objects with descriptive messages about which digit position is being processed (e.g., "Processing ones digit", "Placing 42 into bucket 2")
3. [ ] Use `comparing` to highlight elements being bucketed and `sorted` to mark elements placed in final position after the last digit pass
4. [ ] In `src/algorithms/index.ts`, import and register `radixSort`

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] "Radix Sort" appears in the sorting algorithm dropdown
- [ ] The visualization correctly sorts the array
- [ ] Messages reference digit positions being processed
- [ ] Stats update during playback

#### Constraints
- Do NOT modify types or add new step types — reuse `SortingStep`
- Do NOT modify existing algorithm files
- Follow the exact same `Algorithm` export pattern as `bubbleSort.ts`

---

### - [ ] 13. Add sound/audio feedback mapped to array element values during sorting

#### Branch
`feat/sorting-audio`

#### Why
Audio feedback makes sorting visualizations dramatically more engaging and helps users build intuition about algorithm behavior. The "sound of sorting" is iconic in CS education.

#### Files
- `src/utils/audioUtils.ts` — new file: create an `AudioContext`-based tone generator that maps array values to frequencies
- `src/hooks/useVisualizerRenderer.ts` — trigger audio on compare/swap steps
- `src/components/controls/SoundToggle.tsx` — new component: a mute/unmute button
- `src/App.tsx` — render `SoundToggle` in the sorting sidebar and pass sound-enabled state down

#### Tasks
1. [ ] Create `src/utils/audioUtils.ts`: export a `playTone(value: number, maxValue: number, duration?: number)` function that uses `AudioContext` and `OscillatorNode` to play a short tone (40-80ms). Map the value to a frequency range of ~200Hz-800Hz proportional to `value/maxValue`. Use a gain envelope to avoid clicks (quick ramp up/down). Export a singleton `AudioContext` getter that only creates the context on first user interaction (browser autoplay policy)
2. [ ] Create `src/components/controls/SoundToggle.tsx`: a toggle button using a `Volume2`/`VolumeX` icon from `lucide-react`. Manages a boolean state for sound enabled/disabled. Persist preference to `localStorage` under `codetrace-sound`
3. [ ] In `src/hooks/useVisualizerRenderer.ts`, add an optional `soundEnabled` prop. When true and the step has `comparing` or `swapping` indices, call `playTone` for the values at those indices. Only play on step *changes* (compare previous step ref to avoid replaying on re-renders)
4. [ ] Wire it up in `App.tsx`: add `SoundToggle` to the sorting sidebar, pass `soundEnabled` through to `SortingVisualizer` and down to `useVisualizerRenderer`
5. [ ] Update `SortingVisualizer.tsx` to accept and forward the `soundEnabled` prop to `useVisualizerRenderer`

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Playing a sorting animation with sound enabled produces tones that rise in pitch as values increase
- [ ] Sound toggle button appears in the sidebar in sorting mode
- [ ] Toggling sound off silences all tones immediately
- [ ] Sound preference persists across page reloads
- [ ] No audio errors in console when sound is disabled
- [ ] No audio plays in pathfinding mode

#### Constraints
- Do NOT use any audio library — use the Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) directly
- Do NOT play sound during pathfinding mode
- Do NOT auto-enable sound — default to muted (browser autoplay policies)
- Keep tones short (40-80ms) to avoid overlapping at fast playback speeds

---

### - [ ] 14. Side-by-side algorithm comparison mode (race two algorithms on the same data)

#### Branch
`feat/algorithm-comparison`

#### Why
Comparing algorithms side-by-side on identical input is the best way to build intuition about algorithmic trade-offs. Watching Bubble Sort crawl while Merge Sort finishes instantly is worth more than any Big-O explanation.

#### Files
- `src/types/index.ts` — add a `ComparisonState` type
- `src/hooks/useComparisonMode.ts` — new hook managing two independent algorithm executions and synchronized playback
- `src/components/ComparisonView.tsx` — new component rendering two `SortingVisualizer` instances side by side
- `src/components/controls/ComparisonControls.tsx` — new component with two algorithm selectors and a "Race" button
- `src/App.tsx` — add a comparison mode toggle and conditionally render `ComparisonView` instead of the single visualizer
- `src/components/Header.tsx` — add a comparison mode toggle button

#### Tasks
1. [ ] Add a `ComparisonState` interface to `src/types/index.ts`: `{ leftAlgorithm: string | null, rightAlgorithm: string | null, array: number[], leftSteps: SortingStep[], rightSteps: SortingStep[] }`
2. [ ] Create `src/hooks/useComparisonMode.ts`: a hook that manages two `useAlgorithmExecution` instances sharing the same input array. Provide a `startRace` function that generates steps for both algorithms on the same array snapshot. Share a single `usePlaybackAnimation` — both visualizers advance on the same step counter (the one with fewer steps simply stays on its last frame)
3. [ ] Create `src/components/controls/ComparisonControls.tsx`: two `AlgorithmSelector` dropdowns (left/right) filtered to sorting algorithms, a "Generate Array" button shared between both, and a "Race" button that triggers `startRace`
4. [ ] Create `src/components/ComparisonView.tsx`: renders two `SortingVisualizer` components side by side in a `grid grid-cols-2 gap-4` layout, each with an algorithm name label and its own stats display
5. [ ] In `src/App.tsx`, add a boolean `comparisonMode` state. When true, render `ComparisonView` + `ComparisonControls` in the sidebar instead of the normal single-algorithm view. Wire the comparison hook into the return
6. [ ] Add a comparison mode toggle to `Header.tsx` — a button or toggle next to the mode selector (only visible in sorting mode)

#### Acceptance Criteria
- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes
- [ ] Selecting two sorting algorithms and clicking Race shows both visualizations animating side by side
- [ ] Both visualizations use the exact same starting array
- [ ] Playback controls (play/pause/step/reset) control both visualizations simultaneously
- [ ] Each side shows its own statistics (comparisons, swaps, execution time)
- [ ] The shorter algorithm stops on its final sorted frame while the longer one continues
- [ ] [Visual] Both canvases are equal width and fill the available space
- [ ] Toggling comparison mode off returns to the normal single-algorithm view

#### Constraints
- Do NOT modify existing algorithm files
- Do NOT add a comparison mode for pathfinding — sorting only for now
- Do NOT implement independent playback controls per side — a single shared playback controls both
- Reuse existing `SortingVisualizer`, `PlaybackControls`, and `StatisticsDisplay` components — do NOT duplicate their logic
- Agent's discretion on exact layout proportions and whether the sidebar shrinks or the visualizers stack on narrow viewports

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
