// RSC Serialization Boundary — visualizer data model.
//
// React Server Components run only on the server. Their output is
// serialized as the "RSC payload" and sent to the client, which uses it
// to render alongside its own Client Components. Props passed from a
// Server Component to a Client Component cross this boundary — and the
// boundary has rules about what can cross.

export type PropStatus =
  | 'pending'
  | 'in-transit'
  | 'accepted'
  | 'rejected'

export type PropKind =
  | 'primitive' // string, number, boolean, null
  | 'array'
  | 'object'
  | 'date'
  | 'function' // plain function — fails
  | 'server-action' // function with 'use server' — passes as RPC reference
  | 'jsx' // React element (server-rendered tree)

export interface RSCProp {
  id: string
  name: string
  kind: PropKind
  // Human-readable preview of what the prop looks like on the server.
  serverPreview: string
  // What the prop becomes on the client (or error message if rejected).
  clientPreview: string
  // The wire-format snippet added to the RSC payload when accepted.
  wire?: string
  // Reason string shown when rejected.
  rejectReason?: string
}

export interface RSCStep {
  states: Record<string, PropStatus>
  // Which prop is being processed this step (drives focus + the "Now" note).
  focus: string | null
  note: string
  // The accumulated RSC payload up to and including this step.
  payload: string[]
  codeLine?: number
  // Did the render as a whole fail at this step?
  failed?: boolean
}

export interface RSCScenario {
  id: string
  name: string
  blurb: string
  serverCode: string[]
  serverComponent: string
  clientComponent: string
  props: RSCProp[]
  steps: RSCStep[]
}

// ---------------------------------------------------------------------------
// Builder helper
// ---------------------------------------------------------------------------

const initialStates = (props: RSCProp[]): Record<string, PropStatus> =>
  Object.fromEntries(props.map((p) => [p.id, 'pending' as PropStatus]))

const makeBuilder = (props: RSCProp[]) => {
  const out: RSCStep[] = []
  let curr = initialStates(props)
  let payload: string[] = []
  const push = (
    overrides: Record<string, PropStatus>,
    focus: string | null,
    note: string,
    opts?: { addWire?: string; codeLine?: number; failed?: boolean },
  ) => {
    curr = { ...curr, ...overrides }
    if (opts?.addWire) payload = [...payload, opts.addWire]
    out.push({
      states: { ...curr },
      focus,
      note,
      payload: [...payload],
      codeLine: opts?.codeLine,
      failed: opts?.failed,
    })
  }
  return { out, push }
}

// ---------------------------------------------------------------------------
// Scenario 1 — Plain props cross cleanly
// ---------------------------------------------------------------------------

const scenario1Props: RSCProp[] = [
  {
    id: 'title',
    name: 'title',
    kind: 'primitive',
    serverPreview: '"Headphones"',
    clientPreview: '"Headphones"',
    wire: '"title": "Headphones"',
  },
  {
    id: 'price',
    name: 'price',
    kind: 'primitive',
    serverPreview: '199',
    clientPreview: '199',
    wire: '"price": 199',
  },
  {
    id: 'tags',
    name: 'tags',
    kind: 'array',
    serverPreview: '["audio", "wireless"]',
    clientPreview: '["audio", "wireless"]',
    wire: '"tags": ["audio", "wireless"]',
  },
  {
    id: 'addedAt',
    name: 'addedAt',
    kind: 'date',
    serverPreview: 'new Date()',
    clientPreview: 'Date "2026-01-15T..."',
    wire: '"addedAt": {"$D": "2026-01-15T..."}',
  },
]

const scenario1: RSCScenario = (() => {
  const { out, push } = makeBuilder(scenario1Props)
  push({}, null, 'A Server Component renders an <AddToCart /> Client Component with four props. Each one will be checked at the boundary.', {})
  push({ title: 'in-transit' }, 'title', 'Check `title`. A string primitive serializes directly to JSON.', { codeLine: 6 })
  push({ title: 'accepted' }, 'title', 'Accepted. Appended to the RSC payload.', { addWire: '"title": "Headphones"', codeLine: 6 })
  push({ price: 'in-transit' }, 'price', 'Check `price`. A number primitive — also JSON-safe.', { codeLine: 7 })
  push({ price: 'accepted' }, 'price', 'Accepted.', { addWire: '"price": 199', codeLine: 7 })
  push({ tags: 'in-transit' }, 'tags', 'Check `tags`. Array of strings — every item is serializable, so the whole array passes.', { codeLine: 8 })
  push({ tags: 'accepted' }, 'tags', 'Accepted.', { addWire: '"tags": ["audio", "wireless"]', codeLine: 8 })
  push({ addedAt: 'in-transit' }, 'addedAt', 'Check `addedAt`. A Date isn\'t valid JSON — but Next.js has special encoding for built-in types like Date, Map, Set, URL, BigInt, etc.', { codeLine: 9 })
  push({ addedAt: 'accepted' }, 'addedAt', 'Accepted. On the wire it\'s encoded as `{"$D": "..."}`. The client deserializes it back into a real Date instance.', { addWire: '"addedAt": {"$D": "2026-01-15T..."}', codeLine: 9 })
  push({}, null, 'Done. All 4 props crossed. The Client Component receives real native types — string, number, array, Date.', {})

  return {
    id: 'primitives-pass',
    name: 'Primitives + Date',
    blurb:
      'String, number, boolean, plain object, array, null, undefined — all standard JSON-serializable values cross cleanly. Built-in types like Date, Map, Set, URL, BigInt also pass via Next.js\' extended encoding.',
    serverComponent: 'ProductPage',
    clientComponent: 'AddToCart',
    serverCode: [
      `// app/products/page.tsx`,
      `// Server Component (no 'use client')`,
      `import { AddToCart } from './add-to-cart'`,
      ``,
      `export default function ProductPage() {`,
      `  return <AddToCart`,
      `    title="Headphones"`,
      `    price={199}`,
      `    tags={['audio', 'wireless']}`,
      `    addedAt={new Date()}`,
      `  />`,
      `}`,
    ],
    props: scenario1Props,
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 2 — A plain function is rejected
// ---------------------------------------------------------------------------

const scenario2Props: RSCProp[] = [
  {
    id: 'title',
    name: 'title',
    kind: 'primitive',
    serverPreview: '"Headphones"',
    clientPreview: '"Headphones"',
    wire: '"title": "Headphones"',
  },
  {
    id: 'onAdd',
    name: 'onAdd',
    kind: 'function',
    serverPreview: '(id) => console.log(id)',
    clientPreview: 'ERROR — functions can\'t cross',
    rejectReason:
      'Functions cannot be passed directly to Client Components. Only functions marked with the \'use server\' directive (Server Actions) are allowed.',
  },
]

const scenario2: RSCScenario = (() => {
  const { out, push } = makeBuilder(scenario2Props)
  push({}, null, 'Same Server Component, but it tries to pass an inline `onAdd` callback. This is the most common RSC bug.', {})
  push({ title: 'in-transit' }, 'title', 'title passes.', { codeLine: 5 })
  push({ title: 'accepted' }, 'title', 'Accepted.', { addWire: '"title": "Headphones"', codeLine: 5 })
  push({ onAdd: 'in-transit' }, 'onAdd', 'Check `onAdd`. It\'s a regular function defined inside the Server Component.', { codeLine: 6 })
  push(
    { onAdd: 'rejected' },
    'onAdd',
    'REJECTED. The serializer doesn\'t know how to send a function. Next.js throws: "Functions are not valid as a child of Client Components."',
    { codeLine: 6, failed: true },
  )
  push({}, null, 'Render fails at the boundary. The RSC payload is incomplete. The page errors out at runtime.', { failed: true })

  return {
    id: 'function-rejected',
    name: 'Function: rejected',
    blurb:
      'Functions are not serializable. Passing one from a Server Component to a Client Component crashes at runtime. This is the rule that catches every new RSC developer.',
    serverComponent: 'ProductPage',
    clientComponent: 'AddToCart',
    serverCode: [
      `export default function ProductPage() {`,
      `  // 🚨 Regular function defined inline`,
      `  const onAdd = (id: string) => console.log(id)`,
      ``,
      `  return <AddToCart`,
      `    title="Headphones"`,
      `    onAdd={onAdd}  // crash`,
      `  />`,
      `}`,
    ],
    props: scenario2Props,
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 3 — A Server Action does cross
// ---------------------------------------------------------------------------

const scenario3Props: RSCProp[] = [
  {
    id: 'title',
    name: 'title',
    kind: 'primitive',
    serverPreview: '"Headphones"',
    clientPreview: '"Headphones"',
    wire: '"title": "Headphones"',
  },
  {
    id: 'onAdd',
    name: 'onAdd',
    kind: 'server-action',
    serverPreview: 'addToCartAction (\'use server\')',
    clientPreview: 'opaque ref → RPC',
    wire: '"onAdd": {"$F": "addToCartAction#abc123"}',
  },
]

const scenario3: RSCScenario = (() => {
  const { out, push } = makeBuilder(scenario3Props)
  push({}, null, 'Same code, but the function is marked with the \'use server\' directive. Now the boundary treats it as a Server Action.', {})
  push({ title: 'in-transit' }, 'title', 'title passes.', { codeLine: 7 })
  push({ title: 'accepted' }, 'title', 'Accepted.', { addWire: '"title": "Headphones"', codeLine: 7 })
  push({ onAdd: 'in-transit' }, 'onAdd', 'Check `onAdd`. It\'s a function — but it\'s a Server Action (\'use server\').', { codeLine: 8 })
  push(
    { onAdd: 'accepted' },
    'onAdd',
    'Accepted. The function itself isn\'t sent. Next.js generates an opaque reference ID and writes that to the payload.',
    { addWire: '"onAdd": {"$F": "addToCartAction#abc123"}', codeLine: 8 },
  )
  push({}, null, 'Done. When the client calls `onAdd(...)`, Next.js sends an RPC to the server with the args. The function still runs server-side — but the client can invoke it.', {})

  return {
    id: 'server-action-accepted',
    name: 'Server Action: accepted',
    blurb:
      'A function marked with \'use server\' is treated specially. Next.js replaces it with an opaque reference on the wire. When the client calls it, an RPC fires back to the server. The function never executes on the client.',
    serverComponent: 'ProductPage',
    clientComponent: 'AddToCart',
    serverCode: [
      `// app/products/actions.ts`,
      `'use server'`,
      `export async function addToCartAction(id: string) {`,
      `  await db.cart.add(id)`,
      `}`,
      ``,
      `export default function ProductPage() {`,
      `  return <AddToCart`,
      `    title="Headphones"`,
      `    onAdd={addToCartAction}  // ← passes as RPC ref`,
      `  />`,
      `}`,
    ],
    props: scenario3Props,
    steps: out,
  }
})()

// ---------------------------------------------------------------------------
// Scenario 4 — Server JSX as children (composition pattern)
// ---------------------------------------------------------------------------

const scenario4Props: RSCProp[] = [
  {
    id: 'autoplay',
    name: 'autoplay',
    kind: 'primitive',
    serverPreview: 'true',
    clientPreview: 'true',
    wire: '"autoplay": true',
  },
  {
    id: 'children',
    name: 'children',
    kind: 'jsx',
    serverPreview: '<ProductCard /> × 3',
    clientPreview: 'pre-rendered tree, client mounts as slots',
    wire: '"children": [...3 RSC trees...]',
  },
]

const scenario4: RSCScenario = (() => {
  const { out, push } = makeBuilder(scenario4Props)
  push({}, null, 'A Client Component (<Carousel />) accepts server-rendered JSX as `children`. This is the composition pattern that lets you nest Server Components inside Client Components.', {})
  push({ autoplay: 'in-transit' }, 'autoplay', 'autoplay is a boolean primitive.', { codeLine: 7 })
  push({ autoplay: 'accepted' }, 'autoplay', 'Accepted.', { addWire: '"autoplay": true', codeLine: 7 })
  push({ children: 'in-transit' }, 'children', 'Check `children`. It\'s an array of <ProductCard /> JSX elements — Server Components that React already rendered into trees.', { codeLine: 8 })
  push(
    { children: 'accepted' },
    'children',
    'Accepted. The server-rendered JSX is serialized as part of the RSC payload. The Client Component sees `children` as a ready-to-mount React subtree.',
    { addWire: '"children": [...3 RSC trees serialized...]', codeLine: 8 },
  )
  push({}, null, 'Done. <Carousel /> is a Client Component (it has interactive behavior), but its children are Server Components that ran on the server. The Server Components never become Client Components — they\'re inserted as slots.', {})

  return {
    id: 'jsx-children-composition',
    name: 'JSX children: composition',
    blurb:
      'You cannot import a Server Component into a Client Component. But a Server Component can pass server-rendered JSX as `children` (or any prop) into a Client Component. This is how interactive containers wrap server-rendered content.',
    serverComponent: 'ProductsPage',
    clientComponent: 'Carousel',
    serverCode: [
      `// Carousel is a Client Component (has useState, etc.)`,
      `// ProductCard is a Server Component (database access)`,
      ``,
      `export default async function ProductsPage() {`,
      `  const products = await db.products.list()`,
      ``,
      `  return (`,
      `    <Carousel autoplay>`,
      `      {products.map(p => <ProductCard key={p.id} product={p} />)}`,
      `    </Carousel>`,
      `  )`,
      `}`,
    ],
    props: scenario4Props,
    steps: out,
  }
})()

export const scenarios: RSCScenario[] = [
  scenario1,
  scenario2,
  scenario3,
  scenario4,
]
