// Stacking Context — visualizer data model.
//
// Stacking context determines which element appears on top when they
// overlap. z-index only orders elements *within* the same stacking
// context. Certain CSS properties create new stacking contexts that
// "trap" their children — that's why your `z-index: 9999` modal can
// still end up underneath something with `z-index: 1`.

export interface StackingBox {
  id: string
  label: string
  parentId?: string // for tree rendering
  // Stage coordinates as percentages of the stage area (0-100)
  x: number
  y: number
  w: number
  h: number
  tone: 'accent' | 'ink' | 'paper3' | 'paper2'
  // What the developer declared
  declaredZ?: number
  // Why this box creates a new stacking context (if any).
  // Empty string / undefined means it does NOT create one.
  contextReason?: string
  // The computed paint order — higher = visually on top.
  // We pre-compute this so the visualizer doesn't have to model the
  // full browser algorithm.
  paintOrder: number
  // Source code line(s) where this box is defined.
  codeLines: number[]
}

export interface StackingStep {
  // Which boxes are highlighted this step (e.g. "look at these — they create context")
  highlightIds: string[]
  // Reveal paint-order annotations on each box?
  showPaintOrder: boolean
  // Reveal the "winner" callout?
  showWinner: boolean
  // Active code lines (highlighted in the source panel)
  codeLines: number[]
  note: string
}

export interface StackingScenario {
  id: string
  name: string
  blurb: string
  code: string[]
  boxes: StackingBox[]
  // The id of the box that "wins" — appears on top of the overlap area.
  winnerId: string
  // Whether the winning state is the buggy one (false) or the intended one (true).
  isBug: boolean
  steps: StackingStep[]
  // Final insight shown when the last step is reached.
  insight: string
}

// ---------------------------------------------------------------------------
// Scenario 1 — Plain z-index works as expected
// ---------------------------------------------------------------------------

const s1: StackingScenario = {
  id: 'plain-z-index',
  name: 'Plain z-index',
  blurb:
    'Two sibling boxes, both with z-index, no nested stacking contexts. z-index orders them directly within the body\'s root stacking context.',
  code: [
    `<body>`,
    `  <div class="red"  style="position: relative; z-index: 1">`,
    `    A`,
    `  </div>`,
    `  <div class="blue" style="position: relative; z-index: 2">`,
    `    B`,
    `  </div>`,
    `</body>`,
  ],
  boxes: [
    {
      id: 'a',
      label: 'A',
      x: 15,
      y: 20,
      w: 45,
      h: 50,
      tone: 'accent',
      declaredZ: 1,
      paintOrder: 1,
      codeLines: [2, 3, 4],
    },
    {
      id: 'b',
      label: 'B',
      x: 40,
      y: 35,
      w: 45,
      h: 50,
      tone: 'ink',
      declaredZ: 2,
      paintOrder: 2,
      codeLines: [5, 6, 7],
    },
  ],
  winnerId: 'b',
  isBug: false,
  insight:
    'Both elements are siblings in the body\'s root stacking context. Higher z-index wins. B paints on top of A. This is what you expect.',
  steps: [
    {
      highlightIds: [],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [],
      note: 'Two sibling divs. Both have `position: relative` and a declared z-index.',
    },
    {
      highlightIds: ['a', 'b'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [2, 5],
      note: 'Both elements sit in the same stacking context — the root (body). Neither one creates a new context, so they compare directly by z-index.',
    },
    {
      highlightIds: ['a', 'b'],
      showPaintOrder: true,
      showWinner: true,
      codeLines: [2, 5],
      note: 'Paint order: A = 1, B = 2. B wins. The visual matches the declared z-index because there are no nested contexts to confuse things.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — opacity creates a stacking context (the classic bug)
// ---------------------------------------------------------------------------

const s2: StackingScenario = {
  id: 'opacity-trap',
  name: 'opacity creates a trap',
  blurb:
    'A modal with z-index: 9999 inside a parent with opacity: 0.99. Sibling overlay with z-index: 1. Guess which one wins.',
  code: [
    `<body>`,
    `  <!-- opacity < 1 creates a stacking context -->`,
    `  <div class="card" style="opacity: 0.99">`,
    `    <div class="modal" style="position: fixed; z-index: 9999">`,
    `      Modal`,
    `    </div>`,
    `  </div>`,
    `  <div class="overlay" style="position: relative; z-index: 1">`,
    `    Overlay`,
    `  </div>`,
    `</body>`,
  ],
  boxes: [
    {
      id: 'card',
      label: '.card',
      x: 10,
      y: 15,
      w: 55,
      h: 60,
      tone: 'paper3',
      contextReason: 'opacity: 0.99',
      paintOrder: 1,
      codeLines: [3],
    },
    {
      id: 'modal',
      label: 'Modal',
      parentId: 'card',
      x: 18,
      y: 25,
      w: 40,
      h: 35,
      tone: 'ink',
      declaredZ: 9999,
      paintOrder: 2, // trapped — paints just above .card, below overlay
      codeLines: [4, 5, 6],
    },
    {
      id: 'overlay',
      label: 'Overlay',
      x: 38,
      y: 38,
      w: 50,
      h: 50,
      tone: 'accent',
      declaredZ: 1,
      paintOrder: 3,
      codeLines: [8, 9, 10],
    },
  ],
  winnerId: 'overlay',
  isBug: true,
  insight:
    'opacity < 1 creates a new stacking context on .card. The Modal\'s z-index: 9999 is enormous — but it only counts inside .card\'s context. From the body\'s perspective .card has z-index: auto, which loses to .overlay\'s z-index: 1. The Modal is trapped.',
  steps: [
    {
      highlightIds: [],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [],
      note: 'A nested modal with z-index: 9999, plus a sibling overlay with z-index: 1. The modal should clearly win, right?',
    },
    {
      highlightIds: ['card'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [3],
      note: '.card has opacity: 0.99 — that\'s enough to create a new stacking context. Any positioned descendant of .card is now confined to its z-stack.',
    },
    {
      highlightIds: ['modal', 'overlay'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [4, 8],
      note: 'Modal\'s z-index: 9999 only counts inside .card\'s context. From the outside, .card has z-index: auto. .overlay has z-index: 1 — that beats auto.',
    },
    {
      highlightIds: [],
      showPaintOrder: true,
      showWinner: true,
      codeLines: [3, 8],
      note: 'Paint order: .card = 1 (auto), Modal = 2 (inside .card), Overlay = 3 (z-index: 1 at root). Overlay wins. The modal is hidden.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — transform also creates a stacking context
// ---------------------------------------------------------------------------

const s3: StackingScenario = {
  id: 'transform-trap',
  name: 'transform creates a trap',
  blurb:
    'Same bug, different cause. Adding `transform: translateZ(0)` for "GPU acceleration" silently creates a new stacking context. Any nested modal is now trapped.',
  code: [
    `<body>`,
    `  <!-- transform: any value other than 'none' -->`,
    `  <!-- creates a stacking context -->`,
    `  <div class="card" style="transform: translateZ(0)">`,
    `    <div class="modal" style="position: fixed; z-index: 9999">`,
    `      Modal`,
    `    </div>`,
    `  </div>`,
    `  <div class="overlay" style="position: relative; z-index: 1">`,
    `    Overlay`,
    `  </div>`,
    `</body>`,
  ],
  boxes: [
    {
      id: 'card',
      label: '.card',
      x: 10,
      y: 15,
      w: 55,
      h: 60,
      tone: 'paper3',
      contextReason: 'transform: translateZ(0)',
      paintOrder: 1,
      codeLines: [4],
    },
    {
      id: 'modal',
      label: 'Modal',
      parentId: 'card',
      x: 18,
      y: 25,
      w: 40,
      h: 35,
      tone: 'ink',
      declaredZ: 9999,
      paintOrder: 2,
      codeLines: [5, 6, 7],
    },
    {
      id: 'overlay',
      label: 'Overlay',
      x: 38,
      y: 38,
      w: 50,
      h: 50,
      tone: 'accent',
      declaredZ: 1,
      paintOrder: 3,
      codeLines: [9, 10, 11],
    },
  ],
  winnerId: 'overlay',
  isBug: true,
  insight:
    'transform on any element creates a stacking context — even when the transform is a no-op like translateZ(0). This is the most subtle version of the bug because developers add transforms for unrelated reasons (GPU layer, scroll snap, smooth animation).',
  steps: [
    {
      highlightIds: [],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [],
      note: 'Same setup. Someone added `transform: translateZ(0)` to .card — maybe for GPU acceleration, maybe inherited from a CSS reset.',
    },
    {
      highlightIds: ['card'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [4],
      note: 'transform with any non-none value creates a stacking context. The translateZ(0) doesn\'t move the element visually, but it changes z-order behavior.',
    },
    {
      highlightIds: ['modal', 'overlay'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [5, 9],
      note: 'Same trap as the opacity scenario. Modal\'s 9999 is local to .card. From root, .card is auto, overlay is 1.',
    },
    {
      highlightIds: [],
      showPaintOrder: true,
      showWinner: true,
      codeLines: [4, 9],
      note: 'Paint order: .card → Modal → Overlay. Overlay wins again. Other context-creators with this gotcha: filter, perspective, clip-path, mask, will-change, isolation, mix-blend-mode.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — Fix: portal the modal out
// ---------------------------------------------------------------------------

const s4: StackingScenario = {
  id: 'portal-fix',
  name: 'Fix: portal to body',
  blurb:
    'React.createPortal renders the modal outside its parent\'s DOM. The modal becomes a direct child of <body>, escaping all ancestor stacking contexts.',
  code: [
    `import { createPortal } from 'react-dom'`,
    ``,
    `<div class="card" style="opacity: 0.99">`,
    `  Card content`,
    `  {createPortal(`,
    `    <div className="modal" style={{ zIndex: 9999 }}>`,
    `      Modal`,
    `    </div>,`,
    `    document.body  // ← portal target`,
    `  )}`,
    `</div>`,
    `<div class="overlay" style="position: relative; z-index: 1">`,
    `  Overlay`,
    `</div>`,
  ],
  boxes: [
    {
      id: 'card',
      label: '.card',
      x: 10,
      y: 15,
      w: 55,
      h: 60,
      tone: 'paper3',
      contextReason: 'opacity: 0.99',
      paintOrder: 1,
      codeLines: [3],
    },
    {
      id: 'overlay',
      label: 'Overlay',
      x: 38,
      y: 38,
      w: 50,
      h: 50,
      tone: 'accent',
      declaredZ: 1,
      paintOrder: 2,
      codeLines: [12, 13, 14],
    },
    {
      id: 'modal',
      label: 'Modal (portalled)',
      // No parentId — modal is now a child of body, sibling of card + overlay
      x: 18,
      y: 25,
      w: 40,
      h: 35,
      tone: 'ink',
      declaredZ: 9999,
      paintOrder: 3,
      codeLines: [5, 6, 7, 8, 9, 10],
    },
  ],
  winnerId: 'modal',
  isBug: false,
  insight:
    'createPortal renders the modal\'s DOM under document.body — outside .card entirely. The opacity stacking context on .card no longer traps the modal. Its z-index: 9999 now compares directly with .overlay\'s z-index: 1 in the root context, so the modal wins. (The modal still receives React props from its parent — only the DOM moves.)',
  steps: [
    {
      highlightIds: [],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [],
      note: 'Same JSX shape, but the Modal is wrapped in createPortal. React renders the modal\'s DOM under document.body, not under .card.',
    },
    {
      highlightIds: ['modal'],
      showPaintOrder: false,
      showWinner: false,
      codeLines: [5, 9],
      note: 'The modal\'s DOM is no longer a child of .card. .card\'s opacity stacking context can\'t trap something that isn\'t inside it.',
    },
    {
      highlightIds: ['modal', 'overlay'],
      showPaintOrder: true,
      showWinner: true,
      codeLines: [5, 12],
      note: 'Paint order at root: .card (1), Overlay (2), Modal (9999). Modal wins. The portal escapes every ancestor\'s stacking context in one step.',
    },
  ],
}

export const scenarios: StackingScenario[] = [s1, s2, s3, s4]

// Properties that create stacking contexts (used for the concept callout).
export const CONTEXT_CREATORS = [
  { rule: 'position: relative | absolute', cond: 'with z-index ≠ auto' },
  { rule: 'position: fixed | sticky', cond: 'always, no z-index needed' },
  { rule: 'opacity', cond: '< 1' },
  { rule: 'transform', cond: 'any value other than none' },
  { rule: 'filter', cond: 'any value other than none' },
  { rule: 'perspective', cond: 'any value other than none' },
  { rule: 'clip-path / mask', cond: 'any value other than none' },
  { rule: 'isolation', cond: 'isolate' },
  { rule: 'mix-blend-mode', cond: 'any value other than normal' },
  { rule: 'will-change', cond: 'a property that would create a context' },
  { rule: 'contain', cond: 'layout, paint, or strict' },
] as const
