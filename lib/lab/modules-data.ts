// Modules visualizer — 3 scenarios for ESM mechanics:
//   1. Static ESM dependency graph (resolution order)
//   2. Tree-shaking (dead-code elimination via static analysis)
//   3. Dynamic import (separate chunk created)

export type ModuleState =
  | 'normal'
  | 'parsing' // currently being resolved
  | 'loaded' // fully evaluated
  | 'shaken' // tree-shaken away (removed in production bundle)
  | 'dynamic' // in a separate chunk

export interface ModuleNode {
  id: string
  label: string // file name like "utils.ts"
  state: ModuleState
  // Exports shown inside the box
  exports?: Array<{ name: string; used: boolean }>
  // (x, y) layout in [0, 1] space
  x: number
  y: number
}

export interface ModuleEdge {
  fromId: string
  toId: string
  // What was imported
  imports: string[]
  state: 'normal' | 'highlighted' | 'dynamic'
}

// Bundle chunks visualization (for dynamic import scenario)
export interface Chunk {
  id: string
  label: string // "main.js" / "lazy-chart.chunk.js"
  modules: string[] // module ids contained
  state: 'normal' | 'lazy'
}

export interface ModuleStep {
  modules: ModuleNode[]
  edges: ModuleEdge[]
  // Only used in scenario 3 (dynamic import)
  chunks?: Chunk[]
  vars: Array<{ label: string; value: string }>
  codeLine: number
  note: string
}

export interface ModuleScenario {
  id: string
  name: string
  flavor: 'esm-graph' | 'tree-shake' | 'dynamic-import'
  blurb: string
  code: string[]
  steps: ModuleStep[]
}

// ---------------------------------------------------------------------------
// Helpers — predefined layouts per scenario
// ---------------------------------------------------------------------------

const esmLayout = {
  main: { x: 0.5, y: 0.15, label: 'main.ts' },
  ui: { x: 0.2, y: 0.5, label: 'ui.ts' },
  api: { x: 0.5, y: 0.5, label: 'api.ts' },
  utils: { x: 0.8, y: 0.5, label: 'utils.ts' },
  format: { x: 0.5, y: 0.85, label: 'format.ts' },
}

// ---------------------------------------------------------------------------
// Scenario 1 — ESM dependency graph + resolution order
// ---------------------------------------------------------------------------

const esmGraph: ModuleScenario = {
  id: 'esm-graph',
  name: 'ESM dependency graph',
  flavor: 'esm-graph',
  blurb:
    "ES modules form a directed graph rooted at your entry. The runtime walks the graph in DFS post-order — leaves evaluate first, then their importers, finally the entry. Circular deps work but yield partial bindings until the cycle resolves.",
  code: [
    `// main.ts`,
    `import { renderUI } from './ui'`,
    `import { fetchUser } from './api'`,
    ``,
    `renderUI(await fetchUser(1))`,
    ``,
    `// ui.ts`,
    `import { formatName } from './format'`,
    `export function renderUI(u) { /* ... */ }`,
    ``,
    `// api.ts`,
    `import { json } from './utils'`,
    `export function fetchUser(id) { /* ... */ }`,
    ``,
    `// format.ts (leaf)`,
    `// utils.ts (leaf)`,
  ],
  steps: [
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'normal' },
        { id: 'ui', ...esmLayout.ui, state: 'normal' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'normal' },
        { id: 'format', ...esmLayout.format, state: 'normal' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'entry', value: 'main.ts' }],
      codeLine: 1,
      note: 'Five files. main imports from ui + api. ui depends on format. api depends on utils. format + utils have no deps — they\'re leaves.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'parsing' },
        { id: 'ui', ...esmLayout.ui, state: 'normal' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'normal' },
        { id: 'format', ...esmLayout.format, state: 'normal' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'highlighted' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'visiting', value: 'main → ui first' }],
      codeLine: 1,
      note: 'Start at main. First import: ui. Descend.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'normal' },
        { id: 'ui', ...esmLayout.ui, state: 'parsing' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'normal' },
        { id: 'format', ...esmLayout.format, state: 'normal' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'highlighted' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'visiting', value: 'ui → format' }],
      codeLine: 7,
      note: 'Inside ui, it imports format. Descend further.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'normal' },
        { id: 'ui', ...esmLayout.ui, state: 'normal' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'normal' },
        { id: 'format', ...esmLayout.format, state: 'loaded' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'evaluated', value: 'format.ts ✓' }],
      codeLine: 14,
      note: 'format is a leaf — evaluate it. Body runs, exports captured. Return up to ui.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'normal' },
        { id: 'ui', ...esmLayout.ui, state: 'loaded' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'normal' },
        { id: 'format', ...esmLayout.format, state: 'loaded' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'evaluated', value: 'ui.ts ✓ (deps satisfied)' }],
      codeLine: 8,
      note: 'ui\'s deps are loaded → evaluate ui. Body runs. Return up to main.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'parsing' },
        { id: 'ui', ...esmLayout.ui, state: 'loaded' },
        { id: 'api', ...esmLayout.api, state: 'normal' },
        { id: 'utils', ...esmLayout.utils, state: 'loaded' },
        { id: 'format', ...esmLayout.format, state: 'loaded' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'highlighted' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [{ label: 'visiting', value: 'main → api (utils evaluated leaf-first)' }],
      codeLine: 2,
      note: 'main\'s second import: api. Descend into utils (leaf, evaluates), then api itself.',
    },
    {
      modules: [
        { id: 'main', ...esmLayout.main, state: 'loaded' },
        { id: 'ui', ...esmLayout.ui, state: 'loaded' },
        { id: 'api', ...esmLayout.api, state: 'loaded' },
        { id: 'utils', ...esmLayout.utils, state: 'loaded' },
        { id: 'format', ...esmLayout.format, state: 'loaded' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui', imports: ['renderUI'], state: 'normal' },
        { fromId: 'main', toId: 'api', imports: ['fetchUser'], state: 'normal' },
        { fromId: 'ui', toId: 'format', imports: ['formatName'], state: 'normal' },
        { fromId: 'api', toId: 'utils', imports: ['json'], state: 'normal' },
      ],
      vars: [
        { label: 'order', value: 'format, ui, utils, api, main' },
        { label: 'all evaluated', value: '✓' },
      ],
      codeLine: 4,
      note: 'Final evaluation order (post-order DFS): format → ui → utils → api → main. Each module body runs exactly once.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — Tree-shaking (dead-code elimination)
// ---------------------------------------------------------------------------

const treeShake: ModuleScenario = {
  id: 'tree-shake',
  name: 'Tree shaking',
  flavor: 'tree-shake',
  blurb:
    'A bundler statically analyzes ESM imports/exports. Anything you don\'t import is eliminated from the production bundle — provided there are no side effects. This only works because ESM imports are STATIC (no dynamic `require(string)` from a variable).',
  code: [
    `// utils.ts — 4 exports, but only 1 used`,
    `export function debounce() { /* ... */ }`,
    `export function throttle() { /* ... */ }`,
    `export function uuid()     { /* ... */ }`,
    `export function clamp(n)   { return Math.max(0, Math.min(n, 1)) }`,
    ``,
    `// main.ts`,
    `import { clamp } from './utils'`,
    `console.log(clamp(2))`,
    ``,
    `// After tree-shake:`,
    `// debounce, throttle, uuid → eliminated`,
    `// clamp only → kept`,
  ],
  steps: [
    {
      modules: [
        {
          id: 'main',
          x: 0.5,
          y: 0.2,
          label: 'main.ts',
          state: 'normal',
          exports: [{ name: 'entry', used: true }],
        },
        {
          id: 'utils',
          x: 0.5,
          y: 0.7,
          label: 'utils.ts',
          state: 'normal',
          exports: [
            { name: 'debounce', used: false },
            { name: 'throttle', used: false },
            { name: 'uuid', used: false },
            { name: 'clamp', used: true },
          ],
        },
      ],
      edges: [
        { fromId: 'main', toId: 'utils', imports: ['clamp'], state: 'highlighted' },
      ],
      vars: [
        { label: 'utils exports', value: '4 (debounce, throttle, uuid, clamp)' },
        { label: 'main imports', value: '1 (clamp)' },
      ],
      codeLine: 8,
      note: 'main imports only `clamp` from utils. The bundler reads ESM imports statically and builds a use-graph.',
    },
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'normal' },
        {
          id: 'utils',
          x: 0.5,
          y: 0.7,
          label: 'utils.ts (analyzing)',
          state: 'parsing',
          exports: [
            { name: 'debounce', used: false },
            { name: 'throttle', used: false },
            { name: 'uuid', used: false },
            { name: 'clamp', used: true },
          ],
        },
      ],
      edges: [
        { fromId: 'main', toId: 'utils', imports: ['clamp'], state: 'highlighted' },
      ],
      vars: [{ label: 'phase', value: 'tree-shake analysis' }],
      codeLine: 11,
      note: 'Analysis. The bundler marks `clamp` as reachable from main. The other 3 exports have no incoming use edges.',
    },
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'loaded' },
        {
          id: 'utils',
          x: 0.5,
          y: 0.7,
          label: 'utils.ts (shaken)',
          state: 'loaded',
          exports: [
            { name: 'debounce', used: false },
            { name: 'throttle', used: false },
            { name: 'uuid', used: false },
            { name: 'clamp', used: true },
          ],
        },
      ],
      edges: [{ fromId: 'main', toId: 'utils', imports: ['clamp'], state: 'normal' }],
      vars: [
        { label: 'kept', value: 'clamp (1)' },
        { label: 'eliminated', value: 'debounce, throttle, uuid (3)' },
        { label: 'bundle size impact', value: '~75% reduction in utils.ts code' },
      ],
      codeLine: 12,
      note: 'After tree-shake. Unused exports (3 of 4) are eliminated from the output bundle. Only clamp survives. Note: this requires `sideEffects: false` in package.json — otherwise the bundler conservatively keeps everything.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — Dynamic import (code splitting)
// ---------------------------------------------------------------------------

const dynamicImport: ModuleScenario = {
  id: 'dynamic-import',
  name: 'Dynamic import (code split)',
  flavor: 'dynamic-import',
  blurb:
    'A static `import` is resolved at bundle time and included in the main chunk. A dynamic `import("path")` returns a Promise and tells the bundler "make this a separate chunk, lazy-load it on demand". Used for: route-based splitting, modal/chart libraries used rarely, polyfills.',
  code: [
    `// main.ts`,
    `import { Button } from './ui-core'  // STATIC → main chunk`,
    ``,
    `async function openChart() {`,
    `  // DYNAMIC → its own chunk, fetched on click`,
    `  const { renderChart } = await import('./chart')`,
    `  renderChart()`,
    `}`,
    ``,
    `document.getElementById('btn')?.addEventListener('click', openChart)`,
  ],
  steps: [
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'normal' },
        { id: 'ui-core', x: 0.25, y: 0.6, label: 'ui-core.ts', state: 'normal' },
        { id: 'chart', x: 0.75, y: 0.6, label: 'chart.ts', state: 'dynamic' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui-core', imports: ['Button'], state: 'normal' },
        { fromId: 'main', toId: 'chart', imports: ['renderChart'], state: 'dynamic' },
      ],
      chunks: [
        { id: 'main', label: 'main.js', modules: ['main', 'ui-core'], state: 'normal' },
        { id: 'lazy', label: 'chart.[hash].chunk.js', modules: ['chart'], state: 'lazy' },
      ],
      vars: [{ label: 'entry chunk', value: 'main.js' }, { label: 'lazy chunks', value: '1 (chart)' }],
      codeLine: 1,
      note: 'Static import of ui-core goes into the main chunk. Dynamic import of chart becomes a separate "lazy" chunk.',
    },
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'loaded' },
        { id: 'ui-core', x: 0.25, y: 0.6, label: 'ui-core.ts', state: 'loaded' },
        { id: 'chart', x: 0.75, y: 0.6, label: 'chart.ts (not yet)', state: 'dynamic' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui-core', imports: ['Button'], state: 'normal' },
        { fromId: 'main', toId: 'chart', imports: ['renderChart'], state: 'dynamic' },
      ],
      chunks: [
        { id: 'main', label: 'main.js (~50 KB)', modules: ['main', 'ui-core'], state: 'normal' },
        { id: 'lazy', label: 'chart.[hash].chunk.js (~200 KB)', modules: ['chart'], state: 'lazy' },
      ],
      vars: [
        { label: 'initial download', value: 'just main.js (50 KB)' },
        { label: 'first paint impact', value: 'fast — no chart code' },
      ],
      codeLine: 9,
      note: 'Initial page load. Only the main chunk + ui-core are downloaded. The chart chunk is not fetched until needed. LCP wins.',
    },
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'loaded' },
        { id: 'ui-core', x: 0.25, y: 0.6, label: 'ui-core.ts', state: 'loaded' },
        { id: 'chart', x: 0.75, y: 0.6, label: 'chart.ts (fetching…)', state: 'parsing' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui-core', imports: ['Button'], state: 'normal' },
        { fromId: 'main', toId: 'chart', imports: ['renderChart'], state: 'highlighted' },
      ],
      chunks: [
        { id: 'main', label: 'main.js (loaded)', modules: ['main', 'ui-core'], state: 'normal' },
        { id: 'lazy', label: 'chart chunk (downloading)', modules: ['chart'], state: 'lazy' },
      ],
      vars: [
        { label: 'event', value: 'user clicked button' },
        { label: 'await', value: 'fetch chart chunk' },
      ],
      codeLine: 5,
      note: 'User clicks. openChart runs. The dynamic import triggers a fetch for the chart chunk. Promise pending.',
    },
    {
      modules: [
        { id: 'main', x: 0.5, y: 0.2, label: 'main.ts', state: 'loaded' },
        { id: 'ui-core', x: 0.25, y: 0.6, label: 'ui-core.ts', state: 'loaded' },
        { id: 'chart', x: 0.75, y: 0.6, label: 'chart.ts', state: 'loaded' },
      ],
      edges: [
        { fromId: 'main', toId: 'ui-core', imports: ['Button'], state: 'normal' },
        { fromId: 'main', toId: 'chart', imports: ['renderChart'], state: 'normal' },
      ],
      chunks: [
        { id: 'main', label: 'main.js', modules: ['main', 'ui-core'], state: 'normal' },
        { id: 'lazy', label: 'chart chunk (loaded)', modules: ['chart'], state: 'normal' },
      ],
      vars: [{ label: 'renderChart()', value: 'invoked' }],
      codeLine: 6,
      note: 'Chunk loaded, module evaluated, renderChart called. From here on, future clicks reuse the already-loaded chunk (no second fetch).',
    },
  ],
}

export const scenarios: ModuleScenario[] = [esmGraph, treeShake, dynamicImport]
