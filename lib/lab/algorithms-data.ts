// Algorithm Patterns — visualizer data model.
//
// Four classic interview patterns, each animated step-by-step:
//   1. Sliding Window  — longest substring without repeating characters
//   2. Two Pointers    — find pair with given sum in sorted array
//   3. Binary Search   — find target in sorted array
//   4. BFS on Grid     — count islands (4-connected components of 1s)

export type Pointer = {
  id: string
  label: string
  index: number
  tone: 'accent' | 'ink' | 'muted'
}

export type Highlight = {
  from: number
  to: number
  tone: 'accent' | 'ink' | 'paper3'
  label?: string
}

export type ArrayCell = {
  value: string | number
  // Optional state per cell (used by binary-search "eliminated" half).
  state?: 'normal' | 'eliminated' | 'found'
}

export interface ArrayView {
  cells: ArrayCell[]
  pointers: Pointer[]
  // Inclusive ranges to draw underneath the array as bands
  highlights: Highlight[]
}

export type GridCellState = 'water' | 'land' | 'visiting' | 'visited'

export interface GridView {
  rows: number
  cols: number
  // Flat row-major. Length = rows*cols.
  cells: GridCellState[]
  // Coordinates currently in the BFS queue (display labels).
  queue: Array<{ r: number; c: number }>
  // The cell being processed THIS step (highlighted with accent).
  current?: { r: number; c: number }
}

export interface AlgoVar {
  label: string
  value: string
}

export interface AlgoStep {
  // Which renderer to use
  view: 'array' | 'grid'
  array?: ArrayView
  grid?: GridView
  vars: AlgoVar[]
  codeLine?: number
  note: string
}

export interface AlgoScenario {
  id: string
  name: string
  blurb: string
  view: 'array' | 'grid'
  code: string[]
  // Big-O summary shown below the controls
  complexity: { time: string; space: string }
  steps: AlgoStep[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const arrCells = (xs: (string | number)[]): ArrayCell[] =>
  xs.map((v) => ({ value: v }))

// ---------------------------------------------------------------------------
// Scenario 1 — Sliding Window: Longest Substring Without Repeating Characters
// ---------------------------------------------------------------------------

const sw: AlgoScenario = {
  id: 'sliding-window',
  name: 'Sliding window',
  view: 'array',
  blurb:
    'Find the length of the longest substring with no repeating characters. Move the right pointer forward; if a duplicate appears, shrink the left pointer until the duplicate is gone.',
  complexity: { time: 'O(n)', space: 'O(k) — k = distinct chars in window' },
  code: [
    `function lengthOfLongestSubstring(s: string): number {`,
    `  const seen = new Set<string>()`,
    `  let left = 0, max = 0`,
    ``,
    `  for (let right = 0; right < s.length; right++) {`,
    `    while (seen.has(s[right])) {`,
    `      seen.delete(s[left])`,
    `      left++`,
    `    }`,
    `    seen.add(s[right])`,
    `    max = Math.max(max, right - left + 1)`,
    `  }`,
    `  return max`,
    `}`,
  ],
  steps: (() => {
    const s = 'p w w k e w'.split(' ')
    const cells = arrCells(s)

    const ptrs = (left: number, right: number): Pointer[] => [
      { id: 'l', label: 'left', index: left, tone: 'accent' },
      { id: 'r', label: 'right', index: right, tone: 'ink' },
    ]

    const window = (left: number, right: number): Highlight[] =>
      left <= right
        ? [{ from: left, to: right, tone: 'paper3', label: 'window' }]
        : []

    const make = (
      left: number,
      right: number,
      set: string[],
      max: number,
      note: string,
      codeLine?: number,
    ): AlgoStep => ({
      view: 'array',
      array: { cells, pointers: ptrs(left, right), highlights: window(left, right) },
      vars: [
        { label: 'left', value: String(left) },
        { label: 'right', value: String(right) },
        { label: 'window', value: set.length ? `{ ${set.join(', ')} }` : '{}' },
        { label: 'max length', value: String(max) },
      ],
      note,
      codeLine,
    })

    return [
      make(0, -1, [], 0, 'Initial state. seen = {}, max = 0. right starts before index 0.', 3),
      make(0, 0, ['p'], 1, 'right=0, s[right]=p. Not in seen. Add. Window = "p", length 1. max=1.', 5),
      make(0, 1, ['p', 'w'], 2, 'right=1, s[right]=w. Not in seen. Add. Window = "pw", length 2. max=2.', 5),
      make(0, 2, ['p', 'w'], 2, 'right=2, s[right]=w. ALREADY in seen → enter while loop to shrink left.', 6),
      make(1, 2, ['w'], 2, 'while: remove s[left]=p from seen. left=1. seen still has w — keep shrinking.', 7),
      make(2, 2, [], 2, 'while: remove s[left]=w from seen. left=2. seen no longer has w — exit while.', 7),
      make(2, 2, ['w'], 2, 'Now add s[right]=w to seen. Window = "w", length 1. max unchanged.', 10),
      make(2, 3, ['w', 'k'], 2, 'right=3, s[right]=k. New. Add. Window = "wk", length 2.', 5),
      make(2, 4, ['w', 'k', 'e'], 3, 'right=4, s[right]=e. New. Add. Window = "wke", length 3. max=3.', 11),
      make(2, 5, ['w', 'k', 'e'], 3, 'right=5, s[right]=w. ALREADY in seen → shrink left.', 6),
      make(3, 5, ['k', 'e'], 3, 'while: remove s[left]=w. left=3. seen no longer has w — exit.', 7),
      make(3, 5, ['k', 'e', 'w'], 3, 'Add s[right]=w. Window = "kew", length 3. max unchanged (already 3).', 10),
      make(3, 5, ['k', 'e', 'w'], 3, 'Loop ends. Return max = 3. Answer: longest no-repeat substring has length 3.', 13),
    ]
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — Two Pointers: Two Sum II (sorted array)
// ---------------------------------------------------------------------------

const tp: AlgoScenario = {
  id: 'two-pointers',
  name: 'Two pointers',
  view: 'array',
  blurb:
    'Given a sorted array, find two indices whose values sum to the target. Use one pointer at each end; move them inward based on whether the current sum is too big or too small.',
  complexity: { time: 'O(n)', space: 'O(1)' },
  code: [
    `function twoSum(arr: number[], target: number): [number, number] | null {`,
    `  let left = 0, right = arr.length - 1`,
    ``,
    `  while (left < right) {`,
    `    const sum = arr[left] + arr[right]`,
    `    if (sum === target) return [left, right]`,
    `    if (sum < target) left++`,
    `    else right--`,
    `  }`,
    `  return null`,
    `}`,
  ],
  steps: (() => {
    const arr = [2, 3, 5, 7, 11]
    // target = 10 (referenced in display strings)
    const cells = arrCells(arr)

    const ptrs = (l: number, r: number, found: boolean): Pointer[] => [
      { id: 'l', label: 'left', index: l, tone: 'accent' },
      { id: 'r', label: 'right', index: r, tone: 'ink' },
      ...(found
        ? [
            { id: 'l-f' as const, label: '✓', index: l, tone: 'accent' as const },
            { id: 'r-f' as const, label: '✓', index: r, tone: 'accent' as const },
          ]
        : []),
    ]

    const make = (
      l: number,
      r: number,
      vars: AlgoVar[],
      note: string,
      codeLine?: number,
      found = false,
    ): AlgoStep => ({
      view: 'array',
      array: {
        cells,
        pointers: ptrs(l, r, found),
        highlights: l <= r ? [{ from: l, to: r, tone: 'paper3' }] : [],
      },
      vars,
      note,
      codeLine,
    })

    return [
      make(
        0,
        4,
        [
          { label: 'target', value: '10' },
          { label: 'left', value: '0 (= 2)' },
          { label: 'right', value: '4 (= 11)' },
        ],
        'Initial: left=0 (arr[0]=2), right=4 (arr[4]=11).',
        2,
      ),
      make(
        0,
        4,
        [
          { label: 'target', value: '10' },
          { label: 'sum', value: '2 + 11 = 13' },
          { label: 'verdict', value: '13 > 10 → right--' },
        ],
        'sum = 2 + 11 = 13. Too big. Move right pointer inward.',
        7,
      ),
      make(
        0,
        3,
        [
          { label: 'target', value: '10' },
          { label: 'sum', value: '2 + 7 = 9' },
          { label: 'verdict', value: '9 < 10 → left++' },
        ],
        'right=3 (arr[3]=7). sum = 2 + 7 = 9. Too small. Move left inward.',
        6,
      ),
      make(
        1,
        3,
        [
          { label: 'target', value: '10' },
          { label: 'sum', value: '3 + 7 = 10' },
          { label: 'verdict', value: '= target ✓' },
        ],
        'left=1 (arr[1]=3). sum = 3 + 7 = 10. Match! Return [1, 3].',
        5,
        true,
      ),
    ]
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — Binary Search
// ---------------------------------------------------------------------------

const bs: AlgoScenario = {
  id: 'binary-search',
  name: 'Binary search',
  view: 'array',
  blurb:
    'Find a target in a sorted array by repeatedly halving the search range. Each comparison eliminates half the remaining candidates.',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  code: [
    `function binarySearch(arr: number[], target: number): number {`,
    `  let lo = 0, hi = arr.length - 1`,
    ``,
    `  while (lo <= hi) {`,
    `    const mid = Math.floor((lo + hi) / 2)`,
    `    if (arr[mid] === target) return mid`,
    `    if (arr[mid] < target) lo = mid + 1`,
    `    else hi = mid - 1`,
    `  }`,
    `  return -1`,
    `}`,
  ],
  steps: (() => {
    const arr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53]
    const target = 29

    const make = (
      lo: number,
      hi: number,
      mid: number | null,
      eliminated: Set<number>,
      found: number | null,
      note: string,
      codeLine?: number,
    ): AlgoStep => {
      const cells: ArrayCell[] = arr.map((v, i) => ({
        value: v,
        state:
          i === found
            ? 'found'
            : eliminated.has(i)
              ? 'eliminated'
              : 'normal',
      }))
      const pointers: Pointer[] = []
      if (lo >= 0 && lo < arr.length) pointers.push({ id: 'lo', label: 'lo', index: lo, tone: 'accent' })
      if (hi >= 0 && hi < arr.length) pointers.push({ id: 'hi', label: 'hi', index: hi, tone: 'accent' })
      if (mid !== null) pointers.push({ id: 'mid', label: 'mid', index: mid, tone: 'ink' })

      return {
        view: 'array',
        array: {
          cells,
          pointers,
          highlights:
            lo <= hi && lo >= 0
              ? [{ from: lo, to: hi, tone: 'paper3', label: 'search range' }]
              : [],
        },
        vars: [
          { label: 'target', value: String(target) },
          { label: 'lo', value: String(lo) },
          { label: 'hi', value: String(hi) },
          ...(mid !== null
            ? [
                { label: 'mid', value: String(mid) },
                { label: 'arr[mid]', value: String(arr[mid]) },
              ]
            : []),
          ...(found !== null
            ? [{ label: 'result', value: `index ${found}` }]
            : []),
        ],
        note,
        codeLine,
      }
    }

    return [
      make(0, 15, null, new Set(), null, `Initial: lo=0, hi=15. Search range = full array. target = ${target}.`, 2),
      make(0, 15, 7, new Set(), null, 'mid = (0+15)/2 = 7. arr[7] = 19. Compare to 29.', 5),
      make(8, 15, 7, new Set([0, 1, 2, 3, 4, 5, 6, 7]), null, '19 < 29 → discard left half (including mid). lo = 8.', 7),
      make(8, 15, 11, new Set([0, 1, 2, 3, 4, 5, 6, 7]), null, 'New mid = (8+15)/2 = 11. arr[11] = 37. Compare to 29.', 5),
      make(8, 10, 11, new Set([0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15]), null, '37 > 29 → discard right half (including mid). hi = 10.', 8),
      make(8, 10, 9, new Set([0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15]), null, 'New mid = (8+10)/2 = 9. arr[9] = 29. Compare to 29.', 5),
      make(8, 10, 9, new Set([0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15]), 9, 'arr[9] === 29 → return 9. Found in 3 comparisons out of 16 possible.', 6),
    ]
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 4 — BFS on Grid: Number of Islands
// ---------------------------------------------------------------------------

const bfs: AlgoScenario = {
  id: 'bfs-islands',
  name: 'BFS — Number of islands',
  view: 'grid',
  blurb:
    'Count the 4-connected components of land cells in a 2D grid. Sweep the grid; on each unvisited land cell, run a breadth-first search to mark the whole island as visited, then increment the count.',
  complexity: { time: 'O(rows × cols)', space: 'O(rows × cols)' },
  code: [
    `function numIslands(grid: string[][]): number {`,
    `  const rows = grid.length, cols = grid[0].length`,
    `  const visited = new Set<string>()`,
    `  let count = 0`,
    ``,
    `  for (let r = 0; r < rows; r++) {`,
    `    for (let c = 0; c < cols; c++) {`,
    `      if (grid[r][c] === '1' && !visited.has(\`\${r},\${c}\`)) {`,
    `        count++`,
    `        const q = [[r, c]]`,
    `        while (q.length) {`,
    `          const [y, x] = q.shift()!`,
    `          if (visited.has(\`\${y},\${x}\`)) continue`,
    `          visited.add(\`\${y},\${x}\`)`,
    `          for (const [dy, dx] of [[1,0],[-1,0],[0,1],[0,-1]]) {`,
    `            const ny = y + dy, nx = x + dx`,
    `            if (ny>=0 && ny<rows && nx>=0 && nx<cols`,
    `                && grid[ny][nx] === '1') q.push([ny, nx])`,
    `          }`,
    `        }`,
    `      }`,
    `    }`,
    `  }`,
    `  return count`,
    `}`,
  ],
  steps: (() => {
    const rows = 3,
      cols = 4
    // grid (row-major):
    //   1 1 0 1
    //   1 0 0 1
    //   0 0 1 0
    const landMap: Record<string, boolean> = {
      '0,0': true,
      '0,1': true,
      '0,2': false,
      '0,3': true,
      '1,0': true,
      '1,1': false,
      '1,2': false,
      '1,3': true,
      '2,0': false,
      '2,1': false,
      '2,2': true,
      '2,3': false,
    }
    const isLand = (r: number, c: number) => landMap[`${r},${c}`] ?? false

    const cellState = (
      r: number,
      c: number,
      visited: Set<string>,
      current?: { r: number; c: number },
      queue?: Array<{ r: number; c: number }>,
    ): GridCellState => {
      if (!isLand(r, c)) return 'water'
      const key = `${r},${c}`
      if (current && current.r === r && current.c === c) return 'visiting'
      if (queue && queue.some((q) => q.r === r && q.c === c)) return 'visiting'
      if (visited.has(key)) return 'visited'
      return 'land'
    }

    const make = (
      visited: Set<string>,
      queue: Array<{ r: number; c: number }>,
      current: { r: number; c: number } | undefined,
      count: number,
      note: string,
      codeLine?: number,
    ): AlgoStep => {
      const cells: GridCellState[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push(cellState(r, c, visited, current, queue))
        }
      }
      return {
        view: 'grid',
        grid: { rows, cols, cells, queue, current },
        vars: [
          { label: 'island count', value: String(count) },
          {
            label: 'queue',
            value: queue.length ? queue.map((p) => `(${p.r},${p.c})`).join(' → ') : '∅',
          },
          { label: 'visited', value: String(visited.size) },
        ],
        note,
        codeLine,
      }
    }

    const v = new Set<string>()
    const steps: AlgoStep[] = []

    steps.push(make(v, [], undefined, 0, 'Initial grid. We\'ll sweep row by row.', 1))
    // Island 1: starts at (0,0)
    steps.push(make(v, [], { r: 0, c: 0 }, 0, 'Scan (0,0). Land found. Start a new BFS — count = 1.', 9))
    let q: Array<{ r: number; c: number }> = [{ r: 0, c: 0 }]
    steps.push(make(v, q, undefined, 1, 'Push (0,0) onto the queue. count = 1.', 10))
    // pop (0,0)
    q = []
    v.add('0,0')
    q = [{ r: 0, c: 1 }, { r: 1, c: 0 }]
    steps.push(make(v, q, { r: 0, c: 0 }, 1, 'Pop (0,0). Mark visited. Push land neighbors: (0,1), (1,0).', 13))
    // pop (0,1)
    q = [{ r: 1, c: 0 }]
    v.add('0,1')
    steps.push(make(v, q, { r: 0, c: 1 }, 1, 'Pop (0,1). Mark visited. Neighbors are water or already queued.', 13))
    // pop (1,0)
    q = []
    v.add('1,0')
    steps.push(make(v, q, { r: 1, c: 0 }, 1, 'Pop (1,0). Mark visited. No new land neighbors. Queue empty — island 1 done.', 13))

    // Sweep continues: (0,2) water, (0,3) land
    steps.push(make(v, q, { r: 0, c: 3 }, 1, 'Sweep continues. (0,2) is water. (0,3) is land — start island 2.', 9))
    q = [{ r: 0, c: 3 }]
    steps.push(make(v, q, undefined, 2, 'Push (0,3). count = 2.', 10))
    // pop (0,3)
    q = [{ r: 1, c: 3 }]
    v.add('0,3')
    steps.push(make(v, q, { r: 0, c: 3 }, 2, 'Pop (0,3). Mark visited. Push (1,3) — its land neighbor.', 13))
    // pop (1,3)
    q = []
    v.add('1,3')
    steps.push(make(v, q, { r: 1, c: 3 }, 2, 'Pop (1,3). Mark visited. No more land neighbors. Island 2 done.', 13))

    // Continue sweep, reach (2,2)
    steps.push(make(v, q, { r: 2, c: 2 }, 2, 'Sweep continues. Row 1 cells are water or visited. Row 2: (2,2) is land — island 3.', 9))
    q = [{ r: 2, c: 2 }]
    steps.push(make(v, q, undefined, 3, 'Push (2,2). count = 3.', 10))
    q = []
    v.add('2,2')
    steps.push(make(v, q, { r: 2, c: 2 }, 3, 'Pop (2,2). Mark visited. Isolated cell — no land neighbors. Island 3 done.', 13))

    steps.push(make(v, q, undefined, 3, 'Sweep finishes. Return 3 islands.', 25))

    return steps
  })(),
}

export const scenarios: AlgoScenario[] = [sw, tp, bs, bfs]
