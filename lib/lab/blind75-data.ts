// Blind 75 — canonical LeetCode interview list (Yangshun Tay).
// 75 problems with TypeScript / JavaScript / Go solutions inline,
// each linked to a relevant visualizer when one exists.

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type Category =
  | 'Array'
  | 'Binary'
  | 'Dynamic Programming'
  | 'Graph'
  | 'Interval'
  | 'Linked List'
  | 'Matrix'
  | 'String'
  | 'Tree'
  | 'Heap'

export interface Blind75Problem {
  id: number
  title: string
  category: Category
  difficulty: Difficulty
  leetcodeUrl: string
  approach: string
  vizLink?: string
  code: { js: string; ts: string; go: string }
}

// Compact entry builder
const p = (x: Blind75Problem): Blind75Problem => x

export const problems: Blind75Problem[] = [
  // ===== ARRAY =====
  p({
    id: 1,
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    approach: 'One-pass hashmap: store complement (target − x) as we scan; return when seen.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function twoSum(nums, target) {
  const seen = new Map()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need), i]
    seen.set(nums[i], i)
  }
  return []
}`,
      ts: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need)!, i]
    seen.set(nums[i], i)
  }
  return []
}`,
      go: `func twoSum(nums []int, target int) []int {
  seen := make(map[int]int)
  for i, v := range nums {
    if j, ok := seen[target-v]; ok { return []int{j, i} }
    seen[v] = i
  }
  return nil
}`,
    },
  }),
  p({
    id: 2,
    title: 'Best Time to Buy and Sell Stock',
    category: 'Array',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    approach: 'Track min-so-far while scanning; max profit = price − min seen before.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function maxProfit(prices) {
  let min = Infinity, best = 0
  for (const p of prices) {
    if (p < min) min = p
    else if (p - min > best) best = p - min
  }
  return best
}`,
      ts: `function maxProfit(prices: number[]): number {
  let min = Infinity, best = 0
  for (const p of prices) {
    if (p < min) min = p
    else if (p - min > best) best = p - min
  }
  return best
}`,
      go: `func maxProfit(prices []int) int {
  min, best := math.MaxInt32, 0
  for _, p := range prices {
    if p < min { min = p } else if p-min > best { best = p - min }
  }
  return best
}`,
    },
  }),
  p({
    id: 3,
    title: 'Contains Duplicate',
    category: 'Array',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/',
    approach: 'Set membership check on each element. Return true on first repeat.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function containsDuplicate(nums) {
  const seen = new Set()
  for (const n of nums) { if (seen.has(n)) return true; seen.add(n) }
  return false
}`,
      ts: `function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>()
  for (const n of nums) { if (seen.has(n)) return true; seen.add(n) }
  return false
}`,
      go: `func containsDuplicate(nums []int) bool {
  seen := make(map[int]struct{})
  for _, n := range nums {
    if _, ok := seen[n]; ok { return true }
    seen[n] = struct{}{}
  }
  return false
}`,
    },
  }),
  p({
    id: 4,
    title: 'Product of Array Except Self',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/',
    approach: 'Two passes: left-products in output; multiply by running right-product on the way back.',
    code: {
      js: `function productExceptSelf(nums) {
  const n = nums.length, out = new Array(n).fill(1)
  let left = 1
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i] }
  let right = 1
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i] }
  return out
}`,
      ts: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length, out = new Array<number>(n).fill(1)
  let left = 1
  for (let i = 0; i < n; i++) { out[i] = left; left *= nums[i] }
  let right = 1
  for (let i = n - 1; i >= 0; i--) { out[i] *= right; right *= nums[i] }
  return out
}`,
      go: `func productExceptSelf(nums []int) []int {
  n := len(nums); out := make([]int, n)
  left := 1
  for i := 0; i < n; i++ { out[i] = left; left *= nums[i] }
  right := 1
  for i := n - 1; i >= 0; i-- { out[i] *= right; right *= nums[i] }
  return out
}`,
    },
  }),
  p({
    id: 5,
    title: 'Maximum Subarray',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    approach: "Kadane's: at each i, extend or restart. dp[i] = max(arr[i], dp[i-1] + arr[i]).",
    vizLink: '/lab/algorithms',
    code: {
      js: `function maxSubArray(nums) {
  let cur = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i])
    best = Math.max(best, cur)
  }
  return best
}`,
      ts: `function maxSubArray(nums: number[]): number {
  let cur = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i])
    best = Math.max(best, cur)
  }
  return best
}`,
      go: `func maxSubArray(nums []int) int {
  cur, best := nums[0], nums[0]
  for i := 1; i < len(nums); i++ {
    if nums[i] > cur+nums[i] { cur = nums[i] } else { cur += nums[i] }
    if cur > best { best = cur }
  }
  return best
}`,
    },
  }),
  p({
    id: 6,
    title: 'Maximum Product Subarray',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/',
    approach: 'Track BOTH max and min ending here — a negative number swaps them.',
    vizLink: '/lab/dp',
    code: {
      js: `function maxProduct(nums) {
  let cur_max = nums[0], cur_min = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]
    const candidates = [x, cur_max * x, cur_min * x]
    cur_max = Math.max(...candidates)
    cur_min = Math.min(...candidates)
    best = Math.max(best, cur_max)
  }
  return best
}`,
      ts: `function maxProduct(nums: number[]): number {
  let cmax = nums[0], cmin = nums[0], best = nums[0]
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i]
    const c = [x, cmax * x, cmin * x]
    cmax = Math.max(...c); cmin = Math.min(...c)
    best = Math.max(best, cmax)
  }
  return best
}`,
      go: `func maxProduct(nums []int) int {
  cmax, cmin, best := nums[0], nums[0], nums[0]
  for i := 1; i < len(nums); i++ {
    x := nums[i]
    a, b, c := x, cmax*x, cmin*x
    cmax = max3(a, b, c); cmin = min3(a, b, c)
    if cmax > best { best = cmax }
  }
  return best
}`,
    },
  }),
  p({
    id: 7,
    title: 'Find Minimum in Rotated Sorted Array',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
    approach: 'Binary search: compare mid to right — if mid > right, min is to the right; else mid or left.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid
  }
  return nums[lo]
}`,
      ts: `function findMin(nums: number[]): number {
  let lo = 0, hi = nums.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid
  }
  return nums[lo]
}`,
      go: `func findMin(nums []int) int {
  lo, hi := 0, len(nums)-1
  for lo < hi {
    mid := (lo + hi) / 2
    if nums[mid] > nums[hi] { lo = mid + 1 } else { hi = mid }
  }
  return nums[lo]
}`,
    },
  }),
  p({
    id: 8,
    title: 'Search in Rotated Sorted Array',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    approach: 'Modified binary search: at mid, one half is always sorted. Check which, then decide.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] === target) return mid
    if (nums[lo] <= nums[mid]) {
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1
    } else {
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1
    }
  }
  return -1
}`,
      ts: `function search(nums: number[], target: number): number {
  let lo = 0, hi = nums.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (nums[mid] === target) return mid
    if (nums[lo] <= nums[mid]) {
      if (target >= nums[lo] && target < nums[mid]) hi = mid - 1; else lo = mid + 1
    } else {
      if (target > nums[mid] && target <= nums[hi]) lo = mid + 1; else hi = mid - 1
    }
  }
  return -1
}`,
      go: `func search(nums []int, target int) int {
  lo, hi := 0, len(nums)-1
  for lo <= hi {
    mid := (lo + hi) / 2
    if nums[mid] == target { return mid }
    if nums[lo] <= nums[mid] {
      if target >= nums[lo] && target < nums[mid] { hi = mid - 1 } else { lo = mid + 1 }
    } else {
      if target > nums[mid] && target <= nums[hi] { lo = mid + 1 } else { hi = mid - 1 }
    }
  }
  return -1
}`,
    },
  }),
  p({
    id: 9,
    title: '3Sum',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    approach: 'Sort, then for each i use two pointers (l, r) on the remainder. Skip duplicates.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function threeSum(nums) {
  nums.sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue
    let l = i + 1, r = nums.length - 1
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r]
      if (s === 0) {
        out.push([nums[i], nums[l], nums[r]])
        while (l < r && nums[l] === nums[l+1]) l++
        while (l < r && nums[r] === nums[r-1]) r--
        l++; r--
      } else if (s < 0) l++; else r--
    }
  }
  return out
}`,
      ts: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b)
  const out: number[][] = []
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue
    let l = i + 1, r = nums.length - 1
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r]
      if (s === 0) {
        out.push([nums[i], nums[l], nums[r]])
        while (l < r && nums[l] === nums[l+1]) l++
        while (l < r && nums[r] === nums[r-1]) r--
        l++; r--
      } else if (s < 0) l++; else r--
    }
  }
  return out
}`,
      go: `func threeSum(nums []int) [][]int {
  sort.Ints(nums)
  var out [][]int
  for i := 0; i < len(nums)-2; i++ {
    if i > 0 && nums[i] == nums[i-1] { continue }
    l, r := i+1, len(nums)-1
    for l < r {
      s := nums[i] + nums[l] + nums[r]
      if s == 0 {
        out = append(out, []int{nums[i], nums[l], nums[r]})
        for l < r && nums[l] == nums[l+1] { l++ }
        for l < r && nums[r] == nums[r-1] { r-- }
        l++; r--
      } else if s < 0 { l++ } else { r-- }
    }
  }
  return out
}`,
    },
  }),
  p({
    id: 10,
    title: 'Container With Most Water',
    category: 'Array',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
    approach: 'Two pointers at ends; move the shorter side inward — the longer side cannot improve.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function maxArea(h) {
  let l = 0, r = h.length - 1, best = 0
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l))
    if (h[l] < h[r]) l++; else r--
  }
  return best
}`,
      ts: `function maxArea(h: number[]): number {
  let l = 0, r = h.length - 1, best = 0
  while (l < r) {
    best = Math.max(best, Math.min(h[l], h[r]) * (r - l))
    if (h[l] < h[r]) l++; else r--
  }
  return best
}`,
      go: `func maxArea(h []int) int {
  l, r, best := 0, len(h)-1, 0
  for l < r {
    area := min(h[l], h[r]) * (r - l)
    if area > best { best = area }
    if h[l] < h[r] { l++ } else { r-- }
  }
  return best
}`,
    },
  }),

  // ===== BINARY =====
  p({
    id: 11,
    title: 'Sum of Two Integers',
    category: 'Binary',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/',
    approach: 'XOR for sum-without-carry, AND << 1 for carry; loop until carry = 0.',
    code: {
      js: `function getSum(a, b) {
  while (b !== 0) { const carry = (a & b) << 1; a = a ^ b; b = carry }
  return a
}`,
      ts: `function getSum(a: number, b: number): number {
  while (b !== 0) { const carry = (a & b) << 1; a = a ^ b; b = carry }
  return a
}`,
      go: `func getSum(a, b int) int {
  for b != 0 { carry := (a & b) << 1; a ^= b; b = carry }
  return a
}`,
    },
  }),
  p({
    id: 12,
    title: 'Number of 1 Bits',
    category: 'Binary',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/',
    approach: "Brian Kernighan: n & (n-1) drops the lowest set bit. Count drops.",
    code: {
      js: `function hammingWeight(n) {
  let c = 0
  while (n !== 0) { n &= n - 1; c++ }
  return c
}`,
      ts: `function hammingWeight(n: number): number {
  let c = 0
  while (n !== 0) { n &= n - 1; c++ }
  return c
}`,
      go: `func hammingWeight(n uint32) int {
  c := 0
  for n != 0 { n &= n - 1; c++ }
  return c
}`,
    },
  }),
  p({
    id: 13,
    title: 'Counting Bits',
    category: 'Binary',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/counting-bits/',
    approach: 'DP: bits[i] = bits[i >> 1] + (i & 1).',
    vizLink: '/lab/dp',
    code: {
      js: `function countBits(n) {
  const dp = new Array(n + 1).fill(0)
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1)
  return dp
}`,
      ts: `function countBits(n: number): number[] {
  const dp = new Array<number>(n + 1).fill(0)
  for (let i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1)
  return dp
}`,
      go: `func countBits(n int) []int {
  dp := make([]int, n+1)
  for i := 1; i <= n; i++ { dp[i] = dp[i>>1] + (i & 1) }
  return dp
}`,
    },
  }),
  p({
    id: 14,
    title: 'Missing Number',
    category: 'Binary',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/missing-number/',
    approach: 'XOR all indices 0..n with all values — pairs cancel, the missing one survives.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function missingNumber(nums) {
  let x = nums.length
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i]
  return x
}`,
      ts: `function missingNumber(nums: number[]): number {
  let x = nums.length
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i]
  return x
}`,
      go: `func missingNumber(nums []int) int {
  x := len(nums)
  for i, v := range nums { x ^= i ^ v }
  return x
}`,
    },
  }),
  p({
    id: 15,
    title: 'Reverse Bits',
    category: 'Binary',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/',
    approach: 'Shift result left, OR with low bit of n, shift n right. 32 iterations.',
    code: {
      js: `function reverseBits(n) {
  let r = 0
  for (let i = 0; i < 32; i++) { r = (r << 1) | (n & 1); n >>>= 1 }
  return r >>> 0
}`,
      ts: `function reverseBits(n: number): number {
  let r = 0
  for (let i = 0; i < 32; i++) { r = (r << 1) | (n & 1); n >>>= 1 }
  return r >>> 0
}`,
      go: `func reverseBits(n uint32) uint32 {
  var r uint32 = 0
  for i := 0; i < 32; i++ { r = (r << 1) | (n & 1); n >>= 1 }
  return r
}`,
    },
  }),

  // ===== DYNAMIC PROGRAMMING =====
  p({
    id: 16,
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/',
    approach: 'Fibonacci: ways(n) = ways(n-1) + ways(n-2). Rolling two vars = O(1) space.',
    vizLink: '/lab/dp',
    code: {
      js: `function climbStairs(n) {
  let a = 1, b = 1
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t }
  return b
}`,
      ts: `function climbStairs(n: number): number {
  let a = 1, b = 1
  for (let i = 2; i <= n; i++) { const t = a + b; a = b; b = t }
  return b
}`,
      go: `func climbStairs(n int) int {
  a, b := 1, 1
  for i := 2; i <= n; i++ { a, b = b, a+b }
  return b
}`,
    },
  }),
  p({
    id: 17,
    title: 'Coin Change',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/coin-change/',
    approach: 'dp[a] = min(dp[a-c] + 1) over coins c. Initialize Infinity; check final.',
    vizLink: '/lab/dp',
    code: {
      js: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a-c] + 1)
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}`,
      ts: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Infinity)
  dp[0] = 0
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a-c] + 1)
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}`,
      go: `func coinChange(coins []int, amount int) int {
  dp := make([]int, amount+1)
  for i := range dp { dp[i] = math.MaxInt32 }
  dp[0] = 0
  for a := 1; a <= amount; a++ {
    for _, c := range coins {
      if c <= a && dp[a-c]+1 < dp[a] { dp[a] = dp[a-c] + 1 }
    }
  }
  if dp[amount] == math.MaxInt32 { return -1 }
  return dp[amount]
}`,
    },
  }),
  p({
    id: 18,
    title: 'Longest Increasing Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/',
    approach: 'Patience sorting: maintain `tails`, binary search for replace position. O(n log n).',
    vizLink: '/lab/dp',
    code: {
      js: `function lengthOfLIS(nums) {
  const tails = []
  for (const x of nums) {
    let lo = 0, hi = tails.length
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m }
    tails[lo] = x
  }
  return tails.length
}`,
      ts: `function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []
  for (const x of nums) {
    let lo = 0, hi = tails.length
    while (lo < hi) { const m = (lo + hi) >> 1; if (tails[m] < x) lo = m + 1; else hi = m }
    tails[lo] = x
  }
  return tails.length
}`,
      go: `func lengthOfLIS(nums []int) int {
  var tails []int
  for _, x := range nums {
    lo, hi := 0, len(tails)
    for lo < hi { m := (lo + hi) / 2; if tails[m] < x { lo = m + 1 } else { hi = m } }
    if lo == len(tails) { tails = append(tails, x) } else { tails[lo] = x }
  }
  return len(tails)
}`,
    },
  }),
  p({
    id: 19,
    title: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/',
    approach: '2D DP: dp[i][j] = (match) dp[i-1][j-1] + 1 OR max(dp[i-1][j], dp[i][j-1]).',
    vizLink: '/lab/dp',
    code: {
      js: `function longestCommonSubsequence(a, b) {
  const m = a.length, n = b.length
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0))
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]
}`,
      ts: `function longestCommonSubsequence(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({length: m+1}, () => new Array(n+1).fill(0))
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]
}`,
      go: `func longestCommonSubsequence(a, b string) int {
  m, n := len(a), len(b)
  dp := make([][]int, m+1)
  for i := range dp { dp[i] = make([]int, n+1) }
  for i := 1; i <= m; i++ {
    for j := 1; j <= n; j++ {
      if a[i-1] == b[j-1] { dp[i][j] = dp[i-1][j-1] + 1 } else {
        if dp[i-1][j] > dp[i][j-1] { dp[i][j] = dp[i-1][j] } else { dp[i][j] = dp[i][j-1] }
      }
    }
  }
  return dp[m][n]
}`,
    },
  }),
  p({
    id: 20,
    title: 'Word Break',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/word-break/',
    approach: "dp[i] = true if s[0..i] is breakable. For each i, scan j<i checking dp[j] && dict has s[j..i].",
    vizLink: '/lab/dp',
    code: {
      js: `function wordBreak(s, words) {
  const set = new Set(words), n = s.length
  const dp = new Array(n + 1).fill(false); dp[0] = true
  for (let i = 1; i <= n; i++) for (let j = 0; j < i; j++)
    if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break }
  return dp[n]
}`,
      ts: `function wordBreak(s: string, words: string[]): boolean {
  const set = new Set(words), n = s.length
  const dp = new Array<boolean>(n + 1).fill(false); dp[0] = true
  for (let i = 1; i <= n; i++) for (let j = 0; j < i; j++)
    if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break }
  return dp[n]
}`,
      go: `func wordBreak(s string, words []string) bool {
  set := make(map[string]bool)
  for _, w := range words { set[w] = true }
  n := len(s); dp := make([]bool, n+1); dp[0] = true
  for i := 1; i <= n; i++ {
    for j := 0; j < i; j++ {
      if dp[j] && set[s[j:i]] { dp[i] = true; break }
    }
  }
  return dp[n]
}`,
    },
  }),
  p({
    id: 21,
    title: 'Combination Sum',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/combination-sum/',
    approach: 'Backtracking: at each step pick a coin >= last (avoid duplicates), recurse.',
    vizLink: '/lab/dp',
    code: {
      js: `function combinationSum(cands, target) {
  cands.sort((a, b) => a - b)
  const out = [], cur = []
  const dfs = (start, remain) => {
    if (remain === 0) { out.push([...cur]); return }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break
      cur.push(cands[i]); dfs(i, remain - cands[i]); cur.pop()
    }
  }
  dfs(0, target)
  return out
}`,
      ts: `function combinationSum(cands: number[], target: number): number[][] {
  cands.sort((a, b) => a - b)
  const out: number[][] = [], cur: number[] = []
  const dfs = (start: number, remain: number) => {
    if (remain === 0) { out.push([...cur]); return }
    for (let i = start; i < cands.length; i++) {
      if (cands[i] > remain) break
      cur.push(cands[i]); dfs(i, remain - cands[i]); cur.pop()
    }
  }
  dfs(0, target)
  return out
}`,
      go: `func combinationSum(cands []int, target int) [][]int {
  sort.Ints(cands)
  var out [][]int; var cur []int
  var dfs func(start, remain int)
  dfs = func(start, remain int) {
    if remain == 0 { tmp := make([]int, len(cur)); copy(tmp, cur); out = append(out, tmp); return }
    for i := start; i < len(cands); i++ {
      if cands[i] > remain { break }
      cur = append(cur, cands[i]); dfs(i, remain-cands[i]); cur = cur[:len(cur)-1]
    }
  }
  dfs(0, target)
  return out
}`,
    },
  }),
  p({
    id: 22,
    title: 'House Robber',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/house-robber/',
    approach: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Rolling two vars = O(1).',
    vizLink: '/lab/dp',
    code: {
      js: `function rob(nums) {
  let prev = 0, curr = 0
  for (const x of nums) { const t = Math.max(curr, prev + x); prev = curr; curr = t }
  return curr
}`,
      ts: `function rob(nums: number[]): number {
  let prev = 0, curr = 0
  for (const x of nums) { const t = Math.max(curr, prev + x); prev = curr; curr = t }
  return curr
}`,
      go: `func rob(nums []int) int {
  prev, curr := 0, 0
  for _, x := range nums {
    t := curr; if prev+x > t { t = prev + x }
    prev = curr; curr = t
  }
  return curr
}`,
    },
  }),
  p({
    id: 23,
    title: 'House Robber II (circular)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/',
    approach: 'Two passes of House Robber: exclude first OR exclude last. Take the max.',
    vizLink: '/lab/dp',
    code: {
      js: `function rob(nums) {
  if (nums.length === 1) return nums[0]
  const r = (lo, hi) => {
    let p = 0, c = 0
    for (let i = lo; i <= hi; i++) { const t = Math.max(c, p + nums[i]); p = c; c = t }
    return c
  }
  return Math.max(r(0, nums.length-2), r(1, nums.length-1))
}`,
      ts: `function rob(nums: number[]): number {
  if (nums.length === 1) return nums[0]
  const r = (lo: number, hi: number) => {
    let p = 0, c = 0
    for (let i = lo; i <= hi; i++) { const t = Math.max(c, p + nums[i]); p = c; c = t }
    return c
  }
  return Math.max(r(0, nums.length-2), r(1, nums.length-1))
}`,
      go: `func rob(nums []int) int {
  if len(nums) == 1 { return nums[0] }
  r := func(lo, hi int) int {
    p, c := 0, 0
    for i := lo; i <= hi; i++ {
      t := c; if p+nums[i] > t { t = p + nums[i] }
      p = c; c = t
    }
    return c
  }
  a, b := r(0, len(nums)-2), r(1, len(nums)-1)
  if a > b { return a }
  return b
}`,
    },
  }),
  p({
    id: 24,
    title: 'Decode Ways',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/decode-ways/',
    approach: 'dp[i] = (s[i-1]≠"0" ? dp[i-1] : 0) + (10..26? dp[i-2] : 0).',
    vizLink: '/lab/dp',
    code: {
      js: `function numDecodings(s) {
  const n = s.length
  if (s[0] === '0') return 0
  const dp = new Array(n + 1).fill(0); dp[0] = 1; dp[1] = 1
  for (let i = 2; i <= n; i++) {
    if (s[i-1] !== '0') dp[i] += dp[i-1]
    const two = +s.slice(i-2, i)
    if (two >= 10 && two <= 26) dp[i] += dp[i-2]
  }
  return dp[n]
}`,
      ts: `function numDecodings(s: string): number {
  const n = s.length
  if (s[0] === '0') return 0
  const dp = new Array<number>(n + 1).fill(0); dp[0] = 1; dp[1] = 1
  for (let i = 2; i <= n; i++) {
    if (s[i-1] !== '0') dp[i] += dp[i-1]
    const two = +s.slice(i-2, i)
    if (two >= 10 && two <= 26) dp[i] += dp[i-2]
  }
  return dp[n]
}`,
      go: `func numDecodings(s string) int {
  n := len(s)
  if s[0] == '0' { return 0 }
  dp := make([]int, n+1); dp[0], dp[1] = 1, 1
  for i := 2; i <= n; i++ {
    if s[i-1] != '0' { dp[i] += dp[i-1] }
    two := int(s[i-2]-'0')*10 + int(s[i-1]-'0')
    if two >= 10 && two <= 26 { dp[i] += dp[i-2] }
  }
  return dp[n]
}`,
    },
  }),
  p({
    id: 25,
    title: 'Unique Paths',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/unique-paths/',
    approach: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. Or just one row (rolling).',
    vizLink: '/lab/dp',
    code: {
      js: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1)
  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) row[j] += row[j-1]
  return row[n-1]
}`,
      ts: `function uniquePaths(m: number, n: number): number {
  const row = new Array<number>(n).fill(1)
  for (let i = 1; i < m; i++) for (let j = 1; j < n; j++) row[j] += row[j-1]
  return row[n-1]
}`,
      go: `func uniquePaths(m, n int) int {
  row := make([]int, n)
  for j := range row { row[j] = 1 }
  for i := 1; i < m; i++ {
    for j := 1; j < n; j++ { row[j] += row[j-1] }
  }
  return row[n-1]
}`,
    },
  }),
  p({
    id: 26,
    title: 'Jump Game',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/jump-game/',
    approach: 'Greedy: track farthest reachable. If i > reach, fail.',
    vizLink: '/lab/dp',
    code: {
      js: `function canJump(nums) {
  let reach = 0
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false
    reach = Math.max(reach, i + nums[i])
  }
  return true
}`,
      ts: `function canJump(nums: number[]): boolean {
  let reach = 0
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false
    reach = Math.max(reach, i + nums[i])
  }
  return true
}`,
      go: `func canJump(nums []int) bool {
  reach := 0
  for i, v := range nums {
    if i > reach { return false }
    if i+v > reach { reach = i + v }
  }
  return true
}`,
    },
  }),

  // ===== GRAPH =====
  p({
    id: 27,
    title: 'Clone Graph',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/clone-graph/',
    approach: 'BFS or DFS with a Map<original, clone>. Visit each node, clone, then wire neighbors.',
    vizLink: '/lab/graph',
    code: {
      js: `function cloneGraph(node) {
  if (!node) return null
  const map = new Map()
  const dfs = (n) => {
    if (map.has(n)) return map.get(n)
    const copy = { val: n.val, neighbors: [] }
    map.set(n, copy)
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb))
    return copy
  }
  return dfs(node)
}`,
      ts: `function cloneGraph(node: any): any {
  if (!node) return null
  const map = new Map<any, any>()
  const dfs = (n: any): any => {
    if (map.has(n)) return map.get(n)
    const copy = { val: n.val, neighbors: [] as any[] }
    map.set(n, copy)
    for (const nb of n.neighbors) copy.neighbors.push(dfs(nb))
    return copy
  }
  return dfs(node)
}`,
      go: `func cloneGraph(node *Node) *Node {
  if node == nil { return nil }
  m := make(map[*Node]*Node)
  var dfs func(*Node) *Node
  dfs = func(n *Node) *Node {
    if c, ok := m[n]; ok { return c }
    c := &Node{Val: n.Val}
    m[n] = c
    for _, nb := range n.Neighbors { c.Neighbors = append(c.Neighbors, dfs(nb)) }
    return c
  }
  return dfs(node)
}`,
    },
  }),
  p({
    id: 28,
    title: 'Course Schedule',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/course-schedule/',
    approach: "Kahn's topological sort: queue zero-indegree, emit + decrement neighbors. Cycle if not all emitted.",
    vizLink: '/lab/graph',
    code: {
      js: `function canFinish(n, prereqs) {
  const adj = Array.from({length: n}, () => []), indeg = new Array(n).fill(0)
  for (const [a, b] of prereqs) { adj[b].push(a); indeg[a]++ }
  const q = []
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i)
  let done = 0
  while (q.length) {
    const u = q.shift(); done++
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v)
  }
  return done === n
}`,
      ts: `function canFinish(n: number, prereqs: number[][]): boolean {
  const adj: number[][] = Array.from({length: n}, () => [])
  const indeg = new Array<number>(n).fill(0)
  for (const [a, b] of prereqs) { adj[b].push(a); indeg[a]++ }
  const q: number[] = []
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i)
  let done = 0
  while (q.length) {
    const u = q.shift()!; done++
    for (const v of adj[u]) if (--indeg[v] === 0) q.push(v)
  }
  return done === n
}`,
      go: `func canFinish(n int, prereqs [][]int) bool {
  adj := make([][]int, n); indeg := make([]int, n)
  for _, e := range prereqs { adj[e[1]] = append(adj[e[1]], e[0]); indeg[e[0]]++ }
  var q []int
  for i, d := range indeg { if d == 0 { q = append(q, i) } }
  done := 0
  for len(q) > 0 {
    u := q[0]; q = q[1:]; done++
    for _, v := range adj[u] { indeg[v]--; if indeg[v] == 0 { q = append(q, v) } }
  }
  return done == n
}`,
    },
  }),
  p({
    id: 29,
    title: 'Pacific Atlantic Water Flow',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
    approach: 'Reverse-flow DFS from each ocean. Cells reachable from BOTH sets are the answer.',
    vizLink: '/lab/graph',
    code: {
      js: `function pacificAtlantic(h) {
  const m = h.length, n = h[0].length
  const pac = Array.from({length: m}, () => new Array(n).fill(false))
  const atl = Array.from({length: m}, () => new Array(n).fill(false))
  const dfs = (i, j, vis, prev) => {
    if (i<0||j<0||i>=m||j>=n||vis[i][j]||h[i][j]<prev) return
    vis[i][j] = true
    for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) dfs(i+di, j+dj, vis, h[i][j])
  }
  for (let i = 0; i < m; i++) { dfs(i, 0, pac, -Infinity); dfs(i, n-1, atl, -Infinity) }
  for (let j = 0; j < n; j++) { dfs(0, j, pac, -Infinity); dfs(m-1, j, atl, -Infinity) }
  const out = []
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (pac[i][j] && atl[i][j]) out.push([i, j])
  return out
}`,
      ts: `function pacificAtlantic(h: number[][]): number[][] {
  const m = h.length, n = h[0].length
  const pac = Array.from({length: m}, () => new Array<boolean>(n).fill(false))
  const atl = Array.from({length: m}, () => new Array<boolean>(n).fill(false))
  const dfs = (i: number, j: number, vis: boolean[][], prev: number) => {
    if (i<0||j<0||i>=m||j>=n||vis[i][j]||h[i][j]<prev) return
    vis[i][j] = true
    for (const [di, dj] of [[1,0],[-1,0],[0,1],[0,-1]]) dfs(i+di, j+dj, vis, h[i][j])
  }
  for (let i = 0; i < m; i++) { dfs(i, 0, pac, -Infinity); dfs(i, n-1, atl, -Infinity) }
  for (let j = 0; j < n; j++) { dfs(0, j, pac, -Infinity); dfs(m-1, j, atl, -Infinity) }
  const out: number[][] = []
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (pac[i][j] && atl[i][j]) out.push([i, j])
  return out
}`,
      go: `func pacificAtlantic(h [][]int) [][]int {
  m, n := len(h), len(h[0])
  pac := make([][]bool, m); atl := make([][]bool, m)
  for i := range pac { pac[i] = make([]bool, n); atl[i] = make([]bool, n) }
  var dfs func(i, j int, vis [][]bool, prev int)
  dfs = func(i, j int, vis [][]bool, prev int) {
    if i<0 || j<0 || i>=m || j>=n || vis[i][j] || h[i][j] < prev { return }
    vis[i][j] = true
    dfs(i+1, j, vis, h[i][j]); dfs(i-1, j, vis, h[i][j])
    dfs(i, j+1, vis, h[i][j]); dfs(i, j-1, vis, h[i][j])
  }
  for i := 0; i < m; i++ { dfs(i, 0, pac, math.MinInt32); dfs(i, n-1, atl, math.MinInt32) }
  for j := 0; j < n; j++ { dfs(0, j, pac, math.MinInt32); dfs(m-1, j, atl, math.MinInt32) }
  var out [][]int
  for i := 0; i < m; i++ {
    for j := 0; j < n; j++ {
      if pac[i][j] && atl[i][j] { out = append(out, []int{i, j}) }
    }
  }
  return out
}`,
    },
  }),
  p({
    id: 30,
    title: 'Number of Islands',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/',
    approach: 'Sweep cells. On each unvisited "1", DFS to mark the whole island. Count starts.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function numIslands(grid) {
  const m = grid.length, n = grid[0].length
  let count = 0
  const dfs = (i, j) => {
    if (i<0||j<0||i>=m||j>=n||grid[i][j]!=='1') return
    grid[i][j] = '#'
    dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (grid[i][j] === '1') { count++; dfs(i, j) }
  return count
}`,
      ts: `function numIslands(grid: string[][]): number {
  const m = grid.length, n = grid[0].length
  let count = 0
  const dfs = (i: number, j: number) => {
    if (i<0||j<0||i>=m||j>=n||grid[i][j]!=='1') return
    grid[i][j] = '#'
    dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++)
    if (grid[i][j] === '1') { count++; dfs(i, j) }
  return count
}`,
      go: `func numIslands(grid [][]byte) int {
  m, n := len(grid), len(grid[0])
  count := 0
  var dfs func(i, j int)
  dfs = func(i, j int) {
    if i<0 || j<0 || i>=m || j>=n || grid[i][j] != '1' { return }
    grid[i][j] = '#'
    dfs(i+1, j); dfs(i-1, j); dfs(i, j+1); dfs(i, j-1)
  }
  for i := 0; i < m; i++ {
    for j := 0; j < n; j++ {
      if grid[i][j] == '1' { count++; dfs(i, j) }
    }
  }
  return count
}`,
    },
  }),
  p({
    id: 31,
    title: 'Longest Consecutive Sequence',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/',
    approach: 'Put all in Set. For each x WHERE x-1 not in set (start of a run), count consecutive.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function longestConsecutive(nums) {
  const set = new Set(nums)
  let best = 0
  for (const x of set) {
    if (!set.has(x - 1)) {
      let y = x, len = 1
      while (set.has(y + 1)) { y++; len++ }
      best = Math.max(best, len)
    }
  }
  return best
}`,
      ts: `function longestConsecutive(nums: number[]): number {
  const set = new Set(nums)
  let best = 0
  for (const x of set) {
    if (!set.has(x - 1)) {
      let y = x, len = 1
      while (set.has(y + 1)) { y++; len++ }
      best = Math.max(best, len)
    }
  }
  return best
}`,
      go: `func longestConsecutive(nums []int) int {
  set := make(map[int]bool)
  for _, n := range nums { set[n] = true }
  best := 0
  for x := range set {
    if !set[x-1] {
      y, length := x, 1
      for set[y+1] { y++; length++ }
      if length > best { best = length }
    }
  }
  return best
}`,
    },
  }),
  p({
    id: 32,
    title: 'Number of Connected Components in an Undirected Graph',
    category: 'Graph',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
    approach: 'Union-Find. Each edge unions; count distinct roots.',
    vizLink: '/lab/graph',
    code: {
      js: `function countComponents(n, edges) {
  const par = Array.from({length: n}, (_, i) => i)
  const find = x => par[x] === x ? x : (par[x] = find(par[x]))
  let count = n
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b)
    if (ra !== rb) { par[ra] = rb; count-- }
  }
  return count
}`,
      ts: `function countComponents(n: number, edges: number[][]): number {
  const par = Array.from({length: n}, (_, i) => i)
  const find = (x: number): number => par[x] === x ? x : (par[x] = find(par[x]))
  let count = n
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b)
    if (ra !== rb) { par[ra] = rb; count-- }
  }
  return count
}`,
      go: `func countComponents(n int, edges [][]int) int {
  par := make([]int, n)
  for i := range par { par[i] = i }
  var find func(int) int
  find = func(x int) int { if par[x] != x { par[x] = find(par[x]) }; return par[x] }
  count := n
  for _, e := range edges {
    ra, rb := find(e[0]), find(e[1])
    if ra != rb { par[ra] = rb; count-- }
  }
  return count
}`,
    },
  }),

  // ===== INTERVAL =====
  p({
    id: 33,
    title: 'Insert Interval',
    category: 'Interval',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/insert-interval/',
    approach: 'Three phases: before (push as-is), overlap (merge into newInterval), after (push as-is).',
    code: {
      js: `function insert(intervals, ni) {
  const out = []
  let i = 0
  while (i < intervals.length && intervals[i][1] < ni[0]) out.push(intervals[i++])
  while (i < intervals.length && intervals[i][0] <= ni[1]) {
    ni = [Math.min(ni[0], intervals[i][0]), Math.max(ni[1], intervals[i][1])]; i++
  }
  out.push(ni)
  while (i < intervals.length) out.push(intervals[i++])
  return out
}`,
      ts: `function insert(intervals: number[][], ni: number[]): number[][] {
  const out: number[][] = []
  let i = 0
  while (i < intervals.length && intervals[i][1] < ni[0]) out.push(intervals[i++])
  while (i < intervals.length && intervals[i][0] <= ni[1]) {
    ni = [Math.min(ni[0], intervals[i][0]), Math.max(ni[1], intervals[i][1])]; i++
  }
  out.push(ni)
  while (i < intervals.length) out.push(intervals[i++])
  return out
}`,
      go: `func insert(intervals [][]int, ni []int) [][]int {
  var out [][]int; i := 0
  for i < len(intervals) && intervals[i][1] < ni[0] { out = append(out, intervals[i]); i++ }
  for i < len(intervals) && intervals[i][0] <= ni[1] {
    if intervals[i][0] < ni[0] { ni[0] = intervals[i][0] }
    if intervals[i][1] > ni[1] { ni[1] = intervals[i][1] }
    i++
  }
  out = append(out, ni)
  for i < len(intervals) { out = append(out, intervals[i]); i++ }
  return out
}`,
    },
  }),
  p({
    id: 34,
    title: 'Merge Intervals',
    category: 'Interval',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/',
    approach: 'Sort by start. If current overlaps last, extend; otherwise push.',
    code: {
      js: `function merge(iv) {
  iv.sort((a, b) => a[0] - b[0])
  const out = [iv[0]]
  for (let i = 1; i < iv.length; i++) {
    const last = out[out.length-1]
    if (iv[i][0] <= last[1]) last[1] = Math.max(last[1], iv[i][1])
    else out.push(iv[i])
  }
  return out
}`,
      ts: `function merge(iv: number[][]): number[][] {
  iv.sort((a, b) => a[0] - b[0])
  const out: number[][] = [iv[0]]
  for (let i = 1; i < iv.length; i++) {
    const last = out[out.length-1]
    if (iv[i][0] <= last[1]) last[1] = Math.max(last[1], iv[i][1])
    else out.push(iv[i])
  }
  return out
}`,
      go: `func merge(iv [][]int) [][]int {
  sort.Slice(iv, func(a, b int) bool { return iv[a][0] < iv[b][0] })
  out := [][]int{iv[0]}
  for i := 1; i < len(iv); i++ {
    last := out[len(out)-1]
    if iv[i][0] <= last[1] {
      if iv[i][1] > last[1] { last[1] = iv[i][1] }
    } else { out = append(out, iv[i]) }
  }
  return out
}`,
    },
  }),
  p({
    id: 35,
    title: 'Non-overlapping Intervals',
    category: 'Interval',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/',
    approach: 'Sort by END time. Greedy: keep an interval iff it starts >= last kept end.',
    code: {
      js: `function eraseOverlapIntervals(iv) {
  iv.sort((a, b) => a[1] - b[1])
  let end = -Infinity, kept = 0
  for (const [s, e] of iv) if (s >= end) { kept++; end = e }
  return iv.length - kept
}`,
      ts: `function eraseOverlapIntervals(iv: number[][]): number {
  iv.sort((a, b) => a[1] - b[1])
  let end = -Infinity, kept = 0
  for (const [s, e] of iv) if (s >= end) { kept++; end = e }
  return iv.length - kept
}`,
      go: `func eraseOverlapIntervals(iv [][]int) int {
  sort.Slice(iv, func(a, b int) bool { return iv[a][1] < iv[b][1] })
  end, kept := math.MinInt32, 0
  for _, x := range iv {
    if x[0] >= end { kept++; end = x[1] }
  }
  return len(iv) - kept
}`,
    },
  }),
  p({
    id: 36,
    title: 'Meeting Rooms',
    category: 'Interval',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/',
    approach: 'Sort by start. If any meeting starts before the previous ends → false.',
    code: {
      js: `function canAttendMeetings(iv) {
  iv.sort((a, b) => a[0] - b[0])
  for (let i = 1; i < iv.length; i++) if (iv[i][0] < iv[i-1][1]) return false
  return true
}`,
      ts: `function canAttendMeetings(iv: number[][]): boolean {
  iv.sort((a, b) => a[0] - b[0])
  for (let i = 1; i < iv.length; i++) if (iv[i][0] < iv[i-1][1]) return false
  return true
}`,
      go: `func canAttendMeetings(iv [][]int) bool {
  sort.Slice(iv, func(a, b int) bool { return iv[a][0] < iv[b][0] })
  for i := 1; i < len(iv); i++ { if iv[i][0] < iv[i-1][1] { return false } }
  return true
}`,
    },
  }),
  p({
    id: 37,
    title: 'Meeting Rooms II',
    category: 'Interval',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/',
    approach: 'Min-heap of end times. For each meeting, pop if its start >= min end; push its end.',
    vizLink: '/lab/heap',
    code: {
      js: `function minMeetingRooms(iv) {
  iv.sort((a, b) => a[0] - b[0])
  const ends = []  // simple sorted array as min-heap
  for (const [s, e] of iv) {
    if (ends.length && ends[0] <= s) ends.shift()
    ends.push(e); ends.sort((a, b) => a - b)
  }
  return ends.length
}`,
      ts: `function minMeetingRooms(iv: number[][]): number {
  iv.sort((a, b) => a[0] - b[0])
  const ends: number[] = []
  for (const [s, e] of iv) {
    if (ends.length && ends[0] <= s) ends.shift()
    ends.push(e); ends.sort((a, b) => a - b)
  }
  return ends.length
}`,
      go: `func minMeetingRooms(iv [][]int) int {
  sort.Slice(iv, func(a, b int) bool { return iv[a][0] < iv[b][0] })
  ends := &IntHeap{}
  for _, m := range iv {
    if ends.Len() > 0 && (*ends)[0] <= m[0] { heap.Pop(ends) }
    heap.Push(ends, m[1])
  }
  return ends.Len()
}`,
    },
  }),

  // ===== LINKED LIST =====
  p({
    id: 38,
    title: 'Reverse a Linked List',
    category: 'Linked List',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    approach: 'Three pointers (prev, curr, next). Flip each .next as you walk.',
    vizLink: '/lab/linked-list',
    code: {
      js: `function reverseList(head) {
  let prev = null, curr = head
  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next }
  return prev
}`,
      ts: `function reverseList(head: any): any {
  let prev = null, curr = head
  while (curr) { const next = curr.next; curr.next = prev; prev = curr; curr = next }
  return prev
}`,
      go: `func reverseList(head *ListNode) *ListNode {
  var prev *ListNode; curr := head
  for curr != nil { next := curr.Next; curr.Next = prev; prev = curr; curr = next }
  return prev
}`,
    },
  }),
  p({
    id: 39,
    title: 'Linked List Cycle',
    category: 'Linked List',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/',
    approach: "Floyd's tortoise + hare. If they meet, cycle. If fast hits null, no cycle.",
    vizLink: '/lab/linked-list',
    code: {
      js: `function hasCycle(head) {
  let slow = head, fast = head
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true }
  return false
}`,
      ts: `function hasCycle(head: any): boolean {
  let slow = head, fast = head
  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true }
  return false
}`,
      go: `func hasCycle(head *ListNode) bool {
  slow, fast := head, head
  for fast != nil && fast.Next != nil {
    slow = slow.Next; fast = fast.Next.Next
    if slow == fast { return true }
  }
  return false
}`,
    },
  }),
  p({
    id: 40,
    title: 'Merge Two Sorted Lists',
    category: 'Linked List',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    approach: 'Dummy head + tail pointer. Pick smaller, advance, repeat.',
    vizLink: '/lab/linked-list',
    code: {
      js: `function mergeTwoLists(a, b) {
  const dummy = { next: null }; let tail = dummy
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next } else { tail.next = b; b = b.next }
    tail = tail.next
  }
  tail.next = a || b
  return dummy.next
}`,
      ts: `function mergeTwoLists(a: any, b: any): any {
  const dummy: any = { next: null }; let tail = dummy
  while (a && b) {
    if (a.val <= b.val) { tail.next = a; a = a.next } else { tail.next = b; b = b.next }
    tail = tail.next
  }
  tail.next = a || b
  return dummy.next
}`,
      go: `func mergeTwoLists(a, b *ListNode) *ListNode {
  dummy := &ListNode{}; tail := dummy
  for a != nil && b != nil {
    if a.Val <= b.Val { tail.Next = a; a = a.Next } else { tail.Next = b; b = b.Next }
    tail = tail.Next
  }
  if a != nil { tail.Next = a } else { tail.Next = b }
  return dummy.Next
}`,
    },
  }),
  p({
    id: 41,
    title: 'Merge K Sorted Lists',
    category: 'Linked List',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    approach: 'Min-heap of (val, listIdx). Pop smallest, push next from that list. O(N log k).',
    vizLink: '/lab/heap',
    code: {
      js: `function mergeKLists(lists) {
  // Naive: repeated 2-way merge for clarity. For O(N log k), use a heap.
  const merge2 = (a, b) => {
    const d = { next: null }; let t = d
    while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next } else { t.next = b; b = b.next } ; t = t.next }
    t.next = a || b
    return d.next
  }
  let acc = null
  for (const l of lists) acc = merge2(acc, l)
  return acc
}`,
      ts: `function mergeKLists(lists: any[]): any {
  const merge2 = (a: any, b: any): any => {
    const d: any = { next: null }; let t = d
    while (a && b) { if (a.val <= b.val) { t.next = a; a = a.next } else { t.next = b; b = b.next } ; t = t.next }
    t.next = a || b
    return d.next
  }
  let acc: any = null
  for (const l of lists) acc = merge2(acc, l)
  return acc
}`,
      go: `func mergeKLists(lists []*ListNode) *ListNode {
  merge2 := func(a, b *ListNode) *ListNode {
    d := &ListNode{}; t := d
    for a != nil && b != nil {
      if a.Val <= b.Val { t.Next = a; a = a.Next } else { t.Next = b; b = b.Next }
      t = t.Next
    }
    if a != nil { t.Next = a } else { t.Next = b }
    return d.Next
  }
  var acc *ListNode
  for _, l := range lists { acc = merge2(acc, l) }
  return acc
}`,
    },
  }),
  p({
    id: 42,
    title: 'Remove Nth Node From End',
    category: 'Linked List',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
    approach: 'Two pointers, gap of N. Move both until fast hits end; slow now points to predecessor.',
    vizLink: '/lab/linked-list',
    code: {
      js: `function removeNthFromEnd(head, n) {
  const dummy = { next: head }; let fast = dummy, slow = dummy
  for (let i = 0; i < n; i++) fast = fast.next
  while (fast.next) { fast = fast.next; slow = slow.next }
  slow.next = slow.next.next
  return dummy.next
}`,
      ts: `function removeNthFromEnd(head: any, n: number): any {
  const dummy: any = { next: head }; let fast = dummy, slow = dummy
  for (let i = 0; i < n; i++) fast = fast.next
  while (fast.next) { fast = fast.next; slow = slow.next }
  slow.next = slow.next.next
  return dummy.next
}`,
      go: `func removeNthFromEnd(head *ListNode, n int) *ListNode {
  dummy := &ListNode{Next: head}; fast, slow := dummy, dummy
  for i := 0; i < n; i++ { fast = fast.Next }
  for fast.Next != nil { fast = fast.Next; slow = slow.Next }
  slow.Next = slow.Next.Next
  return dummy.Next
}`,
    },
  }),
  p({
    id: 43,
    title: 'Reorder List',
    category: 'Linked List',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/reorder-list/',
    approach: 'Find middle (slow/fast). Reverse second half. Interleave the two halves.',
    vizLink: '/lab/linked-list',
    code: {
      js: `function reorderList(head) {
  if (!head) return
  let slow = head, fast = head
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next }
  let prev = null, curr = slow.next; slow.next = null
  while (curr) { const n = curr.next; curr.next = prev; prev = curr; curr = n }
  let a = head, b = prev
  while (b) { const na = a.next, nb = b.next; a.next = b; b.next = na; a = na; b = nb }
}`,
      ts: `function reorderList(head: any): void {
  if (!head) return
  let slow = head, fast = head
  while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next }
  let prev: any = null, curr = slow.next; slow.next = null
  while (curr) { const n = curr.next; curr.next = prev; prev = curr; curr = n }
  let a = head, b = prev
  while (b) { const na = a.next, nb = b.next; a.next = b; b.next = na; a = na; b = nb }
}`,
      go: `func reorderList(head *ListNode) {
  if head == nil { return }
  slow, fast := head, head
  for fast.Next != nil && fast.Next.Next != nil { slow = slow.Next; fast = fast.Next.Next }
  var prev *ListNode; curr := slow.Next; slow.Next = nil
  for curr != nil { n := curr.Next; curr.Next = prev; prev = curr; curr = n }
  a, b := head, prev
  for b != nil { na, nb := a.Next, b.Next; a.Next = b; b.Next = na; a = na; b = nb }
}`,
    },
  }),

  // ===== MATRIX =====
  p({
    id: 44,
    title: 'Set Matrix Zeroes',
    category: 'Matrix',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/',
    approach: 'Use first row + first column as flags. Track first-row/col zero separately.',
    code: {
      js: `function setZeroes(m) {
  const R = m.length, C = m[0].length
  let firstRow = false, firstCol = false
  for (let j = 0; j < C; j++) if (m[0][j] === 0) firstRow = true
  for (let i = 0; i < R; i++) if (m[i][0] === 0) firstCol = true
  for (let i = 1; i < R; i++) for (let j = 1; j < C; j++)
    if (m[i][j] === 0) { m[i][0] = 0; m[0][j] = 0 }
  for (let i = 1; i < R; i++) for (let j = 1; j < C; j++)
    if (m[i][0] === 0 || m[0][j] === 0) m[i][j] = 0
  if (firstRow) for (let j = 0; j < C; j++) m[0][j] = 0
  if (firstCol) for (let i = 0; i < R; i++) m[i][0] = 0
}`,
      ts: `function setZeroes(m: number[][]): void {
  const R = m.length, C = m[0].length
  let firstRow = false, firstCol = false
  for (let j = 0; j < C; j++) if (m[0][j] === 0) firstRow = true
  for (let i = 0; i < R; i++) if (m[i][0] === 0) firstCol = true
  for (let i = 1; i < R; i++) for (let j = 1; j < C; j++)
    if (m[i][j] === 0) { m[i][0] = 0; m[0][j] = 0 }
  for (let i = 1; i < R; i++) for (let j = 1; j < C; j++)
    if (m[i][0] === 0 || m[0][j] === 0) m[i][j] = 0
  if (firstRow) for (let j = 0; j < C; j++) m[0][j] = 0
  if (firstCol) for (let i = 0; i < R; i++) m[i][0] = 0
}`,
      go: `func setZeroes(m [][]int) {
  R, C := len(m), len(m[0])
  firstRow, firstCol := false, false
  for j := 0; j < C; j++ { if m[0][j] == 0 { firstRow = true } }
  for i := 0; i < R; i++ { if m[i][0] == 0 { firstCol = true } }
  for i := 1; i < R; i++ {
    for j := 1; j < C; j++ {
      if m[i][j] == 0 { m[i][0] = 0; m[0][j] = 0 }
    }
  }
  for i := 1; i < R; i++ {
    for j := 1; j < C; j++ {
      if m[i][0] == 0 || m[0][j] == 0 { m[i][j] = 0 }
    }
  }
  if firstRow { for j := 0; j < C; j++ { m[0][j] = 0 } }
  if firstCol { for i := 0; i < R; i++ { m[i][0] = 0 } }
}`,
    },
  }),
  p({
    id: 45,
    title: 'Spiral Matrix',
    category: 'Matrix',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/',
    approach: 'Four boundaries (top, bottom, left, right). Walk one edge, shrink the boundary, repeat.',
    code: {
      js: `function spiralOrder(m) {
  const out = []
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) out.push(m[top][j]); top++
    for (let i = top; i <= bottom; i++) out.push(m[i][right]); right--
    if (top <= bottom) for (let j = right; j >= left; j--) out.push(m[bottom][j]); bottom--
    if (left <= right) for (let i = bottom; i >= top; i--) out.push(m[i][left]); left++
  }
  return out
}`,
      ts: `function spiralOrder(m: number[][]): number[] {
  const out: number[] = []
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j++) out.push(m[top][j]); top++
    for (let i = top; i <= bottom; i++) out.push(m[i][right]); right--
    if (top <= bottom) for (let j = right; j >= left; j--) out.push(m[bottom][j]); bottom--
    if (left <= right) for (let i = bottom; i >= top; i--) out.push(m[i][left]); left++
  }
  return out
}`,
      go: `func spiralOrder(m [][]int) []int {
  var out []int
  top, bottom, left, right := 0, len(m)-1, 0, len(m[0])-1
  for top <= bottom && left <= right {
    for j := left; j <= right; j++ { out = append(out, m[top][j]) }
    top++
    for i := top; i <= bottom; i++ { out = append(out, m[i][right]) }
    right--
    if top <= bottom { for j := right; j >= left; j-- { out = append(out, m[bottom][j]) }; bottom-- }
    if left <= right { for i := bottom; i >= top; i-- { out = append(out, m[i][left]) }; left++ }
  }
  return out
}`,
    },
  }),
  p({
    id: 46,
    title: 'Rotate Image',
    category: 'Matrix',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/rotate-image/',
    approach: 'Transpose then reverse each row. Or rotate ring-by-ring in place.',
    code: {
      js: `function rotate(m) {
  const n = m.length
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    [m[i][j], m[j][i]] = [m[j][i], m[i][j]]
  for (const row of m) row.reverse()
}`,
      ts: `function rotate(m: number[][]): void {
  const n = m.length
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++)
    [m[i][j], m[j][i]] = [m[j][i], m[i][j]]
  for (const row of m) row.reverse()
}`,
      go: `func rotate(m [][]int) {
  n := len(m)
  for i := 0; i < n; i++ {
    for j := i + 1; j < n; j++ { m[i][j], m[j][i] = m[j][i], m[i][j] }
  }
  for _, row := range m {
    for i, j := 0, len(row)-1; i < j; i, j = i+1, j-1 { row[i], row[j] = row[j], row[i] }
  }
}`,
    },
  }),
  p({
    id: 47,
    title: 'Word Search',
    category: 'Matrix',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/word-search/',
    approach: 'DFS from each cell. Mark visited (temp # then restore). Backtrack on mismatch.',
    vizLink: '/lab/graph',
    code: {
      js: `function exist(board, word) {
  const m = board.length, n = board[0].length
  const dfs = (i, j, k) => {
    if (k === word.length) return true
    if (i<0||j<0||i>=m||j>=n||board[i][j] !== word[k]) return false
    const tmp = board[i][j]; board[i][j] = '#'
    const ok = dfs(i+1,j,k+1) || dfs(i-1,j,k+1) || dfs(i,j+1,k+1) || dfs(i,j-1,k+1)
    board[i][j] = tmp
    return ok
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true
  return false
}`,
      ts: `function exist(board: string[][], word: string): boolean {
  const m = board.length, n = board[0].length
  const dfs = (i: number, j: number, k: number): boolean => {
    if (k === word.length) return true
    if (i<0||j<0||i>=m||j>=n||board[i][j] !== word[k]) return false
    const tmp = board[i][j]; board[i][j] = '#'
    const ok = dfs(i+1,j,k+1) || dfs(i-1,j,k+1) || dfs(i,j+1,k+1) || dfs(i,j-1,k+1)
    board[i][j] = tmp
    return ok
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true
  return false
}`,
      go: `func exist(board [][]byte, word string) bool {
  m, n := len(board), len(board[0])
  var dfs func(i, j, k int) bool
  dfs = func(i, j, k int) bool {
    if k == len(word) { return true }
    if i<0 || j<0 || i>=m || j>=n || board[i][j] != word[k] { return false }
    tmp := board[i][j]; board[i][j] = '#'
    ok := dfs(i+1, j, k+1) || dfs(i-1, j, k+1) || dfs(i, j+1, k+1) || dfs(i, j-1, k+1)
    board[i][j] = tmp
    return ok
  }
  for i := 0; i < m; i++ {
    for j := 0; j < n; j++ {
      if dfs(i, j, 0) { return true }
    }
  }
  return false
}`,
    },
  }),

  // ===== STRING =====
  p({
    id: 48,
    title: 'Longest Substring Without Repeating Characters',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    approach: 'Sliding window with Set. Shrink from left until duplicate gone, then expand right.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function lengthOfLongestSubstring(s) {
  const seen = new Set(); let l = 0, best = 0
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) { seen.delete(s[l]); l++ }
    seen.add(s[r]); best = Math.max(best, r - l + 1)
  }
  return best
}`,
      ts: `function lengthOfLongestSubstring(s: string): number {
  const seen = new Set<string>(); let l = 0, best = 0
  for (let r = 0; r < s.length; r++) {
    while (seen.has(s[r])) { seen.delete(s[l]); l++ }
    seen.add(s[r]); best = Math.max(best, r - l + 1)
  }
  return best
}`,
      go: `func lengthOfLongestSubstring(s string) int {
  seen := make(map[byte]bool); l, best := 0, 0
  for r := 0; r < len(s); r++ {
    for seen[s[r]] { delete(seen, s[l]); l++ }
    seen[s[r]] = true
    if r-l+1 > best { best = r - l + 1 }
  }
  return best
}`,
    },
  }),
  p({
    id: 49,
    title: 'Longest Repeating Character Replacement',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
    approach: 'Sliding window. Track max-count. If window − maxCount > k, shrink left.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0); let l = 0, maxF = 0, best = 0
  for (let r = 0; r < s.length; r++) {
    const c = s.charCodeAt(r) - 65
    maxF = Math.max(maxF, ++count[c])
    if (r - l + 1 - maxF > k) { count[s.charCodeAt(l) - 65]--; l++ }
    best = Math.max(best, r - l + 1)
  }
  return best
}`,
      ts: `function characterReplacement(s: string, k: number): number {
  const count = new Array<number>(26).fill(0); let l = 0, maxF = 0, best = 0
  for (let r = 0; r < s.length; r++) {
    const c = s.charCodeAt(r) - 65
    maxF = Math.max(maxF, ++count[c])
    if (r - l + 1 - maxF > k) { count[s.charCodeAt(l) - 65]--; l++ }
    best = Math.max(best, r - l + 1)
  }
  return best
}`,
      go: `func characterReplacement(s string, k int) int {
  count := [26]int{}; l, maxF, best := 0, 0, 0
  for r := 0; r < len(s); r++ {
    c := s[r] - 'A'; count[c]++
    if count[c] > maxF { maxF = count[c] }
    if r-l+1-maxF > k { count[s[l]-'A']--; l++ }
    if r-l+1 > best { best = r - l + 1 }
  }
  return best
}`,
    },
  }),
  p({
    id: 50,
    title: 'Minimum Window Substring',
    category: 'String',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    approach: 'Sliding window + need-count map. Expand right; when valid, shrink left and record best.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function minWindow(s, t) {
  const need = new Map()
  for (const c of t) need.set(c, (need.get(c) || 0) + 1)
  let missing = t.length, l = 0, best = '', bestLen = Infinity
  for (let r = 0; r < s.length; r++) {
    if ((need.get(s[r]) || 0) > 0) missing--
    need.set(s[r], (need.get(s[r]) || 0) - 1)
    while (missing === 0) {
      if (r - l + 1 < bestLen) { bestLen = r - l + 1; best = s.slice(l, r + 1) }
      need.set(s[l], (need.get(s[l]) || 0) + 1)
      if ((need.get(s[l]) || 0) > 0) missing++
      l++
    }
  }
  return best
}`,
      ts: `function minWindow(s: string, t: string): string {
  const need = new Map<string, number>()
  for (const c of t) need.set(c, (need.get(c) || 0) + 1)
  let missing = t.length, l = 0, best = '', bestLen = Infinity
  for (let r = 0; r < s.length; r++) {
    if ((need.get(s[r]) || 0) > 0) missing--
    need.set(s[r], (need.get(s[r]) || 0) - 1)
    while (missing === 0) {
      if (r - l + 1 < bestLen) { bestLen = r - l + 1; best = s.slice(l, r + 1) }
      need.set(s[l], (need.get(s[l]) || 0) + 1)
      if ((need.get(s[l]) || 0) > 0) missing++
      l++
    }
  }
  return best
}`,
      go: `func minWindow(s, t string) string {
  need := make(map[byte]int)
  for i := 0; i < len(t); i++ { need[t[i]]++ }
  missing, l, best, bestLen := len(t), 0, "", math.MaxInt32
  for r := 0; r < len(s); r++ {
    if need[s[r]] > 0 { missing-- }
    need[s[r]]--
    for missing == 0 {
      if r-l+1 < bestLen { bestLen = r - l + 1; best = s[l:r+1] }
      need[s[l]]++
      if need[s[l]] > 0 { missing++ }
      l++
    }
  }
  return best
}`,
    },
  }),
  p({
    id: 51,
    title: 'Valid Anagram',
    category: 'String',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/',
    approach: 'Count frequencies in one pass; decrement with the other; nonzero → false.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const c = new Array(26).fill(0)
  for (let i = 0; i < s.length; i++) { c[s.charCodeAt(i)-97]++; c[t.charCodeAt(i)-97]-- }
  return c.every(x => x === 0)
}`,
      ts: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false
  const c = new Array<number>(26).fill(0)
  for (let i = 0; i < s.length; i++) { c[s.charCodeAt(i)-97]++; c[t.charCodeAt(i)-97]-- }
  return c.every(x => x === 0)
}`,
      go: `func isAnagram(s, t string) bool {
  if len(s) != len(t) { return false }
  var c [26]int
  for i := 0; i < len(s); i++ { c[s[i]-'a']++; c[t[i]-'a']-- }
  for _, x := range c { if x != 0 { return false } }
  return true
}`,
    },
  }),
  p({
    id: 52,
    title: 'Group Anagrams',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
    approach: 'Key each word by its sorted characters (or by count tuple). Bucket into a Map.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function groupAnagrams(strs) {
  const m = new Map()
  for (const s of strs) {
    const k = [...s].sort().join('')
    if (!m.has(k)) m.set(k, [])
    m.get(k).push(s)
  }
  return [...m.values()]
}`,
      ts: `function groupAnagrams(strs: string[]): string[][] {
  const m = new Map<string, string[]>()
  for (const s of strs) {
    const k = [...s].sort().join('')
    if (!m.has(k)) m.set(k, [])
    m.get(k)!.push(s)
  }
  return [...m.values()]
}`,
      go: `func groupAnagrams(strs []string) [][]string {
  m := make(map[string][]string)
  for _, s := range strs {
    b := []byte(s); sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
    k := string(b); m[k] = append(m[k], s)
  }
  out := make([][]string, 0, len(m))
  for _, v := range m { out = append(out, v) }
  return out
}`,
    },
  }),
  p({
    id: 53,
    title: 'Valid Parentheses',
    category: 'String',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
    approach: 'Stack: push openings; on closer, pop and check match. Empty at end = valid.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function isValid(s) {
  const stack = [], match = { ')': '(', ']': '[', '}': '{' }
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c)
    else if (stack.pop() !== match[c]) return false
  }
  return stack.length === 0
}`,
      ts: `function isValid(s: string): boolean {
  const stack: string[] = []
  const match: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c)
    else if (stack.pop() !== match[c]) return false
  }
  return stack.length === 0
}`,
      go: `func isValid(s string) bool {
  var stack []byte
  match := map[byte]byte{')': '(', ']': '[', '}': '{'}
  for i := 0; i < len(s); i++ {
    c := s[i]
    if c == '(' || c == '[' || c == '{' { stack = append(stack, c)
    } else {
      if len(stack) == 0 || stack[len(stack)-1] != match[c] { return false }
      stack = stack[:len(stack)-1]
    }
  }
  return len(stack) == 0
}`,
    },
  }),
  p({
    id: 54,
    title: 'Valid Palindrome',
    category: 'String',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
    approach: 'Two pointers; skip non-alphanumeric; compare lowercase.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function isPalindrome(s) {
  let l = 0, r = s.length - 1
  const ok = c => /[a-z0-9]/i.test(c)
  while (l < r) {
    while (l < r && !ok(s[l])) l++
    while (l < r && !ok(s[r])) r--
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false
    l++; r--
  }
  return true
}`,
      ts: `function isPalindrome(s: string): boolean {
  let l = 0, r = s.length - 1
  const ok = (c: string) => /[a-z0-9]/i.test(c)
  while (l < r) {
    while (l < r && !ok(s[l])) l++
    while (l < r && !ok(s[r])) r--
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false
    l++; r--
  }
  return true
}`,
      go: `func isPalindrome(s string) bool {
  ok := func(b byte) bool { return (b>='a'&&b<='z') || (b>='A'&&b<='Z') || (b>='0'&&b<='9') }
  lower := func(b byte) byte { if b>='A'&&b<='Z' { return b + 32 }; return b }
  l, r := 0, len(s)-1
  for l < r {
    for l < r && !ok(s[l]) { l++ }
    for l < r && !ok(s[r]) { r-- }
    if lower(s[l]) != lower(s[r]) { return false }
    l++; r--
  }
  return true
}`,
    },
  }),
  p({
    id: 55,
    title: 'Longest Palindromic Substring',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/',
    approach: 'Expand around each center (odd and even). Track best.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function longestPalindrome(s) {
  let start = 0, len = 0
  const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }; return [l + 1, r - 1] }
  for (let i = 0; i < s.length; i++) {
    for (const [l, r] of [expand(i, i), expand(i, i + 1)]) {
      if (r - l + 1 > len) { start = l; len = r - l + 1 }
    }
  }
  return s.slice(start, start + len)
}`,
      ts: `function longestPalindrome(s: string): string {
  let start = 0, len = 0
  const expand = (l: number, r: number): [number, number] => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++ }
    return [l + 1, r - 1]
  }
  for (let i = 0; i < s.length; i++) {
    for (const [l, r] of [expand(i, i), expand(i, i + 1)]) {
      if (r - l + 1 > len) { start = l; len = r - l + 1 }
    }
  }
  return s.slice(start, start + len)
}`,
      go: `func longestPalindrome(s string) string {
  start, length := 0, 0
  expand := func(l, r int) (int, int) {
    for l >= 0 && r < len(s) && s[l] == s[r] { l--; r++ }
    return l + 1, r - 1
  }
  for i := 0; i < len(s); i++ {
    for _, p := range [][2]int{{i, i}, {i, i + 1}} {
      l, r := expand(p[0], p[1])
      if r-l+1 > length { start = l; length = r - l + 1 }
    }
  }
  return s[start : start+length]
}`,
    },
  }),
  p({
    id: 56,
    title: 'Palindromic Substrings',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/',
    approach: 'Expand around each center; count every expansion that stays palindromic.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function countSubstrings(s) {
  let count = 0
  const expand = (l, r) => { while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++ } }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1) }
  return count
}`,
      ts: `function countSubstrings(s: string): number {
  let count = 0
  const expand = (l: number, r: number) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++ }
  }
  for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1) }
  return count
}`,
      go: `func countSubstrings(s string) int {
  count := 0
  expand := func(l, r int) { for l >= 0 && r < len(s) && s[l] == s[r] { count++; l--; r++ } }
  for i := 0; i < len(s); i++ { expand(i, i); expand(i, i+1) }
  return count
}`,
    },
  }),
  p({
    id: 57,
    title: 'Encode and Decode Strings',
    category: 'String',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/',
    approach: 'Length-prefix each string: "<len>#<string>". Decode by reading length, slicing.',
    code: {
      js: `const encode = (arr) => arr.map(s => s.length + '#' + s).join('')
const decode = (str) => {
  const out = []; let i = 0
  while (i < str.length) {
    let j = i; while (str[j] !== '#') j++
    const len = +str.slice(i, j); out.push(str.slice(j + 1, j + 1 + len)); i = j + 1 + len
  }
  return out
}`,
      ts: `const encode = (arr: string[]): string => arr.map(s => s.length + '#' + s).join('')
const decode = (str: string): string[] => {
  const out: string[] = []; let i = 0
  while (i < str.length) {
    let j = i; while (str[j] !== '#') j++
    const len = +str.slice(i, j); out.push(str.slice(j + 1, j + 1 + len)); i = j + 1 + len
  }
  return out
}`,
      go: `func encode(arr []string) string {
  var b strings.Builder
  for _, s := range arr { fmt.Fprintf(&b, "%d#%s", len(s), s) }
  return b.String()
}
func decode(str string) []string {
  var out []string; i := 0
  for i < len(str) {
    j := i; for str[j] != '#' { j++ }
    l, _ := strconv.Atoi(str[i:j])
    out = append(out, str[j+1:j+1+l]); i = j + 1 + l
  }
  return out
}`,
    },
  }),

  // ===== TREE =====
  p({
    id: 58,
    title: 'Maximum Depth of Binary Tree',
    category: 'Tree',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    approach: 'Recurse: 1 + max(left, right). Null returns 0.',
    vizLink: '/lab/bst',
    code: {
      js: `function maxDepth(root) {
  return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0
}`,
      ts: `function maxDepth(root: any): number {
  return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0
}`,
      go: `func maxDepth(root *TreeNode) int {
  if root == nil { return 0 }
  l, r := maxDepth(root.Left), maxDepth(root.Right)
  if l > r { return l + 1 }
  return r + 1
}`,
    },
  }),
  p({
    id: 59,
    title: 'Same Tree',
    category: 'Tree',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/same-tree/',
    approach: 'Recurse: both null OK; one null fail; values match AND children match.',
    vizLink: '/lab/bst',
    code: {
      js: `function isSameTree(p, q) {
  if (!p && !q) return true
  if (!p || !q || p.val !== q.val) return false
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}`,
      ts: `function isSameTree(p: any, q: any): boolean {
  if (!p && !q) return true
  if (!p || !q || p.val !== q.val) return false
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}`,
      go: `func isSameTree(p, q *TreeNode) bool {
  if p == nil && q == nil { return true }
  if p == nil || q == nil || p.Val != q.Val { return false }
  return isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)
}`,
    },
  }),
  p({
    id: 60,
    title: 'Invert Binary Tree',
    category: 'Tree',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/',
    approach: 'Swap left/right at each node, then recurse.',
    vizLink: '/lab/bst',
    code: {
      js: `function invertTree(root) {
  if (!root) return null
  ;[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
  return root
}`,
      ts: `function invertTree(root: any): any {
  if (!root) return null
  ;[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
  return root
}`,
      go: `func invertTree(root *TreeNode) *TreeNode {
  if root == nil { return nil }
  root.Left, root.Right = invertTree(root.Right), invertTree(root.Left)
  return root
}`,
    },
  }),
  p({
    id: 61,
    title: 'Binary Tree Maximum Path Sum',
    category: 'Tree',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    approach: 'DFS returning best one-sided gain. Update global with left+root+right path.',
    vizLink: '/lab/bst',
    code: {
      js: `function maxPathSum(root) {
  let best = -Infinity
  const dfs = n => {
    if (!n) return 0
    const l = Math.max(0, dfs(n.left)), r = Math.max(0, dfs(n.right))
    best = Math.max(best, n.val + l + r)
    return n.val + Math.max(l, r)
  }
  dfs(root)
  return best
}`,
      ts: `function maxPathSum(root: any): number {
  let best = -Infinity
  const dfs = (n: any): number => {
    if (!n) return 0
    const l = Math.max(0, dfs(n.left)), r = Math.max(0, dfs(n.right))
    best = Math.max(best, n.val + l + r)
    return n.val + Math.max(l, r)
  }
  dfs(root)
  return best
}`,
      go: `func maxPathSum(root *TreeNode) int {
  best := math.MinInt32
  var dfs func(*TreeNode) int
  dfs = func(n *TreeNode) int {
    if n == nil { return 0 }
    l, r := dfs(n.Left), dfs(n.Right)
    if l < 0 { l = 0 }; if r < 0 { r = 0 }
    if n.Val+l+r > best { best = n.Val + l + r }
    if l > r { return n.Val + l }
    return n.Val + r
  }
  dfs(root)
  return best
}`,
    },
  }),
  p({
    id: 62,
    title: 'Binary Tree Level Order Traversal',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    approach: 'BFS by level: drain current queue size, collect, push children.',
    vizLink: '/lab/algorithms',
    code: {
      js: `function levelOrder(root) {
  if (!root) return []
  const out = [], q = [root]
  while (q.length) {
    const size = q.length, level = []
    for (let i = 0; i < size; i++) {
      const n = q.shift(); level.push(n.val)
      if (n.left) q.push(n.left); if (n.right) q.push(n.right)
    }
    out.push(level)
  }
  return out
}`,
      ts: `function levelOrder(root: any): number[][] {
  if (!root) return []
  const out: number[][] = [], q: any[] = [root]
  while (q.length) {
    const size = q.length, level: number[] = []
    for (let i = 0; i < size; i++) {
      const n = q.shift(); level.push(n.val)
      if (n.left) q.push(n.left); if (n.right) q.push(n.right)
    }
    out.push(level)
  }
  return out
}`,
      go: `func levelOrder(root *TreeNode) [][]int {
  if root == nil { return nil }
  var out [][]int; q := []*TreeNode{root}
  for len(q) > 0 {
    size := len(q); level := []int{}
    for i := 0; i < size; i++ {
      n := q[0]; q = q[1:]; level = append(level, n.Val)
      if n.Left != nil { q = append(q, n.Left) }
      if n.Right != nil { q = append(q, n.Right) }
    }
    out = append(out, level)
  }
  return out
}`,
    },
  }),
  p({
    id: 63,
    title: 'Serialize and Deserialize Binary Tree',
    category: 'Tree',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
    approach: 'Preorder DFS with "null" markers. Decode with a queue/iterator.',
    vizLink: '/lab/bst',
    code: {
      js: `function serialize(root) {
  const out = []
  const dfs = n => { if (!n) { out.push('null'); return } ; out.push(n.val); dfs(n.left); dfs(n.right) }
  dfs(root)
  return out.join(',')
}
function deserialize(data) {
  const tokens = data.split(','); let i = 0
  const build = () => {
    const t = tokens[i++]
    if (t === 'null') return null
    return { val: +t, left: build(), right: build() }
  }
  return build()
}`,
      ts: `function serialize(root: any): string {
  const out: string[] = []
  const dfs = (n: any) => { if (!n) { out.push('null'); return } ; out.push(String(n.val)); dfs(n.left); dfs(n.right) }
  dfs(root)
  return out.join(',')
}
function deserialize(data: string): any {
  const tokens = data.split(','); let i = 0
  const build = (): any => {
    const t = tokens[i++]
    if (t === 'null') return null
    return { val: +t, left: build(), right: build() }
  }
  return build()
}`,
      go: `func serialize(root *TreeNode) string {
  var out []string
  var dfs func(*TreeNode)
  dfs = func(n *TreeNode) { if n == nil { out = append(out, "null"); return }
    out = append(out, strconv.Itoa(n.Val)); dfs(n.Left); dfs(n.Right) }
  dfs(root)
  return strings.Join(out, ",")
}
func deserialize(data string) *TreeNode {
  tokens := strings.Split(data, ","); i := 0
  var build func() *TreeNode
  build = func() *TreeNode {
    t := tokens[i]; i++
    if t == "null" { return nil }
    v, _ := strconv.Atoi(t)
    return &TreeNode{Val: v, Left: build(), Right: build()}
  }
  return build()
}`,
    },
  }),
  p({
    id: 64,
    title: 'Subtree of Another Tree',
    category: 'Tree',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/',
    approach: 'For each node of root, check if same as subRoot. Use isSameTree helper.',
    vizLink: '/lab/bst',
    code: {
      js: `function isSubtree(root, sub) {
  const same = (a, b) => !a && !b ? true : (!a || !b || a.val !== b.val ? false : same(a.left, b.left) && same(a.right, b.right))
  if (!root) return false
  return same(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub)
}`,
      ts: `function isSubtree(root: any, sub: any): boolean {
  const same = (a: any, b: any): boolean => !a && !b ? true : (!a || !b || a.val !== b.val ? false : same(a.left, b.left) && same(a.right, b.right))
  if (!root) return false
  return same(root, sub) || isSubtree(root.left, sub) || isSubtree(root.right, sub)
}`,
      go: `func isSubtree(root, sub *TreeNode) bool {
  var same func(a, b *TreeNode) bool
  same = func(a, b *TreeNode) bool {
    if a == nil && b == nil { return true }
    if a == nil || b == nil || a.Val != b.Val { return false }
    return same(a.Left, b.Left) && same(a.Right, b.Right)
  }
  if root == nil { return false }
  return same(root, sub) || isSubtree(root.Left, sub) || isSubtree(root.Right, sub)
}`,
    },
  }),
  p({
    id: 65,
    title: 'Construct Binary Tree from Preorder and Inorder',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
    approach: 'First preorder = root. Find it in inorder → split into left/right subtrees. Recurse.',
    vizLink: '/lab/bst',
    code: {
      js: `function buildTree(pre, ino) {
  const idx = new Map(ino.map((v, i) => [v, i]))
  let i = 0
  const rec = (l, r) => {
    if (l > r) return null
    const v = pre[i++], k = idx.get(v)
    return { val: v, left: rec(l, k - 1), right: rec(k + 1, r) }
  }
  return rec(0, ino.length - 1)
}`,
      ts: `function buildTree(pre: number[], ino: number[]): any {
  const idx = new Map<number, number>(ino.map((v, i) => [v, i]))
  let i = 0
  const rec = (l: number, r: number): any => {
    if (l > r) return null
    const v = pre[i++], k = idx.get(v)!
    return { val: v, left: rec(l, k - 1), right: rec(k + 1, r) }
  }
  return rec(0, ino.length - 1)
}`,
      go: `func buildTree(pre, ino []int) *TreeNode {
  idx := make(map[int]int)
  for i, v := range ino { idx[v] = i }
  i := 0
  var rec func(l, r int) *TreeNode
  rec = func(l, r int) *TreeNode {
    if l > r { return nil }
    v := pre[i]; i++; k := idx[v]
    return &TreeNode{Val: v, Left: rec(l, k-1), Right: rec(k+1, r)}
  }
  return rec(0, len(ino)-1)
}`,
    },
  }),
  p({
    id: 66,
    title: 'Validate Binary Search Tree',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/',
    approach: 'Recurse with (lo, hi) range. Each node must satisfy lo < val < hi.',
    vizLink: '/lab/bst',
    code: {
      js: `function isValidBST(root) {
  const check = (n, lo, hi) => !n || (n.val > lo && n.val < hi && check(n.left, lo, n.val) && check(n.right, n.val, hi))
  return check(root, -Infinity, Infinity)
}`,
      ts: `function isValidBST(root: any): boolean {
  const check = (n: any, lo: number, hi: number): boolean =>
    !n || (n.val > lo && n.val < hi && check(n.left, lo, n.val) && check(n.right, n.val, hi))
  return check(root, -Infinity, Infinity)
}`,
      go: `func isValidBST(root *TreeNode) bool {
  var check func(n *TreeNode, lo, hi int) bool
  check = func(n *TreeNode, lo, hi int) bool {
    if n == nil { return true }
    return n.Val > lo && n.Val < hi && check(n.Left, lo, n.Val) && check(n.Right, n.Val, hi)
  }
  return check(root, math.MinInt64, math.MaxInt64)
}`,
    },
  }),
  p({
    id: 67,
    title: 'Kth Smallest Element in a BST',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
    approach: 'In-order traversal yields sorted values. Stop at the k-th.',
    vizLink: '/lab/bst',
    code: {
      js: `function kthSmallest(root, k) {
  const stack = []; let curr = root
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left }
    curr = stack.pop()
    if (--k === 0) return curr.val
    curr = curr.right
  }
  return -1
}`,
      ts: `function kthSmallest(root: any, k: number): number {
  const stack: any[] = []; let curr = root
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left }
    curr = stack.pop()
    if (--k === 0) return curr.val
    curr = curr.right
  }
  return -1
}`,
      go: `func kthSmallest(root *TreeNode, k int) int {
  var stack []*TreeNode; curr := root
  for curr != nil || len(stack) > 0 {
    for curr != nil { stack = append(stack, curr); curr = curr.Left }
    n := len(stack) - 1; curr = stack[n]; stack = stack[:n]
    k--; if k == 0 { return curr.Val }
    curr = curr.Right
  }
  return -1
}`,
    },
  }),
  p({
    id: 68,
    title: 'Lowest Common Ancestor of a BST',
    category: 'Tree',
    difficulty: 'Easy',
    leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
    approach: 'Walk down. If both < root → left; both > root → right; else current is LCA.',
    vizLink: '/lab/bst',
    code: {
      js: `function lowestCommonAncestor(root, p, q) {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left
    else if (p.val > root.val && q.val > root.val) root = root.right
    else return root
  }
  return null
}`,
      ts: `function lowestCommonAncestor(root: any, p: any, q: any): any {
  while (root) {
    if (p.val < root.val && q.val < root.val) root = root.left
    else if (p.val > root.val && q.val > root.val) root = root.right
    else return root
  }
  return null
}`,
      go: `func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
  for root != nil {
    if p.Val < root.Val && q.Val < root.Val { root = root.Left
    } else if p.Val > root.Val && q.Val > root.Val { root = root.Right
    } else { return root }
  }
  return nil
}`,
    },
  }),
  p({
    id: 69,
    title: 'Implement Trie (Prefix Tree)',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    approach: 'Nodes with children map + terminal flag. Insert walks/creates; search walks; startsWith stops at end.',
    code: {
      js: `class Trie {
  constructor() { this.root = { c: {}, end: false } }
  insert(w) { let n = this.root; for (const ch of w) { n.c[ch] ||= { c: {}, end: false }; n = n.c[ch] } ; n.end = true }
  search(w) { let n = this.root; for (const ch of w) { if (!n.c[ch]) return false; n = n.c[ch] } ; return n.end }
  startsWith(p) { let n = this.root; for (const ch of p) { if (!n.c[ch]) return false; n = n.c[ch] } ; return true }
}`,
      ts: `class Trie {
  root: { c: Record<string, any>; end: boolean } = { c: {}, end: false }
  insert(w: string) { let n = this.root; for (const ch of w) { n.c[ch] ||= { c: {}, end: false }; n = n.c[ch] } ; n.end = true }
  search(w: string): boolean { let n = this.root; for (const ch of w) { if (!n.c[ch]) return false; n = n.c[ch] } ; return n.end }
  startsWith(p: string): boolean { let n = this.root; for (const ch of p) { if (!n.c[ch]) return false; n = n.c[ch] } ; return true }
}`,
      go: `type Trie struct { c [26]*Trie; end bool }
func Constructor() Trie { return Trie{} }
func (t *Trie) Insert(w string) {
  n := t; for i := 0; i < len(w); i++ { x := w[i] - 'a'; if n.c[x] == nil { n.c[x] = &Trie{} } ; n = n.c[x] } ; n.end = true
}
func (t *Trie) Search(w string) bool {
  n := t; for i := 0; i < len(w); i++ { x := w[i] - 'a'; if n.c[x] == nil { return false } ; n = n.c[x] } ; return n.end
}
func (t *Trie) StartsWith(p string) bool {
  n := t; for i := 0; i < len(p); i++ { x := p[i] - 'a'; if n.c[x] == nil { return false } ; n = n.c[x] } ; return true
}`,
    },
  }),
  p({
    id: 70,
    title: 'Add and Search Word (WordDictionary)',
    category: 'Tree',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
    approach: 'Trie + DFS for "." wildcard: try all child branches.',
    code: {
      js: `class WordDictionary {
  constructor() { this.root = { c: {}, end: false } }
  addWord(w) { let n = this.root; for (const ch of w) { n.c[ch] ||= { c: {}, end: false }; n = n.c[ch] } ; n.end = true }
  search(w) {
    const dfs = (n, i) => {
      if (i === w.length) return n.end
      const ch = w[i]
      if (ch === '.') return Object.values(n.c).some(child => dfs(child, i + 1))
      return n.c[ch] ? dfs(n.c[ch], i + 1) : false
    }
    return dfs(this.root, 0)
  }
}`,
      ts: `class WordDictionary {
  root: { c: Record<string, any>; end: boolean } = { c: {}, end: false }
  addWord(w: string) { let n = this.root; for (const ch of w) { n.c[ch] ||= { c: {}, end: false }; n = n.c[ch] } ; n.end = true }
  search(w: string): boolean {
    const dfs = (n: any, i: number): boolean => {
      if (i === w.length) return n.end
      const ch = w[i]
      if (ch === '.') return Object.values(n.c).some((child: any) => dfs(child, i + 1))
      return n.c[ch] ? dfs(n.c[ch], i + 1) : false
    }
    return dfs(this.root, 0)
  }
}`,
      go: `type WordDictionary struct { c [26]*WordDictionary; end bool }
func Constructor() WordDictionary { return WordDictionary{} }
func (d *WordDictionary) AddWord(w string) {
  n := d
  for i := 0; i < len(w); i++ { x := w[i] - 'a'; if n.c[x] == nil { n.c[x] = &WordDictionary{} } ; n = n.c[x] }
  n.end = true
}
func (d *WordDictionary) Search(w string) bool {
  var dfs func(n *WordDictionary, i int) bool
  dfs = func(n *WordDictionary, i int) bool {
    if i == len(w) { return n.end }
    if w[i] == '.' {
      for _, ch := range n.c { if ch != nil && dfs(ch, i+1) { return true } }
      return false
    }
    x := w[i] - 'a'; if n.c[x] == nil { return false } ; return dfs(n.c[x], i+1)
  }
  return dfs(d, 0)
}`,
    },
  }),
  p({
    id: 71,
    title: 'Word Search II',
    category: 'Tree',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/',
    approach: 'Build trie of words. DFS the board, walking the trie. Prune branches on miss.',
    vizLink: '/lab/graph',
    code: {
      js: `function findWords(board, words) {
  const root = {}
  for (const w of words) { let n = root; for (const c of w) { n[c] ||= {}; n = n[c] } ; n.word = w }
  const m = board.length, n = board[0].length, out = []
  const dfs = (i, j, node) => {
    const ch = board[i][j]
    const nx = node[ch]
    if (!nx) return
    if (nx.word) { out.push(nx.word); nx.word = null }
    board[i][j] = '#'
    if (i > 0) dfs(i-1, j, nx)
    if (i < m-1) dfs(i+1, j, nx)
    if (j > 0) dfs(i, j-1, nx)
    if (j < n-1) dfs(i, j+1, nx)
    board[i][j] = ch
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root)
  return out
}`,
      ts: `function findWords(board: string[][], words: string[]): string[] {
  const root: any = {}
  for (const w of words) { let n = root; for (const c of w) { n[c] ||= {}; n = n[c] } ; n.word = w }
  const m = board.length, n = board[0].length, out: string[] = []
  const dfs = (i: number, j: number, node: any) => {
    const ch = board[i][j]
    const nx = node[ch]
    if (!nx) return
    if (nx.word) { out.push(nx.word); nx.word = null }
    board[i][j] = '#'
    if (i > 0) dfs(i-1, j, nx)
    if (i < m-1) dfs(i+1, j, nx)
    if (j > 0) dfs(i, j-1, nx)
    if (j < n-1) dfs(i, j+1, nx)
    board[i][j] = ch
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) dfs(i, j, root)
  return out
}`,
      go: `func findWords(board [][]byte, words []string) []string {
  type Node struct { children map[byte]*Node; word string }
  root := &Node{children: make(map[byte]*Node)}
  for _, w := range words {
    n := root
    for i := 0; i < len(w); i++ {
      c := w[i]; if _, ok := n.children[c]; !ok { n.children[c] = &Node{children: make(map[byte]*Node)} }
      n = n.children[c]
    }
    n.word = w
  }
  m, k := len(board), len(board[0]); var out []string
  var dfs func(i, j int, n *Node)
  dfs = func(i, j int, n *Node) {
    if i < 0 || j < 0 || i >= m || j >= k { return }
    ch := board[i][j]; if ch == '#' { return }
    nx, ok := n.children[ch]; if !ok { return }
    if nx.word != "" { out = append(out, nx.word); nx.word = "" }
    board[i][j] = '#'; dfs(i+1, j, nx); dfs(i-1, j, nx); dfs(i, j+1, nx); dfs(i, j-1, nx); board[i][j] = ch
  }
  for i := 0; i < m; i++ { for j := 0; j < k; j++ { dfs(i, j, root) } }
  return out
}`,
    },
  }),

  // ===== HEAP =====
  p({
    id: 72,
    title: 'Merge K Sorted Lists (heap)',
    category: 'Heap',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/',
    approach: 'Min-heap of head-pointers from each list. Repeatedly pop smallest, push its next. O(N log k).',
    vizLink: '/lab/heap',
    code: {
      js: `function mergeKLists(lists) {
  const heap = lists.filter(Boolean)
  heap.sort((a, b) => a.val - b.val)
  const dummy = { next: null }; let tail = dummy
  while (heap.length) {
    const n = heap.shift(); tail.next = n; tail = n
    if (n.next) {
      let lo = 0, hi = heap.length
      while (lo < hi) { const m = (lo + hi) >> 1; if (heap[m].val < n.next.val) lo = m + 1; else hi = m }
      heap.splice(lo, 0, n.next)
    }
  }
  return dummy.next
}`,
      ts: `function mergeKLists(lists: any[]): any {
  const heap: any[] = lists.filter(Boolean)
  heap.sort((a, b) => a.val - b.val)
  const dummy: any = { next: null }; let tail = dummy
  while (heap.length) {
    const n = heap.shift(); tail.next = n; tail = n
    if (n.next) {
      let lo = 0, hi = heap.length
      while (lo < hi) { const m = (lo + hi) >> 1; if (heap[m].val < n.next.val) lo = m + 1; else hi = m }
      heap.splice(lo, 0, n.next)
    }
  }
  return dummy.next
}`,
      go: `func mergeKLists(lists []*ListNode) *ListNode {
  h := &NodeHeap{}; heap.Init(h)
  for _, l := range lists { if l != nil { heap.Push(h, l) } }
  dummy := &ListNode{}; tail := dummy
  for h.Len() > 0 {
    n := heap.Pop(h).(*ListNode); tail.Next = n; tail = n
    if n.Next != nil { heap.Push(h, n.Next) }
  }
  return dummy.Next
}`,
    },
  }),
  p({
    id: 73,
    title: 'Top K Frequent Elements',
    category: 'Heap',
    difficulty: 'Medium',
    leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
    approach: 'Count frequencies. Bucket-sort by frequency (O(n)), or min-heap of size k (O(n log k)).',
    vizLink: '/lab/heap',
    code: {
      js: `function topKFrequent(nums, k) {
  const freq = new Map()
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1)
  const buckets = Array.from({ length: nums.length + 1 }, () => [])
  for (const [n, f] of freq) buckets[f].push(n)
  const out = []
  for (let i = buckets.length - 1; i >= 0 && out.length < k; i--) out.push(...buckets[i])
  return out.slice(0, k)
}`,
      ts: `function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>()
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1)
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => [])
  for (const [n, f] of freq) buckets[f].push(n)
  const out: number[] = []
  for (let i = buckets.length - 1; i >= 0 && out.length < k; i--) out.push(...buckets[i])
  return out.slice(0, k)
}`,
      go: `func topKFrequent(nums []int, k int) []int {
  freq := make(map[int]int); for _, n := range nums { freq[n]++ }
  buckets := make([][]int, len(nums)+1)
  for n, f := range freq { buckets[f] = append(buckets[f], n) }
  var out []int
  for i := len(buckets) - 1; i >= 0 && len(out) < k; i-- {
    out = append(out, buckets[i]...)
  }
  return out[:k]
}`,
    },
  }),
  p({
    id: 74,
    title: 'Find Median from Data Stream',
    category: 'Heap',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/',
    approach: 'Two heaps: max-heap for lower half, min-heap for upper. Balance. Median = top(s).',
    vizLink: '/lab/heap',
    code: {
      js: `class MedianFinder {
  constructor() { this.lo = []; this.hi = [] }
  addNum(x) {
    this.lo.push(-x); this.lo.sort((a,b)=>a-b)
    this.hi.push(-this.lo.shift()); this.hi.sort((a,b)=>a-b)
    if (this.hi.length > this.lo.length) { this.lo.push(-this.hi.shift()); this.lo.sort((a,b)=>a-b) }
  }
  findMedian() {
    return this.lo.length > this.hi.length ? -this.lo[0] : ((-this.lo[0]) + this.hi[0]) / 2
  }
}`,
      ts: `class MedianFinder {
  lo: number[] = []; hi: number[] = []
  addNum(x: number) {
    this.lo.push(-x); this.lo.sort((a,b)=>a-b)
    this.hi.push(-this.lo.shift()!); this.hi.sort((a,b)=>a-b)
    if (this.hi.length > this.lo.length) { this.lo.push(-this.hi.shift()!); this.lo.sort((a,b)=>a-b) }
  }
  findMedian(): number {
    return this.lo.length > this.hi.length ? -this.lo[0] : ((-this.lo[0]) + this.hi[0]) / 2
  }
}`,
      go: `type MedianFinder struct { lo *MaxHeap; hi *MinHeap }
func Constructor() MedianFinder { return MedianFinder{lo: &MaxHeap{}, hi: &MinHeap{}} }
func (m *MedianFinder) AddNum(x int) {
  heap.Push(m.lo, x); heap.Push(m.hi, heap.Pop(m.lo))
  if m.hi.Len() > m.lo.Len() { heap.Push(m.lo, heap.Pop(m.hi)) }
}
func (m *MedianFinder) FindMedian() float64 {
  if m.lo.Len() > m.hi.Len() { return float64((*m.lo)[0]) }
  return (float64((*m.lo)[0]) + float64((*m.hi)[0])) / 2.0
}`,
    },
  }),
  p({
    id: 75,
    title: 'Alien Dictionary',
    category: 'Graph',
    difficulty: 'Hard',
    leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/',
    approach: "Build directed edge a→b for each adjacent word pair's first differing char. Topological sort.",
    vizLink: '/lab/graph',
    code: {
      js: `function alienOrder(words) {
  const adj = new Map(), indeg = new Map()
  for (const w of words) for (const c of w) { adj.set(c, new Set()); indeg.set(c, 0) }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1]
    if (a.length > b.length && a.startsWith(b)) return ''
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]).has(b[j])) { adj.get(a[j]).add(b[j]); indeg.set(b[j], indeg.get(b[j]) + 1) }
        break
      }
    }
  }
  const q = []
  for (const [c, d] of indeg) if (d === 0) q.push(c)
  const out = []
  while (q.length) {
    const c = q.shift(); out.push(c)
    for (const n of adj.get(c)) { indeg.set(n, indeg.get(n) - 1); if (indeg.get(n) === 0) q.push(n) }
  }
  return out.length === indeg.size ? out.join('') : ''
}`,
      ts: `function alienOrder(words: string[]): string {
  const adj = new Map<string, Set<string>>(), indeg = new Map<string, number>()
  for (const w of words) for (const c of w) { adj.set(c, new Set()); indeg.set(c, 0) }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i], b = words[i + 1]
    if (a.length > b.length && a.startsWith(b)) return ''
    for (let j = 0; j < Math.min(a.length, b.length); j++) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j])!.has(b[j])) { adj.get(a[j])!.add(b[j]); indeg.set(b[j], indeg.get(b[j])! + 1) }
        break
      }
    }
  }
  const q: string[] = []
  for (const [c, d] of indeg) if (d === 0) q.push(c)
  const out: string[] = []
  while (q.length) {
    const c = q.shift()!; out.push(c)
    for (const n of adj.get(c)!) { indeg.set(n, indeg.get(n)! - 1); if (indeg.get(n) === 0) q.push(n) }
  }
  return out.length === indeg.size ? out.join('') : ''
}`,
      go: `func alienOrder(words []string) string {
  adj := make(map[byte]map[byte]bool); indeg := make(map[byte]int)
  for _, w := range words { for i := 0; i < len(w); i++ { adj[w[i]] = map[byte]bool{}; indeg[w[i]] = 0 } }
  for i := 0; i < len(words)-1; i++ {
    a, b := words[i], words[i+1]
    if len(a) > len(b) && strings.HasPrefix(a, b) { return "" }
    for j := 0; j < min(len(a), len(b)); j++ {
      if a[j] != b[j] {
        if !adj[a[j]][b[j]] { adj[a[j]][b[j]] = true; indeg[b[j]]++ }
        break
      }
    }
  }
  var q []byte
  for c, d := range indeg { if d == 0 { q = append(q, c) } }
  var out []byte
  for len(q) > 0 {
    c := q[0]; q = q[1:]; out = append(out, c)
    for n := range adj[c] { indeg[n]--; if indeg[n] == 0 { q = append(q, n) } }
  }
  if len(out) == len(indeg) { return string(out) }
  return ""
}`,
    },
  }),
]

// Helpers for filter UI
export const allCategories: Category[] = [
  'Array', 'Binary', 'Dynamic Programming', 'Graph',
  'Interval', 'Linked List', 'Matrix', 'String', 'Tree', 'Heap',
]

export const allDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard']
