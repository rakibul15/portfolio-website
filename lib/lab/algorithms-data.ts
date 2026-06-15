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

export type AlgoLanguage = 'js' | 'go'

export interface AlgoScenario {
  id: string
  name: string
  blurb: string
  view: 'array' | 'grid'
  // Source code in multiple languages. Code-line indices in steps refer to
  // BOTH versions — keep the two implementations aligned line-by-line where
  // possible, or accept that highlights are approximate when languages differ.
  code: { js: string[]; go: string[] }
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
  code: {
    js: [
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
    go: [
      `func lengthOfLongestSubstring(s string) int {`,
      `  seen := make(map[byte]bool)`,
      `  left, max := 0, 0`,
      ``,
      `  for right := 0; right < len(s); right++ {`,
      `    for seen[s[right]] {`,
      `      delete(seen, s[left])`,
      `      left++`,
      `    }`,
      `    seen[s[right]] = true`,
      `    if right-left+1 > max { max = right - left + 1 }`,
      `  }`,
      `  return max`,
      `}`,
    ],
  },
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
  code: {
    js: [
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
    go: [
      `func twoSum(arr []int, target int) (int, int, bool) {`,
      `  left, right := 0, len(arr)-1`,
      ``,
      `  for left < right {`,
      `    sum := arr[left] + arr[right]`,
      `    if sum == target { return left, right, true }`,
      `    if sum < target { left++ } else { right-- }`,
      `  }`,
      `  return 0, 0, false`,
      `}`,
    ],
  },
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
  code: {
    js: [
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
    go: [
      `func binarySearch(arr []int, target int) int {`,
      `  lo, hi := 0, len(arr)-1`,
      ``,
      `  for lo <= hi {`,
      `    mid := (lo + hi) / 2`,
      `    if arr[mid] == target { return mid }`,
      `    if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }`,
      `  }`,
      `  return -1`,
      `}`,
    ],
  },
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
  code: {
    js: [
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
    go: [
      `func numIslands(grid [][]byte) int {`,
      `  rows, cols := len(grid), len(grid[0])`,
      `  visited := make(map[[2]int]bool)`,
      `  count := 0`,
      ``,
      `  for r := 0; r < rows; r++ {`,
      `    for c := 0; c < cols; c++ {`,
      `      if grid[r][c] == '1' && !visited[[2]int{r, c}] {`,
      `        count++`,
      `        q := [][2]int{{r, c}}`,
      `        for len(q) > 0 {`,
      `          y, x := q[0][0], q[0][1]`,
      `          q = q[1:]`,
      `          if visited[[2]int{y, x}] { continue }`,
      `          visited[[2]int{y, x}] = true`,
      `          dirs := [4][2]int{{1,0},{-1,0},{0,1},{0,-1}}`,
      `          for _, d := range dirs {`,
      `            ny, nx := y+d[0], x+d[1]`,
      `            if ny>=0 && ny<rows && nx>=0 && nx<cols && grid[ny][nx]=='1' {`,
      `              q = append(q, [2]int{ny, nx})`,
      `            }`,
      `          }`,
      `        }`,
      `      }`,
      `    }`,
      `  }`,
      `  return count`,
      `}`,
    ],
  },
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

// ---------------------------------------------------------------------------
// Scenario 5 — Two Sum (unsorted) using a Hashmap
// ---------------------------------------------------------------------------

const ts: AlgoScenario = {
  id: 'two-sum-hashmap',
  name: 'Two Sum (hashmap)',
  view: 'array',
  blurb:
    'Find two indices that sum to target in an UNSORTED array. One-pass hashmap: as we scan, look up the complement (target − current). O(n) time, O(n) space — beats O(n²) brute force.',
  complexity: { time: 'O(n)', space: 'O(n)' },
  code: {
    js: [
      `function twoSum(arr: number[], target: number): [number, number] | null {`,
      `  const seen = new Map<number, number>()`,
      ``,
      `  for (let i = 0; i < arr.length; i++) {`,
      `    const need = target - arr[i]`,
      `    if (seen.has(need)) {`,
      `      return [seen.get(need)!, i]`,
      `    }`,
      `    seen.set(arr[i], i)`,
      `  }`,
      `  return null`,
      `}`,
    ],
    go: [
      `func twoSum(arr []int, target int) (int, int, bool) {`,
      `  seen := make(map[int]int)`,
      ``,
      `  for i, v := range arr {`,
      `    need := target - v`,
      `    if j, ok := seen[need]; ok {`,
      `      return j, i, true`,
      `    }`,
      `    seen[v] = i`,
      `  }`,
      `  return 0, 0, false`,
      `}`,
    ],
  },
  steps: (() => {
    const arr = [3, 1, 8, 4, 2, 7]
    const target = 10
    const cells = arrCells(arr)

    const make = (
      i: number,
      seen: Array<[number, number]>,
      foundPair: [number, number] | null,
      note: string,
      codeLine?: number,
    ): AlgoStep => {
      const states: ArrayCell[] = cells.map((c, idx) => ({
        value: c.value,
        state: foundPair && (idx === foundPair[0] || idx === foundPair[1]) ? 'found' : 'normal',
      }))
      const pointers: Pointer[] = []
      if (i >= 0 && i < arr.length) {
        pointers.push({ id: 'i', label: 'i', index: i, tone: 'ink' })
      }
      return {
        view: 'array',
        array: { cells: states, pointers, highlights: [] },
        vars: [
          { label: 'target', value: String(target) },
          { label: 'i', value: i >= 0 ? `${i} (= ${arr[i]})` : '—' },
          {
            label: 'seen',
            value: seen.length ? `{ ${seen.map(([v, idx]) => `${v}: ${idx}`).join(', ')} }` : '{}',
          },
          ...(foundPair
            ? [{ label: 'result', value: `[${foundPair[0]}, ${foundPair[1]}]` }]
            : []),
        ],
        note,
        codeLine,
      }
    }

    return [
      make(-1, [], null, `Find two indices i, j such that arr[i] + arr[j] = ${target}. Array is UNSORTED — two-pointers won't work.`, 2),
      make(0, [], null, 'i=0, arr[i]=3. need = 10 - 3 = 7. Seen is empty — not found. Add 3 → 0 to seen.', 4),
      make(1, [[3, 0]], null, 'i=1, arr[i]=1. need = 9. Seen = {3: 0} — no 9. Add 1 → 1.', 5),
      make(2, [[3, 0], [1, 1]], null, 'i=2, arr[i]=8. need = 2. Seen has no 2. Add 8 → 2.', 5),
      make(3, [[3, 0], [1, 1], [8, 2]], null, 'i=3, arr[i]=4. need = 6. Seen has no 6. Add 4 → 3.', 5),
      make(4, [[3, 0], [1, 1], [8, 2], [4, 3]], null, 'i=4, arr[i]=2. need = 8. seen.has(8)! Found complement at index 2.', 6),
      make(4, [[3, 0], [1, 1], [8, 2], [4, 3]], [2, 4], 'Return [2, 4]. arr[2] + arr[4] = 8 + 2 = 10. ✓', 7),
    ]
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 6 — Maximum Subarray (Kadane's Algorithm)
// ---------------------------------------------------------------------------

const kad: AlgoScenario = {
  id: 'kadane-max-subarray',
  name: 'Kadane (max subarray)',
  view: 'array',
  blurb:
    'Find the contiguous subarray with the largest sum. At each index, decide: extend the current subarray, or start fresh from here. The choice is whichever gives a bigger running sum.',
  complexity: { time: 'O(n)', space: 'O(1)' },
  code: {
    js: [
      `function maxSubArray(arr: number[]): number {`,
      `  let best = arr[0]`,
      `  let current = arr[0]`,
      ``,
      `  for (let i = 1; i < arr.length; i++) {`,
      `    current = Math.max(arr[i], current + arr[i])`,
      `    best = Math.max(best, current)`,
      `  }`,
      `  return best`,
      `}`,
    ],
    go: [
      `func maxSubArray(arr []int) int {`,
      `  best := arr[0]`,
      `  current := arr[0]`,
      ``,
      `  for i := 1; i < len(arr); i++ {`,
      `    if arr[i] > current+arr[i] { current = arr[i]`,
      `    } else { current = current + arr[i] }`,
      `    if current > best { best = current }`,
      `  }`,
      `  return best`,
      `}`,
    ],
  },
  steps: (() => {
    const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    const cells = arrCells(arr)

    const make = (
      i: number,
      current: number,
      best: number,
      bestStart: number,
      bestEnd: number,
      decision: 'start' | 'extend' | null,
      note: string,
      codeLine?: number,
    ): AlgoStep => {
      const pointers: Pointer[] = []
      if (i >= 0) pointers.push({ id: 'i', label: 'i', index: i, tone: 'ink' })

      const highlights: Highlight[] = []
      if (bestStart >= 0 && bestEnd >= 0) {
        highlights.push({
          from: bestStart,
          to: bestEnd,
          tone: 'paper3',
          label: 'best so far',
        })
      }

      return {
        view: 'array',
        array: { cells, pointers, highlights },
        vars: [
          { label: 'i', value: i >= 0 ? `${i} (= ${arr[i]})` : '—' },
          { label: 'current', value: String(current) },
          { label: 'best', value: String(best) },
          ...(decision ? [{ label: 'decision', value: decision === 'start' ? 'start fresh' : 'extend' }] : []),
        ],
        note,
        codeLine,
      }
    }

    // Compute optimal subarray for the highlight band
    // For [-2,1,-3,4,-1,2,1,-5,4] the answer is [4,-1,2,1] sum=6, indices 3..6
    const out: AlgoStep[] = []
    out.push(make(0, -2, -2, 0, 0, null, 'best = current = arr[0] = -2.', 2))
    out.push(make(1, 1, 1, 1, 1, 'start', 'i=1. arr[i]=1. extend: -2+1 = -1. fresh: 1. 1 > -1 → start fresh. current = 1. best updated to 1.', 6))
    out.push(make(2, -2, 1, 1, 1, 'extend', 'i=2. arr[i]=-3. extend: 1+(-3) = -2. fresh: -3. -2 > -3 → extend. current = -2.', 6))
    out.push(make(3, 4, 4, 3, 3, 'start', 'i=3. arr[i]=4. extend: -2+4 = 2. fresh: 4. 4 > 2 → start fresh. current = 4. best = 4.', 7))
    out.push(make(4, 3, 4, 3, 4, 'extend', 'i=4. arr[i]=-1. extend: 4-1 = 3. fresh: -1. extend. current = 3.', 6))
    out.push(make(5, 5, 5, 3, 5, 'extend', 'i=5. arr[i]=2. extend: 3+2 = 5. fresh: 2. extend. current = 5. best = 5.', 7))
    out.push(make(6, 6, 6, 3, 6, 'extend', 'i=6. arr[i]=1. extend: 5+1 = 6. extend. current = 6. best = 6.', 7))
    out.push(make(7, 1, 6, 3, 6, 'extend', 'i=7. arr[i]=-5. extend: 6-5 = 1. fresh: -5. extend. current = 1. best stays.', 6))
    out.push(make(8, 5, 6, 3, 6, 'extend', 'i=8. arr[i]=4. extend: 1+4 = 5. fresh: 4. extend. current = 5. best stays.', 6))
    out.push(make(8, 5, 6, 3, 6, null, 'Loop ends. Return best = 6. Optimal subarray: indices 3..6 (values 4, -1, 2, 1).', 9))
    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 7 — Number of Islands via DFS (recursive)
// ---------------------------------------------------------------------------

const dfs: AlgoScenario = {
  id: 'dfs-islands',
  name: 'DFS — Number of islands',
  view: 'grid',
  blurb:
    'Same problem as BFS, but the queue becomes a stack (or just the call stack via recursion). DFS dives deep into one path before backtracking. Same time/space complexity — different traversal order.',
  complexity: { time: 'O(rows × cols)', space: 'O(rows × cols) — call stack' },
  code: {
    js: [
      `function numIslands(grid: string[][]): number {`,
      `  const rows = grid.length, cols = grid[0].length`,
      `  let count = 0`,
      ``,
      `  function dfs(r: number, c: number) {`,
      `    if (r < 0 || r >= rows || c < 0 || c >= cols) return`,
      `    if (grid[r][c] !== '1') return`,
      `    grid[r][c] = '#'  // mark visited in place`,
      `    dfs(r + 1, c)`,
      `    dfs(r - 1, c)`,
      `    dfs(r, c + 1)`,
      `    dfs(r, c - 1)`,
      `  }`,
      ``,
      `  for (let r = 0; r < rows; r++) {`,
      `    for (let c = 0; c < cols; c++) {`,
      `      if (grid[r][c] === '1') {`,
      `        count++`,
      `        dfs(r, c)`,
      `      }`,
      `    }`,
      `  }`,
      `  return count`,
      `}`,
    ],
    go: [
      `func numIslands(grid [][]byte) int {`,
      `  rows, cols := len(grid), len(grid[0])`,
      `  count := 0`,
      ``,
      `  var dfs func(r, c int)`,
      `  dfs = func(r, c int) {`,
      `    if r < 0 || r >= rows || c < 0 || c >= cols { return }`,
      `    if grid[r][c] != '1' { return }`,
      `    grid[r][c] = '#'`,
      `    dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)`,
      `  }`,
      ``,
      `  for r := 0; r < rows; r++ {`,
      `    for c := 0; c < cols; c++ {`,
      `      if grid[r][c] == '1' {`,
      `        count++`,
      `        dfs(r, c)`,
      `      }`,
      `    }`,
      `  }`,
      `  return count`,
      `}`,
    ],
  },
  steps: (() => {
    const rows = 3,
      cols = 4
    // Same grid as BFS scenario:
    //   1 1 0 1
    //   1 0 0 1
    //   0 0 1 0
    const landMap: Record<string, boolean> = {
      '0,0': true, '0,1': true, '0,2': false, '0,3': true,
      '1,0': true, '1,1': false, '1,2': false, '1,3': true,
      '2,0': false, '2,1': false, '2,2': true, '2,3': false,
    }
    const isLand = (r: number, c: number) => landMap[`${r},${c}`] ?? false

    const cellState = (
      r: number,
      c: number,
      visited: Set<string>,
      current?: { r: number; c: number },
      stack?: Array<{ r: number; c: number }>,
    ): GridCellState => {
      if (!isLand(r, c)) return 'water'
      const key = `${r},${c}`
      if (current && current.r === r && current.c === c) return 'visiting'
      if (stack && stack.some((s) => s.r === r && s.c === c)) return 'visiting'
      if (visited.has(key)) return 'visited'
      return 'land'
    }

    const make = (
      visited: Set<string>,
      stack: Array<{ r: number; c: number }>,
      current: { r: number; c: number } | undefined,
      count: number,
      note: string,
      codeLine?: number,
    ): AlgoStep => {
      const cells: GridCellState[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push(cellState(r, c, visited, current, stack))
        }
      }
      return {
        view: 'grid',
        grid: { rows, cols, cells, queue: stack, current },
        vars: [
          { label: 'island count', value: String(count) },
          {
            label: 'call stack',
            value: stack.length
              ? stack.map((p) => `dfs(${p.r},${p.c})`).join(' → ')
              : '∅',
          },
          { label: 'visited', value: String(visited.size) },
        ],
        note,
        codeLine,
      }
    }

    const v = new Set<string>()
    const steps: AlgoStep[] = []

    steps.push(make(v, [], undefined, 0, 'Same grid. Sweep row by row. On each unvisited land cell, dive deep with DFS instead of breadth-first.', 1))
    // Island 1
    steps.push(make(v, [], { r: 0, c: 0 }, 0, 'Scan (0,0). Land — start a new DFS. count=1.', 18))
    steps.push(make(v, [{ r: 0, c: 0 }], undefined, 1, 'Push dfs(0,0) onto the call stack.', 5))
    v.add('0,0')
    steps.push(make(v, [{ r: 0, c: 0 }, { r: 1, c: 0 }], { r: 0, c: 0 }, 1, 'Inside dfs(0,0): mark visited. Recurse down — dfs(1,0).', 9))
    v.add('1,0')
    steps.push(make(v, [{ r: 0, c: 0 }, { r: 1, c: 0 }], { r: 1, c: 0 }, 1, 'dfs(1,0): mark visited. Recurse down — dfs(2,0) is water, returns. Recurse up — dfs(0,0) already visited. Recurse right — dfs(1,1) is water. Recurse left — out of bounds. dfs(1,0) returns.', 10))
    steps.push(make(v, [{ r: 0, c: 0 }], { r: 0, c: 0 }, 1, 'Back in dfs(0,0). Continue with dfs(-1,0) (out of bounds), then dfs(0,1).', 11))
    steps.push(make(v, [{ r: 0, c: 0 }, { r: 0, c: 1 }], { r: 0, c: 1 }, 1, 'dfs(0,1): land. Mark visited. All neighbors already visited / water / out of bounds. Returns.', 12))
    v.add('0,1')
    steps.push(make(v, [{ r: 0, c: 0 }], { r: 0, c: 0 }, 1, 'Back in dfs(0,0). Last recursion dfs(0,-1) is out of bounds. dfs(0,0) returns — island 1 done.', 13))

    // Continue sweep. Skip already-visited (0,1). (0,2) water. (0,3) land.
    steps.push(make(v, [], { r: 0, c: 3 }, 1, 'Sweep continues. (0,2) water. (0,3) land — start island 2.', 18))
    steps.push(make(v, [{ r: 0, c: 3 }], undefined, 2, 'Push dfs(0,3). count=2.', 5))
    v.add('0,3')
    steps.push(make(v, [{ r: 0, c: 3 }, { r: 1, c: 3 }], { r: 1, c: 3 }, 2, 'dfs(0,3) marks visited. Recurses dfs(1,3) — land.', 9))
    v.add('1,3')
    steps.push(make(v, [{ r: 0, c: 3 }], { r: 0, c: 3 }, 2, 'dfs(1,3) visits, no unvisited neighbors, returns. dfs(0,3) returns. Island 2 done.', 13))

    // Reach (2,2)
    steps.push(make(v, [], { r: 2, c: 2 }, 2, 'Sweep continues. (2,2) is land — island 3.', 18))
    steps.push(make(v, [{ r: 2, c: 2 }], undefined, 3, 'Push dfs(2,2). count=3.', 5))
    v.add('2,2')
    steps.push(make(v, [], { r: 2, c: 2 }, 3, 'dfs(2,2) visits, all neighbors water or out of bounds. Returns. Island 3 done.', 13))

    steps.push(make(v, [], undefined, 3, 'Sweep finishes. Return 3 islands. Same answer as BFS, different traversal order.', 23))

    return steps
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 8 — Merge Sort (divide and conquer)
// ---------------------------------------------------------------------------

const ms: AlgoScenario = {
  id: 'merge-sort',
  name: 'Merge sort',
  view: 'array',
  blurb:
    'Divide the array in half recursively until each piece has one element. Then merge pairs back together in sorted order. Stable, O(n log n), but needs O(n) extra space.',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  code: {
    js: [
      `function mergeSort(arr: number[]): number[] {`,
      `  if (arr.length <= 1) return arr`,
      `  const mid = Math.floor(arr.length / 2)`,
      `  const left = mergeSort(arr.slice(0, mid))`,
      `  const right = mergeSort(arr.slice(mid))`,
      `  return merge(left, right)`,
      `}`,
      ``,
      `function merge(a: number[], b: number[]): number[] {`,
      `  const out: number[] = []`,
      `  let i = 0, j = 0`,
      `  while (i < a.length && j < b.length) {`,
      `    if (a[i] <= b[j]) out.push(a[i++])`,
      `    else out.push(b[j++])`,
      `  }`,
      `  return [...out, ...a.slice(i), ...b.slice(j)]`,
      `}`,
    ],
    go: [
      `func mergeSort(arr []int) []int {`,
      `  if len(arr) <= 1 { return arr }`,
      `  mid := len(arr) / 2`,
      `  left := mergeSort(arr[:mid])`,
      `  right := mergeSort(arr[mid:])`,
      `  return merge(left, right)`,
      `}`,
      ``,
      `func merge(a, b []int) []int {`,
      `  out := make([]int, 0, len(a)+len(b))`,
      `  i, j := 0, 0`,
      `  for i < len(a) && j < len(b) {`,
      `    if a[i] <= b[j] { out = append(out, a[i]); i++`,
      `    } else { out = append(out, b[j]); j++ }`,
      `  }`,
      `  out = append(out, a[i:]...)`,
      `  out = append(out, b[j:]...)`,
      `  return out`,
      `}`,
    ],
  },
  steps: (() => {
    // We visualize the array as it transforms across phases:
    // divide:  [5,2,4,6,1,3] → [5,2,4] [6,1,3] → [5][2,4] [6][1,3] → [5][2][4] [6][1][3]
    // merge:   [5][2][4]→[5][2,4]→[2,4,5]; [6][1][3]→[6][1,3]→[1,3,6]; → [1,2,3,4,5,6]
    //
    // For visualization we'll just show the current "array state" using value-only cells
    // and a narration of what's happening at each stage.

    const make = (
      values: (number | string)[],
      highlights: Highlight[],
      vars: AlgoVar[],
      note: string,
      codeLine?: number,
    ): AlgoStep => ({
      view: 'array',
      array: { cells: arrCells(values), pointers: [], highlights },
      vars,
      note,
      codeLine,
    })

    return [
      make([5, 2, 4, 6, 1, 3], [], [{ label: 'phase', value: 'start' }], 'Initial array [5, 2, 4, 6, 1, 3]. Sort with merge sort.', 1),
      make(
        ['5', '2', '4', '|', '6', '1', '3'],
        [
          { from: 0, to: 2, tone: 'accent', label: 'left' },
          { from: 4, to: 6, tone: 'ink', label: 'right' },
        ],
        [{ label: 'phase', value: 'divide depth 1' }],
        'Divide: split at the midpoint. Left = [5, 2, 4]. Right = [6, 1, 3].',
        3,
      ),
      make(
        ['5', '|', '2', '4', '|||', '6', '|', '1', '3'],
        [
          { from: 0, to: 0, tone: 'accent' },
          { from: 2, to: 3, tone: 'accent' },
          { from: 5, to: 5, tone: 'ink' },
          { from: 7, to: 8, tone: 'ink' },
        ],
        [{ label: 'phase', value: 'divide depth 2' }],
        'Divide further. Left → [5], [2, 4]. Right → [6], [1, 3].',
        4,
      ),
      make(
        ['5', '|', '2', '|', '4', '|||', '6', '|', '1', '|', '3'],
        [
          { from: 0, to: 0, tone: 'accent' },
          { from: 2, to: 2, tone: 'accent' },
          { from: 4, to: 4, tone: 'accent' },
          { from: 6, to: 6, tone: 'ink' },
          { from: 8, to: 8, tone: 'ink' },
          { from: 10, to: 10, tone: 'ink' },
        ],
        [{ label: 'phase', value: 'fully divided' }],
        'All pieces have length 1. Base case — they are trivially "sorted".',
        2,
      ),
      make(
        [5, '|', 2, 4, '|||', 6, '|', 1, 3],
        [
          { from: 0, to: 0, tone: 'accent' },
          { from: 2, to: 3, tone: 'accent', label: 'merged' },
          { from: 5, to: 5, tone: 'ink' },
          { from: 7, to: 8, tone: 'ink', label: 'merged' },
        ],
        [{ label: 'phase', value: 'merge depth 2' }],
        'Merge [2] + [4] → [2, 4]. Merge [1] + [3] → [1, 3]. (Both already sorted.)',
        9,
      ),
      make(
        [2, 4, 5, '|||', 1, 3, 6],
        [
          { from: 0, to: 2, tone: 'accent', label: 'merged left' },
          { from: 4, to: 6, tone: 'ink', label: 'merged right' },
        ],
        [{ label: 'phase', value: 'merge depth 1' }],
        'Merge [5] + [2, 4] → [2, 4, 5]. Merge [6] + [1, 3] → [1, 3, 6].',
        9,
      ),
      make(
        [1, 2, 3, 4, 5, 6],
        [{ from: 0, to: 5, tone: 'paper3', label: 'sorted' }],
        [
          { label: 'phase', value: 'final merge' },
          { label: 'result', value: '[1, 2, 3, 4, 5, 6]' },
        ],
        'Final merge: [2, 4, 5] + [1, 3, 6] → [1, 2, 3, 4, 5, 6]. Done.',
        13,
      ),
    ]
  })(),
}

export const scenarios: AlgoScenario[] = [sw, tp, bs, bfs, ts, kad, dfs, ms]
