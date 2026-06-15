import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { DPViz } from '@/components/lab/dp/dp-viz'

export const metadata: Metadata = {
  title: 'Dynamic Programming',
  description:
    'Climbing stairs (1D), house robber (1D), and edit distance (2D) — watch the DP table fill cell-by-cell with the formula at every step.',
}

export default function DPPage() {
  return (
    <VizShell
      eyebrow="DSA · Dynamic Programming"
      title="Dynamic Programming"
      subtitle="DP is just memoized recursion expressed as a table. Each cell's value depends only on smaller subproblems. Build the table from the base cases outward, and your final answer is one of the cells. Watch three classics — two 1D, one 2D — fill in real time."
    >
      <DPViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The DP recipe
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;State + transition + base cases. If you can name those three,
            you can solve the problem.&rdquo;
          </p>
          <ol className="text-[14px] text-muted leading-[1.75] font-light mt-6 list-decimal pl-5 space-y-2">
            <li>
              <strong className="text-ink font-medium">State</strong> — what does
              dp[i] (or dp[i][j]) MEAN? Write a sentence first.
            </li>
            <li>
              <strong className="text-ink font-medium">Transition</strong> — how
              do you compute dp[i] from previous cells?
            </li>
            <li>
              <strong className="text-ink font-medium">Base cases</strong> — the
              smallest subproblem(s) you can answer directly.
            </li>
            <li>
              <strong className="text-ink font-medium">Order of fill</strong> —
              make sure dependencies are computed before they&apos;re needed.
            </li>
            <li>
              <strong className="text-ink font-medium">Answer location</strong> —
              which cell holds the final result?
            </li>
          </ol>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              When DP beats brute force
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              When the recursive solution has{' '}
              <strong className="text-ink font-medium">overlapping subproblems</strong>{' '}
              (climbing stairs naive = O(2ⁿ) because it recomputes the same fib
              numbers over and over). Memoization or tabulation collapses it to
              O(n).
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              When NOT to DP
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Greedy beats DP when the local choice is provably globally optimal
              (activity selection, Huffman). Divide-and-conquer when subproblems
              don&apos;t overlap (merge sort). DP only when you find yourself
              re-computing the same subproblem.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Space optimization trick
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              If dp[i] only reads dp[i-1] and dp[i-2], you don&apos;t need the
              full array — two rolling variables suffice. Climbing stairs and
              House Robber both shrink from O(n) to O(1) space this way. For 2D
              DP that only reads the previous row, you can shrink to O(min(m, n))
              space.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              The senior signal
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Saying &quot;this is DP&quot; out loud, then explaining the state +
              transition BEFORE coding. Most candidates write code then explain
              backwards. Explaining first signals you can reason about the
              structure, not just memorize patterns.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
