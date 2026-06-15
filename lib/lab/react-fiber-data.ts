// React Fiber reconciliation — visualizer data model.
//
// Each scenario starts from the same component tree shape, applies different
// memoization / prop-stability strategies, and shows how React decides what
// re-renders when a single setState fires at the top.

export type RenderStatus =
  | 'idle' // not touched yet in this scenario
  | 'state-change' // setState called here
  | 'scheduled' // queued for the next render pass
  | 'rendering' // currently running the component function
  | 'committed' // finished — JSX returned, work merged
  | 'skipped-memo' // React.memo + shallow-equal props → no work

export interface FiberTreeNode {
  id: string
  name: string
  isMemo?: boolean
  // Short label like "{ count }" or "memo · { product, onSelect }".
  propsLabel?: string
  children?: FiberTreeNode[]
}

export interface FiberStep {
  states: Record<string, RenderStatus>
  note: string
  // Optional: which line of the code panel is "active" (1-indexed). 0 = none.
  codeLine?: number
}

export interface FiberScenario {
  id: string
  name: string
  blurb: string
  tree: FiberTreeNode
  code: string[]
  steps: FiberStep[]
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const NODE_IDS = [
  'app',
  'header',
  'main',
  'sidebar',
  'user-card',
  'nav-links',
  'product-list',
  'product-1',
  'product-2',
  'product-3',
] as const

type NodeId = (typeof NODE_IDS)[number]

const allIdle = (): Record<string, RenderStatus> =>
  Object.fromEntries(NODE_IDS.map((id) => [id, 'idle' as RenderStatus]))

// Mutable step accumulator — builds up the scenario step by step.
const makeBuilder = () => {
  const out: FiberStep[] = []
  let curr = allIdle()
  const push = (
    overrides: Partial<Record<NodeId, RenderStatus>>,
    note: string,
    codeLine?: number,
  ) => {
    curr = { ...curr, ...overrides }
    out.push({ states: { ...curr }, note, codeLine })
  }
  return { out, push }
}

// ---------------------------------------------------------------------------
// Tree factory — same shape across all scenarios, varying memo flags
// ---------------------------------------------------------------------------

const baseTree = (overrides: {
  headerMemo?: boolean
  productListMemo?: boolean
  productCardMemo?: boolean
  productListPropsLabel?: string
  productCardPropsLabel?: string
}): FiberTreeNode => ({
  id: 'app',
  name: 'App',
  propsLabel: 'useState(count)',
  children: [
    { id: 'header', name: 'Header', isMemo: overrides.headerMemo },
    {
      id: 'main',
      name: 'Main',
      propsLabel: '{ count }',
      children: [
        {
          id: 'sidebar',
          name: 'Sidebar',
          children: [
            { id: 'user-card', name: 'UserCard', propsLabel: '{ user }' },
            { id: 'nav-links', name: 'NavLinks' },
          ],
        },
        {
          id: 'product-list',
          name: 'ProductList',
          isMemo: overrides.productListMemo,
          propsLabel: overrides.productListPropsLabel,
          children: [
            {
              id: 'product-1',
              name: 'ProductCard',
              isMemo: overrides.productCardMemo,
              propsLabel: overrides.productCardPropsLabel,
            },
            {
              id: 'product-2',
              name: 'ProductCard',
              isMemo: overrides.productCardMemo,
              propsLabel: overrides.productCardPropsLabel,
            },
            {
              id: 'product-3',
              name: 'ProductCard',
              isMemo: overrides.productCardMemo,
              propsLabel: overrides.productCardPropsLabel,
            },
          ],
        },
      ],
    },
  ],
})

// ---------------------------------------------------------------------------
// Scenario 1 — Default cascade. No memo anywhere.
// ---------------------------------------------------------------------------

const scenario1: FiberScenario = (() => {
  const { out, push } = makeBuilder()
  push({}, 'App owns a count. User clicks +1. Nothing is memoized.', 0)
  push({ app: 'state-change' }, 'setCount fires inside App. React schedules a re-render rooted at App.', 4)
  push({ app: 'rendering' }, 'App runs. Returns new JSX with the new count.', 7)
  push({ app: 'committed', header: 'rendering' }, 'React walks App\'s children top-down. Header renders first (no memo).', 8)
  push({ header: 'committed', main: 'rendering' }, 'Header returned. Render Main next.', 9)
  push({ main: 'committed', sidebar: 'rendering' }, 'Main returned. Descend into Sidebar.', 9)
  push({ sidebar: 'committed', 'user-card': 'rendering' }, 'Sidebar returned. Render its first child: UserCard.', 9)
  push({ 'user-card': 'committed', 'nav-links': 'rendering' }, 'UserCard returned. Now NavLinks.', 9)
  push({ 'nav-links': 'committed', 'product-list': 'rendering' }, 'NavLinks done. Move back up and into ProductList.', 9)
  push({ 'product-list': 'committed', 'product-1': 'rendering' }, 'ProductList returned. Render its children: 3 ProductCards.', 9)
  push({ 'product-1': 'committed', 'product-2': 'rendering' }, 'ProductCard #1 done.', 9)
  push({ 'product-2': 'committed', 'product-3': 'rendering' }, 'ProductCard #2 done.', 9)
  push({ 'product-3': 'committed' }, 'ProductCard #3 done. Tree fully reconciled.', 9)
  push({}, 'Done. All 10 components re-rendered for one setState — this is the default behavior.', 9)

  return {
    id: 'default-cascade',
    name: 'Default cascade',
    blurb:
      'With no memoization, a setState anywhere causes the owning component and every descendant to re-render. Re-render ≠ DOM update — React still diffs the output before touching the DOM. But every function in the subtree runs.',
    tree: baseTree({}),
    code: [
      `function App() {`,
      `  const [count, setCount] = useState(0)`,
      ``,
      `  return (`,
      `    <div>`,
      `      <button onClick={() => setCount(c => c + 1)}>+1</button>`,
      `      <Header />`,
      `      <Main count={count} />`,
      `    </div>`,
      `  )`,
      `}`,
    ],
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 2 — React.memo blocks a subtree
// ---------------------------------------------------------------------------

const scenario2: FiberScenario = (() => {
  const { out, push } = makeBuilder()
  push({}, 'Header is wrapped in React.memo. ProductList is too. Both receive only stable props.', 0)
  push({ app: 'state-change' }, 'setCount fires in App. Schedule a re-render at App.', 7)
  push({ app: 'rendering' }, 'App runs. New JSX produced.', 10)
  push({ app: 'committed', header: 'scheduled' }, 'Reconcile children. Header is memo\'d — React checks props before running it.', 11)
  push({ header: 'skipped-memo' }, 'Header gets no props from App. Shallow compare passes. Skip — its function is NOT called.', 11)
  push({ main: 'rendering' }, 'Move to Main. Not memo\'d, so it runs.', 12)
  push({ main: 'committed', sidebar: 'rendering' }, 'Descend into Sidebar.', 12)
  push({ sidebar: 'committed', 'user-card': 'rendering' }, 'Sidebar done. Render UserCard.', 12)
  push({ 'user-card': 'committed', 'nav-links': 'rendering' }, 'UserCard done. NavLinks.', 12)
  push({ 'nav-links': 'committed', 'product-list': 'scheduled' }, 'NavLinks done. ProductList is next — and it\'s memo\'d.', 12)
  push(
    {
      'product-list': 'skipped-memo',
      'product-1': 'skipped-memo',
      'product-2': 'skipped-memo',
      'product-3': 'skipped-memo',
    },
    'ProductList\'s items reference is stable. Memo skips. The 3 ProductCards inside are not traversed at all.',
    12,
  )
  push({}, 'Done. 5 components rendered, 5 skipped — Header plus ProductList\'s entire subtree.', 12)

  return {
    id: 'memo-blocks-subtree',
    name: 'memo() blocks a subtree',
    blurb:
      'React.memo wraps a component in a shallow prop-equality check. If props haven\'t changed, the function isn\'t called — and its children aren\'t traversed either. The whole subtree is skipped.',
    tree: baseTree({
      headerMemo: true,
      productListMemo: true,
      productListPropsLabel: 'memo · { items }',
    }),
    code: [
      `const Header = React.memo(function Header() {`,
      `  // No props at all`,
      `})`,
      ``,
      `const ProductList = React.memo(function ProductList({ items }) {`,
      `  // items is from a module-level constant — stable reference`,
      `})`,
      ``,
      `function App() {`,
      `  const [count, setCount] = useState(0)`,
      `  return <Main count={count}><Header /><ProductList items={ITEMS} /></Main>`,
      `}`,
    ],
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 3 — Inline function defeats memo
// ---------------------------------------------------------------------------

const scenario3: FiberScenario = (() => {
  const { out, push } = makeBuilder()
  push({}, 'Each ProductCard is memo\'d. But App passes an INLINE function as onSelect every render.', 0)
  push({ app: 'state-change' }, 'setCount fires. Schedule re-render.', 9)
  push({ app: 'rendering' }, 'App runs. The inline `(id) => ...` is created as a fresh function every render.', 11)
  push({ app: 'committed', header: 'rendering' }, 'Header has no memo here — render.', 12)
  push({ header: 'committed', main: 'rendering' }, 'Main runs.', 12)
  push({ main: 'committed', sidebar: 'rendering' }, 'Sidebar runs.', 12)
  push({ sidebar: 'committed', 'user-card': 'rendering' }, 'UserCard runs.', 12)
  push({ 'user-card': 'committed', 'nav-links': 'rendering' }, 'NavLinks runs.', 12)
  push({ 'nav-links': 'committed', 'product-list': 'rendering' }, 'ProductList runs. Passes onSelect down to each card.', 12)
  push({ 'product-list': 'committed', 'product-1': 'scheduled' }, 'ProductCard #1 is memo\'d — React shallow-compares props.', 12)
  push({ 'product-1': 'rendering' }, 'onSelect has a NEW function reference. Object.is fails. Memo defeated. Render.', 12)
  push({ 'product-1': 'committed', 'product-2': 'scheduled' }, 'Same check for #2.', 12)
  push({ 'product-2': 'rendering' }, 'Same outcome — new function ref. Render.', 12)
  push({ 'product-2': 'committed', 'product-3': 'scheduled' }, 'And #3.', 12)
  push({ 'product-3': 'rendering' }, 'New function ref. Render.', 12)
  push({ 'product-3': 'committed' }, 'All cards re-rendered despite React.memo.', 12)
  push({}, 'Done. All 10 components rendered. The memo had no effect — the inline function leaked through.', 12)

  return {
    id: 'inline-fn-defeats-memo',
    name: 'Inline function defeats memo',
    blurb:
      'React.memo does a shallow Object.is on every prop. An inline `() => ...` callback is a new function reference on every render, so the comparison fails — and the memoized child re-renders anyway.',
    tree: baseTree({
      productCardMemo: true,
      productCardPropsLabel: 'memo · { product, onSelect }',
    }),
    code: [
      `const ProductCard = React.memo(function ProductCard({ product, onSelect }) {`,
      `  return (`,
      `    <button onClick={() => onSelect(product.id)}>{product.name}</button>`,
      `  )`,
      `})`,
      ``,
      `function ProductList({ items, onSelect }) {`,
      `  return items.map(p => <ProductCard key={p.id} product={p} onSelect={onSelect} />)`,
      `}`,
      ``,
      `function App() {`,
      `  const [count, setCount] = useState(0)`,
      `  // 🚨 New function every render`,
      `  return <ProductList items={ITEMS} onSelect={(id) => console.log(id)} />`,
      `}`,
    ],
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 4 — useCallback rescues memo
// ---------------------------------------------------------------------------

const scenario4: FiberScenario = (() => {
  const { out, push } = makeBuilder()
  push({}, 'Same setup, but App wraps onSelect in useCallback with an empty dep array. Function identity is stable.', 0)
  push({ app: 'state-change' }, 'setCount fires.', 9)
  push({ app: 'rendering' }, 'App runs. useCallback returns the SAME function instance as last render (deps unchanged).', 11)
  push({ app: 'committed', header: 'rendering' }, 'Header renders (no memo).', 13)
  push({ header: 'committed', main: 'rendering' }, 'Main runs.', 13)
  push({ main: 'committed', sidebar: 'rendering' }, 'Sidebar runs.', 13)
  push({ sidebar: 'committed', 'user-card': 'rendering' }, 'UserCard runs.', 13)
  push({ 'user-card': 'committed', 'nav-links': 'rendering' }, 'NavLinks runs.', 13)
  push({ 'nav-links': 'committed', 'product-list': 'rendering' }, 'ProductList runs (not memo\'d here).', 13)
  push({ 'product-list': 'committed', 'product-1': 'scheduled' }, 'ProductCard #1 — memo prop check.', 13)
  push({ 'product-1': 'skipped-memo' }, 'product reference unchanged. onSelect reference unchanged (useCallback). Shallow-equal. Skip.', 13)
  push({ 'product-2': 'scheduled' }, 'Same check for #2.', 13)
  push({ 'product-2': 'skipped-memo' }, 'Stable props. Skip.', 13)
  push({ 'product-3': 'scheduled' }, 'And #3.', 13)
  push({ 'product-3': 'skipped-memo' }, 'Stable. Skip.', 13)
  push({}, 'Done. 6 components rendered, 3 skipped. useCallback + memo work together — but only if the cards also receive stable product refs.', 13)

  return {
    id: 'usecallback-rescues',
    name: 'useCallback rescues memo',
    blurb:
      'useCallback stabilizes the function identity across renders. Combined with React.memo on the child, the shallow prop check passes and the subtree skips — the optimization works.',
    tree: baseTree({
      productCardMemo: true,
      productCardPropsLabel: 'memo · { product, onSelect }',
    }),
    code: [
      `const ProductCard = React.memo(function ProductCard({ product, onSelect }) {`,
      `  return (`,
      `    <button onClick={() => onSelect(product.id)}>{product.name}</button>`,
      `  )`,
      `})`,
      ``,
      `function App() {`,
      `  const [count, setCount] = useState(0)`,
      ``,
      `  // ✓ Stable identity across renders`,
      `  const handleSelect = useCallback((id) => console.log(id), [])`,
      ``,
      `  return <ProductList items={ITEMS} onSelect={handleSelect} />`,
      `}`,
    ],
    steps: out,
  }
})()

export const scenarios: FiberScenario[] = [scenario1, scenario2, scenario3, scenario4]
