// Dynamic Programming visualizer — 1D and 2D DP table walkthroughs.

export type CellState =
  | 'empty'
  | 'computing' // being computed this step
  | 'filled' // already computed
  | 'reading' // currently being read as a dependency
  | 'answer' // the final answer cell

export interface DPCell {
  value: number | null
  state: CellState
}

export interface DPStep {
  // For 1D scenarios, only `row1d` is set.
  // For 2D scenarios, the full `grid` is set.
  row1d?: DPCell[]
  // 2D grid (rows × cols)
  grid?: DPCell[][]
  // Row / col header labels (for 2D)
  rowLabels?: string[]
  colLabels?: string[]
  // Variables shown on the side
  vars: Array<{ label: string; value: string }>
  // The formula being applied this step
  formula?: string
  note: string
  codeLine: number
}

export interface DPScenario {
  id: string
  name: string
  flavor: '1d' | '2d'
  blurb: string
  complexity: { time: string; space: string }
  code: { js: string[]; go: string[] }
  steps: DPStep[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const empty: DPCell = { value: null, state: 'empty' }

// ---------------------------------------------------------------------------
// Scenario 1 — Climbing Stairs (Fibonacci variant)
// ---------------------------------------------------------------------------

const climbingStairs: DPScenario = {
  id: 'climbing-stairs',
  name: 'Climbing stairs',
  flavor: '1d',
  blurb:
    'How many ways to climb n stairs, 1 or 2 at a time? The number of ways to reach step i is ways(i-1) + ways(i-2) — Fibonacci in disguise. Classic 1D DP introduction.',
  complexity: { time: 'O(n)', space: 'O(n) → O(1) with rolling vars' },
  code: {
    js: [
      `function climbStairs(n: number): number {`,
      `  if (n <= 2) return n`,
      ``,
      `  const dp = new Array(n + 1)`,
      `  dp[1] = 1`,
      `  dp[2] = 2`,
      ``,
      `  for (let i = 3; i <= n; i++) {`,
      `    dp[i] = dp[i - 1] + dp[i - 2]`,
      `  }`,
      `  return dp[n]`,
      `}`,
    ],
    go: [
      `func ClimbStairs(n int) int {`,
      `  if n <= 2 { return n }`,
      ``,
      `  dp := make([]int, n+1)`,
      `  dp[1] = 1`,
      `  dp[2] = 2`,
      ``,
      `  for i := 3; i <= n; i++ {`,
      `    dp[i] = dp[i-1] + dp[i-2]`,
      `  }`,
      `  return dp[n]`,
      `}`,
    ],
  },
  steps: (() => {
    const n = 6
    const out: DPStep[] = []

    // Pre-compute final dp: 0,1,2,3,5,8,13 (using 1-indexed)
    const finalDp = [0, 1, 2, 3, 5, 8, 13]

    const mkRow = (
      filledThrough: number,
      computing?: number,
      reading?: number[],
    ): DPCell[] => {
      const row: DPCell[] = []
      for (let i = 0; i <= n; i++) {
        if (computing === i) {
          row.push({ value: null, state: 'computing' })
        } else if (reading?.includes(i)) {
          row.push({ value: finalDp[i], state: 'reading' })
        } else if (i <= filledThrough) {
          row.push({ value: finalDp[i], state: i === n && filledThrough === n ? 'answer' : 'filled' })
        } else {
          row.push(empty)
        }
      }
      return row
    }

    out.push({
      row1d: mkRow(-1),
      vars: [{ label: 'n', value: '6' }],
      note: 'Goal: ways to climb 6 stairs. Allocate dp[0..6].',
      codeLine: 4,
    })

    out.push({
      row1d: mkRow(2),
      vars: [{ label: 'base cases', value: 'dp[1]=1, dp[2]=2' }],
      note: 'Base: 1 stair → 1 way (one big step). 2 stairs → 2 ways (1+1 or 2).',
      codeLine: 6,
    })

    out.push({
      row1d: mkRow(2, 3, [1, 2]),
      vars: [
        { label: 'i', value: '3' },
        { label: 'dp[i-1]', value: 'dp[2] = 2' },
        { label: 'dp[i-2]', value: 'dp[1] = 1' },
      ],
      formula: 'dp[3] = dp[2] + dp[1] = 2 + 1 = 3',
      note: 'i=3. Sum the two predecessors.',
      codeLine: 9,
    })

    out.push({
      row1d: mkRow(3, 4, [2, 3]),
      vars: [
        { label: 'i', value: '4' },
        { label: 'dp[i-1]', value: 'dp[3] = 3' },
        { label: 'dp[i-2]', value: 'dp[2] = 2' },
      ],
      formula: 'dp[4] = dp[3] + dp[2] = 3 + 2 = 5',
      note: 'i=4. Same formula, new neighbors.',
      codeLine: 9,
    })

    out.push({
      row1d: mkRow(4, 5, [3, 4]),
      vars: [
        { label: 'i', value: '5' },
        { label: 'dp[i-1]', value: 'dp[4] = 5' },
        { label: 'dp[i-2]', value: 'dp[3] = 3' },
      ],
      formula: 'dp[5] = dp[4] + dp[3] = 5 + 3 = 8',
      note: 'i=5.',
      codeLine: 9,
    })

    out.push({
      row1d: mkRow(5, 6, [4, 5]),
      vars: [
        { label: 'i', value: '6' },
        { label: 'dp[i-1]', value: 'dp[5] = 8' },
        { label: 'dp[i-2]', value: 'dp[4] = 5' },
      ],
      formula: 'dp[6] = dp[5] + dp[4] = 8 + 5 = 13',
      note: 'i=6.',
      codeLine: 9,
    })

    out.push({
      row1d: mkRow(6),
      vars: [
        { label: 'answer', value: 'dp[6] = 13' },
        { label: 'space opt', value: 'only last 2 values needed → O(1) possible' },
      ],
      note: 'Done. 13 ways. Notice: only dp[i-1] and dp[i-2] are read — the full array is unnecessary, rolling two vars is O(1) space.',
      codeLine: 11,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — House Robber
// ---------------------------------------------------------------------------

const houseRobber: DPScenario = {
  id: 'house-robber',
  name: 'House robber',
  flavor: '1d',
  blurb:
    "Rob a row of houses without robbing two adjacent ones. Maximize loot. At each house: skip (carry previous total) or rob (skip-one-back total + this value). Take the bigger.",
  complexity: { time: 'O(n)', space: 'O(n) → O(1)' },
  code: {
    js: [
      `function rob(nums: number[]): number {`,
      `  const n = nums.length`,
      `  if (n === 0) return 0`,
      `  if (n === 1) return nums[0]`,
      ``,
      `  const dp = new Array(n)`,
      `  dp[0] = nums[0]`,
      `  dp[1] = Math.max(nums[0], nums[1])`,
      ``,
      `  for (let i = 2; i < n; i++) {`,
      `    dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])`,
      `  }`,
      `  return dp[n - 1]`,
      `}`,
    ],
    go: [
      `func Rob(nums []int) int {`,
      `  n := len(nums)`,
      `  if n == 0 { return 0 }`,
      `  if n == 1 { return nums[0] }`,
      ``,
      `  dp := make([]int, n)`,
      `  dp[0] = nums[0]`,
      `  dp[1] = max(nums[0], nums[1])`,
      ``,
      `  for i := 2; i < n; i++ {`,
      `    dp[i] = max(dp[i-1], dp[i-2]+nums[i])`,
      `  }`,
      `  return dp[n-1]`,
      `}`,
    ],
  },
  steps: (() => {
    // nums = [2, 7, 9, 3, 1]
    // dp:    [2, 7, 11, 11, 12]   answer = 12 (rob 2, 9, 1)
    const nums = [2, 7, 9, 3, 1]
    const finalDp = [2, 7, 11, 11, 12]
    const out: DPStep[] = []

    const mkRow = (
      filledThrough: number,
      computing?: number,
      reading?: number[],
    ): DPCell[] => {
      const row: DPCell[] = []
      for (let i = 0; i < nums.length; i++) {
        if (computing === i) row.push({ value: null, state: 'computing' })
        else if (reading?.includes(i)) row.push({ value: finalDp[i], state: 'reading' })
        else if (i <= filledThrough)
          row.push({
            value: finalDp[i],
            state: i === nums.length - 1 && filledThrough === nums.length - 1 ? 'answer' : 'filled',
          })
        else row.push(empty)
      }
      return row
    }

    out.push({
      row1d: mkRow(-1),
      vars: [{ label: 'nums', value: '[2, 7, 9, 3, 1]' }],
      note: 'Houses with loot [2, 7, 9, 3, 1]. We will fill dp[i] = max profit considering houses 0..i.',
      codeLine: 6,
    })

    out.push({
      row1d: mkRow(1),
      vars: [
        { label: 'dp[0]', value: 'nums[0] = 2' },
        { label: 'dp[1]', value: 'max(2, 7) = 7' },
      ],
      formula: 'dp[1] = max(nums[0], nums[1])',
      note: 'Base: dp[0] = rob house 0. dp[1] = best of robbing house 0 or house 1.',
      codeLine: 8,
    })

    out.push({
      row1d: mkRow(1, 2, [0, 1]),
      vars: [
        { label: 'i', value: '2 (loot=9)' },
        { label: 'skip', value: 'dp[1] = 7' },
        { label: 'rob', value: 'dp[0] + 9 = 11' },
      ],
      formula: 'dp[2] = max(7, 11) = 11',
      note: 'i=2. Choice: skip house 2 (keep dp[1]=7) OR rob it (dp[0]+9=11). Take max.',
      codeLine: 12,
    })

    out.push({
      row1d: mkRow(2, 3, [1, 2]),
      vars: [
        { label: 'i', value: '3 (loot=3)' },
        { label: 'skip', value: 'dp[2] = 11' },
        { label: 'rob', value: 'dp[1] + 3 = 10' },
      ],
      formula: 'dp[3] = max(11, 10) = 11',
      note: 'i=3. Skipping this small house keeps more loot than robbing it.',
      codeLine: 12,
    })

    out.push({
      row1d: mkRow(3, 4, [2, 3]),
      vars: [
        { label: 'i', value: '4 (loot=1)' },
        { label: 'skip', value: 'dp[3] = 11' },
        { label: 'rob', value: 'dp[2] + 1 = 12' },
      ],
      formula: 'dp[4] = max(11, 12) = 12',
      note: 'i=4. Robbing this house wins by 1.',
      codeLine: 12,
    })

    out.push({
      row1d: mkRow(4),
      vars: [
        { label: 'answer', value: 'dp[4] = 12' },
        { label: 'plan', value: 'rob houses 0, 2, 4 (loot 2+9+1)' },
      ],
      note: 'Done. Max loot = 12. Plan: rob houses 0, 2, 4 (skip adjacency rule respected).',
      codeLine: 14,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — Edit Distance (2D DP)
// ---------------------------------------------------------------------------

const editDistance: DPScenario = {
  id: 'edit-distance',
  name: 'Edit distance (2D)',
  flavor: '2d',
  blurb:
    'Min number of single-char edits (insert / delete / replace) to turn word1 into word2. The 2D table where dp[i][j] = edit distance between word1[0..i] and word2[0..j].',
  complexity: { time: 'O(m × n)', space: 'O(m × n) → O(min) with row rolling' },
  code: {
    js: [
      `function minDistance(a: string, b: string): number {`,
      `  const m = a.length, n = b.length`,
      `  const dp = Array.from({ length: m + 1 },`,
      `    () => new Array(n + 1).fill(0))`,
      ``,
      `  for (let i = 0; i <= m; i++) dp[i][0] = i`,
      `  for (let j = 0; j <= n; j++) dp[0][j] = j`,
      ``,
      `  for (let i = 1; i <= m; i++) {`,
      `    for (let j = 1; j <= n; j++) {`,
      `      if (a[i - 1] === b[j - 1]) {`,
      `        dp[i][j] = dp[i - 1][j - 1]   // match`,
      `      } else {`,
      `        dp[i][j] = 1 + Math.min(`,
      `          dp[i - 1][j],     // delete`,
      `          dp[i][j - 1],     // insert`,
      `          dp[i - 1][j - 1], // replace`,
      `        )`,
      `      }`,
      `    }`,
      `  }`,
      `  return dp[m][n]`,
      `}`,
    ],
    go: [
      `func MinDistance(a, b string) int {`,
      `  m, n := len(a), len(b)`,
      `  dp := make([][]int, m+1)`,
      `  for i := range dp { dp[i] = make([]int, n+1) }`,
      ``,
      `  for i := 0; i <= m; i++ { dp[i][0] = i }`,
      `  for j := 0; j <= n; j++ { dp[0][j] = j }`,
      ``,
      `  for i := 1; i <= m; i++ {`,
      `    for j := 1; j <= n; j++ {`,
      `      if a[i-1] == b[j-1] {`,
      `        dp[i][j] = dp[i-1][j-1]`,
      `      } else {`,
      `        dp[i][j] = 1 + min3(`,
      `          dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`,
      `      }`,
      `    }`,
      `  }`,
      `  return dp[m][n]`,
      `}`,
    ],
  },
  steps: (() => {
    // a = "cat", b = "cut" → distance 1 (replace 'a' with 'u')
    const a = 'cat'
    const b = 'cut'
    const m = a.length
    const n = b.length

    // Final dp table for "cat" → "cut":
    //       ""  c   u   t
    //   ""  0   1   2   3
    //   c   1   0   1   2
    //   a   2   1   1   2
    //   t   3   2   2   1
    const finalDP: number[][] = [
      [0, 1, 2, 3],
      [1, 0, 1, 2],
      [2, 1, 1, 2],
      [3, 2, 2, 1],
    ]

    const rowLabels = ['""', 'c', 'a', 't']
    const colLabels = ['""', 'c', 'u', 't']

    const mkGrid = (
      filledMap: Set<string>, // "i,j" set
      computing?: [number, number],
      reading?: Array<[number, number]>,
    ): DPCell[][] => {
      const grid: DPCell[][] = []
      for (let i = 0; i <= m; i++) {
        const row: DPCell[] = []
        for (let j = 0; j <= n; j++) {
          const key = `${i},${j}`
          if (computing && computing[0] === i && computing[1] === j) {
            row.push({ value: null, state: 'computing' })
          } else if (reading?.some(([ri, rj]) => ri === i && rj === j)) {
            row.push({ value: finalDP[i][j], state: 'reading' })
          } else if (filledMap.has(key)) {
            row.push({
              value: finalDP[i][j],
              state:
                i === m && j === n && filledMap.has(`${m},${n}`)
                  ? 'answer'
                  : 'filled',
            })
          } else {
            row.push(empty)
          }
        }
        grid.push(row)
      }
      return grid
    }

    const out: DPStep[] = []
    const filled = new Set<string>()

    out.push({
      grid: mkGrid(filled),
      rowLabels,
      colLabels,
      vars: [
        { label: 'a', value: '"cat"' },
        { label: 'b', value: '"cut"' },
      ],
      note: 'dp[i][j] = edit distance between a[0..i] and b[0..j]. Initialize an (m+1)×(n+1) grid.',
      codeLine: 3,
    })

    // Fill base row + col
    for (let i = 0; i <= m; i++) filled.add(`${i},0`)
    for (let j = 0; j <= n; j++) filled.add(`0,${j}`)

    out.push({
      grid: mkGrid(filled),
      rowLabels,
      colLabels,
      vars: [
        { label: 'base row', value: 'dp[0][j] = j' },
        { label: 'base col', value: 'dp[i][0] = i' },
      ],
      formula: 'dp[i][0] = i, dp[0][j] = j',
      note: 'Base cases: empty string ↔ any prefix needs that many inserts/deletes.',
      codeLine: 7,
    })

    // dp[1][1]: a[0]='c', b[0]='c' → match → dp[0][0] = 0
    out.push({
      grid: mkGrid(filled, [1, 1], [[0, 0]]),
      rowLabels,
      colLabels,
      vars: [
        { label: 'i,j', value: '(1, 1)' },
        { label: 'a[0]', value: '"c"' },
        { label: 'b[0]', value: '"c"' },
      ],
      formula: 'match → dp[1][1] = dp[0][0] = 0',
      note: 'a[0]=c, b[0]=c. Match! Take diagonal value (no cost).',
      codeLine: 13,
    })

    filled.add('1,1')

    // dp[1][2]: a[0]='c', b[1]='u' → mismatch → 1 + min(dp[0][2]=2, dp[1][1]=0, dp[0][1]=1) = 1
    out.push({
      grid: mkGrid(filled, [1, 2], [[0, 1], [0, 2], [1, 1]]),
      rowLabels,
      colLabels,
      vars: [
        { label: 'i,j', value: '(1, 2)' },
        { label: 'a[0]', value: '"c"' },
        { label: 'b[1]', value: '"u"' },
      ],
      formula: 'mismatch → 1 + min(2, 0, 1) = 1',
      note: 'Mismatch. Take min of three neighbors + 1.',
      codeLine: 16,
    })
    filled.add('1,2')

    // dp[1][3]: c vs t → mismatch → 1 + min(dp[0][3]=3, dp[1][2]=1, dp[0][2]=2) = 2
    out.push({
      grid: mkGrid(filled, [1, 3], [[0, 2], [0, 3], [1, 2]]),
      rowLabels,
      colLabels,
      vars: [{ label: 'i,j', value: '(1, 3)' }],
      formula: 'mismatch → 1 + min(3, 1, 2) = 2',
      note: 'Continue along row 1. dp[1][3] = 2.',
      codeLine: 16,
    })
    filled.add('1,3')

    // Fill row 2 (a)
    // dp[2][1]: a vs c → mismatch → 1+min(dp[1][1]=0, dp[2][0]=2, dp[1][0]=1)=1
    out.push({
      grid: mkGrid(filled, [2, 1], [[1, 0], [1, 1], [2, 0]]),
      rowLabels,
      colLabels,
      vars: [{ label: 'i,j', value: '(2, 1)' }],
      formula: 'mismatch → 1 + min(0, 2, 1) = 1',
      note: 'Row 2: a vs c at (2,1). dp[2][1] = 1.',
      codeLine: 16,
    })
    filled.add('2,1')

    // dp[2][2]: a vs u → mismatch → 1+min(dp[1][2]=1, dp[2][1]=1, dp[1][1]=0) = 1
    out.push({
      grid: mkGrid(filled, [2, 2], [[1, 1], [1, 2], [2, 1]]),
      rowLabels,
      colLabels,
      vars: [{ label: 'i,j', value: '(2, 2)' }],
      formula: 'mismatch → 1 + min(1, 1, 0) = 1',
      note: 'a vs u. dp[2][2] = 1.',
      codeLine: 16,
    })
    filled.add('2,2')

    // dp[2][3]: a vs t → mismatch → 1+min(dp[1][3]=2, dp[2][2]=1, dp[1][2]=1) = 2
    filled.add('2,3')

    out.push({
      grid: mkGrid(filled),
      rowLabels,
      colLabels,
      vars: [{ label: 'row 2 done', value: '[2, 1, 1, 2]' }],
      note: 'Row 2 fully filled.',
      codeLine: 11,
    })

    // Row 3 (t)
    // dp[3][1]: t vs c → mismatch → 1+min(dp[2][1]=1, dp[3][0]=3, dp[2][0]=2) = 2
    filled.add('3,1')
    // dp[3][2]: t vs u → mismatch → 1+min(dp[2][2]=1, dp[3][1]=2, dp[2][1]=1) = 2
    filled.add('3,2')

    // dp[3][3]: t vs t → match → dp[2][2] = 1
    out.push({
      grid: mkGrid(filled, [3, 3], [[2, 2]]),
      rowLabels,
      colLabels,
      vars: [
        { label: 'i,j', value: '(3, 3) — the corner!' },
        { label: 'a[2]', value: '"t"' },
        { label: 'b[2]', value: '"t"' },
      ],
      formula: 'match → dp[3][3] = dp[2][2] = 1',
      note: 'Last cell. a[2]=t, b[2]=t. Match! Take diagonal.',
      codeLine: 13,
    })
    filled.add('3,3')

    out.push({
      grid: mkGrid(filled),
      rowLabels,
      colLabels,
      vars: [
        { label: 'answer', value: 'dp[m][n] = 1' },
        { label: 'edit', value: 'replace "a" with "u"' },
      ],
      note: '"cat" → "cut" needs 1 edit (replace the middle char). Bottom-right corner is the answer.',
      codeLine: 22,
    })

    return out
  })(),
}

export const scenarios: DPScenario[] = [climbingStairs, houseRobber, editDistance]
