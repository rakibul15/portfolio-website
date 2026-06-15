// Linked List visualizer — data model.
//
// Each scenario steps through a linked-list operation. The renderer shows
// nodes in a horizontal row with arrows between them, plus labelled
// pointer chips (head, tail, slow, fast, curr, prev) above the nodes.

export type NodeState =
  | 'normal' // baseline
  | 'new' // just inserted this step
  | 'removing' // about to be removed
  | 'visiting' // pointer is currently here
  | 'cycle-target' // the node that the cycle's tail points back to

export interface LLNode {
  id: string
  value: string | number
  state: NodeState
}

export type PointerTone =
  | 'accent'
  | 'lab-blue'
  | 'lab-amber'
  | 'lab-emerald'
  | 'lab-purple'

export interface LLPointer {
  id: string
  label: string // "head", "slow", "fast", "curr", "prev", "next"
  // null = the pointer is at NULL (off the end)
  nodeId: string | null
  tone: PointerTone
}

export type EdgeState = 'normal' | 'new' | 'breaking' | 'cycle'

export interface LLEdge {
  fromId: string
  // null means → NULL (end-of-list terminator)
  toId: string | null
  state: EdgeState
  // 'forward' for singly + doubly forward, 'backward' for doubly back-arrow
  direction: 'forward' | 'backward'
}

export interface LLStep {
  // Nodes in display order (left-to-right). Order may shift across steps.
  nodes: LLNode[]
  pointers: LLPointer[]
  edges: LLEdge[]
  // Whether to render the trailing "→ NULL" terminator on the right.
  showNullTerminator: boolean
  note: string
  codeLine?: number
}

export interface LLScenario {
  id: string
  name: string
  variant: 'singly' | 'doubly' | 'cycle'
  blurb: string
  complexity: { time: string; space: string }
  code: { js: string[]; go: string[] }
  steps: LLStep[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const buildEdges = (
  nodes: LLNode[],
  direction: 'singly' | 'doubly' = 'singly',
): LLEdge[] => {
  const edges: LLEdge[] = []
  for (let i = 0; i < nodes.length; i++) {
    const next = nodes[i + 1] ?? null
    edges.push({
      fromId: nodes[i].id,
      toId: next?.id ?? null,
      state: 'normal',
      direction: 'forward',
    })
    if (direction === 'doubly' && next) {
      edges.push({
        fromId: next.id,
        toId: nodes[i].id,
        state: 'normal',
        direction: 'backward',
      })
    }
  }
  return edges
}

// ---------------------------------------------------------------------------
// Scenario 1 — Singly Linked List: insert + delete at various positions
// ---------------------------------------------------------------------------

const insertDelete: LLScenario = {
  id: 'singly-insert-delete',
  name: 'Insert & Delete (singly)',
  variant: 'singly',
  blurb:
    'Insert a node at the head, at the tail, and in the middle of a singly linked list. Then delete a node. Each operation is two pointer rewires — that is the whole trick.',
  complexity: { time: 'O(1) head, O(n) middle/tail', space: 'O(1)' },
  code: {
    js: [
      `class ListNode<T> {`,
      `  constructor(public value: T, public next: ListNode<T> | null = null) {}`,
      `}`,
      ``,
      `function insertHead<T>(head: ListNode<T> | null, value: T) {`,
      `  const node = new ListNode(value, head)`,
      `  return node`,
      `}`,
      ``,
      `function insertAfter<T>(prev: ListNode<T>, value: T) {`,
      `  prev.next = new ListNode(value, prev.next)`,
      `}`,
      ``,
      `function deleteAfter<T>(prev: ListNode<T>) {`,
      `  if (prev.next) prev.next = prev.next.next`,
      `}`,
    ],
    go: [
      `type Node struct {`,
      `  Value int`,
      `  Next  *Node`,
      `}`,
      ``,
      `func InsertHead(head *Node, v int) *Node {`,
      `  return &Node{Value: v, Next: head}`,
      `}`,
      ``,
      `func InsertAfter(prev *Node, v int) {`,
      `  prev.Next = &Node{Value: v, Next: prev.Next}`,
      `}`,
      ``,
      `func DeleteAfter(prev *Node) {`,
      `  if prev.Next != nil { prev.Next = prev.Next.Next }`,
      `}`,
    ],
  },
  steps: (() => {
    const out: LLStep[] = []
    const A = { id: 'a', value: 10, state: 'normal' as NodeState }
    const B = { id: 'b', value: 20, state: 'normal' as NodeState }
    const C = { id: 'c', value: 30, state: 'normal' as NodeState }

    // Step 1: initial 10 → 20 → 30
    out.push({
      nodes: [A, B, C],
      pointers: [{ id: 'head', label: 'head', nodeId: 'a', tone: 'lab-blue' }],
      edges: buildEdges([A, B, C]),
      showNullTerminator: true,
      note: 'Initial list: head → 10 → 20 → 30 → NULL.',
      codeLine: 1,
    })

    // Step 2: insertHead(5)
    const NEW1 = { id: 'n1', value: 5, state: 'new' as NodeState }
    out.push({
      nodes: [NEW1, A, B, C],
      pointers: [{ id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' }],
      edges: buildEdges([NEW1, A, B, C]).map((e, i) =>
        i === 0 ? { ...e, state: 'new' } : e,
      ),
      showNullTerminator: true,
      note: 'insertHead(5): create a new node, point its next to the old head, return it as the new head. Two ops, O(1).',
      codeLine: 5,
    })

    // Step 3: stabilize (new becomes normal)
    out.push({
      nodes: [{ ...NEW1, state: 'normal' }, A, B, C],
      pointers: [{ id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' }],
      edges: buildEdges([NEW1, A, B, C]),
      showNullTerminator: true,
      note: 'After insertHead: head → 5 → 10 → 20 → 30 → NULL.',
      codeLine: 5,
    })

    // Step 4: insertAfter(B, 25) — between 20 and 30
    const NEW2 = { id: 'n2', value: 25, state: 'new' as NodeState }
    out.push({
      nodes: [{ ...NEW1, state: 'normal' }, A, B, NEW2, C],
      pointers: [
        { id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' },
        { id: 'prev', label: 'prev', nodeId: 'b', tone: 'lab-amber' },
      ],
      edges: [
        { fromId: 'n1', toId: 'a', state: 'normal', direction: 'forward' },
        { fromId: 'a', toId: 'b', state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'n2', state: 'new', direction: 'forward' },
        { fromId: 'n2', toId: 'c', state: 'new', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'insertAfter(prev = 20, 25): create node 25 with next = prev.next. Then prev.next = node 25.',
      codeLine: 9,
    })

    // Step 5: stabilize
    out.push({
      nodes: [
        { ...NEW1, state: 'normal' },
        A,
        B,
        { ...NEW2, state: 'normal' },
        C,
      ],
      pointers: [{ id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' }],
      edges: buildEdges([{ ...NEW1, state: 'normal' }, A, B, NEW2, C]),
      showNullTerminator: true,
      note: 'After insert: head → 5 → 10 → 20 → 25 → 30 → NULL.',
      codeLine: 9,
    })

    // Step 6: deleteAfter(B) — drops 25
    out.push({
      nodes: [
        { ...NEW1, state: 'normal' },
        A,
        B,
        { ...NEW2, state: 'removing' },
        C,
      ],
      pointers: [
        { id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' },
        { id: 'prev', label: 'prev', nodeId: 'b', tone: 'lab-amber' },
      ],
      edges: [
        { fromId: 'n1', toId: 'a', state: 'normal', direction: 'forward' },
        { fromId: 'a', toId: 'b', state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'n2', state: 'breaking', direction: 'forward' },
        { fromId: 'n2', toId: 'c', state: 'breaking', direction: 'forward' },
        { fromId: 'b', toId: 'c', state: 'new', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'deleteAfter(prev = 20): set prev.next = prev.next.next. The 25 node is unreachable — GC will collect it.',
      codeLine: 13,
    })

    // Step 7: final
    out.push({
      nodes: [{ ...NEW1, state: 'normal' }, A, B, C],
      pointers: [{ id: 'head', label: 'head', nodeId: 'n1', tone: 'lab-blue' }],
      edges: buildEdges([{ ...NEW1, state: 'normal' }, A, B, C]),
      showNullTerminator: true,
      note: 'After delete: head → 5 → 10 → 20 → 30 → NULL. One pointer rewire, O(1).',
      codeLine: 13,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — Reverse a Singly Linked List
// ---------------------------------------------------------------------------

const reverse: LLScenario = {
  id: 'singly-reverse',
  name: 'Reverse the list',
  variant: 'singly',
  blurb:
    'The classic interview question. Walk the list with three pointers — prev, curr, next — flipping each .next as you go. O(n) time, O(1) space, no recursion.',
  complexity: { time: 'O(n)', space: 'O(1)' },
  code: {
    js: [
      `function reverse(head: ListNode | null): ListNode | null {`,
      `  let prev: ListNode | null = null`,
      `  let curr: ListNode | null = head`,
      ``,
      `  while (curr !== null) {`,
      `    const next = curr.next  // remember`,
      `    curr.next = prev         // flip`,
      `    prev = curr              // advance`,
      `    curr = next`,
      `  }`,
      ``,
      `  return prev  // new head`,
      `}`,
    ],
    go: [
      `func Reverse(head *Node) *Node {`,
      `  var prev *Node`,
      `  curr := head`,
      ``,
      `  for curr != nil {`,
      `    next := curr.Next`,
      `    curr.Next = prev`,
      `    prev = curr`,
      `    curr = next`,
      `  }`,
      ``,
      `  return prev`,
      `}`,
    ],
  },
  steps: (() => {
    const A: LLNode = { id: 'a', value: 1, state: 'normal' }
    const B: LLNode = { id: 'b', value: 2, state: 'normal' }
    const C: LLNode = { id: 'c', value: 3, state: 'normal' }
    const D: LLNode = { id: 'd', value: 4, state: 'normal' }
    const nodes = [A, B, C, D]
    const out: LLStep[] = []

    const ptrs = (
      prev: string | null,
      curr: string | null,
      next?: string | null,
    ): LLPointer[] => {
      const result: LLPointer[] = []
      result.push({ id: 'prev', label: 'prev', nodeId: prev, tone: 'lab-blue' })
      result.push({ id: 'curr', label: 'curr', nodeId: curr, tone: 'lab-amber' })
      if (next !== undefined) {
        result.push({
          id: 'next',
          label: 'next',
          nodeId: next,
          tone: 'lab-purple',
        })
      }
      return result
    }

    // Step 1: initial
    out.push({
      nodes,
      pointers: ptrs(null, 'a'),
      edges: buildEdges(nodes),
      showNullTerminator: true,
      note: 'Initial: prev = NULL, curr = head (node 1). We will flip each .next pointer.',
      codeLine: 2,
    })

    // Step 2: iteration 1 — next = curr.next (B)
    out.push({
      nodes,
      pointers: ptrs(null, 'a', 'b'),
      edges: buildEdges(nodes),
      showNullTerminator: true,
      note: 'Iteration 1. next = curr.next = node 2. We hold onto it BEFORE breaking the link.',
      codeLine: 6,
    })

    // Step 3: curr.next = prev (NULL)
    out.push({
      nodes: nodes.map((n) => (n.id === 'a' ? { ...n, state: 'visiting' } : n)),
      pointers: ptrs(null, 'a', 'b'),
      edges: [
        { fromId: 'a', toId: null, state: 'new', direction: 'forward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Flip: curr.next = prev. Now node 1 → NULL. The remaining list is still 2 → 3 → 4 (held by `next`).',
      codeLine: 7,
    })

    // Step 4: prev = curr (a); curr = next (b)
    out.push({
      nodes,
      pointers: ptrs('a', 'b'),
      edges: [
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Advance: prev = curr (1), curr = next (2). Iteration 1 done.',
      codeLine: 8,
    })

    // Step 5: iteration 2 — next = c
    out.push({
      nodes,
      pointers: ptrs('a', 'b', 'c'),
      edges: [
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Iteration 2. next = curr.next = node 3.',
      codeLine: 6,
    })

    // Step 6: flip b.next = a
    out.push({
      nodes,
      pointers: ptrs('a', 'b', 'c'),
      edges: [
        { fromId: 'b', toId: 'a', state: 'new', direction: 'forward' },
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Flip: node 2.next = prev (node 1). Now 2 → 1 → NULL.',
      codeLine: 7,
    })

    // Step 7: advance
    out.push({
      nodes,
      pointers: ptrs('b', 'c'),
      edges: [
        { fromId: 'b', toId: 'a', state: 'normal', direction: 'forward' },
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Advance: prev = 2, curr = 3.',
      codeLine: 8,
    })

    // Step 8: iter 3 - flip c.next = b
    out.push({
      nodes,
      pointers: ptrs('b', 'c', 'd'),
      edges: [
        { fromId: 'c', toId: 'b', state: 'new', direction: 'forward' },
        { fromId: 'b', toId: 'a', state: 'normal', direction: 'forward' },
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Iter 3. next = node 4, then node 3.next = prev (2). List so far: 3 → 2 → 1 → NULL.',
      codeLine: 7,
    })

    // Step 9: iter 4 - flip d.next = c
    out.push({
      nodes,
      pointers: ptrs('c', 'd', null),
      edges: [
        { fromId: 'd', toId: 'c', state: 'new', direction: 'forward' },
        { fromId: 'c', toId: 'b', state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'a', state: 'normal', direction: 'forward' },
        { fromId: 'a', toId: null, state: 'normal', direction: 'forward' },
      ],
      showNullTerminator: true,
      note: 'Iter 4. next = NULL. node 4.next = prev (3). List: 4 → 3 → 2 → 1 → NULL.',
      codeLine: 7,
    })

    // Step 10: curr = null, exit loop. Return prev = d as new head.
    // Reorder nodes for display: D, C, B, A
    const reversed: LLNode[] = [
      { id: 'd', value: 4, state: 'normal' },
      { id: 'c', value: 3, state: 'normal' },
      { id: 'b', value: 2, state: 'normal' },
      { id: 'a', value: 1, state: 'normal' },
    ]
    out.push({
      nodes: reversed,
      pointers: [{ id: 'head', label: 'head', nodeId: 'd', tone: 'lab-emerald' }],
      edges: buildEdges(reversed),
      showNullTerminator: true,
      note: 'Done. curr is NULL → exit loop. Return prev = node 4 as the new head.',
      codeLine: 13,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — Floyd's Cycle Detection (tortoise + hare)
// ---------------------------------------------------------------------------

const cycle: LLScenario = {
  id: 'floyd-cycle',
  name: "Floyd's cycle (tortoise + hare)",
  variant: 'cycle',
  blurb:
    'Detect whether a list has a cycle without using extra memory. Walk two pointers: slow moves 1 step, fast moves 2. If they ever meet, there is a cycle. If fast reaches NULL, no cycle.',
  complexity: { time: 'O(n)', space: 'O(1)' },
  code: {
    js: [
      `function hasCycle(head: ListNode | null): boolean {`,
      `  let slow = head`,
      `  let fast = head`,
      ``,
      `  while (fast !== null && fast.next !== null) {`,
      `    slow = slow!.next        // 1 step`,
      `    fast = fast.next.next    // 2 steps`,
      ``,
      `    if (slow === fast) return true  // they met`,
      `  }`,
      `  return false  // fast hit NULL`,
      `}`,
    ],
    go: [
      `func HasCycle(head *Node) bool {`,
      `  slow, fast := head, head`,
      ``,
      `  for fast != nil && fast.Next != nil {`,
      `    slow = slow.Next`,
      `    fast = fast.Next.Next`,
      ``,
      `    if slow == fast { return true }`,
      `  }`,
      `  return false`,
      `}`,
    ],
  },
  steps: (() => {
    // List: A → B → C → D → E → back to C (cycle)
    const A: LLNode = { id: 'a', value: 1, state: 'normal' }
    const B: LLNode = { id: 'b', value: 2, state: 'normal' }
    const C: LLNode = { id: 'c', value: 3, state: 'cycle-target' }
    const D: LLNode = { id: 'd', value: 4, state: 'normal' }
    const E: LLNode = { id: 'e', value: 5, state: 'normal' }
    const nodes = [A, B, C, D, E]

    // Edges: forward chain + special "cycle" edge from E back to C.
    const baseEdges: LLEdge[] = [
      { fromId: 'a', toId: 'b', state: 'normal', direction: 'forward' },
      { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
      { fromId: 'c', toId: 'd', state: 'normal', direction: 'forward' },
      { fromId: 'd', toId: 'e', state: 'normal', direction: 'forward' },
      { fromId: 'e', toId: 'c', state: 'cycle', direction: 'forward' },
    ]

    const ptrs = (slow: string, fast: string): LLPointer[] => [
      { id: 'slow', label: 'slow', nodeId: slow, tone: 'lab-blue' },
      { id: 'fast', label: 'fast', nodeId: fast, tone: 'accent' },
    ]

    const out: LLStep[] = []

    out.push({
      nodes,
      pointers: ptrs('a', 'a'),
      edges: baseEdges,
      showNullTerminator: false,
      note: "Both pointers start at head. The right-most arrow shows E loops back to C — that's the cycle.",
      codeLine: 2,
    })

    // tick 1: slow=b, fast=c
    out.push({
      nodes,
      pointers: ptrs('b', 'c'),
      edges: baseEdges,
      showNullTerminator: false,
      note: 'Tick 1. slow → 2. fast → 3 (two steps). They are not equal.',
      codeLine: 5,
    })

    // tick 2: slow=c, fast=e
    out.push({
      nodes,
      pointers: ptrs('c', 'e'),
      edges: baseEdges,
      showNullTerminator: false,
      note: 'Tick 2. slow → 3. fast → 5 (two steps). Not equal.',
      codeLine: 5,
    })

    // tick 3: slow=d, fast=d (fast wrapped around the cycle)
    out.push({
      nodes,
      pointers: ptrs('d', 'd'),
      edges: baseEdges,
      showNullTerminator: false,
      note: 'Tick 3. slow → 4. fast steps from 5 → 3 (cycle) → 4. They MEET at node 4. Return true.',
      codeLine: 8,
    })

    out.push({
      nodes,
      pointers: ptrs('d', 'd'),
      edges: baseEdges,
      showNullTerminator: false,
      note: "Cycle detected. Without Floyd's, we would have needed O(n) space (a visited set). This is O(1).",
      codeLine: 8,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 4 — Doubly Linked List: insert
// ---------------------------------------------------------------------------

const doubly: LLScenario = {
  id: 'doubly-insert',
  name: 'Doubly LL — insert',
  variant: 'doubly',
  blurb:
    'A doubly linked list maintains both .next and .prev pointers, so each insert/delete updates four pointers instead of two. Trade more bookkeeping for O(1) backward traversal — used in LRU caches, browser history, undo stacks.',
  complexity: { time: 'O(1) with the node reference', space: 'O(1)' },
  code: {
    js: [
      `class DListNode<T> {`,
      `  prev: DListNode<T> | null = null`,
      `  next: DListNode<T> | null = null`,
      `  constructor(public value: T) {}`,
      `}`,
      ``,
      `function insertAfter<T>(node: DListNode<T>, value: T) {`,
      `  const fresh = new DListNode(value)`,
      `  fresh.next = node.next`,
      `  fresh.prev = node`,
      `  if (node.next) node.next.prev = fresh`,
      `  node.next = fresh`,
      `}`,
    ],
    go: [
      `type DNode struct {`,
      `  Value      int`,
      `  Prev, Next *DNode`,
      `}`,
      ``,
      `func InsertAfter(node *DNode, v int) {`,
      `  fresh := &DNode{Value: v, Next: node.Next, Prev: node}`,
      `  if node.Next != nil {`,
      `    node.Next.Prev = fresh`,
      `  }`,
      `  node.Next = fresh`,
      `}`,
    ],
  },
  steps: (() => {
    const A: LLNode = { id: 'a', value: 1, state: 'normal' }
    const B: LLNode = { id: 'b', value: 2, state: 'normal' }
    const C: LLNode = { id: 'c', value: 3, state: 'normal' }
    const initial = [A, B, C]

    const out: LLStep[] = []

    out.push({
      nodes: initial,
      pointers: [
        { id: 'head', label: 'head', nodeId: 'a', tone: 'lab-blue' },
        { id: 'tail', label: 'tail', nodeId: 'c', tone: 'lab-emerald' },
      ],
      edges: buildEdges(initial, 'doubly'),
      showNullTerminator: true,
      note: 'Doubly linked list: 1 ⇄ 2 ⇄ 3. Each node holds prev + next references.',
      codeLine: 1,
    })

    // insert 99 after node A
    const NEW: LLNode = { id: 'n', value: 99, state: 'new' }
    out.push({
      nodes: [A, NEW, B, C],
      pointers: [
        { id: 'node', label: 'node', nodeId: 'a', tone: 'lab-amber' },
        { id: 'fresh', label: 'fresh', nodeId: 'n', tone: 'lab-purple' },
      ],
      edges: [
        { fromId: 'a', toId: 'b', state: 'breaking', direction: 'forward' },
        { fromId: 'b', toId: 'a', state: 'breaking', direction: 'backward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'b', state: 'normal', direction: 'backward' },
      ],
      showNullTerminator: true,
      note: 'insertAfter(node=1, 99). Create `fresh = 99`. About to rewire 4 pointers.',
      codeLine: 7,
    })

    out.push({
      nodes: [A, NEW, B, C],
      pointers: [
        { id: 'node', label: 'node', nodeId: 'a', tone: 'lab-amber' },
        { id: 'fresh', label: 'fresh', nodeId: 'n', tone: 'lab-purple' },
      ],
      edges: [
        { fromId: 'n', toId: 'b', state: 'new', direction: 'forward' },
        { fromId: 'n', toId: 'a', state: 'new', direction: 'backward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'b', state: 'normal', direction: 'backward' },
      ],
      showNullTerminator: true,
      note: '1. fresh.next = node.next (2)   2. fresh.prev = node (1).',
      codeLine: 10,
    })

    out.push({
      nodes: [A, { ...NEW, state: 'normal' }, B, C],
      pointers: [
        { id: 'node', label: 'node', nodeId: 'a', tone: 'lab-amber' },
        { id: 'fresh', label: 'fresh', nodeId: 'n', tone: 'lab-purple' },
      ],
      edges: [
        { fromId: 'a', toId: 'n', state: 'new', direction: 'forward' },
        { fromId: 'n', toId: 'a', state: 'normal', direction: 'backward' },
        { fromId: 'n', toId: 'b', state: 'normal', direction: 'forward' },
        { fromId: 'b', toId: 'n', state: 'new', direction: 'backward' },
        { fromId: 'b', toId: 'c', state: 'normal', direction: 'forward' },
        { fromId: 'c', toId: 'b', state: 'normal', direction: 'backward' },
      ],
      showNullTerminator: true,
      note: '3. node.next.prev = fresh (2 now points back to 99 instead of 1).  4. node.next = fresh (1 now points forward to 99 instead of 2).',
      codeLine: 12,
    })

    out.push({
      nodes: [A, { ...NEW, state: 'normal' }, B, C],
      pointers: [
        { id: 'head', label: 'head', nodeId: 'a', tone: 'lab-blue' },
        { id: 'tail', label: 'tail', nodeId: 'c', tone: 'lab-emerald' },
      ],
      edges: buildEdges([A, NEW, B, C], 'doubly'),
      showNullTerminator: true,
      note: 'Done. 1 ⇄ 99 ⇄ 2 ⇄ 3. Four pointers touched, O(1) total.',
      codeLine: 12,
    })

    return out
  })(),
}

export const scenarios: LLScenario[] = [insertDelete, reverse, cycle, doubly]
