// Memory & GC visualizer — show how objects are kept alive by reachable
// references and what happens during a GC sweep. 3 scenarios:
//   1. Basic object lifecycle (created, dereferenced, collected)
//   2. Closure leak (long-lived function holding onto a big object)
//   3. WeakMap vs Map (weak keys release when only the WeakMap holds them)

export type ObjectState =
  | 'normal'
  | 'new'
  | 'unreachable' // pointed by NO root - eligible for GC
  | 'sweeping' // currently being inspected by GC
  | 'collected' // gone

export interface HeapObject {
  id: string
  label: string // e.g. "user", "bigData", "node1"
  size: string // "small" | "huge" — for visual sizing
  state: ObjectState
  // Quick description / fields
  detail?: string
}

export interface HeapRef {
  // The "root" doing the referencing — "global", "stack", "closure", "weakmap"
  fromId: string
  toId: string
  state: 'normal' | 'broken' // broken = just removed; will be cleaned up next step
  // strong vs weak ref (affects GC)
  kind: 'strong' | 'weak'
}

export interface Root {
  id: string
  label: string
  detail?: string
}

export interface MemoryStep {
  roots: Root[] // global, call stack, etc.
  objects: HeapObject[]
  refs: HeapRef[]
  // Stats shown in side panel
  vars: Array<{ label: string; value: string }>
  // Optional accumulated "leak indicator" — total leaked-bytes-like figure
  consoleOutput?: string[]
  codeLine: number
  note: string
}

export interface MemoryScenario {
  id: string
  name: string
  flavor: 'lifecycle' | 'closure-leak' | 'weakmap'
  blurb: string
  code: string[]
  steps: MemoryStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Basic object lifecycle
// ---------------------------------------------------------------------------

const lifecycle: MemoryScenario = {
  id: 'lifecycle',
  name: 'Object lifecycle',
  flavor: 'lifecycle',
  blurb:
    'An object lives as long as something reachable points at it. Drop the last reference and the GC will collect it. Watch a simple `user` variable born, copied, dereferenced, and swept.',
  code: [
    `let user = { name: "Alice", age: 30 }   // create`,
    `let alias = user                         // 2 refs`,
    `user = null                              // 1 ref`,
    `alias = null                             // 0 refs → unreachable`,
    `// next GC pass collects the object`,
  ],
  steps: [
    {
      roots: [{ id: 'g', label: 'global', detail: 'top-level scope' }],
      objects: [],
      refs: [],
      vars: [{ label: 'heap size', value: '0' }],
      codeLine: 0,
      note: 'Start. Empty heap, only the global root.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'o', label: '{ name, age }', size: 'small', state: 'new', detail: 'first allocation' },
      ],
      refs: [{ fromId: 'g', toId: 'o', state: 'normal', kind: 'strong' }],
      vars: [
        { label: 'user', value: '→ obj' },
        { label: 'heap size', value: '1' },
        { label: 'refcount(obj)', value: '1' },
      ],
      codeLine: 1,
      note: 'Allocate the object. Global binding `user` holds a strong reference.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [{ id: 'o', label: '{ name, age }', size: 'small', state: 'normal' }],
      refs: [
        { fromId: 'g', toId: 'o', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'o', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'user', value: '→ obj' },
        { label: 'alias', value: '→ obj (same)' },
        { label: 'refcount(obj)', value: '2' },
      ],
      codeLine: 2,
      note: '`alias = user`. The object now has TWO strong roots holding it. Mutating via either alias is visible from both.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [{ id: 'o', label: '{ name, age }', size: 'small', state: 'normal' }],
      refs: [{ fromId: 'g', toId: 'o', state: 'normal', kind: 'strong' }],
      vars: [
        { label: 'user', value: 'null' },
        { label: 'alias', value: '→ obj' },
        { label: 'refcount(obj)', value: '1' },
      ],
      codeLine: 3,
      note: '`user = null`. One reference dropped. Object is STILL alive because `alias` holds it.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [{ id: 'o', label: '{ name, age }', size: 'small', state: 'unreachable' }],
      refs: [],
      vars: [
        { label: 'user', value: 'null' },
        { label: 'alias', value: 'null' },
        { label: 'refcount(obj)', value: '0 — orphan' },
      ],
      codeLine: 4,
      note: '`alias = null`. Last reference dropped. The object has NO root path → unreachable. JS engines don\'t literally count refs (that breaks on cycles); they walk from roots and find what\'s reachable.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [{ id: 'o', label: '{ name, age }', size: 'small', state: 'sweeping' }],
      refs: [],
      vars: [{ label: 'GC pass', value: 'running mark-and-sweep' }],
      codeLine: 5,
      note: 'GC kicks in. Mark phase walks reachable from roots. The orphaned object is not marked → goes into sweep.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [{ id: 'o', label: '(collected)', size: 'small', state: 'collected' }],
      refs: [],
      vars: [
        { label: 'heap size', value: '0' },
        { label: 'freed', value: '~80 bytes' },
      ],
      codeLine: 5,
      note: 'Sweep. Memory is reclaimed. Heap back to empty.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — Closure memory leak
// ---------------------------------------------------------------------------

const closureLeak: MemoryScenario = {
  id: 'closure-leak',
  name: 'Closure leak',
  flavor: 'closure-leak',
  blurb:
    "The most common JS memory leak: a long-lived handler closes over a huge object and that handler stays subscribed forever. Even if you no longer USE the big object, the closure pins it. Result: gigabytes leak slowly over the page's life.",
  code: [
    `function attach() {`,
    `  const bigData = new Array(10_000_000).fill(0)  // ~80 MB`,
    ``,
    `  document.addEventListener('click', () => {`,
    `    // doesn't use bigData, but closes over it`,
    `    console.log('clicked')`,
    `  })`,
    `}`,
    ``,
    `attach()`,
    `// bigData is unreachable from any user variable now —`,
    `// BUT the click handler closure keeps it alive forever.`,
  ],
  steps: [
    {
      roots: [
        { id: 'g', label: 'global' },
        { id: 'dom', label: 'DOM event listeners', detail: 'document.click' },
      ],
      objects: [],
      refs: [],
      vars: [{ label: 'page memory', value: 'baseline' }],
      codeLine: 1,
      note: 'Two roots: the global scope and the DOM event-target registry. Anything either of them reaches stays alive.',
    },
    {
      roots: [
        { id: 'g', label: 'global' },
        { id: 'dom', label: 'DOM event listeners' },
      ],
      objects: [
        { id: 'bigData', label: 'Array(10M)', size: 'huge', state: 'new', detail: '~80 MB' },
        { id: 'attachFrame', label: 'attach() frame', size: 'small', state: 'new' },
      ],
      refs: [
        { fromId: 'g', toId: 'attachFrame', state: 'normal', kind: 'strong' },
        { fromId: 'attachFrame', toId: 'bigData', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'page memory', value: '~80 MB' },
        { label: 'bigData reachable from', value: 'attach() local scope' },
      ],
      codeLine: 2,
      note: 'Inside attach(), allocate the huge array. While attach is on the stack, its scope holds bigData strongly.',
    },
    {
      roots: [
        { id: 'g', label: 'global' },
        { id: 'dom', label: 'DOM event listeners' },
      ],
      objects: [
        { id: 'bigData', label: 'Array(10M)', size: 'huge', state: 'normal' },
        { id: 'closure', label: 'closure { bigData }', size: 'small', state: 'new', detail: 'click handler' },
      ],
      refs: [
        { fromId: 'g', toId: 'closure', state: 'normal', kind: 'strong' },
        { fromId: 'closure', toId: 'bigData', state: 'normal', kind: 'strong' },
        { fromId: 'dom', toId: 'closure', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'page memory', value: '~80 MB + closure' },
        { label: 'closure reaches', value: '{ bigData }' },
      ],
      codeLine: 4,
      note: 'addEventListener registers the inner function. The function CLOSES over bigData even though it doesn\'t use it. DOM holds the closure strongly.',
    },
    {
      roots: [
        { id: 'g', label: 'global' },
        { id: 'dom', label: 'DOM event listeners' },
      ],
      objects: [
        { id: 'bigData', label: 'Array(10M)', size: 'huge', state: 'normal' },
        { id: 'closure', label: 'closure { bigData }', size: 'small', state: 'normal' },
      ],
      refs: [
        { fromId: 'dom', toId: 'closure', state: 'normal', kind: 'strong' },
        { fromId: 'closure', toId: 'bigData', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'attach() returned', value: 'true' },
        { label: 'page memory', value: '~80 MB (still!)' },
      ],
      codeLine: 10,
      note: 'attach() returns. Its stack frame is gone. But the closure is still rooted by the DOM. Through the closure → bigData is STILL reachable. The huge array never gets collected.',
    },
    {
      roots: [
        { id: 'g', label: 'global' },
        { id: 'dom', label: 'DOM event listeners' },
      ],
      objects: [
        { id: 'bigData', label: 'Array(10M) — LEAKED', size: 'huge', state: 'normal' },
        { id: 'closure', label: 'closure { bigData }', size: 'small', state: 'normal' },
      ],
      refs: [
        { fromId: 'dom', toId: 'closure', state: 'normal', kind: 'strong' },
        { fromId: 'closure', toId: 'bigData', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'fix', value: 'either: (a) remove the listener; (b) don\'t close over bigData' },
      ],
      codeLine: 11,
      note: 'The leak. bigData survives until the document does (i.e. until the tab closes). Fix: call removeEventListener when done, OR factor out the variable so the handler doesn\'t close over it.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — WeakMap allows GC of keys
// ---------------------------------------------------------------------------

const weakmap: MemoryScenario = {
  id: 'weakmap',
  name: 'WeakMap vs Map',
  flavor: 'weakmap',
  blurb:
    'A regular Map holds its keys strongly — they survive as long as the Map does. A WeakMap holds keys WEAKLY — when no other root references the key, it (and its associated value) become eligible for collection. Use WeakMap to cache metadata keyed by short-lived objects.',
  code: [
    `const map     = new Map()`,
    `const weakmap = new WeakMap()`,
    ``,
    `let user1 = { id: 1 }`,
    `let user2 = { id: 2 }`,
    ``,
    `map.set(user1, 'meta1')      // strong key`,
    `weakmap.set(user2, 'meta2')  // weak key`,
    ``,
    `user1 = null   // map still pins it → kept`,
    `user2 = null   // weakmap doesn't pin → collectable`,
  ],
  steps: [
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map {}', size: 'small', state: 'new' },
        { id: 'weakmap', label: 'WeakMap {}', size: 'small', state: 'new' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
      ],
      vars: [{ label: 'map size', value: '0' }, { label: 'weakmap size', value: '0' }],
      codeLine: 2,
      note: 'Create both maps. Empty so far.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map {}', size: 'small', state: 'normal' },
        { id: 'weakmap', label: 'WeakMap {}', size: 'small', state: 'normal' },
        { id: 'user1', label: '{ id: 1 }', size: 'small', state: 'new' },
        { id: 'user2', label: '{ id: 2 }', size: 'small', state: 'new' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'user1', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'user2', state: 'normal', kind: 'strong' },
      ],
      vars: [{ label: 'user1', value: '→ obj1' }, { label: 'user2', value: '→ obj2' }],
      codeLine: 5,
      note: 'Allocate two user objects. Each is referenced by a top-level variable AND nothing else yet.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map { user1 → "meta1" }', size: 'small', state: 'normal' },
        { id: 'weakmap', label: 'WeakMap { user2 → "meta2" }', size: 'small', state: 'normal' },
        { id: 'user1', label: '{ id: 1 }', size: 'small', state: 'normal' },
        { id: 'user2', label: '{ id: 2 }', size: 'small', state: 'normal' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'user1', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'user2', state: 'normal', kind: 'strong' },
        { fromId: 'map', toId: 'user1', state: 'normal', kind: 'strong' },
        { fromId: 'weakmap', toId: 'user2', state: 'normal', kind: 'weak' },
      ],
      vars: [
        { label: 'map.size', value: '1' },
        { label: 'weakmap', value: 'no .size — opaque' },
      ],
      codeLine: 7,
      note: 'map.set(user1, "meta1") creates a STRONG edge from the Map to user1. weakmap.set(user2, "meta2") creates a WEAK edge (dashed).',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map { user1 → "meta1" }', size: 'small', state: 'normal' },
        { id: 'weakmap', label: 'WeakMap { user2 → "meta2" }', size: 'small', state: 'normal' },
        { id: 'user1', label: '{ id: 1 } — still alive', size: 'small', state: 'normal' },
        { id: 'user2', label: '{ id: 2 }', size: 'small', state: 'normal' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'user2', state: 'normal', kind: 'strong' },
        { fromId: 'map', toId: 'user1', state: 'normal', kind: 'strong' },
        { fromId: 'weakmap', toId: 'user2', state: 'normal', kind: 'weak' },
      ],
      vars: [
        { label: 'user1', value: 'null (but map still holds it)' },
        { label: 'user1 reachable from', value: 'global → map → user1' },
      ],
      codeLine: 10,
      note: '`user1 = null` drops the global ref. But the Map\'s strong edge keeps user1 alive. This is the "map keeps things forever" hazard.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map { user1 → "meta1" }', size: 'small', state: 'normal' },
        { id: 'weakmap', label: 'WeakMap {}', size: 'small', state: 'normal' },
        { id: 'user1', label: '{ id: 1 } — still alive', size: 'small', state: 'normal' },
        { id: 'user2', label: '{ id: 2 } — unreachable', size: 'small', state: 'unreachable' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
        { fromId: 'map', toId: 'user1', state: 'normal', kind: 'strong' },
      ],
      vars: [{ label: 'user2', value: 'null — weak edge alone doesn\'t keep it' }],
      codeLine: 11,
      note: '`user2 = null`. The WeakMap entry has a weak edge — it does NOT count as a root. user2 has no strong path now → unreachable.',
    },
    {
      roots: [{ id: 'g', label: 'global' }],
      objects: [
        { id: 'map', label: 'Map { user1 → "meta1" }', size: 'small', state: 'normal' },
        { id: 'weakmap', label: 'WeakMap {} (auto-purged)', size: 'small', state: 'normal' },
        { id: 'user1', label: '{ id: 1 } — LEAK candidate', size: 'small', state: 'normal' },
        { id: 'user2', label: '(collected)', size: 'small', state: 'collected' },
      ],
      refs: [
        { fromId: 'g', toId: 'map', state: 'normal', kind: 'strong' },
        { fromId: 'g', toId: 'weakmap', state: 'normal', kind: 'strong' },
        { fromId: 'map', toId: 'user1', state: 'normal', kind: 'strong' },
      ],
      vars: [
        { label: 'use Map when', value: 'iteration / explicit size matters' },
        { label: 'use WeakMap when', value: 'caching metadata keyed by short-lived objects' },
      ],
      codeLine: 11,
      note: 'After GC. user2 is collected; the WeakMap entry is purged automatically. user1 is still alive (Map\'s strong edge). The takeaway: use WeakMap when you don\'t want your cache to be the reason an object lives.',
    },
  ],
}

export const scenarios: MemoryScenario[] = [lifecycle, closureLeak, weakmap]
