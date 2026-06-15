// JS Utility Implementations visualizer — the 4 most-asked FE coding
// interview problems, animated step-by-step.

export type CellState = 'normal' | 'new' | 'updated' | 'evicted' | 'hit' | 'miss'

export interface CacheEntry {
  key: string
  value: string
  state?: CellState
}

export interface SubscriberRow {
  event: string
  handlers: string[]
  state?: CellState
}

export interface TreeBlob {
  // Pretty-printed representation, line-by-line.
  lines: string[]
  // Optional line that is "currently being copied / processed".
  activeLine?: number
}

export interface JSUtilStep {
  // Optional state panels — only the ones relevant to the scenario are populated.
  cache?: CacheEntry[]
  cacheLimit?: number
  subscribers?: SubscriberRow[]
  inputTree?: TreeBlob
  outputTree?: TreeBlob
  // Variables snapshot
  vars: Array<{ label: string; value: string }>
  output: string[]
  codeLine: number
  note: string
}

export interface JSUtilScenario {
  id: string
  name: string
  flavor: 'deepClone' | 'memoize' | 'lru' | 'eventEmitter'
  blurb: string
  complexity: { time: string; space: string }
  code: string[]
  steps: JSUtilStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — deepClone
// ---------------------------------------------------------------------------

const deepClone: JSUtilScenario = {
  id: 'deep-clone',
  name: 'deepClone',
  flavor: 'deepClone',
  blurb:
    "Clone a nested object. Recurse into arrays and plain objects, handle Date / Map / Set specially, and use a WeakMap to break circular references. JSON.parse(JSON.stringify(x)) doesn't handle any of this — it's the wrong answer in interviews.",
  complexity: { time: 'O(n) nodes', space: 'O(n)' },
  code: [
    `function deepClone<T>(value: T, seen = new WeakMap()): T {`,
    `  if (value === null || typeof value !== 'object') return value`,
    `  if (seen.has(value as object)) return seen.get(value as object) as T`,
    ``,
    `  if (value instanceof Date)  return new Date(value) as T`,
    `  if (value instanceof Map) {`,
    `    const m = new Map()`,
    `    seen.set(value, m)`,
    `    for (const [k, v] of value) m.set(deepClone(k), deepClone(v, seen))`,
    `    return m as T`,
    `  }`,
    `  if (Array.isArray(value)) {`,
    `    const a: unknown[] = []`,
    `    seen.set(value, a)`,
    `    for (const item of value) a.push(deepClone(item, seen))`,
    `    return a as T`,
    `  }`,
    `  const o: Record<string, unknown> = {}`,
    `  seen.set(value as object, o)`,
    `  for (const [k, v] of Object.entries(value as object)) {`,
    `    o[k] = deepClone(v, seen)`,
    `  }`,
    `  return o as T`,
    `}`,
  ],
  steps: [
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
      },
      outputTree: { lines: ['(empty)'] },
      vars: [{ label: 'seen', value: 'WeakMap {}' }],
      output: [],
      codeLine: 1,
      note: 'Input: a nested object with a string, an array, and a nested object.',
    },
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
        activeLine: 0,
      },
      outputTree: { lines: ['{}'] },
      vars: [
        { label: 'value', value: '{name, tags, prefs}' },
        { label: 'seen', value: 'WeakMap {root → o}' },
      ],
      output: [],
      codeLine: 16,
      note: 'Object branch. Create empty `o`, register in `seen` (so circular refs would resolve here).',
    },
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
        activeLine: 1,
      },
      outputTree: {
        lines: ['{', '  name: "Alice"', '}'],
      },
      vars: [{ label: 'key', value: '"name"' }, { label: 'value', value: '"Alice" (primitive)' }],
      output: [],
      codeLine: 2,
      note: 'Iterate: key="name", value="Alice". Primitive → return as-is. o.name = "Alice".',
    },
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
        activeLine: 2,
      },
      outputTree: {
        lines: ['{', '  name: "Alice",', '  tags: ["admin", "ops"]', '}'],
      },
      vars: [{ label: 'key', value: '"tags"' }, { label: 'value', value: 'Array(2)' }],
      output: [],
      codeLine: 11,
      note: 'key="tags", value=["admin", "ops"]. Array branch — recurse, both items are strings (primitives), no further recursion.',
    },
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
        activeLine: 3,
      },
      outputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
      },
      vars: [{ label: 'key', value: '"prefs"' }, { label: 'value', value: '{theme: "dark"}' }],
      output: [],
      codeLine: 16,
      note: 'key="prefs", value is another object. Recurse. Returns a fresh object with theme: "dark".',
    },
    {
      inputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
      },
      outputTree: {
        lines: [
          '{',
          '  name: "Alice",',
          '  tags: ["admin", "ops"],',
          '  prefs: { theme: "dark" }',
          '}',
        ],
      },
      vars: [{ label: 'result', value: 'fresh clone' }, { label: 'shared refs', value: '0' }],
      output: ['clone !== original  // true', 'clone.prefs !== original.prefs  // true'],
      codeLine: 22,
      note: 'Done. Clone is fully independent — mutating clone.prefs does not affect original. JSON-stringify-parse would have failed on Map/Set/Date/circular here.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — memoize
// ---------------------------------------------------------------------------

const memoize: JSUtilScenario = {
  id: 'memoize',
  name: 'memoize',
  flavor: 'memoize',
  blurb:
    "Cache a function's result by its arguments. Subsequent calls with the same args return instantly. Cost: memory grows with unique-arg combinations.",
  complexity: { time: 'O(1) per cached call', space: 'O(unique calls)' },
  code: [
    `function memoize<A extends unknown[], R>(`,
    `  fn: (...args: A) => R,`,
    `  hash: (...args: A) => string = (...a) => JSON.stringify(a),`,
    `): (...args: A) => R {`,
    `  const cache = new Map<string, R>()`,
    ``,
    `  return (...args: A): R => {`,
    `    const key = hash(...args)`,
    `    if (cache.has(key)) return cache.get(key)!`,
    `    const result = fn(...args)`,
    `    cache.set(key, result)`,
    `    return result`,
    `  }`,
    `}`,
    ``,
    `const slowSquare = (n: number) => { /* slow */ return n * n }`,
    `const fastSquare = memoize(slowSquare)`,
  ],
  steps: [
    {
      cache: [],
      vars: [{ label: 'fn', value: 'slowSquare' }, { label: 'cache size', value: '0' }],
      output: [],
      codeLine: 5,
      note: 'memoize returns a wrapped function. cache starts empty.',
    },
    {
      cache: [{ key: '[4]', value: '16', state: 'new' }],
      vars: [
        { label: 'args', value: '[4]' },
        { label: 'cache.has', value: 'false' },
        { label: 'result', value: '16 (computed)' },
      ],
      output: ['fastSquare(4) → 16'],
      codeLine: 11,
      note: 'fastSquare(4). Not in cache → call fn(4)=16. Store cache[\"[4]\"] = 16.',
    },
    {
      cache: [{ key: '[4]', value: '16', state: 'hit' }],
      vars: [
        { label: 'args', value: '[4]' },
        { label: 'cache.has', value: 'true' },
        { label: 'result', value: '16 (cached)' },
      ],
      output: ['fastSquare(4) → 16', 'fastSquare(4) → 16 ⚡'],
      codeLine: 9,
      note: 'fastSquare(4) AGAIN. cache hit — return 16 instantly without calling fn.',
    },
    {
      cache: [
        { key: '[4]', value: '16' },
        { key: '[7]', value: '49', state: 'new' },
      ],
      vars: [{ label: 'args', value: '[7]' }, { label: 'result', value: '49 (computed)' }],
      output: ['fastSquare(4) → 16', 'fastSquare(4) → 16 ⚡', 'fastSquare(7) → 49'],
      codeLine: 11,
      note: 'fastSquare(7). New key → compute and store.',
    },
    {
      cache: [
        { key: '[4]', value: '16', state: 'hit' },
        { key: '[7]', value: '49' },
      ],
      vars: [{ label: 'cache size', value: '2' }, { label: 'hits', value: '2 / 4 calls' }],
      output: [
        'fastSquare(4) → 16',
        'fastSquare(4) → 16 ⚡',
        'fastSquare(7) → 49',
        'fastSquare(4) → 16 ⚡',
      ],
      codeLine: 9,
      note: 'Mix calls. 4 total calls, 2 actually executed slowSquare, 2 served from cache. The win.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — LRU cache
// ---------------------------------------------------------------------------

const lru: JSUtilScenario = {
  id: 'lru-cache',
  name: 'LRU cache',
  flavor: 'lru',
  blurb:
    'Keep at most N items. On every access (get or put), move that item to the front. When over capacity, evict the back. JS Map preserves insertion order — that\'s the trick that makes this O(1).',
  complexity: { time: 'O(1) get & put', space: 'O(capacity)' },
  code: [
    `class LRU<K, V> {`,
    `  private map = new Map<K, V>()`,
    `  constructor(private capacity: number) {}`,
    ``,
    `  get(key: K): V | undefined {`,
    `    if (!this.map.has(key)) return undefined`,
    `    const value = this.map.get(key)!`,
    `    this.map.delete(key)     // remove`,
    `    this.map.set(key, value) // re-insert at end (newest)`,
    `    return value`,
    `  }`,
    ``,
    `  put(key: K, value: V): void {`,
    `    if (this.map.has(key)) this.map.delete(key)`,
    `    this.map.set(key, value)`,
    `    if (this.map.size > this.capacity) {`,
    `      const oldest = this.map.keys().next().value!`,
    `      this.map.delete(oldest)`,
    `    }`,
    `  }`,
    `}`,
  ],
  steps: [
    {
      cache: [],
      cacheLimit: 3,
      vars: [{ label: 'capacity', value: '3' }, { label: 'op', value: 'init' }],
      output: [],
      codeLine: 3,
      note: 'Capacity = 3. Order in the cache: left = oldest, right = newest.',
    },
    {
      cache: [{ key: 'A', value: '1', state: 'new' }],
      cacheLimit: 3,
      vars: [{ label: 'op', value: 'put(A, 1)' }],
      output: [],
      codeLine: 14,
      note: 'put(A, 1). Cache: [A]. Size 1.',
    },
    {
      cache: [
        { key: 'A', value: '1' },
        { key: 'B', value: '2', state: 'new' },
      ],
      cacheLimit: 3,
      vars: [{ label: 'op', value: 'put(B, 2)' }],
      output: [],
      codeLine: 14,
      note: 'put(B, 2). Cache: [A, B].',
    },
    {
      cache: [
        { key: 'A', value: '1' },
        { key: 'B', value: '2' },
        { key: 'C', value: '3', state: 'new' },
      ],
      cacheLimit: 3,
      vars: [{ label: 'op', value: 'put(C, 3)' }, { label: 'size', value: '3 (at capacity)' }],
      output: [],
      codeLine: 14,
      note: 'put(C, 3). Cache: [A, B, C]. At capacity.',
    },
    {
      cache: [
        { key: 'B', value: '2' },
        { key: 'C', value: '3' },
        { key: 'A', value: '1', state: 'updated' },
      ],
      cacheLimit: 3,
      vars: [{ label: 'op', value: 'get(A)' }, { label: 'result', value: '1' }],
      output: ['get(A) → 1'],
      codeLine: 9,
      note: 'get(A). delete + re-insert → A moves to the end (newest). Order: [B, C, A].',
    },
    {
      cache: [
        { key: 'C', value: '3' },
        { key: 'A', value: '1' },
        { key: 'D', value: '4', state: 'new' },
      ],
      cacheLimit: 3,
      vars: [
        { label: 'op', value: 'put(D, 4)' },
        { label: 'evicted', value: 'B (oldest)' },
      ],
      output: ['get(A) → 1', 'put(D) evicted B'],
      codeLine: 19,
      note: 'put(D, 4). Size would exceed → evict the OLDEST (B, leftmost in insertion order). Order: [C, A, D].',
    },
    {
      cache: [
        { key: 'C', value: '3', state: 'evicted' },
        { key: 'A', value: '1' },
        { key: 'D', value: '4' },
      ],
      cacheLimit: 3,
      vars: [{ label: 'next eviction target', value: 'C' }],
      output: ['get(A) → 1', 'put(D) evicted B'],
      codeLine: 0,
      note: 'C is now the oldest — it would be evicted next. Touching A or D would push them ahead.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — Event Emitter
// ---------------------------------------------------------------------------

const eventEmitter: JSUtilScenario = {
  id: 'event-emitter',
  name: 'Event Emitter',
  flavor: 'eventEmitter',
  blurb:
    "Pub/sub the JS way. on(event, fn) subscribes, emit(event, ...args) invokes everyone, off(event, fn) unsubscribes. Used inside Node.js streams, browser event targets, every UI framework. Implementing it from scratch is a classic FE coding round.",
  complexity: { time: 'O(1) on/off · O(n) emit', space: 'O(subscribers)' },
  code: [
    `class EventEmitter {`,
    `  private map = new Map<string, Set<(...args: any[]) => void>>()`,
    ``,
    `  on(event: string, fn: (...args: any[]) => void): () => void {`,
    `    if (!this.map.has(event)) this.map.set(event, new Set())`,
    `    this.map.get(event)!.add(fn)`,
    `    return () => this.off(event, fn)  // unsubscriber`,
    `  }`,
    ``,
    `  off(event: string, fn: (...args: any[]) => void): void {`,
    `    this.map.get(event)?.delete(fn)`,
    `  }`,
    ``,
    `  emit(event: string, ...args: any[]): void {`,
    `    for (const fn of this.map.get(event) ?? []) fn(...args)`,
    `  }`,
    `}`,
  ],
  steps: [
    {
      subscribers: [],
      vars: [{ label: 'op', value: 'new EventEmitter()' }],
      output: [],
      codeLine: 1,
      note: 'Fresh emitter. Internal map is empty.',
    },
    {
      subscribers: [{ event: 'click', handlers: ['handler1'], state: 'new' }],
      vars: [
        { label: 'op', value: "on('click', handler1)" },
        { label: 'returns', value: 'unsubscriber fn' },
      ],
      output: [],
      codeLine: 6,
      note: "on('click', handler1). The first handler creates the Set. Subscribe count: 1.",
    },
    {
      subscribers: [
        { event: 'click', handlers: ['handler1', 'handler2'], state: 'updated' },
      ],
      vars: [{ label: 'op', value: "on('click', handler2)" }],
      output: [],
      codeLine: 6,
      note: "on('click', handler2). Same event, second handler added to the Set.",
    },
    {
      subscribers: [
        { event: 'click', handlers: ['handler1', 'handler2'] },
        { event: 'submit', handlers: ['onSubmit'], state: 'new' },
      ],
      vars: [{ label: 'op', value: "on('submit', onSubmit)" }],
      output: [],
      codeLine: 6,
      note: "on('submit', onSubmit). Different event → new Set entry.",
    },
    {
      subscribers: [
        { event: 'click', handlers: ['handler1', 'handler2'], state: 'hit' },
        { event: 'submit', handlers: ['onSubmit'] },
      ],
      vars: [{ label: 'op', value: "emit('click', e)" }],
      output: ['handler1 fired', 'handler2 fired'],
      codeLine: 15,
      note: "emit('click', e). Iterate the Set for 'click' — both handlers fire in subscription order.",
    },
    {
      subscribers: [
        { event: 'click', handlers: ['handler2'], state: 'updated' },
        { event: 'submit', handlers: ['onSubmit'] },
      ],
      vars: [
        { label: 'op', value: "off('click', handler1)" },
        { label: 'or', value: 'unsubscribe()' },
      ],
      output: ['handler1 fired', 'handler2 fired'],
      codeLine: 11,
      note: "off('click', handler1) — or call the unsubscriber returned from on(). handler1 removed from the Set.",
    },
    {
      subscribers: [
        { event: 'click', handlers: ['handler2'], state: 'hit' },
        { event: 'submit', handlers: ['onSubmit'] },
      ],
      vars: [{ label: 'op', value: "emit('click', e)" }],
      output: ['handler1 fired', 'handler2 fired', 'handler2 fired'],
      codeLine: 15,
      note: "Second emit('click'). Only handler2 fires now — handler1 is unsubscribed.",
    },
  ],
}

export const scenarios: JSUtilScenario[] = [deepClone, memoize, lru, eventEmitter]
