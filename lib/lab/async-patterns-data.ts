// Async & Concurrency Patterns — visualizer data model.
//
// Each scenario is a horizontal timeline. Events live in "lanes" (rows).
// Lanes show different concerns: user input, function invocations, network
// calls in flight, completion / abort signals. The "now" marker sweeps left
// to right as the user steps through.

export type EventKind =
  | 'tick' // a momentary event (single tick mark)
  | 'invoke' // function actually ran
  | 'start' // a long operation starts
  | 'end' // a long operation ends
  | 'abort' // a long operation was cancelled
  | 'success' // a long operation finished successfully

export interface TimelineEvent {
  id: string
  laneId: string
  // For instant events (tick/invoke), set timeMs.
  // For ranged events (start..end/abort), set startMs + endMs.
  timeMs?: number
  startMs?: number
  endMs?: number
  label: string
  kind: EventKind
  tone?: 'accent' | 'ink' | 'muted' | 'success'
}

export interface TimelineLane {
  id: string
  label: string
  hint?: string
}

export interface AsyncPatternStep {
  // Events visible at this step (we accumulate as we step forward)
  events: TimelineEvent[]
  // Current "now" position on the timeline (in ms along the x-axis)
  nowMs: number
  // Side-panel variables / counters
  vars: Array<{ label: string; value: string }>
  note: string
  codeLine?: number
}

export interface AsyncPatternScenario {
  id: string
  name: string
  blurb: string
  totalDurationMs: number // x-axis total range
  lanes: TimelineLane[]
  // Optional gridlines (ms markers shown on x-axis)
  gridStepMs: number
  code: { js: string[]; go: string[] }
  steps: AsyncPatternStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Debounce
// ---------------------------------------------------------------------------
//
// User types fast, debounce(300ms) ensures the function only runs 300ms
// AFTER the last keystroke.

const debounce: AsyncPatternScenario = {
  id: 'debounce',
  name: 'Debounce',
  blurb:
    'Run a function only after the user stops triggering it for N ms. Classic use: search-as-you-type that fires the API call only when the user pauses.',
  totalDurationMs: 1200,
  gridStepMs: 200,
  lanes: [
    { id: 'input', label: 'User input', hint: 'each keystroke = 1 tick' },
    { id: 'timer', label: 'Pending timer', hint: 'resets on every input' },
    { id: 'invoke', label: 'Function ran', hint: 'fires once after the pause' },
  ],
  code: {
    js: [
      `function debounce<T extends (...a: any[]) => void>(fn: T, ms: number) {`,
      `  let id: ReturnType<typeof setTimeout> | undefined`,
      ``,
      `  return (...args: Parameters<T>) => {`,
      `    if (id) clearTimeout(id)`,
      `    id = setTimeout(() => fn(...args), ms)`,
      `  }`,
      `}`,
      ``,
      `// Usage`,
      `const search = debounce(fetchSearchResults, 300)`,
      `input.addEventListener('input', e => search(e.target.value))`,
    ],
    go: [
      `// Go: a Debouncer with sync.Mutex and time.AfterFunc`,
      `type Debouncer struct {`,
      `  mu    sync.Mutex`,
      `  timer *time.Timer`,
      `  delay time.Duration`,
      `}`,
      ``,
      `func (d *Debouncer) Trigger(fn func()) {`,
      `  d.mu.Lock()`,
      `  defer d.mu.Unlock()`,
      `  if d.timer != nil { d.timer.Stop() }`,
      `  d.timer = time.AfterFunc(d.delay, fn)`,
      `}`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []

    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    push(0, [], [{ label: 'pending timer', value: 'none' }], 'User starts typing.', 11)

    push(
      100,
      [{ id: 'k1', laneId: 'input', timeMs: 100, label: 'p', kind: 'tick', tone: 'ink' }],
      [{ label: 'pending timer', value: 'fires at 400ms' }],
      't=100ms: keystroke "p". Schedule a timer to fire at t=400ms (100+300).',
      6,
    )
    push(
      100,
      [{ id: 't1', laneId: 'timer', startMs: 100, endMs: 400, label: '→ fire at 400', kind: 'start', tone: 'muted' }],
      [{ label: 'pending timer', value: 'fires at 400ms' }],
      'Timer 1 is now counting down.',
      6,
    )

    push(
      200,
      [{ id: 'k2', laneId: 'input', timeMs: 200, label: 'pw', kind: 'tick', tone: 'ink' }],
      [{ label: 'pending timer', value: 'cancelled' }],
      't=200ms: keystroke "w". Cancel the previous timer (it never fires).',
      5,
    )
    push(
      200,
      [
        { id: 't1-abort', laneId: 'timer', startMs: 100, endMs: 200, label: '✗ cancelled', kind: 'abort', tone: 'muted' },
        { id: 't2', laneId: 'timer', startMs: 200, endMs: 500, label: '→ fire at 500', kind: 'start', tone: 'muted' },
      ],
      [{ label: 'pending timer', value: 'fires at 500ms' }],
      'Schedule a fresh timer to fire at t=500ms.',
      6,
    )

    push(
      350,
      [{ id: 'k3', laneId: 'input', timeMs: 350, label: 'pwd', kind: 'tick', tone: 'ink' }],
      [{ label: 'pending timer', value: 'fires at 650ms' }],
      't=350ms: keystroke "d". Cancel + reschedule again. The user is still typing.',
      5,
    )
    push(
      350,
      [
        { id: 't2-abort', laneId: 'timer', startMs: 200, endMs: 350, label: '✗ cancelled', kind: 'abort', tone: 'muted' },
        { id: 't3', laneId: 'timer', startMs: 350, endMs: 650, label: '→ fire at 650', kind: 'start', tone: 'muted' },
      ],
      [{ label: 'pending timer', value: 'fires at 650ms' }],
      'New timer counts from 350ms.',
      6,
    )

    push(
      650,
      [
        {
          id: 't3-done',
          laneId: 'timer',
          startMs: 350,
          endMs: 650,
          label: '✓ fired',
          kind: 'success',
          tone: 'accent',
        },
        { id: 'inv', laneId: 'invoke', timeMs: 650, label: 'fetchSearchResults("pwd")', kind: 'invoke', tone: 'accent' },
      ],
      [
        { label: 'pending timer', value: 'none' },
        { label: 'invocations', value: '1' },
      ],
      't=650ms: 300ms have passed without a new keystroke. The timer fires. Function runs ONCE — with the latest value "pwd".',
      6,
    )

    push(
      1000,
      [],
      [{ label: 'invocations', value: '1 total' }],
      'Done. Without debounce: 3 calls (one per keystroke). With debounce: 1 call. 67% fewer requests, same UX.',
      6,
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — Throttle
// ---------------------------------------------------------------------------

const throttle: AsyncPatternScenario = {
  id: 'throttle',
  name: 'Throttle',
  blurb:
    'Allow a function to run AT MOST once every N ms, no matter how fast it\'s triggered. Use for scroll handlers, mouse-move tracking, infinite scroll — anywhere "rate-limit, don\'t collapse" matters.',
  totalDurationMs: 1200,
  gridStepMs: 200,
  lanes: [
    { id: 'input', label: 'Triggers', hint: 'rapid-fire events' },
    { id: 'gate', label: 'Throttle gate', hint: 'open / cooling down' },
    { id: 'invoke', label: 'Function ran', hint: 'at most every 300ms' },
  ],
  code: {
    js: [
      `function throttle<T extends (...a: any[]) => void>(fn: T, ms: number) {`,
      `  let lastCall = 0`,
      ``,
      `  return (...args: Parameters<T>) => {`,
      `    const now = Date.now()`,
      `    if (now - lastCall < ms) return`,
      `    lastCall = now`,
      `    fn(...args)`,
      `  }`,
      `}`,
      ``,
      `// Usage`,
      `window.addEventListener('scroll', throttle(onScroll, 300))`,
    ],
    go: [
      `// Go: a Throttler with time.Now() bookkeeping`,
      `type Throttler struct {`,
      `  mu       sync.Mutex`,
      `  lastCall time.Time`,
      `  delay    time.Duration`,
      `}`,
      ``,
      `func (t *Throttler) Try(fn func()) bool {`,
      `  t.mu.Lock()`,
      `  defer t.mu.Unlock()`,
      `  if time.Since(t.lastCall) < t.delay { return false }`,
      `  t.lastCall = time.Now()`,
      `  fn()`,
      `  return true`,
      `}`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []
    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    push(0, [], [{ label: 'last call', value: 'never' }], 'User scrolls. onScroll fires rapidly.', 11)

    push(
      100,
      [
        { id: 'e1', laneId: 'input', timeMs: 100, label: 'scroll', kind: 'tick', tone: 'ink' },
        { id: 'inv1', laneId: 'invoke', timeMs: 100, label: 'onScroll()', kind: 'invoke', tone: 'accent' },
        { id: 'g1', laneId: 'gate', startMs: 100, endMs: 400, label: 'cooling 300ms', kind: 'start', tone: 'muted' },
      ],
      [
        { label: 'last call', value: '100ms' },
        { label: 'invocations', value: '1' },
      ],
      't=100ms: first scroll. Gate is OPEN — function runs. Gate closes for 300ms.',
      7,
    )

    push(
      200,
      [
        { id: 'e2', laneId: 'input', timeMs: 200, label: 'scroll', kind: 'tick', tone: 'ink' },
      ],
      [
        { label: 'last call', value: '100ms' },
        { label: 'invocations', value: '1' },
      ],
      't=200ms: scroll. Gate still closed (only 100ms since last call). Function SKIPPED.',
      5,
    )

    push(
      300,
      [{ id: 'e3', laneId: 'input', timeMs: 300, label: 'scroll', kind: 'tick', tone: 'ink' }],
      [
        { label: 'last call', value: '100ms' },
        { label: 'invocations', value: '1' },
      ],
      't=300ms: scroll. Still in cooldown. SKIPPED.',
      5,
    )

    push(
      450,
      [
        { id: 'e4', laneId: 'input', timeMs: 450, label: 'scroll', kind: 'tick', tone: 'ink' },
        { id: 'inv2', laneId: 'invoke', timeMs: 450, label: 'onScroll()', kind: 'invoke', tone: 'accent' },
        { id: 'g2', laneId: 'gate', startMs: 450, endMs: 750, label: 'cooling 300ms', kind: 'start', tone: 'muted' },
      ],
      [
        { label: 'last call', value: '450ms' },
        { label: 'invocations', value: '2' },
      ],
      't=450ms: scroll. Gate is open (450 - 100 = 350ms ≥ 300ms). Function RUNS. New cooldown starts.',
      7,
    )

    push(
      550,
      [{ id: 'e5', laneId: 'input', timeMs: 550, label: 'scroll', kind: 'tick', tone: 'ink' }],
      [
        { label: 'last call', value: '450ms' },
        { label: 'invocations', value: '2' },
      ],
      't=550ms: scroll. Cooling down. SKIPPED.',
      5,
    )
    push(
      700,
      [{ id: 'e6', laneId: 'input', timeMs: 700, label: 'scroll', kind: 'tick', tone: 'ink' }],
      [
        { label: 'last call', value: '450ms' },
        { label: 'invocations', value: '2' },
      ],
      't=700ms: scroll. Still cooling (700 - 450 = 250 < 300). SKIPPED.',
      5,
    )
    push(
      850,
      [
        { id: 'e7', laneId: 'input', timeMs: 850, label: 'scroll', kind: 'tick', tone: 'ink' },
        { id: 'inv3', laneId: 'invoke', timeMs: 850, label: 'onScroll()', kind: 'invoke', tone: 'accent' },
      ],
      [
        { label: 'last call', value: '850ms' },
        { label: 'invocations', value: '3' },
      ],
      't=850ms: scroll. 400ms since last call — gate open. Function RUNS.',
      7,
    )

    push(
      1100,
      [],
      [{ label: 'invocations', value: '3 (of 7 triggers)' }],
      'Done. 7 raw triggers → 3 actual calls. Throttle enforces a "max once per 300ms" rule.',
      7,
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — Promise.all
// ---------------------------------------------------------------------------

const all: AsyncPatternScenario = {
  id: 'promise-all',
  name: 'Promise.all',
  blurb:
    'Run several async operations in parallel and wait for all to finish. Resolves with an array of all results. If ANY rejects, the whole thing short-circuits with that error.',
  totalDurationMs: 1500,
  gridStepMs: 250,
  lanes: [
    { id: 'p1', label: 'fetch /a' },
    { id: 'p2', label: 'fetch /b' },
    { id: 'p3', label: 'fetch /c' },
    { id: 'await', label: 'Promise.all', hint: 'resolves when last one settles' },
  ],
  code: {
    js: [
      `const [a, b, c] = await Promise.all([`,
      `  fetch('/a'),`,
      `  fetch('/b'),`,
      `  fetch('/c'),`,
      `])`,
      ``,
      `// All three run in parallel.`,
      `// Total time ≈ slowest, not sum.`,
    ],
    go: [
      `// Go: golang.org/x/sync/errgroup`,
      `g, ctx := errgroup.WithContext(ctx)`,
      ``,
      `var a, b, c Result`,
      `g.Go(func() error { return fetch(ctx, "/a", &a) })`,
      `g.Go(func() error { return fetch(ctx, "/b", &b) })`,
      `g.Go(func() error { return fetch(ctx, "/c", &c) })`,
      ``,
      `if err := g.Wait(); err != nil {`,
      `  return err  // First error cancels all others.`,
      `}`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []
    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    push(
      0,
      [
        { id: 'p1', laneId: 'p1', startMs: 0, endMs: 600, label: 'fetch /a', kind: 'start', tone: 'muted' },
        { id: 'p2', laneId: 'p2', startMs: 0, endMs: 400, label: 'fetch /b', kind: 'start', tone: 'muted' },
        { id: 'p3', laneId: 'p3', startMs: 0, endMs: 900, label: 'fetch /c', kind: 'start', tone: 'muted' },
        { id: 'wait', laneId: 'await', startMs: 0, endMs: 900, label: 'awaiting all', kind: 'start', tone: 'muted' },
      ],
      [
        { label: 'in flight', value: '3' },
        { label: 'resolved', value: '0' },
      ],
      't=0: Promise.all kicks off all three fetches simultaneously. Browser fires 3 network requests in parallel.',
      1,
    )

    push(
      400,
      [
        { id: 'p2d', laneId: 'p2', startMs: 0, endMs: 400, label: '✓ /b done', kind: 'success', tone: 'accent' },
      ],
      [
        { label: 'in flight', value: '2' },
        { label: 'resolved', value: '1 (/b)' },
      ],
      't=400ms: /b resolves first (fastest). Promise.all is still pending — has to wait for /a and /c.',
      4,
    )

    push(
      600,
      [
        { id: 'p1d', laneId: 'p1', startMs: 0, endMs: 600, label: '✓ /a done', kind: 'success', tone: 'accent' },
      ],
      [
        { label: 'in flight', value: '1' },
        { label: 'resolved', value: '2 (/b, /a)' },
      ],
      't=600ms: /a resolves. Still waiting for /c.',
      4,
    )

    push(
      900,
      [
        { id: 'p3d', laneId: 'p3', startMs: 0, endMs: 900, label: '✓ /c done', kind: 'success', tone: 'accent' },
        { id: 'waitd', laneId: 'await', startMs: 0, endMs: 900, label: '✓ all resolved', kind: 'success', tone: 'accent' },
      ],
      [
        { label: 'in flight', value: '0' },
        { label: 'resolved', value: '3' },
        { label: 'total time', value: '900ms (= slowest)' },
      ],
      't=900ms: /c resolves. Promise.all settles with [a, b, c]. Total wall time = 900ms (the slowest). Serial would have been 600+400+900 = 1900ms.',
      1,
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 4 — Promise.race
// ---------------------------------------------------------------------------

const race: AsyncPatternScenario = {
  id: 'promise-race',
  name: 'Promise.race',
  blurb:
    'Resolve as soon as the FIRST promise settles — whether with success or failure. Common use: race a fetch against a timeout to enforce a hard SLA.',
  totalDurationMs: 1500,
  gridStepMs: 250,
  lanes: [
    { id: 'fetch', label: 'fetch /slow', hint: 'real work' },
    { id: 'timeout', label: 'timeout (500ms)', hint: 'fallback' },
    { id: 'await', label: 'Promise.race', hint: 'wins = first to settle' },
  ],
  code: {
    js: [
      `function fetchWithTimeout(url: string, ms: number) {`,
      `  return Promise.race([`,
      `    fetch(url),`,
      `    new Promise((_, reject) =>`,
      `      setTimeout(() => reject(new Error('timeout')), ms)`,
      `    ),`,
      `  ])`,
      `}`,
      ``,
      `try {`,
      `  const data = await fetchWithTimeout('/slow', 500)`,
      `} catch (e) {`,
      `  console.error(e.message)  // 'timeout'`,
      `}`,
    ],
    go: [
      `// Go: context.WithTimeout — the canonical pattern`,
      `ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)`,
      `defer cancel()`,
      ``,
      `req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)`,
      `resp, err := http.DefaultClient.Do(req)`,
      `if err != nil {`,
      `  // ctx.Err() == context.DeadlineExceeded → timed out`,
      `  return err`,
      `}`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []
    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    push(
      0,
      [
        { id: 'f', laneId: 'fetch', startMs: 0, endMs: 1200, label: 'fetch /slow', kind: 'start', tone: 'muted' },
        { id: 't', laneId: 'timeout', startMs: 0, endMs: 500, label: 'timeout 500ms', kind: 'start', tone: 'muted' },
        { id: 'w', laneId: 'await', startMs: 0, endMs: 500, label: 'racing', kind: 'start', tone: 'muted' },
      ],
      [
        { label: 'fetch eta', value: '1200ms' },
        { label: 'timeout', value: '500ms' },
        { label: 'winner', value: '—' },
      ],
      't=0: Race starts. fetch is slow (1200ms). Timeout is set to 500ms. Whichever settles first wins.',
      2,
    )

    push(
      300,
      [],
      [{ label: 'winner', value: 'still racing' }],
      't=300ms: Both still in flight. The fetch hasn\'t replied; the timer is still counting.',
      2,
    )

    push(
      500,
      [
        { id: 'td', laneId: 'timeout', startMs: 0, endMs: 500, label: '✗ rejected: timeout', kind: 'abort', tone: 'accent' },
        { id: 'wd', laneId: 'await', startMs: 0, endMs: 500, label: '✗ caught: timeout', kind: 'abort', tone: 'accent' },
      ],
      [
        { label: 'winner', value: 'timeout' },
        { label: 'caught', value: 'Error("timeout")' },
      ],
      't=500ms: Timer fires first. Promise.race rejects immediately with "timeout". The fetch is STILL RUNNING in the background (Promise.race doesn\'t cancel losers — use AbortController for that).',
      12,
    )

    push(
      1200,
      [
        { id: 'fd', laneId: 'fetch', startMs: 0, endMs: 1200, label: 'fetch eventually replies (ignored)', kind: 'success', tone: 'muted' },
      ],
      [
        { label: 'winner', value: 'timeout' },
        { label: 'wasted bandwidth', value: 'yes' },
      ],
      't=1200ms: The fetch finally replies. But nobody is awaiting it anymore. The response is silently dropped (and the request used network bandwidth for nothing). This is why the AbortController scenario exists.',
      1,
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 5 — Promise Pool (concurrency limiter)
// ---------------------------------------------------------------------------

const pool: AsyncPatternScenario = {
  id: 'promise-pool',
  name: 'Promise pool',
  blurb:
    'Run N async tasks but with at most K running at the same time. Process 100 image uploads K=3 at a time — bounded memory, bounded API pressure, full pipeline always busy.',
  totalDurationMs: 1500,
  gridStepMs: 250,
  lanes: [
    { id: 'slot1', label: 'slot 1' },
    { id: 'slot2', label: 'slot 2' },
    { id: 'slot3', label: 'slot 3' },
    { id: 'queue', label: 'Waiting', hint: 'tasks pending start' },
  ],
  code: {
    js: [
      `async function pool<T, R>(`,
      `  items: T[],`,
      `  worker: (t: T) => Promise<R>,`,
      `  limit: number,`,
      `): Promise<R[]> {`,
      `  const out: R[] = []`,
      `  let i = 0`,
      ``,
      `  async function run() {`,
      `    while (i < items.length) {`,
      `      const idx = i++`,
      `      out[idx] = await worker(items[idx])`,
      `    }`,
      `  }`,
      ``,
      `  await Promise.all(`,
      `    Array.from({ length: limit }, run)`,
      `  )`,
      `  return out`,
      `}`,
    ],
    go: [
      `// Go: errgroup with SetLimit (Go 1.20+)`,
      `g := new(errgroup.Group)`,
      `g.SetLimit(3)  // pool size`,
      ``,
      `for _, item := range items {`,
      `  item := item  // capture`,
      `  g.Go(func() error {`,
      `    return worker(item)`,
      `  })`,
      `}`,
      ``,
      `if err := g.Wait(); err != nil { return err }`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []
    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    // 6 tasks. Pool size 3. Each task ~400ms.
    push(
      0,
      [
        { id: 't1', laneId: 'slot1', startMs: 0, endMs: 400, label: 'task 1', kind: 'start', tone: 'muted' },
        { id: 't2', laneId: 'slot2', startMs: 0, endMs: 400, label: 'task 2', kind: 'start', tone: 'muted' },
        { id: 't3', laneId: 'slot3', startMs: 0, endMs: 400, label: 'task 3', kind: 'start', tone: 'muted' },
        { id: 'q1', laneId: 'queue', timeMs: 0, label: '#4', kind: 'tick', tone: 'muted' },
        { id: 'q2', laneId: 'queue', timeMs: 0, label: '#5', kind: 'tick', tone: 'muted' },
        { id: 'q3', laneId: 'queue', timeMs: 0, label: '#6', kind: 'tick', tone: 'muted' },
      ],
      [
        { label: 'pool size', value: '3' },
        { label: 'running', value: '3' },
        { label: 'queued', value: '3' },
        { label: 'done', value: '0' },
      ],
      't=0: 6 tasks total, pool size 3. Tasks 1-3 start immediately. Tasks 4-6 wait.',
      9,
    )

    push(
      400,
      [
        { id: 't1d', laneId: 'slot1', startMs: 0, endMs: 400, label: '✓ task 1', kind: 'success', tone: 'accent' },
        { id: 't2d', laneId: 'slot2', startMs: 0, endMs: 400, label: '✓ task 2', kind: 'success', tone: 'accent' },
        { id: 't3d', laneId: 'slot3', startMs: 0, endMs: 400, label: '✓ task 3', kind: 'success', tone: 'accent' },
        { id: 't4', laneId: 'slot1', startMs: 400, endMs: 800, label: 'task 4', kind: 'start', tone: 'muted' },
        { id: 't5', laneId: 'slot2', startMs: 400, endMs: 800, label: 'task 5', kind: 'start', tone: 'muted' },
        { id: 't6', laneId: 'slot3', startMs: 400, endMs: 800, label: 'task 6', kind: 'start', tone: 'muted' },
      ],
      [
        { label: 'pool size', value: '3' },
        { label: 'running', value: '3' },
        { label: 'queued', value: '0' },
        { label: 'done', value: '3' },
      ],
      't=400ms: First batch finishes. As each slot frees, it pulls the next queued task. Tasks 4-6 start immediately.',
      11,
    )

    push(
      800,
      [
        { id: 't4d', laneId: 'slot1', startMs: 400, endMs: 800, label: '✓ task 4', kind: 'success', tone: 'accent' },
        { id: 't5d', laneId: 'slot2', startMs: 400, endMs: 800, label: '✓ task 5', kind: 'success', tone: 'accent' },
        { id: 't6d', laneId: 'slot3', startMs: 400, endMs: 800, label: '✓ task 6', kind: 'success', tone: 'accent' },
      ],
      [
        { label: 'running', value: '0' },
        { label: 'done', value: '6' },
        { label: 'total time', value: '800ms' },
      ],
      't=800ms: All 6 tasks done. With pool=3: 800ms total. Without (serial): 2400ms. Without (unlimited Promise.all): 400ms but with possible OOM / rate-limit issues.',
      16,
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 6 — AbortController (cancel a stale fetch)
// ---------------------------------------------------------------------------

const abort: AsyncPatternScenario = {
  id: 'abort-controller',
  name: 'AbortController',
  blurb:
    'User types in a search box → each keystroke fires a fetch. Slow networks return responses in the wrong order. AbortController cancels the previous fetch when a new one starts, so only the latest result is rendered.',
  totalDurationMs: 1500,
  gridStepMs: 250,
  lanes: [
    { id: 'input', label: 'User input' },
    { id: 'req1', label: 'fetch "ja"' },
    { id: 'req2', label: 'fetch "jav"' },
    { id: 'render', label: 'Render', hint: 'only newest response' },
  ],
  code: {
    js: [
      `let controller: AbortController | null = null`,
      ``,
      `async function search(query: string) {`,
      `  controller?.abort()  // cancel any in-flight`,
      `  controller = new AbortController()`,
      ``,
      `  try {`,
      `    const res = await fetch(\`/api?q=\${query}\`, {`,
      `      signal: controller.signal,`,
      `    })`,
      `    setResults(await res.json())`,
      `  } catch (e: any) {`,
      `    if (e.name !== 'AbortError') throw e`,
      `  }`,
      `}`,
    ],
    go: [
      `// Go: context.WithCancel + cancel on new request`,
      `var cancelPrev context.CancelFunc`,
      ``,
      `func search(query string) {`,
      `  if cancelPrev != nil { cancelPrev() }`,
      `  ctx, cancel := context.WithCancel(context.Background())`,
      `  cancelPrev = cancel`,
      ``,
      `  go func() {`,
      `    req, _ := http.NewRequestWithContext(ctx, "GET", "/api?q="+query, nil)`,
      `    resp, err := http.DefaultClient.Do(req)`,
      `    if errors.Is(err, context.Canceled) { return }`,
      `    render(resp)`,
      `  }()`,
      `}`,
    ],
  },
  steps: (() => {
    const events: TimelineEvent[] = []
    const out: AsyncPatternStep[] = []
    const push = (
      nowMs: number,
      addEvents: TimelineEvent[],
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
    ) => {
      events.push(...addEvents)
      out.push({ events: [...events], nowMs, vars, note, codeLine })
    }

    push(
      0,
      [],
      [{ label: 'controller', value: 'null' }],
      'User types in the search box.',
      3,
    )

    push(
      100,
      [
        { id: 'k1', laneId: 'input', timeMs: 100, label: 'ja', kind: 'tick', tone: 'ink' },
        { id: 'r1', laneId: 'req1', startMs: 100, endMs: 900, label: 'fetch /api?q=ja', kind: 'start', tone: 'muted' },
      ],
      [{ label: 'controller', value: 'C1 (for "ja")' }],
      't=100ms: type "ja". Create controller C1. Fire fetch with C1.signal. Server is slow on this one (will take 800ms).',
      8,
    )

    push(
      300,
      [
        { id: 'k2', laneId: 'input', timeMs: 300, label: 'jav', kind: 'tick', tone: 'ink' },
        {
          id: 'r1-abort',
          laneId: 'req1',
          startMs: 100,
          endMs: 300,
          label: '✗ aborted',
          kind: 'abort',
          tone: 'accent',
        },
        { id: 'r2', laneId: 'req2', startMs: 300, endMs: 600, label: 'fetch /api?q=jav', kind: 'start', tone: 'muted' },
      ],
      [{ label: 'controller', value: 'C2 (for "jav")' }],
      't=300ms: type "v". The previous controller C1 is aborted → /api?q=ja request is cancelled mid-flight. New controller C2 fires /api?q=jav.',
      4,
    )

    push(
      600,
      [
        { id: 'r2d', laneId: 'req2', startMs: 300, endMs: 600, label: '✓ jav done', kind: 'success', tone: 'accent' },
        { id: 'render', laneId: 'render', timeMs: 600, label: 'render "jav" results', kind: 'invoke', tone: 'accent' },
      ],
      [{ label: 'controller', value: 'C2 (done)' }],
      't=600ms: /api?q=jav resolves. Results render. The earlier "ja" request never finished — and crucially, never overwrote the newer "jav" results.',
      11,
    )

    push(
      900,
      [],
      [{ label: 'controller', value: 'C2 (done)' }],
      'Done. Without AbortController, the "ja" response (had it arrived AFTER "jav") would have overwritten the correct results. This is the canonical async race-condition fix.',
      11,
    )

    return out
  })(),
}

export const scenarios: AsyncPatternScenario[] = [debounce, throttle, all, race, pool, abort]
