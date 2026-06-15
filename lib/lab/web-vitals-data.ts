// Core Web Vitals — visualizer data model.
//
// Three scenarios, one per vital. Each walks through a "before fix"
// timeline that produces a poor score, applies a fix, then runs the
// "after fix" timeline that produces a good score.
//
// 2024+ thresholds:
//   LCP — good ≤ 2500ms, poor > 4000ms
//   INP — good ≤ 200ms,  poor > 500ms   (replaced FID in March 2024)
//   CLS — good ≤ 0.1,    poor > 0.25

export type Vital = 'lcp' | 'inp' | 'cls'

export type Rating = 'good' | 'needs-improvement' | 'poor' | 'pending'

export interface VitalScore {
  value: number // ms for LCP/INP, unitless ratio for CLS
  rating: Rating
}

// One block on the rendered "viewport".
export type BlockKind = 'header' | 'text' | 'hero' | 'ad' | 'cta' | 'footer'

export interface ViewportBlock {
  id: string
  kind: BlockKind
  label: string
  // 'absent'     — not yet in DOM (reserved space not painted)
  // 'reserved'   — placeholder with aspect-ratio reserved (no shift on later load)
  // 'loading'    — fetching, shown as a spinner / pulse
  // 'painted'    — visible
  state: 'absent' | 'reserved' | 'loading' | 'painted'
  // Height in arbitrary "viewport units" (used to compute shift offsets visually)
  height: number
  // If a shift happened on this step, this block was the one pushed down (or up).
  // Stored as the previous Y position relative to current — drives the animation.
  shiftedFromY?: number
}

export type Phase = 'before-fix' | 'transition' | 'after-fix'

export interface CWVStep {
  phase: Phase
  // Time-on-the-clock for this phase (resets between phases)
  timeMs: number
  event: string
  blocks: ViewportBlock[]
  // Current scores (only show the focused vital for this scenario; others may be undefined)
  scores: Partial<Record<Vital, VitalScore>>
  note: string
  // Active code line in the BEFORE source. We always show the "before" source for
  // the before-fix half and the "after" source for the after-fix half.
  codeLine?: number
}

export interface CWVScenario {
  id: string
  name: string
  vital: Vital
  blurb: string
  before: string[]
  after: string[]
  steps: CWVStep[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function rate(vital: Vital, value: number): Rating {
  if (vital === 'lcp') {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }
  if (vital === 'inp') {
    if (value <= 200) return 'good'
    if (value <= 500) return 'needs-improvement'
    return 'poor'
  }
  // cls
  if (value <= 0.1) return 'good'
  if (value <= 0.25) return 'needs-improvement'
  return 'poor'
}

const s = (vital: Vital, value: number): VitalScore => ({
  value,
  rating: rate(vital, value),
})

// ---------------------------------------------------------------------------
// Scenario 1 — LCP: slow hero image, then priority + width/height
// ---------------------------------------------------------------------------

const lcpScenario: CWVScenario = {
  id: 'lcp-hero-image',
  name: 'LCP — Hero image',
  vital: 'lcp',
  blurb:
    'A hero image is the LCP element on most landing pages. Without a preload hint, the browser doesn\'t discover the image source until it parses the HTML body. That late discovery is the entire cost.',
  before: [
    `// app/page.tsx`,
    ``,
    `export default function Home() {`,
    `  return (`,
    `    <main>`,
    `      <h1>Welcome</h1>`,
    `      <p>Some intro copy...</p>`,
    `      <img src="/hero.jpg" alt="Hero" />`,
    `    </main>`,
    `  )`,
    `}`,
  ],
  after: [
    `// app/page.tsx`,
    `import Image from 'next/image'`,
    ``,
    `export default function Home() {`,
    `  return (`,
    `    <main>`,
    `      <h1>Welcome</h1>`,
    `      <p>Some intro copy...</p>`,
    `      <Image`,
    `        src="/hero.jpg" alt="Hero"`,
    `        width={1200} height={600}`,
    `        priority`,
    `      />`,
    `    </main>`,
    `  )`,
    `}`,
  ],
  steps: [
    {
      phase: 'before-fix',
      timeMs: 0,
      event: 'Navigation start',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'absent', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image (no dims)', state: 'absent', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'User loads /. HTML request fires. No preload hint for the hero image — the browser doesn\'t know about it yet.',
      codeLine: 1,
    },
    {
      phase: 'before-fix',
      timeMs: 350,
      event: 'HTML received, parsing',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'absent', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image (no dims)', state: 'absent', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'HTML arrives. Browser parses head, then body. Hero <img> tag isn\'t discovered until ~350ms in.',
      codeLine: 8,
    },
    {
      phase: 'before-fix',
      timeMs: 380,
      event: 'Image request fired',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'painted', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'loading', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'Browser finds the <img> and fires the request. Text content already paints (FCP at ~380ms).',
      codeLine: 8,
    },
    {
      phase: 'before-fix',
      timeMs: 1800,
      event: 'Still loading',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'painted', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'loading', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'Image is large (~600KB), CDN is in another region. Browser is still waiting.',
      codeLine: 8,
    },
    {
      phase: 'before-fix',
      timeMs: 4200,
      event: 'LCP fired',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'painted', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'painted', height: 5 },
      ],
      scores: { lcp: s('lcp', 4200) },
      note: 'Hero finally paints at 4.2s. It\'s the largest element, so this is the LCP event. POOR rating (> 4s threshold).',
      codeLine: 8,
    },
    {
      phase: 'transition',
      timeMs: 0,
      event: 'Applying fix',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'absent', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'absent', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'Apply the fix: replace <img> with next/image, add `priority` and explicit dimensions. Next.js will inject a <link rel="preload" as="image" /> into <head>.',
    },
    {
      phase: 'after-fix',
      timeMs: 50,
      event: 'HTML head parsed',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'absent', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'loading', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'Browser parses <head>. Finds the preload hint for /hero.jpg and fires the image request IMMEDIATELY — in parallel with HTML body parsing.',
      codeLine: 2,
    },
    {
      phase: 'after-fix',
      timeMs: 380,
      event: 'FCP — text paints',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'painted', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'loading', height: 5 },
      ],
      scores: { lcp: { value: 0, rating: 'pending' } },
      note: 'Header + text paint. Image is still arriving but already in-flight since 50ms.',
      codeLine: 9,
    },
    {
      phase: 'after-fix',
      timeMs: 1600,
      event: 'LCP fired',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Intro copy', state: 'painted', height: 2 },
        { id: 'i', kind: 'hero', label: 'Hero image', state: 'painted', height: 5 },
      ],
      scores: { lcp: s('lcp', 1600) },
      note: 'Hero paints at 1.6s. Same network, same image — but the request started 300ms earlier and ran in parallel. GOOD rating (< 2.5s).',
      codeLine: 9,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — INP: heavy sync work on click, then useTransition
// ---------------------------------------------------------------------------

const inpScenario: CWVScenario = {
  id: 'inp-heavy-click',
  name: 'INP — Heavy click handler',
  vital: 'inp',
  blurb:
    'User clicks a filter button. The click handler synchronously re-renders a 5,000-item list. The main thread is blocked, and the next paint is delayed. INP measures from input to next paint.',
  before: [
    `function FilterList() {`,
    `  const [query, setQuery] = useState('')`,
    `  const items = useMemo(() =>`,
    `    bigList.filter(i => i.includes(query)),`,
    `    [query]`,
    `  )`,
    ``,
    `  return (`,
    `    <>`,
    `      <input onChange={e =>`,
    `        setQuery(e.target.value)  // sync update`,
    `      } />`,
    `      <List items={items} />`,
    `    </>`,
    `  )`,
    `}`,
  ],
  after: [
    `function FilterList() {`,
    `  const [query, setQuery] = useState('')`,
    `  const deferred = useDeferredValue(query)`,
    `  const items = useMemo(() =>`,
    `    bigList.filter(i => i.includes(deferred)),`,
    `    [deferred]`,
    `  )`,
    ``,
    `  return (`,
    `    <>`,
    `      <input onChange={e =>`,
    `        setQuery(e.target.value)`,
    `      } />`,
    `      <List items={items} />`,
    `    </>`,
    `  )`,
    `}`,
  ],
  steps: [
    {
      phase: 'before-fix',
      timeMs: 0,
      event: 'User types in filter',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: '5000-item list', state: 'painted', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'User types in the filter input. onChange fires.',
      codeLine: 10,
    },
    {
      phase: 'before-fix',
      timeMs: 5,
      event: 'setQuery called',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'loading', height: 1 },
        { id: 't', kind: 'text', label: 'List re-rendering...', state: 'loading', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'setQuery triggers a synchronous re-render. Main thread is now blocked while React filters 5,000 items.',
      codeLine: 11,
    },
    {
      phase: 'before-fix',
      timeMs: 180,
      event: 'Still blocked',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'loading', height: 1 },
        { id: 't', kind: 'text', label: 'List re-rendering...', state: 'loading', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'Filter + re-render is still running. User\'s keystroke hasn\'t been reflected in the input yet.',
      codeLine: 4,
    },
    {
      phase: 'before-fix',
      timeMs: 380,
      event: 'Paint',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Filtered list (1,200 items)', state: 'painted', height: 6 },
      ],
      scores: { inp: s('inp', 380) },
      note: 'Main thread frees up. Browser finally paints: input shows the character, list is filtered. INP = 380ms. POOR (> 200ms).',
      codeLine: 10,
    },
    {
      phase: 'transition',
      timeMs: 0,
      event: 'Applying fix',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: '5000-item list', state: 'painted', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'Apply the fix: wrap the derived value with useDeferredValue (or wrap the setQuery in startTransition). React marks the list update as non-urgent.',
    },
    {
      phase: 'after-fix',
      timeMs: 0,
      event: 'User types in filter',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: '5000-item list', state: 'painted', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'User types again.',
      codeLine: 11,
    },
    {
      phase: 'after-fix',
      timeMs: 15,
      event: 'Urgent update commits',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: '5000-item list (stale)', state: 'painted', height: 6 },
      ],
      scores: { inp: { value: 0, rating: 'pending' } },
      note: 'setQuery commits as an urgent update — input character is reflected immediately. The derived value (deferred) still holds the old query.',
      codeLine: 3,
    },
    {
      phase: 'after-fix',
      timeMs: 60,
      event: 'Paint',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: '5000-item list (stale)', state: 'painted', height: 6 },
      ],
      scores: { inp: s('inp', 60) },
      note: 'Paint happens with the new input value but old list. INP = 60ms — GOOD. The user-visible response is fast.',
      codeLine: 11,
    },
    {
      phase: 'after-fix',
      timeMs: 380,
      event: 'Deferred update completes',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'cta', label: 'Filter input', state: 'painted', height: 1 },
        { id: 't', kind: 'text', label: 'Filtered list (1,200 items)', state: 'painted', height: 6 },
      ],
      scores: { inp: s('inp', 60) },
      note: 'Background re-render finishes. List updates. INP stays 60ms — only the user-input-to-first-paint window counts.',
      codeLine: 11,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — CLS: image without dimensions, then aspect-ratio
// ---------------------------------------------------------------------------

const clsScenario: CWVScenario = {
  id: 'cls-image-no-dims',
  name: 'CLS — Image without dimensions',
  vital: 'cls',
  blurb:
    'A page renders text first. Then a hero image arrives and pushes the text down by hundreds of pixels — the user was already reading. That shift is the entire CLS score.',
  before: [
    `<header>...</header>`,
    `<img src="/hero.jpg" alt="Hero" />`,
    `<article>`,
    `  <h1>Headline</h1>`,
    `  <p>Body text the user is already reading...</p>`,
    `</article>`,
  ],
  after: [
    `<header>...</header>`,
    `<img`,
    `  src="/hero.jpg" alt="Hero"`,
    `  width={1200} height={600}`,
    `  style={{ aspectRatio: '2 / 1' }}`,
    `/>`,
    `<article>`,
    `  <h1>Headline</h1>`,
    `  <p>Body text the user is already reading...</p>`,
    `</article>`,
  ],
  steps: [
    {
      phase: 'before-fix',
      timeMs: 0,
      event: 'Navigation start',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (no dims)', state: 'absent', height: 5 },
        { id: 't', kind: 'text', label: 'Body text', state: 'absent', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'pending' } },
      note: 'Page request fires.',
      codeLine: 2,
    },
    {
      phase: 'before-fix',
      timeMs: 400,
      event: 'Initial paint (no image)',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (0px tall)', state: 'absent', height: 0 },
        { id: 't', kind: 'text', label: 'Body text', state: 'painted', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'good' } },
      note: 'Text paints. The image has no width/height attributes — the browser reserves 0px for it. The body text sits right under the header.',
      codeLine: 2,
    },
    {
      phase: 'before-fix',
      timeMs: 1100,
      event: 'User starts reading',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (0px tall)', state: 'loading', height: 0 },
        { id: 't', kind: 'text', label: 'Body text', state: 'painted', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'good' } },
      note: 'User is already scanning the headline. Image is still in flight in the background.',
      codeLine: 2,
    },
    {
      phase: 'before-fix',
      timeMs: 2200,
      event: 'Image loads — SHIFT',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (just arrived)', state: 'painted', height: 5 },
        {
          id: 't',
          kind: 'text',
          label: 'Body text (pushed down)',
          state: 'painted',
          height: 4,
          shiftedFromY: -5,
        },
      ],
      scores: { cls: s('cls', 0.32) },
      note: 'Image lands. The browser now allocates 600px for it. Everything below jumps down 600px. CLS = 0.32. POOR (> 0.25). User loses their reading position.',
      codeLine: 2,
    },
    {
      phase: 'transition',
      timeMs: 0,
      event: 'Applying fix',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (no dims)', state: 'absent', height: 5 },
        { id: 't', kind: 'text', label: 'Body text', state: 'absent', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'pending' } },
      note: 'Apply the fix: add width + height attributes (and/or aspect-ratio in CSS). Browser knows the slot size before the image arrives — it reserves the space up front.',
    },
    {
      phase: 'after-fix',
      timeMs: 0,
      event: 'Navigation start',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'absent', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (reserved)', state: 'absent', height: 5 },
        { id: 't', kind: 'text', label: 'Body text', state: 'absent', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'pending' } },
      note: 'Same page request.',
      codeLine: 4,
    },
    {
      phase: 'after-fix',
      timeMs: 400,
      event: 'Initial paint (space reserved)',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (reserved 2:1 slot)', state: 'reserved', height: 5 },
        { id: 't', kind: 'text', label: 'Body text', state: 'painted', height: 4 },
      ],
      scores: { cls: { value: 0, rating: 'good' } },
      note: 'Text paints. The browser knows the image will be 2:1 — it reserves 600px slot now. Body text sits at its final position.',
      codeLine: 5,
    },
    {
      phase: 'after-fix',
      timeMs: 2200,
      event: 'Image loads into reserved slot',
      blocks: [
        { id: 'h', kind: 'header', label: 'Header', state: 'painted', height: 1 },
        { id: 'i', kind: 'hero', label: 'Hero (loaded into slot)', state: 'painted', height: 5 },
        { id: 't', kind: 'text', label: 'Body text', state: 'painted', height: 4 },
      ],
      scores: { cls: s('cls', 0) },
      note: 'Image arrives. It fills the slot that was already reserved. No layout shifts anywhere. CLS = 0.00. GOOD.',
      codeLine: 4,
    },
  ],
}

export const scenarios: CWVScenario[] = [lcpScenario, inpScenario, clsScenario]
