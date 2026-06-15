// Heap visualizer — data model.
//
// A heap is stored as an array but viewed as a complete binary tree:
//   For index i: parent = (i - 1) >> 1, left = 2i + 1, right = 2i + 2.
//
// The renderer shows both views side-by-side so the array <-> tree
// mapping clicks for the user.

export type HeapNodeState =
  | 'normal'
  | 'comparing' // currently being compared
  | 'swap-pair' // one of two nodes about to swap
  | 'just-swapped'
  | 'new' // just inserted at the end
  | 'sift-target' // the index we are sifting from
  | 'extracted' // the previous root that was just popped
  | 'leaf-skipped' // leaf we don't need to sift down (heapify scenario)
  | 'kth' // root of the min-heap in top-K (the K-th largest)

export interface HeapStep {
  // Array representation. heap[0] is the root.
  array: number[]
  // State for each index. May be shorter than array if trailing entries are normal.
  states: Record<number, HeapNodeState>
  // Compare highlight (parent, child) or (idx, other) — drawn as a connecting bracket
  compare?: [number, number]
  // Variables shown on the side
  vars: Array<{ label: string; value: string }>
  // Optional sorted output collected during the scenario (extract scenario uses this)
  output?: number[]
  // Optional "input remaining" array used by the Top-K scenario
  remaining?: number[]
  // Optional currently-being-processed value from the remaining input (Top-K)
  currentInput?: number
  note: string
  codeLine?: number
}

export interface HeapScenario {
  id: string
  name: string
  blurb: string
  // 'max' or 'min' affects the tree-view tinting at the title level
  heapKind: 'max' | 'min'
  complexity: { time: string; space: string }
  code: { js: string[]; go: string[] }
  steps: HeapStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Insert (sift up) into a max-heap
// ---------------------------------------------------------------------------

const insert: HeapScenario = {
  id: 'insert-sift-up',
  name: 'Insert (sift up)',
  heapKind: 'max',
  blurb:
    'Insert into a max-heap: append the value at the end, then "sift up" — repeatedly swap with the parent while the value is bigger than its parent. O(log n) comparisons.',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  code: {
    js: [
      `class MaxHeap {`,
      `  private a: number[] = []`,
      ``,
      `  push(value: number) {`,
      `    this.a.push(value)`,
      `    let i = this.a.length - 1`,
      ``,
      `    while (i > 0) {`,
      `      const parent = (i - 1) >> 1`,
      `      if (this.a[i] <= this.a[parent]) break`,
      `      ;[this.a[i], this.a[parent]] = [this.a[parent], this.a[i]]`,
      `      i = parent`,
      `    }`,
      `  }`,
      `}`,
    ],
    go: [
      `type MaxHeap struct{ a []int }`,
      ``,
      `func (h *MaxHeap) Push(v int) {`,
      `  h.a = append(h.a, v)`,
      `  i := len(h.a) - 1`,
      ``,
      `  for i > 0 {`,
      `    parent := (i - 1) >> 1`,
      `    if h.a[i] <= h.a[parent] { break }`,
      `    h.a[i], h.a[parent] = h.a[parent], h.a[i]`,
      `    i = parent`,
      `  }`,
      `}`,
    ],
  },
  steps: [
    {
      array: [50, 30, 40, 10, 20],
      states: {},
      vars: [
        { label: 'heap', value: '[50, 30, 40, 10, 20]' },
        { label: 'inserting', value: '70' },
      ],
      note: 'Start with the max-heap [50, 30, 40, 10, 20]. We will insert 70.',
      codeLine: 4,
    },
    {
      array: [50, 30, 40, 10, 20, 70],
      states: { 5: 'new' },
      vars: [
        { label: 'i', value: '5' },
        { label: 'parent', value: '2 (= 40)' },
      ],
      note: '1. Append 70 at the end (index 5). The array is no longer a valid heap — 70 > its parent (40).',
      codeLine: 5,
    },
    {
      array: [50, 30, 40, 10, 20, 70],
      states: { 5: 'comparing', 2: 'comparing' },
      compare: [2, 5],
      vars: [
        { label: 'i', value: '5' },
        { label: 'parent', value: '2 (= 40)' },
        { label: 'compare', value: '70 > 40 → swap' },
      ],
      note: 'Compare a[5] = 70 with a[parent = (5-1)>>1 = 2] = 40. 70 > 40, swap them.',
      codeLine: 9,
    },
    {
      array: [50, 30, 70, 10, 20, 40],
      states: { 2: 'just-swapped', 5: 'just-swapped' },
      vars: [
        { label: 'i', value: '2' },
        { label: 'parent', value: '0 (= 50)' },
      ],
      note: 'After swap: [50, 30, 70, 10, 20, 40]. i becomes 2. Now compare with new parent.',
      codeLine: 11,
    },
    {
      array: [50, 30, 70, 10, 20, 40],
      states: { 2: 'comparing', 0: 'comparing' },
      compare: [0, 2],
      vars: [
        { label: 'i', value: '2' },
        { label: 'parent', value: '0 (= 50)' },
        { label: 'compare', value: '70 > 50 → swap' },
      ],
      note: 'Compare a[2] = 70 with a[parent = 0] = 50. 70 > 50, swap.',
      codeLine: 9,
    },
    {
      array: [70, 30, 50, 10, 20, 40],
      states: { 0: 'just-swapped', 2: 'just-swapped' },
      vars: [
        { label: 'i', value: '0' },
        { label: 'state', value: 'reached root' },
      ],
      note: 'After swap: [70, 30, 50, 10, 20, 40]. i = 0 (root). Loop exits.',
      codeLine: 8,
    },
    {
      array: [70, 30, 50, 10, 20, 40],
      states: {},
      vars: [
        { label: 'heap', value: '[70, 30, 50, 10, 20, 40]' },
        { label: 'comparisons', value: '2' },
      ],
      note: 'Done. 70 reached the root in 2 comparisons (log₂(6) ≈ 2.58). Heap property restored.',
      codeLine: 13,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — Extract max (sift down)
// ---------------------------------------------------------------------------

const extract: HeapScenario = {
  id: 'extract-sift-down',
  name: 'Extract max (sift down)',
  heapKind: 'max',
  blurb:
    'Extracting the max from a heap: save the root, move the last element to the root, then "sift down" — swap with the larger child while the heap property is violated.',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  code: {
    js: [
      `pop(): number | undefined {`,
      `  if (this.a.length === 0) return undefined`,
      `  const max = this.a[0]`,
      `  const last = this.a.pop()!`,
      `  if (this.a.length === 0) return max`,
      `  this.a[0] = last`,
      ``,
      `  let i = 0`,
      `  const n = this.a.length`,
      `  while (true) {`,
      `    const l = 2 * i + 1, r = 2 * i + 2`,
      `    let largest = i`,
      `    if (l < n && this.a[l] > this.a[largest]) largest = l`,
      `    if (r < n && this.a[r] > this.a[largest]) largest = r`,
      `    if (largest === i) break`,
      `    ;[this.a[i], this.a[largest]] = [this.a[largest], this.a[i]]`,
      `    i = largest`,
      `  }`,
      `  return max`,
      `}`,
    ],
    go: [
      `func (h *MaxHeap) Pop() (int, bool) {`,
      `  if len(h.a) == 0 { return 0, false }`,
      `  max := h.a[0]`,
      `  n := len(h.a) - 1`,
      `  h.a[0] = h.a[n]`,
      `  h.a = h.a[:n]`,
      ``,
      `  i := 0`,
      `  for {`,
      `    l, r := 2*i+1, 2*i+2`,
      `    largest := i`,
      `    if l < n && h.a[l] > h.a[largest] { largest = l }`,
      `    if r < n && h.a[r] > h.a[largest] { largest = r }`,
      `    if largest == i { break }`,
      `    h.a[i], h.a[largest] = h.a[largest], h.a[i]`,
      `    i = largest`,
      `  }`,
      `  return max, true`,
      `}`,
    ],
  },
  steps: [
    {
      array: [70, 30, 50, 10, 20, 40],
      states: {},
      output: [],
      vars: [
        { label: 'heap', value: '[70, 30, 50, 10, 20, 40]' },
        { label: 'op', value: 'pop()' },
      ],
      note: 'Start: max-heap [70, 30, 50, 10, 20, 40]. We want to remove the max (70) and keep the heap valid.',
      codeLine: 1,
    },
    {
      array: [70, 30, 50, 10, 20, 40],
      states: { 0: 'extracted', 5: 'comparing' },
      output: [70],
      vars: [
        { label: 'saved max', value: '70' },
        { label: 'last', value: '40 (index 5)' },
      ],
      note: 'Save the root (70) as the answer to return. Then move the last element (40) to the root.',
      codeLine: 3,
    },
    {
      array: [40, 30, 50, 10, 20],
      states: { 0: 'sift-target' },
      output: [70],
      vars: [
        { label: 'array', value: '[40, 30, 50, 10, 20]' },
        { label: 'i', value: '0' },
      ],
      note: 'Array is now [40, 30, 50, 10, 20]. Root = 40 violates max-heap (children 30, 50). Sift down.',
      codeLine: 9,
    },
    {
      array: [40, 30, 50, 10, 20],
      states: { 0: 'comparing', 1: 'comparing', 2: 'comparing' },
      compare: [0, 2],
      output: [70],
      vars: [
        { label: 'i', value: '0' },
        { label: 'l', value: '1 (= 30)' },
        { label: 'r', value: '2 (= 50)' },
        { label: 'largest', value: '2 (= 50)' },
      ],
      note: 'At i=0. Children: left=30 (idx 1), right=50 (idx 2). Largest of {40, 30, 50} = 50 at index 2.',
      codeLine: 14,
    },
    {
      array: [50, 30, 40, 10, 20],
      states: { 0: 'just-swapped', 2: 'just-swapped' },
      output: [70],
      vars: [
        { label: 'array', value: '[50, 30, 40, 10, 20]' },
        { label: 'i', value: '2' },
      ],
      note: 'Swap a[0] and a[2]. Array: [50, 30, 40, 10, 20]. i = 2.',
      codeLine: 17,
    },
    {
      array: [50, 30, 40, 10, 20],
      states: { 2: 'sift-target' },
      output: [70],
      vars: [
        { label: 'i', value: '2' },
        { label: 'children', value: 'l=5, r=6 (both out of bounds)' },
      ],
      note: 'At i=2. Children would be at index 5 and 6 — both ≥ n. No more siftdown. Heap valid.',
      codeLine: 15,
    },
    {
      array: [50, 30, 40, 10, 20],
      states: {},
      output: [70],
      vars: [
        { label: 'returned', value: '70' },
        { label: 'heap', value: '[50, 30, 40, 10, 20]' },
      ],
      note: 'Done. Returned 70. Heap is now [50, 30, 40, 10, 20] — still a valid max-heap.',
      codeLine: 21,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — Heapify (build a heap from an unsorted array)
// ---------------------------------------------------------------------------

const heapify: HeapScenario = {
  id: 'heapify',
  name: 'Heapify (O(n) build)',
  heapKind: 'max',
  blurb:
    'Turn an unsorted array into a heap in O(n) — NOT O(n log n). The trick: sift down starting from the last non-leaf, working backward to the root. Most siftDowns are short because most nodes are near the bottom.',
  complexity: { time: 'O(n)', space: 'O(1)' },
  code: {
    js: [
      `function heapify(a: number[]): number[] {`,
      `  const n = a.length`,
      `  // Last non-leaf is at (n / 2) - 1`,
      `  for (let i = (n >> 1) - 1; i >= 0; i--) {`,
      `    siftDown(a, i, n)`,
      `  }`,
      `  return a`,
      `}`,
      ``,
      `function siftDown(a: number[], i: number, n: number) {`,
      `  while (true) {`,
      `    const l = 2*i+1, r = 2*i+2`,
      `    let largest = i`,
      `    if (l < n && a[l] > a[largest]) largest = l`,
      `    if (r < n && a[r] > a[largest]) largest = r`,
      `    if (largest === i) return`,
      `    ;[a[i], a[largest]] = [a[largest], a[i]]`,
      `    i = largest`,
      `  }`,
      `}`,
    ],
    go: [
      `func Heapify(a []int) {`,
      `  n := len(a)`,
      `  for i := n/2 - 1; i >= 0; i-- {`,
      `    siftDown(a, i, n)`,
      `  }`,
      `}`,
      ``,
      `func siftDown(a []int, i, n int) {`,
      `  for {`,
      `    l, r := 2*i+1, 2*i+2`,
      `    largest := i`,
      `    if l < n && a[l] > a[largest] { largest = l }`,
      `    if r < n && a[r] > a[largest] { largest = r }`,
      `    if largest == i { return }`,
      `    a[i], a[largest] = a[largest], a[i]`,
      `    i = largest`,
      `  }`,
      `}`,
    ],
  },
  steps: [
    {
      array: [3, 1, 6, 5, 2, 4],
      states: { 3: 'leaf-skipped', 4: 'leaf-skipped', 5: 'leaf-skipped' },
      vars: [
        { label: 'array', value: '[3, 1, 6, 5, 2, 4]' },
        { label: 'last non-leaf', value: 'index 2 (= 6)' },
      ],
      note: 'Start with unsorted [3, 1, 6, 5, 2, 4]. Last non-leaf is at (n/2)-1 = 2. Leaves (indices 3, 4, 5) are already trivially heaps.',
      codeLine: 3,
    },
    {
      array: [3, 1, 6, 5, 2, 4],
      states: {
        2: 'sift-target',
        5: 'comparing',
        3: 'leaf-skipped',
        4: 'leaf-skipped',
      },
      compare: [2, 5],
      vars: [
        { label: 'i', value: '2 (= 6)' },
        { label: 'l', value: '5 (= 4)' },
        { label: 'largest', value: '6 (stays at i)' },
      ],
      note: 'siftDown index 2 (value 6). Left child is index 5 (value 4). 6 > 4, no swap needed.',
      codeLine: 14,
    },
    {
      array: [3, 1, 6, 5, 2, 4],
      states: {
        1: 'sift-target',
        3: 'comparing',
        4: 'comparing',
      },
      compare: [1, 3],
      vars: [
        { label: 'i', value: '1 (= 1)' },
        { label: 'l', value: '3 (= 5)' },
        { label: 'r', value: '4 (= 2)' },
        { label: 'largest', value: '3 (= 5)' },
      ],
      note: 'siftDown index 1 (value 1). Children: 5 (idx 3), 2 (idx 4). Largest is 5 at index 3. 1 < 5, swap.',
      codeLine: 14,
    },
    {
      array: [3, 5, 6, 1, 2, 4],
      states: { 1: 'just-swapped', 3: 'just-swapped' },
      vars: [
        { label: 'array', value: '[3, 5, 6, 1, 2, 4]' },
        { label: 'i', value: '3' },
      ],
      note: 'Swap a[1] ↔ a[3]. Array: [3, 5, 6, 1, 2, 4]. Continue siftDown from index 3.',
      codeLine: 16,
    },
    {
      array: [3, 5, 6, 1, 2, 4],
      states: { 3: 'sift-target' },
      vars: [
        { label: 'i', value: '3' },
        { label: 'children', value: 'l=7, r=8 (out of bounds)' },
      ],
      note: 'At index 3. Children at 7, 8 — out of bounds. Subtree done.',
      codeLine: 15,
    },
    {
      array: [3, 5, 6, 1, 2, 4],
      states: {
        0: 'sift-target',
        1: 'comparing',
        2: 'comparing',
      },
      compare: [0, 2],
      vars: [
        { label: 'i', value: '0 (= 3)' },
        { label: 'l', value: '1 (= 5)' },
        { label: 'r', value: '2 (= 6)' },
        { label: 'largest', value: '2 (= 6)' },
      ],
      note: 'siftDown index 0 (value 3). Children: 5 (idx 1), 6 (idx 2). Largest is 6 at index 2. 3 < 6, swap.',
      codeLine: 14,
    },
    {
      array: [6, 5, 3, 1, 2, 4],
      states: { 0: 'just-swapped', 2: 'just-swapped' },
      vars: [
        { label: 'array', value: '[6, 5, 3, 1, 2, 4]' },
        { label: 'i', value: '2' },
      ],
      note: 'Swap a[0] ↔ a[2]. Array: [6, 5, 3, 1, 2, 4]. Continue from index 2.',
      codeLine: 16,
    },
    {
      array: [6, 5, 3, 1, 2, 4],
      states: { 2: 'sift-target', 5: 'comparing' },
      compare: [2, 5],
      vars: [
        { label: 'i', value: '2 (= 3)' },
        { label: 'l', value: '5 (= 4)' },
        { label: 'largest', value: '5 (= 4)' },
      ],
      note: 'At index 2 (value 3). Left child: 4 (idx 5). 4 > 3, swap.',
      codeLine: 14,
    },
    {
      array: [6, 5, 4, 1, 2, 3],
      states: { 2: 'just-swapped', 5: 'just-swapped' },
      vars: [
        { label: 'array', value: '[6, 5, 4, 1, 2, 3]' },
        { label: 'i', value: '5' },
      ],
      note: 'Swap. Array: [6, 5, 4, 1, 2, 3]. Continue from index 5. No children — done.',
      codeLine: 16,
    },
    {
      array: [6, 5, 4, 1, 2, 3],
      states: {},
      vars: [
        { label: 'final', value: '[6, 5, 4, 1, 2, 3]' },
        { label: 'swaps', value: '3' },
        { label: 'time', value: 'O(n)' },
      ],
      note: 'Done. [6, 5, 4, 1, 2, 3] is a valid max-heap. Only 3 swaps for 6 elements. Bottom-up heapify is O(n), not O(n log n).',
      codeLine: 7,
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — Top K with a min-heap
// ---------------------------------------------------------------------------

const topK: HeapScenario = {
  id: 'top-k',
  name: 'Top K (min-heap)',
  heapKind: 'min',
  blurb:
    'Find the K largest values in a stream. Maintain a MIN-heap of size K: if the next value beats the heap\'s minimum, pop the min and push the new value. At the end, the heap holds the K largest values. O(n log K) — beats sorting (O(n log n)) when K is small.',
  complexity: { time: 'O(n log K)', space: 'O(K)' },
  code: {
    js: [
      `function topK(values: number[], k: number): number[] {`,
      `  const heap = new MinHeap()  // size-capped at k`,
      ``,
      `  for (const v of values) {`,
      `    if (heap.size() < k) {`,
      `      heap.push(v)`,
      `    } else if (v > heap.peek()) {`,
      `      heap.pop()`,
      `      heap.push(v)`,
      `    }`,
      `  }`,
      ``,
      `  return heap.toArray().sort((a, b) => b - a)`,
      `}`,
    ],
    go: [
      `import "container/heap"`,
      ``,
      `func TopK(values []int, k int) []int {`,
      `  h := &IntMinHeap{}`,
      `  heap.Init(h)`,
      ``,
      `  for _, v := range values {`,
      `    if h.Len() < k {`,
      `      heap.Push(h, v)`,
      `    } else if v > (*h)[0] {`,
      `      heap.Pop(h)`,
      `      heap.Push(h, v)`,
      `    }`,
      `  }`,
      ``,
      `  return *h  // sort if you need ranked order`,
      `}`,
    ],
  },
  steps: (() => {
    // Stream: [3, 1, 7, 5, 9, 2, 6, 8], K = 3
    // After processing, top 3 = {7, 8, 9}
    const K = 3
    const stream = [3, 1, 7, 5, 9, 2, 6, 8]
    const out: HeapStep[] = []

    out.push({
      array: [],
      states: {},
      remaining: stream,
      vars: [
        { label: 'K', value: '3' },
        { label: 'stream', value: '[3, 1, 7, 5, 9, 2, 6, 8]' },
      ],
      note: `Find top ${K} largest. Strategy: keep a MIN-heap of size ${K}. The heap's root will always be the smallest of our current "top K" candidates — easy to compare against new values.`,
      codeLine: 2,
    })

    // After pushing 3
    out.push({
      array: [3],
      states: { 0: 'new' },
      remaining: stream.slice(1),
      currentInput: 3,
      vars: [
        { label: 'value', value: '3' },
        { label: 'heap size', value: '1' },
        { label: 'decision', value: 'push (size < K)' },
      ],
      note: 'Value 3. Heap size (0) < K. Push.',
      codeLine: 6,
    })

    out.push({
      array: [1, 3],
      states: { 0: 'kth', 1: 'normal' },
      remaining: stream.slice(2),
      currentInput: 1,
      vars: [
        { label: 'value', value: '1' },
        { label: 'heap size', value: '2' },
        { label: 'decision', value: 'push, sift up' },
      ],
      note: 'Value 1. Push → sift up. New min = 1 at root. Heap [1, 3].',
      codeLine: 6,
    })

    out.push({
      array: [1, 3, 7],
      states: { 0: 'kth' },
      remaining: stream.slice(3),
      currentInput: 7,
      vars: [
        { label: 'value', value: '7' },
        { label: 'heap size', value: '3' },
        { label: 'decision', value: 'push (size = K)' },
      ],
      note: 'Value 7. Heap size (2) < K. Push. Heap [1, 3, 7]. Now full.',
      codeLine: 6,
    })

    out.push({
      array: [1, 3, 7],
      states: { 0: 'comparing' },
      remaining: stream.slice(4),
      currentInput: 5,
      vars: [
        { label: 'value', value: '5' },
        { label: 'heap min', value: '1' },
        { label: 'compare', value: '5 > 1 → swap in' },
      ],
      note: 'Value 5. Heap full. Compare 5 vs heap min (1). 5 > 1 → eject 1, insert 5.',
      codeLine: 8,
    })

    // After ejecting 1, inserting 5: pop 1, root becomes last (7), then sift down
    // pop 1, fill with last (7) → [7, 3]. Sift down 7: child=3, swap → [3, 7]. Then push 5 → [3, 7, 5]. Sift up: parent of 5 is 0 (=3), 5>3 no swap. Heap = [3, 7, 5].
    out.push({
      array: [3, 7, 5],
      states: { 0: 'kth', 2: 'new' },
      remaining: stream.slice(4),
      currentInput: 5,
      vars: [
        { label: 'heap', value: '[3, 7, 5]' },
        { label: 'min', value: '3' },
      ],
      note: 'Popped 1, pushed 5. Heap now [3, 7, 5]. Min = 3.',
      codeLine: 10,
    })

    out.push({
      array: [3, 7, 5],
      states: { 0: 'comparing' },
      remaining: stream.slice(5),
      currentInput: 9,
      vars: [
        { label: 'value', value: '9' },
        { label: 'heap min', value: '3' },
        { label: 'compare', value: '9 > 3 → swap in' },
      ],
      note: 'Value 9. 9 > 3 → eject 3, insert 9.',
      codeLine: 8,
    })

    // Pop 3, refill with last (5) → [5, 7], sift down. l=1 (=7), largest=5? In min-heap, smallest. 5<7 no swap. → [5, 7]. Push 9 → [5, 7, 9]. Sift up 9: parent=5, 9>5 stop. → [5, 7, 9]. Actually wait, in min-heap we'd want smallest at root. 5 is smallest. Good.
    out.push({
      array: [5, 7, 9],
      states: { 0: 'kth', 2: 'new' },
      remaining: stream.slice(5),
      currentInput: 9,
      vars: [
        { label: 'heap', value: '[5, 7, 9]' },
        { label: 'min', value: '5' },
      ],
      note: 'Heap [5, 7, 9]. Min = 5.',
      codeLine: 10,
    })

    out.push({
      array: [5, 7, 9],
      states: { 0: 'comparing' },
      remaining: stream.slice(6),
      currentInput: 2,
      vars: [
        { label: 'value', value: '2' },
        { label: 'heap min', value: '5' },
        { label: 'compare', value: '2 < 5 → skip' },
      ],
      note: 'Value 2. 2 < heap min (5). Cannot be in top K. Skip.',
      codeLine: 8,
    })

    out.push({
      array: [5, 7, 9],
      states: { 0: 'comparing' },
      remaining: stream.slice(7),
      currentInput: 6,
      vars: [
        { label: 'value', value: '6' },
        { label: 'compare', value: '6 > 5 → swap in' },
      ],
      note: 'Value 6. 6 > 5 → eject 5, insert 6. New heap: [6, 7, 9].',
      codeLine: 8,
    })

    out.push({
      array: [6, 7, 9],
      states: { 0: 'kth' },
      remaining: [],
      currentInput: 8,
      vars: [
        { label: 'value', value: '8' },
        { label: 'compare', value: '8 > 6 → swap in' },
      ],
      note: 'Value 8. 8 > 6 → eject 6, insert 8. New heap: [7, 8, 9]. Stream done.',
      codeLine: 8,
    })

    out.push({
      array: [7, 8, 9],
      states: { 0: 'kth' },
      remaining: [],
      vars: [
        { label: 'top K', value: '{7, 8, 9}' },
        { label: 'sorted desc', value: '[9, 8, 7]' },
      ],
      note: 'Done. Top 3 = {7, 8, 9}. The min-heap held them; sort if you need ranked order. O(n log K) total.',
      codeLine: 14,
    })

    return out
  })(),
}

export const scenarios: HeapScenario[] = [insert, extract, heapify, topK]
