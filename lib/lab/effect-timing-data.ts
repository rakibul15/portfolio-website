// useEffect vs useLayoutEffect — visualizer data model.
//
// React's commit phase is followed by either:
//   - useLayoutEffect → synchronously, blocks the browser from painting
//   - useEffect       → after the browser paints
//
// Each scenario steps through the same lifecycle phases so the user can
// compare the ordering side-by-side.

export type Phase =
  | 'idle'
  | 'render'
  | 'commit'
  | 'layout-effect'
  | 'paint'
  | 'effect'
  | 'done'

export type PhaseStatus = 'pending' | 'active' | 'done' | 'skipped'

// What the user sees on the "viewport" preview at this step.
// Scenarios 1 + 2 use 'counter'. Scenarios 3 + 4 use 'tooltip'.
export interface ScreenState {
  mode: 'counter' | 'tooltip'
  // counter mode:
  counterValue?: number
  counterPainted?: boolean
  // tooltip mode:
  tooltipTop?: number // CSS top in % of viewport (0 = top, 100 = bottom)
  tooltipPainted?: boolean
  tooltipFlicker?: boolean // mark this paint as the "bad" frame the user briefly saw
}

export interface EffectStep {
  activePhase: Phase
  // Per-phase status — drives the timeline pill colors.
  phaseStatus: Partial<Record<Phase, PhaseStatus>>
  screen: ScreenState
  consoleAdd?: string
  note: string
  codeLine?: number
}

export interface EffectScenario {
  id: string
  name: string
  blurb: string
  code: string[]
  // Which phases to render in the timeline, in order.
  phases: { id: Phase; label: string; sublabel?: string }[]
  steps: EffectStep[]
  // Whether this scenario's screen preview is a counter or a tooltip-in-viewport.
  screenMode: 'counter' | 'tooltip'
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const useEffectPhases: EffectScenario['phases'] = [
  { id: 'render', label: 'Render', sublabel: 'fn() runs' },
  { id: 'commit', label: 'Commit', sublabel: 'DOM mutates' },
  { id: 'paint', label: 'Paint', sublabel: 'browser draws' },
  { id: 'effect', label: 'useEffect', sublabel: 'fires after paint' },
]

const useLayoutEffectPhases: EffectScenario['phases'] = [
  { id: 'render', label: 'Render', sublabel: 'fn() runs' },
  { id: 'commit', label: 'Commit', sublabel: 'DOM mutates' },
  { id: 'layout-effect', label: 'useLayoutEffect', sublabel: 'fires synchronously' },
  { id: 'paint', label: 'Paint', sublabel: 'browser draws' },
]

// Phases for the flicker scenarios (useEffect causes 2 paints; useLayoutEffect 1)
const flickerEffectPhases: EffectScenario['phases'] = [
  { id: 'render', label: 'Render 1', sublabel: 'top: 0' },
  { id: 'commit', label: 'Commit', sublabel: 'DOM mutates' },
  { id: 'paint', label: 'Paint 1', sublabel: 'flicker frame' },
  { id: 'effect', label: 'useEffect', sublabel: 'measure + setState' },
  // Implicit re-render then paint, modelled as another step on existing phase
]

const flickerLayoutEffectPhases: EffectScenario['phases'] = [
  { id: 'render', label: 'Render 1', sublabel: 'top: 0' },
  { id: 'commit', label: 'Commit', sublabel: 'DOM mutates' },
  { id: 'layout-effect', label: 'useLayoutEffect', sublabel: 'measure + setState' },
  { id: 'paint', label: 'Paint', sublabel: 'corrected position' },
]

// ---------------------------------------------------------------------------
// Scenario 1 — useEffect timing
// ---------------------------------------------------------------------------

const scenario1: EffectScenario = {
  id: 'use-effect-basic',
  name: 'useEffect timing',
  blurb:
    'useEffect runs AFTER the browser paints. The user sees the new DOM first, then the side effect fires. This is the right default for non-visual work (logging, fetching, subscriptions).',
  screenMode: 'counter',
  phases: useEffectPhases,
  code: [
    `function Counter() {`,
    `  const [count, setCount] = useState(0)`,
    ``,
    `  useEffect(() => {`,
    `    console.log('effect:', count)`,
    `  })`,
    ``,
    `  return <button onClick={() => setCount(c => c + 1)}>{count}</button>`,
    `}`,
  ],
  steps: [
    {
      activePhase: 'idle',
      phaseStatus: {},
      screen: { mode: 'counter', counterValue: 0, counterPainted: true },
      note: 'Counter is mounted. User has clicked the button → setCount(1).',
      codeLine: 8,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active' },
      screen: { mode: 'counter', counterValue: 0, counterPainted: true },
      note: 'React enters the render phase. Counter() runs, returns new JSX showing 1. Screen still shows 0 — nothing has been committed yet.',
      codeLine: 1,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: false },
      note: 'Commit phase. React applies DOM mutations (button.innerText = "1"). The browser still hasn\'t painted — the screen shows the old frame.',
      codeLine: 8,
    },
    {
      activePhase: 'paint',
      phaseStatus: { render: 'done', commit: 'done', paint: 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: true },
      note: 'Browser paints. NOW the user sees 1. The effect has NOT yet fired.',
      codeLine: 8,
    },
    {
      activePhase: 'effect',
      phaseStatus: { render: 'done', commit: 'done', paint: 'done', effect: 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: true },
      consoleAdd: 'effect: 1',
      note: 'useEffect callback fires asynchronously, after paint. console.log runs.',
      codeLine: 5,
    },
    {
      activePhase: 'done',
      phaseStatus: { render: 'done', commit: 'done', paint: 'done', effect: 'done' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: true },
      note: 'Done. The paint happened before the effect — the user never waited on it.',
      codeLine: 8,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — useLayoutEffect timing
// ---------------------------------------------------------------------------

const scenario2: EffectScenario = {
  id: 'use-layout-effect-basic',
  name: 'useLayoutEffect timing',
  blurb:
    'useLayoutEffect runs synchronously after commit but BEFORE paint. The browser is blocked until your callback returns. Use it only for things the user must not see in a half-finished state — DOM measurement, layout-dependent style fixes.',
  screenMode: 'counter',
  phases: useLayoutEffectPhases,
  code: [
    `function Counter() {`,
    `  const [count, setCount] = useState(0)`,
    ``,
    `  useLayoutEffect(() => {`,
    `    console.log('layout effect:', count)`,
    `  })`,
    ``,
    `  return <button onClick={() => setCount(c => c + 1)}>{count}</button>`,
    `}`,
  ],
  steps: [
    {
      activePhase: 'idle',
      phaseStatus: {},
      screen: { mode: 'counter', counterValue: 0, counterPainted: true },
      note: 'Counter is mounted. User has clicked → setCount(1).',
      codeLine: 8,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active' },
      screen: { mode: 'counter', counterValue: 0, counterPainted: true },
      note: 'Render phase. Counter() runs.',
      codeLine: 1,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: false },
      note: 'Commit phase. DOM is mutated to show 1. Browser is queued to paint — but React has more work first.',
      codeLine: 8,
    },
    {
      activePhase: 'layout-effect',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: false },
      consoleAdd: 'layout effect: 1',
      note: 'useLayoutEffect fires SYNCHRONOUSLY. The browser is blocked from painting until this returns.',
      codeLine: 5,
    },
    {
      activePhase: 'paint',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'done', paint: 'active' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: true },
      note: 'NOW the browser paints. The user sees 1 — and the effect has already run.',
      codeLine: 8,
    },
    {
      activePhase: 'done',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'done', paint: 'done' },
      screen: { mode: 'counter', counterValue: 1, counterPainted: true },
      note: 'Done. The layout effect blocked paint. For trivial work this is fine; for heavy work the page feels frozen.',
      codeLine: 8,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — Flicker (measure with useEffect)
// ---------------------------------------------------------------------------

const scenario3: EffectScenario = {
  id: 'flicker-use-effect',
  name: 'Flicker (useEffect + measure)',
  blurb:
    'Classic bug: a tooltip mounts at top:0, an effect measures it and adjusts position. Because useEffect runs AFTER paint, the user sees the tooltip at the wrong position for one frame, then it snaps to the right place. Visible flicker.',
  screenMode: 'tooltip',
  phases: flickerEffectPhases,
  code: [
    `function Tooltip() {`,
    `  const ref = useRef(null)`,
    `  const [top, setTop] = useState(0)`,
    ``,
    `  useEffect(() => {`,
    `    const r = ref.current.getBoundingClientRect()`,
    `    if (window.innerHeight - r.bottom < 100) {`,
    `      setTop(-100)`,
    `    }`,
    `  }, [])`,
    ``,
    `  return <div ref={ref} style={{top}}>Tooltip</div>`,
    `}`,
  ],
  steps: [
    {
      activePhase: 'idle',
      phaseStatus: {},
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Tooltip is about to mount. Default top: 0 — but in the parent\'s coordinate space, that puts it below the viewport.',
      codeLine: 13,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Render phase. JSX returned with top: 0 (off-screen).',
      codeLine: 3,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Commit phase. DOM gets the wrong-position tooltip.',
      codeLine: 13,
    },
    {
      activePhase: 'paint',
      phaseStatus: { render: 'done', commit: 'done', paint: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: true, tooltipFlicker: true },
      note: 'Paint 1. USER SEES THE TOOLTIP AT THE WRONG POSITION. This is the flicker frame.',
      codeLine: 13,
    },
    {
      activePhase: 'effect',
      phaseStatus: { render: 'done', commit: 'done', paint: 'done', effect: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: true, tooltipFlicker: true },
      consoleAdd: 'measured: bottom > viewport, adjusting top to -100',
      note: 'useEffect fires (after paint). Measures the DOM, sees overflow, calls setTop(-100). This schedules another render.',
      codeLine: 5,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active', commit: 'done', paint: 'done', effect: 'done' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: true, tooltipFlicker: true },
      note: 'Re-render. JSX returned with corrected top.',
      codeLine: 3,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: false },
      note: 'Commit phase. DOM updated to top: -100. Not painted yet.',
      codeLine: 13,
    },
    {
      activePhase: 'paint',
      phaseStatus: { render: 'done', commit: 'done', paint: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: true },
      note: 'Paint 2. User now sees the correct position — but they already saw the wrong one. Net result: visible flicker.',
      codeLine: 13,
    },
    {
      activePhase: 'done',
      phaseStatus: { render: 'done', commit: 'done', paint: 'done' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: true },
      note: 'Done. 2 renders, 2 paints, 1 user-visible flicker. The fix is in the next scenario.',
      codeLine: 13,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — Fix (measure with useLayoutEffect)
// ---------------------------------------------------------------------------

const scenario4: EffectScenario = {
  id: 'flicker-fix-layout-effect',
  name: 'Fix (useLayoutEffect + measure)',
  blurb:
    'Same code, but with useLayoutEffect. The effect fires before paint, the re-render and second commit happen, and only then does the browser paint — the user only ever sees the corrected position.',
  screenMode: 'tooltip',
  phases: flickerLayoutEffectPhases,
  code: [
    `function Tooltip() {`,
    `  const ref = useRef(null)`,
    `  const [top, setTop] = useState(0)`,
    ``,
    `  useLayoutEffect(() => {`,
    `    const r = ref.current.getBoundingClientRect()`,
    `    if (window.innerHeight - r.bottom < 100) {`,
    `      setTop(-100)`,
    `    }`,
    `  }, [])`,
    ``,
    `  return <div ref={ref} style={{top}}>Tooltip</div>`,
    `}`,
  ],
  steps: [
    {
      activePhase: 'idle',
      phaseStatus: {},
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Same starting state. Tooltip about to mount with default top: 0.',
      codeLine: 13,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Render phase. JSX with top: 0.',
      codeLine: 3,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Commit phase. DOM mutated. Browser would paint next — but useLayoutEffect runs first.',
      codeLine: 13,
    },
    {
      activePhase: 'layout-effect',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'active' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      consoleAdd: 'measured (sync): adjusting top to -100',
      note: 'useLayoutEffect fires synchronously. Measures, sees overflow, calls setTop(-100). React processes the new state IMMEDIATELY, before paint.',
      codeLine: 5,
    },
    {
      activePhase: 'render',
      phaseStatus: { render: 'active', commit: 'done', 'layout-effect': 'done' },
      screen: { mode: 'tooltip', tooltipTop: 100, tooltipPainted: false },
      note: 'Synchronous re-render. JSX with corrected top.',
      codeLine: 3,
    },
    {
      activePhase: 'commit',
      phaseStatus: { render: 'done', commit: 'active', 'layout-effect': 'done' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: false },
      note: 'Commit phase again. DOM updated to top: -100. STILL no paint yet — the browser was blocked the whole time.',
      codeLine: 13,
    },
    {
      activePhase: 'paint',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'done', paint: 'active' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: true },
      note: 'Browser finally paints. User sees the CORRECT position on the first frame. No flicker.',
      codeLine: 13,
    },
    {
      activePhase: 'done',
      phaseStatus: { render: 'done', commit: 'done', 'layout-effect': 'done', paint: 'done' },
      screen: { mode: 'tooltip', tooltipTop: 30, tooltipPainted: true },
      note: 'Done. 1 paint, 0 flicker. The trade-off: the browser was blocked during the measure + re-render. For trivial work, fine. For heavy work, you\'re back to a frozen UI.',
      codeLine: 13,
    },
  ],
}

export const scenarios: EffectScenario[] = [scenario1, scenario2, scenario3, scenario4]
