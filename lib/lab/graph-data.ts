// Graph visualizer — data model.
//
// Nodes are positioned by hand in [0, 1] coordinate space so the SVG
// renderer can lay them out at any container size. Each scenario steps
// through one of: BFS, DFS, topological sort (Kahn's), cycle detection
// (DFS 3-color).

export type GraphNodeState =
  | 'normal'
  | 'current' // pointer is here
  | 'visited' // fully processed (BFS/DFS done with it)
  | 'in-queue' // pending in BFS queue
  | 'in-stack' // pending in DFS stack / on recursion stack
  | 'gray' // in current DFS path (cycle detection)
  | 'black' // fully explored (cycle detection)
  | 'sorted' // emitted to topological order
  | 'cycle' // member of detected cycle

export interface GraphNode {
  id: string
  label: string
  x: number // [0, 1]
  y: number // [0, 1]
  state: GraphNodeState
}

export type GraphEdgeState =
  | 'normal'
  | 'highlighted'
  | 'traversed' // BFS/DFS used this edge
  | 'back-edge' // back-edge — usually a cycle marker

export interface GraphEdge {
  fromId: string
  toId: string
  directed: boolean
  state: GraphEdgeState
  weight?: number // optional, for weighted scenarios
}

export interface GraphStep {
  nodes: GraphNode[]
  edges: GraphEdge[]
  // BFS queue / DFS stack snapshot at this step. Render only one of the two
  // depending on scenario.
  queue?: string[]
  stack?: string[]
  // Output order (visit order, or topological order)
  output?: string[]
  // Side-panel variables
  vars: Array<{ label: string; value: string }>
  note: string
  codeLine?: number
}

export interface GraphScenario {
  id: string
  name: string
  blurb: string
  // Determines tinting of the title / legend
  flavor: 'bfs' | 'dfs' | 'toposort' | 'cycle'
  directed: boolean
  complexity: { time: string; space: string }
  code: { js: string[]; go: string[] }
  steps: GraphStep[]
}

// ---------------------------------------------------------------------------
// Shared layouts
// ---------------------------------------------------------------------------

// 2×3 undirected graph used for BFS + DFS:
//   A — B — C
//   |   |   |
//   D — E — F
const undirectedPositions: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 0.15, y: 0.25, label: 'A' },
  B: { x: 0.5, y: 0.25, label: 'B' },
  C: { x: 0.85, y: 0.25, label: 'C' },
  D: { x: 0.15, y: 0.75, label: 'D' },
  E: { x: 0.5, y: 0.75, label: 'E' },
  F: { x: 0.85, y: 0.75, label: 'F' },
}

const undirectedEdges: GraphEdge[] = [
  { fromId: 'A', toId: 'B', directed: false, state: 'normal' },
  { fromId: 'B', toId: 'C', directed: false, state: 'normal' },
  { fromId: 'A', toId: 'D', directed: false, state: 'normal' },
  { fromId: 'B', toId: 'E', directed: false, state: 'normal' },
  { fromId: 'C', toId: 'F', directed: false, state: 'normal' },
  { fromId: 'D', toId: 'E', directed: false, state: 'normal' },
  { fromId: 'E', toId: 'F', directed: false, state: 'normal' },
]

const makeUndirectedNodes = (
  states: Record<string, GraphNodeState>,
): GraphNode[] =>
  Object.entries(undirectedPositions).map(([id, p]) => ({
    id,
    label: p.label,
    x: p.x,
    y: p.y,
    state: states[id] ?? 'normal',
  }))

// ---------------------------------------------------------------------------
// Scenario 1 — BFS (breadth-first)
// ---------------------------------------------------------------------------

const bfs: GraphScenario = {
  id: 'bfs',
  name: 'BFS (breadth-first)',
  blurb:
    'Breadth-first search: visit the start, then all of its neighbors, then their unvisited neighbors, etc. Uses a queue. Always finds the shortest path in an UNWEIGHTED graph.',
  flavor: 'bfs',
  directed: false,
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  code: {
    js: [
      `function bfs(graph: Map<string, string[]>, start: string): string[] {`,
      `  const visited = new Set<string>()`,
      `  const queue: string[] = [start]`,
      `  const order: string[] = []`,
      ``,
      `  visited.add(start)`,
      `  while (queue.length > 0) {`,
      `    const node = queue.shift()!`,
      `    order.push(node)`,
      `    for (const next of graph.get(node) ?? []) {`,
      `      if (!visited.has(next)) {`,
      `        visited.add(next)`,
      `        queue.push(next)`,
      `      }`,
      `    }`,
      `  }`,
      `  return order`,
      `}`,
    ],
    go: [
      `func BFS(graph map[string][]string, start string) []string {`,
      `  visited := map[string]bool{start: true}`,
      `  queue := []string{start}`,
      `  order := []string{}`,
      ``,
      `  for len(queue) > 0 {`,
      `    node := queue[0]`,
      `    queue = queue[1:]`,
      `    order = append(order, node)`,
      ``,
      `    for _, next := range graph[node] {`,
      `      if !visited[next] {`,
      `        visited[next] = true`,
      `        queue = append(queue, next)`,
      `      }`,
      `    }`,
      `  }`,
      `  return order`,
      `}`,
    ],
  },
  steps: (() => {
    const out: GraphStep[] = []
    const mk = (
      states: Record<string, GraphNodeState>,
      queue: string[],
      order: string[],
      note: string,
      vars: Array<{ label: string; value: string }>,
      codeLine?: number,
    ): GraphStep => ({
      nodes: makeUndirectedNodes(states),
      edges: undirectedEdges,
      queue,
      output: order,
      vars,
      note,
      codeLine,
    })

    out.push(
      mk(
        {},
        [],
        [],
        'Undirected graph. Start BFS at A. Queue starts with [A].',
        [{ label: 'start', value: 'A' }],
        2,
      ),
    )

    out.push(
      mk(
        { A: 'in-queue' },
        ['A'],
        [],
        'Push A to queue, mark visited.',
        [
          { label: 'queue', value: '[A]' },
          { label: 'visited', value: '{A}' },
        ],
        3,
      ),
    )

    // Pop A → add B, D
    out.push(
      mk(
        { A: 'current' },
        ['A'],
        [],
        'Pop A from queue. Process its neighbors.',
        [
          { label: 'current', value: 'A' },
          { label: 'neighbors', value: 'B, D' },
        ],
        7,
      ),
    )
    out.push(
      mk(
        { A: 'visited', B: 'in-queue', D: 'in-queue' },
        ['B', 'D'],
        ['A'],
        'A is visited. Add unvisited neighbors B, D to queue.',
        [
          { label: 'queue', value: '[B, D]' },
          { label: 'order', value: '[A]' },
        ],
        13,
      ),
    )

    // Pop B → add C, E
    out.push(
      mk(
        { A: 'visited', B: 'current', D: 'in-queue' },
        ['B', 'D'],
        ['A'],
        'Pop B. Neighbors: A (visited), C (new), E (new).',
        [
          { label: 'current', value: 'B' },
          { label: 'queue', value: '[B, D] → pop B' },
        ],
        7,
      ),
    )
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'in-queue',
          C: 'in-queue',
          E: 'in-queue',
        },
        ['D', 'C', 'E'],
        ['A', 'B'],
        'Mark B visited. Push C, E.',
        [
          { label: 'queue', value: '[D, C, E]' },
          { label: 'order', value: '[A, B]' },
        ],
        13,
      ),
    )

    // Pop D → E already in queue, skip
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'current',
          C: 'in-queue',
          E: 'in-queue',
        },
        ['D', 'C', 'E'],
        ['A', 'B'],
        'Pop D. Neighbors: A (visited), E (already queued — skip).',
        [
          { label: 'current', value: 'D' },
          { label: 'skipped', value: 'E (already in queue)' },
        ],
        7,
      ),
    )
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'visited',
          C: 'in-queue',
          E: 'in-queue',
        },
        ['C', 'E'],
        ['A', 'B', 'D'],
        'Mark D visited.',
        [
          { label: 'queue', value: '[C, E]' },
          { label: 'order', value: '[A, B, D]' },
        ],
        13,
      ),
    )

    // Pop C → add F
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'visited',
          C: 'current',
          E: 'in-queue',
        },
        ['C', 'E'],
        ['A', 'B', 'D'],
        'Pop C. Neighbor F is unvisited.',
        [{ label: 'current', value: 'C' }],
        7,
      ),
    )
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'visited',
          C: 'visited',
          E: 'in-queue',
          F: 'in-queue',
        },
        ['E', 'F'],
        ['A', 'B', 'D', 'C'],
        'Push F to queue.',
        [
          { label: 'queue', value: '[E, F]' },
          { label: 'order', value: '[A, B, D, C]' },
        ],
        13,
      ),
    )

    // Pop E → F already in queue
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'visited',
          C: 'visited',
          E: 'visited',
          F: 'in-queue',
        },
        ['F'],
        ['A', 'B', 'D', 'C', 'E'],
        'Pop E. All neighbors visited or queued.',
        [
          { label: 'queue', value: '[F]' },
          { label: 'order', value: '[A, B, D, C, E]' },
        ],
        13,
      ),
    )

    // Pop F → done
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          D: 'visited',
          C: 'visited',
          E: 'visited',
          F: 'visited',
        },
        [],
        ['A', 'B', 'D', 'C', 'E', 'F'],
        'Pop F. Queue empty → done.',
        [{ label: 'order', value: '[A, B, D, C, E, F]' }],
        17,
      ),
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — DFS (depth-first)
// ---------------------------------------------------------------------------

const dfs: GraphScenario = {
  id: 'dfs',
  name: 'DFS (depth-first)',
  blurb:
    'Depth-first search: dive deep into one neighbor before backtracking. Uses a stack (explicit) or the call stack (recursive). Different traversal order than BFS — useful for cycle detection, topological sort, connected components.',
  flavor: 'dfs',
  directed: false,
  complexity: { time: 'O(V + E)', space: 'O(V) — call stack' },
  code: {
    js: [
      `function dfs(graph: Map<string, string[]>, start: string): string[] {`,
      `  const visited = new Set<string>()`,
      `  const order: string[] = []`,
      ``,
      `  function visit(node: string) {`,
      `    if (visited.has(node)) return`,
      `    visited.add(node)`,
      `    order.push(node)`,
      `    for (const next of graph.get(node) ?? []) {`,
      `      visit(next)`,
      `    }`,
      `  }`,
      ``,
      `  visit(start)`,
      `  return order`,
      `}`,
    ],
    go: [
      `func DFS(graph map[string][]string, start string) []string {`,
      `  visited := map[string]bool{}`,
      `  order := []string{}`,
      ``,
      `  var visit func(string)`,
      `  visit = func(node string) {`,
      `    if visited[node] { return }`,
      `    visited[node] = true`,
      `    order = append(order, node)`,
      `    for _, next := range graph[node] {`,
      `      visit(next)`,
      `    }`,
      `  }`,
      ``,
      `  visit(start)`,
      `  return order`,
      `}`,
    ],
  },
  steps: (() => {
    const out: GraphStep[] = []
    const mk = (
      states: Record<string, GraphNodeState>,
      stack: string[],
      order: string[],
      note: string,
      vars: Array<{ label: string; value: string }>,
      codeLine?: number,
    ): GraphStep => ({
      nodes: makeUndirectedNodes(states),
      edges: undirectedEdges,
      stack,
      output: order,
      vars,
      note,
      codeLine,
    })

    out.push(
      mk(
        {},
        [],
        [],
        'Same graph. Start DFS at A. Recursive — call stack tracks where we are.',
        [{ label: 'start', value: 'A' }],
        13,
      ),
    )

    // visit(A)
    out.push(
      mk(
        { A: 'current' },
        ['visit(A)'],
        ['A'],
        'visit(A): mark visited, push A to output, recurse into first neighbor B.',
        [{ label: 'order', value: '[A]' }],
        7,
      ),
    )

    // visit(B) from A
    out.push(
      mk(
        { A: 'in-stack', B: 'current' },
        ['visit(A)', 'visit(B)'],
        ['A', 'B'],
        'visit(B): mark, push B, recurse into first neighbor (A already visited, then C).',
        [{ label: 'order', value: '[A, B]' }],
        7,
      ),
    )

    // visit(C) from B
    out.push(
      mk(
        { A: 'in-stack', B: 'in-stack', C: 'current' },
        ['visit(A)', 'visit(B)', 'visit(C)'],
        ['A', 'B', 'C'],
        'visit(C): mark, push C, recurse into F.',
        [{ label: 'order', value: '[A, B, C]' }],
        7,
      ),
    )

    // visit(F) from C
    out.push(
      mk(
        { A: 'in-stack', B: 'in-stack', C: 'in-stack', F: 'current' },
        ['visit(A)', 'visit(B)', 'visit(C)', 'visit(F)'],
        ['A', 'B', 'C', 'F'],
        'visit(F): mark, push F, recurse into E (its only unvisited neighbor).',
        [{ label: 'order', value: '[A, B, C, F]' }],
        7,
      ),
    )

    // visit(E) from F
    out.push(
      mk(
        {
          A: 'in-stack',
          B: 'in-stack',
          C: 'in-stack',
          F: 'in-stack',
          E: 'current',
        },
        ['visit(A)', 'visit(B)', 'visit(C)', 'visit(F)', 'visit(E)'],
        ['A', 'B', 'C', 'F', 'E'],
        'visit(E): mark, push E, recurse into D (only one left).',
        [{ label: 'order', value: '[A, B, C, F, E]' }],
        7,
      ),
    )

    // visit(D) from E
    out.push(
      mk(
        {
          A: 'in-stack',
          B: 'in-stack',
          C: 'in-stack',
          F: 'in-stack',
          E: 'in-stack',
          D: 'current',
        },
        [
          'visit(A)',
          'visit(B)',
          'visit(C)',
          'visit(F)',
          'visit(E)',
          'visit(D)',
        ],
        ['A', 'B', 'C', 'F', 'E', 'D'],
        'visit(D): mark, push D. All neighbors visited — return.',
        [{ label: 'order', value: '[A, B, C, F, E, D]' }],
        7,
      ),
    )

    // unwinding back to A
    out.push(
      mk(
        {
          A: 'visited',
          B: 'visited',
          C: 'visited',
          F: 'visited',
          E: 'visited',
          D: 'visited',
        },
        [],
        ['A', 'B', 'C', 'F', 'E', 'D'],
        'All recursive calls return up the stack. Different order than BFS: A B C F E D vs A B D C E F.',
        [{ label: 'order', value: '[A, B, C, F, E, D]' }],
        15,
      ),
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — Topological Sort (Kahn's algorithm)
// ---------------------------------------------------------------------------

// Course-prerequisite directed graph:
//   A → B → D
//   ↓   ↓
//   C → E
const toposortNodes: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 0.15, y: 0.25, label: 'A' },
  B: { x: 0.5, y: 0.25, label: 'B' },
  D: { x: 0.85, y: 0.25, label: 'D' },
  C: { x: 0.15, y: 0.75, label: 'C' },
  E: { x: 0.5, y: 0.75, label: 'E' },
}

const toposortEdges: GraphEdge[] = [
  { fromId: 'A', toId: 'B', directed: true, state: 'normal' },
  { fromId: 'B', toId: 'D', directed: true, state: 'normal' },
  { fromId: 'A', toId: 'C', directed: true, state: 'normal' },
  { fromId: 'B', toId: 'E', directed: true, state: 'normal' },
  { fromId: 'C', toId: 'E', directed: true, state: 'normal' },
]

const toposort: GraphScenario = {
  id: 'toposort',
  name: 'Topological sort (Kahn)',
  blurb:
    "Topological sort: order nodes such that every edge u → v has u BEFORE v in the result. Used for course prerequisites, build orders, task scheduling, package dependency resolution. Kahn's algorithm uses indegrees + a queue.",
  flavor: 'toposort',
  directed: true,
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  code: {
    js: [
      `function topoSort(graph: Map<string, string[]>): string[] {`,
      `  // Step 1: compute indegrees`,
      `  const indeg = new Map<string, number>()`,
      `  for (const u of graph.keys()) indeg.set(u, 0)`,
      `  for (const [, neighbors] of graph) {`,
      `    for (const v of neighbors) indeg.set(v, (indeg.get(v) ?? 0) + 1)`,
      `  }`,
      ``,
      `  // Step 2: queue all zero-indegree nodes`,
      `  const queue: string[] = []`,
      `  for (const [u, d] of indeg) if (d === 0) queue.push(u)`,
      ``,
      `  // Step 3: pop, emit, decrement neighbors`,
      `  const order: string[] = []`,
      `  while (queue.length > 0) {`,
      `    const u = queue.shift()!`,
      `    order.push(u)`,
      `    for (const v of graph.get(u) ?? []) {`,
      `      indeg.set(v, indeg.get(v)! - 1)`,
      `      if (indeg.get(v) === 0) queue.push(v)`,
      `    }`,
      `  }`,
      `  return order  // length < V means cycle`,
      `}`,
    ],
    go: [
      `func TopoSort(graph map[string][]string) []string {`,
      `  indeg := map[string]int{}`,
      `  for u := range graph { indeg[u] = 0 }`,
      `  for _, neighbors := range graph {`,
      `    for _, v := range neighbors { indeg[v]++ }`,
      `  }`,
      ``,
      `  var queue []string`,
      `  for u, d := range indeg {`,
      `    if d == 0 { queue = append(queue, u) }`,
      `  }`,
      ``,
      `  var order []string`,
      `  for len(queue) > 0 {`,
      `    u := queue[0]`,
      `    queue = queue[1:]`,
      `    order = append(order, u)`,
      `    for _, v := range graph[u] {`,
      `      indeg[v]--`,
      `      if indeg[v] == 0 { queue = append(queue, v) }`,
      `    }`,
      `  }`,
      `  return order`,
      `}`,
    ],
  },
  steps: (() => {
    const out: GraphStep[] = []

    const mkNodes = (states: Record<string, GraphNodeState>): GraphNode[] =>
      Object.entries(toposortNodes).map(([id, p]) => ({
        id,
        label: p.label,
        x: p.x,
        y: p.y,
        state: states[id] ?? 'normal',
      }))

    const mk = (
      states: Record<string, GraphNodeState>,
      queue: string[],
      order: string[],
      note: string,
      vars: Array<{ label: string; value: string }>,
      codeLine?: number,
    ): GraphStep => ({
      nodes: mkNodes(states),
      edges: toposortEdges,
      queue,
      output: order,
      vars,
      note,
      codeLine,
    })

    out.push(
      mk(
        {},
        [],
        [],
        'DAG. Edges: A→B, A→C, B→D, B→E, C→E. We want a linear order respecting all dependencies.',
        [{ label: 'edges', value: '5' }],
        1,
      ),
    )

    out.push(
      mk(
        {},
        [],
        [],
        'Step 1: compute indegree of each node — how many edges point INTO it.',
        [{ label: 'indegrees', value: '{A:0, B:1, C:1, D:1, E:2}' }],
        4,
      ),
    )

    out.push(
      mk(
        { A: 'in-queue' },
        ['A'],
        [],
        'Step 2: queue all zero-indegree nodes. Only A has indegree 0.',
        [{ label: 'queue', value: '[A]' }],
        13,
      ),
    )

    out.push(
      mk(
        { A: 'current' },
        ['A'],
        [],
        'Pop A. Emit to output. Decrement indegree of B and C.',
        [
          { label: 'current', value: 'A' },
          { label: 'after dec', value: '{B:0, C:0, D:1, E:2}' },
        ],
        18,
      ),
    )

    out.push(
      mk(
        { A: 'sorted', B: 'in-queue', C: 'in-queue' },
        ['B', 'C'],
        ['A'],
        'B and C now have indegree 0 → push both to queue. order = [A].',
        [
          { label: 'queue', value: '[B, C]' },
          { label: 'order', value: '[A]' },
        ],
        22,
      ),
    )

    out.push(
      mk(
        { A: 'sorted', B: 'current', C: 'in-queue' },
        ['B', 'C'],
        ['A'],
        'Pop B. Decrement D (1→0) and E (2→1).',
        [
          { label: 'current', value: 'B' },
          { label: 'after dec', value: '{D:0, E:1}' },
        ],
        18,
      ),
    )

    out.push(
      mk(
        { A: 'sorted', B: 'sorted', C: 'in-queue', D: 'in-queue' },
        ['C', 'D'],
        ['A', 'B'],
        'D reaches 0 → push.',
        [
          { label: 'queue', value: '[C, D]' },
          { label: 'order', value: '[A, B]' },
        ],
        22,
      ),
    )

    out.push(
      mk(
        { A: 'sorted', B: 'sorted', C: 'current', D: 'in-queue' },
        ['C', 'D'],
        ['A', 'B'],
        'Pop C. Decrement E (1→0).',
        [
          { label: 'current', value: 'C' },
          { label: 'after dec', value: '{E:0}' },
        ],
        18,
      ),
    )

    out.push(
      mk(
        {
          A: 'sorted',
          B: 'sorted',
          C: 'sorted',
          D: 'in-queue',
          E: 'in-queue',
        },
        ['D', 'E'],
        ['A', 'B', 'C'],
        'E reaches 0 → push.',
        [
          { label: 'queue', value: '[D, E]' },
          { label: 'order', value: '[A, B, C]' },
        ],
        22,
      ),
    )

    out.push(
      mk(
        {
          A: 'sorted',
          B: 'sorted',
          C: 'sorted',
          D: 'sorted',
          E: 'sorted',
        },
        [],
        ['A', 'B', 'C', 'D', 'E'],
        'Pop D and E (in order). Both have no outgoing edges. Done.',
        [{ label: 'order', value: '[A, B, C, D, E]' }],
        25,
      ),
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 4 — Cycle Detection (DFS 3-color)
// ---------------------------------------------------------------------------

// Directed graph with a cycle:
//   A → B → C
//       ↑   ↓
//       D ← ┘
const cycleNodes: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 0.1, y: 0.5, label: 'A' },
  B: { x: 0.4, y: 0.5, label: 'B' },
  C: { x: 0.75, y: 0.2, label: 'C' },
  D: { x: 0.75, y: 0.8, label: 'D' },
}

const cycleEdges: GraphEdge[] = [
  { fromId: 'A', toId: 'B', directed: true, state: 'normal' },
  { fromId: 'B', toId: 'C', directed: true, state: 'normal' },
  { fromId: 'C', toId: 'D', directed: true, state: 'normal' },
  { fromId: 'D', toId: 'B', directed: true, state: 'normal' }, // back edge — creates the cycle
]

const cycleDetect: GraphScenario = {
  id: 'cycle-detect',
  name: 'Cycle detection (DFS 3-color)',
  blurb:
    "Detect a cycle in a directed graph using DFS with three colors: white = unvisited, gray = on the current path, black = fully explored. If we ever try to walk into a GRAY node, we've found a cycle.",
  flavor: 'cycle',
  directed: true,
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  code: {
    js: [
      `function hasCycle(graph: Map<string, string[]>): boolean {`,
      `  const WHITE = 0, GRAY = 1, BLACK = 2`,
      `  const color = new Map<string, number>()`,
      `  for (const u of graph.keys()) color.set(u, WHITE)`,
      ``,
      `  function dfs(u: string): boolean {`,
      `    color.set(u, GRAY)`,
      `    for (const v of graph.get(u) ?? []) {`,
      `      if (color.get(v) === GRAY) return true  // back edge!`,
      `      if (color.get(v) === WHITE && dfs(v)) return true`,
      `    }`,
      `    color.set(u, BLACK)`,
      `    return false`,
      `  }`,
      ``,
      `  for (const u of graph.keys()) {`,
      `    if (color.get(u) === WHITE && dfs(u)) return true`,
      `  }`,
      `  return false`,
      `}`,
    ],
    go: [
      `const ( White = iota; Gray; Black )`,
      ``,
      `func HasCycle(graph map[string][]string) bool {`,
      `  color := map[string]int{}`,
      `  for u := range graph { color[u] = White }`,
      ``,
      `  var dfs func(string) bool`,
      `  dfs = func(u string) bool {`,
      `    color[u] = Gray`,
      `    for _, v := range graph[u] {`,
      `      if color[v] == Gray { return true }`,
      `      if color[v] == White && dfs(v) { return true }`,
      `    }`,
      `    color[u] = Black`,
      `    return false`,
      `  }`,
      ``,
      `  for u := range graph {`,
      `    if color[u] == White && dfs(u) { return true }`,
      `  }`,
      `  return false`,
      `}`,
    ],
  },
  steps: (() => {
    const out: GraphStep[] = []
    const mkNodes = (states: Record<string, GraphNodeState>): GraphNode[] =>
      Object.entries(cycleNodes).map(([id, p]) => ({
        id,
        label: p.label,
        x: p.x,
        y: p.y,
        state: states[id] ?? 'normal',
      }))

    const mk = (
      states: Record<string, GraphNodeState>,
      stack: string[],
      note: string,
      vars: Array<{ label: string; value: string }>,
      edges: GraphEdge[],
      codeLine?: number,
    ): GraphStep => ({
      nodes: mkNodes(states),
      edges,
      stack,
      vars,
      note,
      codeLine,
    })

    out.push(
      mk(
        {},
        [],
        'Edges: A→B, B→C, C→D, D→B. Spot the cycle by eye: B → C → D → B.',
        [{ label: 'colors', value: 'all WHITE' }],
        cycleEdges,
        4,
      ),
    )

    // dfs(A) - color A gray
    out.push(
      mk(
        { A: 'gray' },
        ['dfs(A)'],
        'Start DFS at A. Color A = GRAY (on path).',
        [{ label: 'gray', value: '{A}' }],
        cycleEdges,
        7,
      ),
    )

    // recurse into B
    out.push(
      mk(
        { A: 'gray', B: 'gray' },
        ['dfs(A)', 'dfs(B)'],
        'A → B. B is WHITE → recurse. Color B = GRAY.',
        [{ label: 'gray', value: '{A, B}' }],
        cycleEdges,
        10,
      ),
    )

    // recurse into C
    out.push(
      mk(
        { A: 'gray', B: 'gray', C: 'gray' },
        ['dfs(A)', 'dfs(B)', 'dfs(C)'],
        'B → C. C is WHITE → recurse. Color C = GRAY.',
        [{ label: 'gray', value: '{A, B, C}' }],
        cycleEdges,
        10,
      ),
    )

    // recurse into D
    out.push(
      mk(
        { A: 'gray', B: 'gray', C: 'gray', D: 'gray' },
        ['dfs(A)', 'dfs(B)', 'dfs(C)', 'dfs(D)'],
        'C → D. D is WHITE → recurse. Color D = GRAY.',
        [{ label: 'gray', value: '{A, B, C, D}' }],
        cycleEdges,
        10,
      ),
    )

    // D → B is gray → cycle!
    out.push(
      mk(
        { A: 'gray', B: 'cycle', C: 'gray', D: 'cycle' },
        ['dfs(A)', 'dfs(B)', 'dfs(C)', 'dfs(D)'],
        'D → B. B is GRAY (still on path)! This is a back edge — CYCLE DETECTED.',
        [
          { label: 'back edge', value: 'D → B' },
          { label: 'result', value: 'true (has cycle)' },
        ],
        cycleEdges.map((e) =>
          e.fromId === 'D' && e.toId === 'B' ? { ...e, state: 'back-edge' } : e,
        ),
        9,
      ),
    )

    out.push(
      mk(
        { A: 'gray', B: 'cycle', C: 'gray', D: 'cycle' },
        [],
        'Return true. All the way up the stack. Done. The cycle is B → C → D → B.',
        [{ label: 'result', value: 'true' }],
        cycleEdges.map((e) =>
          e.fromId === 'D' && e.toId === 'B' ? { ...e, state: 'back-edge' } : e,
        ),
        19,
      ),
    )

    return out
  })(),
}

export const scenarios: GraphScenario[] = [bfs, dfs, toposort, cycleDetect]
