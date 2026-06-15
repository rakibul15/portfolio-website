// Event loop visualizer — data model
//
// Each example is a list of "steps". A step is a snapshot of the runtime
// after one VM tick of progress: the call stack, microtask queue,
// macrotask queue, the current code line being executed (or about to be),
// and any console output produced so far.
//
// Stepping through the array animates the event loop.

export interface ELItem {
  id: string
  label: string
  tone?: 'default' | 'callback' | 'task' | 'log'
}

export interface ELStep {
  line: number // 1-indexed line of code (0 = none / before start)
  stack: ELItem[]
  micro: ELItem[]
  macro: ELItem[]
  output: string[] // accumulated console output
  note: string // short description shown in the controls
}

export interface ELExample {
  id: string
  name: string
  blurb: string
  code: string[]
  steps: ELStep[]
}

// Helper to compose steps less verbosely
const s = (
  line: number,
  stack: ELItem[],
  micro: ELItem[],
  macro: ELItem[],
  output: string[],
  note: string,
): ELStep => ({ line, stack, micro, macro, output, note })

// =============================================================================
// Example 1: classic Promise vs setTimeout ordering
// =============================================================================

const example1: ELExample = {
  id: 'promise-vs-settimeout',
  name: 'Promise vs setTimeout',
  blurb:
    'Microtasks (Promise callbacks) run before macrotasks (setTimeout callbacks), even when the timeout is 0.',
  code: [
    `console.log('1')`,
    `setTimeout(() => console.log('2'), 0)`,
    `Promise.resolve().then(() => console.log('3'))`,
    `console.log('4')`,
  ],
  steps: [
    s(0, [], [], [], [], 'Ready. Press Play or Step to begin.'),
    s(1, [{ id: 'a', label: `console.log('1')`, tone: 'log' }], [], [], [], 'Push console.log(\'1\') onto the call stack.'),
    s(1, [], [], [], ['1'], `Stack pops. '1' is printed to the console.`),
    s(2, [{ id: 'b', label: 'setTimeout(...)', tone: 'default' }], [], [], ['1'], 'Push setTimeout onto the stack. It schedules its callback.'),
    s(2, [], [], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1'], 'setTimeout returns. Its callback is queued as a macrotask.'),
    s(3, [{ id: 'c', label: 'Promise.resolve().then(...)', tone: 'default' }], [], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1'], 'Push Promise.resolve().then onto the stack. It schedules the .then callback.'),
    s(3, [], [{ id: 'cb-promise', label: `() => log('3')`, tone: 'callback' }], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1'], 'then returns. Its callback is queued as a microtask.'),
    s(4, [{ id: 'd', label: `console.log('4')`, tone: 'log' }], [{ id: 'cb-promise', label: `() => log('3')`, tone: 'callback' }], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1'], 'Push console.log(\'4\') onto the stack.'),
    s(4, [], [{ id: 'cb-promise', label: `() => log('3')`, tone: 'callback' }], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1', '4'], `Stack pops. '4' is printed. Synchronous code is done.`),
    s(0, [{ id: 'cb-promise', label: `() => log('3')`, tone: 'callback' }], [], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1', '4'], 'Stack empty → drain microtask queue. Promise callback runs first.'),
    s(0, [], [], [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], ['1', '4', '3'], `'3' is printed. Microtask queue drained.`),
    s(0, [{ id: 'cb-timeout', label: `() => log('2')`, tone: 'task' }], [], [], ['1', '4', '3'], 'Now process one macrotask. Pull the timeout callback.'),
    s(0, [], [], [], ['1', '4', '3', '2'], `'2' is printed. Macrotask done.`),
    s(0, [], [], [], ['1', '4', '3', '2'], 'Done. Output order: 1, 4, 3, 2.'),
  ],
}

// =============================================================================
// Example 2: async/await sugar around microtasks
// =============================================================================

const example2: ELExample = {
  id: 'async-await',
  name: 'async/await is microtasks',
  blurb:
    'await is just .then in disguise. The code after await runs as a microtask, even if the awaited value resolves synchronously.',
  code: [
    `async function run() {`,
    `  console.log('A')`,
    `  await Promise.resolve()`,
    `  console.log('B')`,
    `}`,
    `run()`,
    `console.log('C')`,
  ],
  steps: [
    s(0, [], [], [], [], 'Ready. Press Play or Step to begin.'),
    s(6, [{ id: 'r', label: 'run()', tone: 'default' }], [], [], [], 'Call run(). Push its frame onto the stack.'),
    s(2, [{ id: 'r', label: 'run()', tone: 'default' }, { id: 'a', label: `console.log('A')`, tone: 'log' }], [], [], [], 'Inside run, push console.log(\'A\').'),
    s(2, [{ id: 'r', label: 'run()', tone: 'default' }], [], [], ['A'], `'A' is printed.`),
    s(3, [{ id: 'r', label: 'run()', tone: 'default' }], [], [], ['A'], 'Hit await. Pause run, schedule the rest as a microtask.'),
    s(3, [], [{ id: 'rest', label: 'rest of run() → log(B)', tone: 'callback' }], [], ['A'], 'run() pops. Rest of the function is queued as a microtask.'),
    s(7, [{ id: 'c', label: `console.log('C')`, tone: 'log' }], [{ id: 'rest', label: 'rest of run() → log(B)', tone: 'callback' }], [], ['A'], 'Push console.log(\'C\') onto the stack.'),
    s(7, [], [{ id: 'rest', label: 'rest of run() → log(B)', tone: 'callback' }], [], ['A', 'C'], `'C' is printed. Synchronous code done.`),
    s(0, [{ id: 'rest', label: 'rest of run() → log(B)', tone: 'callback' }], [], [], ['A', 'C'], 'Stack empty → drain microtask queue. Resume run().'),
    s(4, [{ id: 'rest', label: 'rest of run()', tone: 'callback' }, { id: 'b', label: `console.log('B')`, tone: 'log' }], [], [], ['A', 'C'], 'Push console.log(\'B\') onto the stack.'),
    s(4, [], [], [], ['A', 'C', 'B'], `'B' is printed.`),
    s(0, [], [], [], ['A', 'C', 'B'], 'Done. Output order: A, C, B.'),
  ],
}

// =============================================================================
// Example 3: nested promises continue to drain
// =============================================================================

const example3: ELExample = {
  id: 'nested-microtasks',
  name: 'Microtasks drain fully',
  blurb:
    'New microtasks added while draining are still processed in the same tick. Only after the queue is fully empty does the next macrotask run.',
  code: [
    `setTimeout(() => console.log('timeout'), 0)`,
    `Promise.resolve()`,
    `  .then(() => console.log('p1'))`,
    `  .then(() => console.log('p2'))`,
    `  .then(() => console.log('p3'))`,
  ],
  steps: [
    s(0, [], [], [], [], 'Ready. Press Play or Step to begin.'),
    s(1, [{ id: 's1', label: 'setTimeout(...)', tone: 'default' }], [], [], [], 'Schedule timeout callback.'),
    s(1, [], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], [], 'Timeout callback queued as macrotask.'),
    s(2, [{ id: 's2', label: 'Promise.resolve().then(p1)', tone: 'default' }], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], [], 'Schedule first .then.'),
    s(2, [], [{ id: 'p1', label: `() => log('p1')`, tone: 'callback' }], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], [], 'p1 callback queued as microtask.'),
    s(0, [{ id: 'p1', label: `() => log('p1')`, tone: 'callback' }], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], [], 'Sync done → drain microtasks. Run p1.'),
    s(0, [], [{ id: 'p2', label: `() => log('p2')`, tone: 'callback' }], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], ['p1'], `'p1' printed. p2 callback queued mid-drain.`),
    s(0, [{ id: 'p2', label: `() => log('p2')`, tone: 'callback' }], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], ['p1'], 'Continue draining. Run p2.'),
    s(0, [], [{ id: 'p3', label: `() => log('p3')`, tone: 'callback' }], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], ['p1', 'p2'], `'p2' printed. p3 callback queued.`),
    s(0, [{ id: 'p3', label: `() => log('p3')`, tone: 'callback' }], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], ['p1', 'p2'], 'Run p3.'),
    s(0, [], [], [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], ['p1', 'p2', 'p3'], `'p3' printed. Microtask queue is now empty.`),
    s(0, [{ id: 't', label: `() => log('timeout')`, tone: 'task' }], [], [], ['p1', 'p2', 'p3'], 'Now process one macrotask. Run timeout callback.'),
    s(0, [], [], [], ['p1', 'p2', 'p3', 'timeout'], `'timeout' printed.`),
    s(0, [], [], [], ['p1', 'p2', 'p3', 'timeout'], 'Done. Order: p1, p2, p3, timeout.'),
  ],
}

export const examples: ELExample[] = [example1, example2, example3]
