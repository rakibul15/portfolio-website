import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { AlgorithmsViz } from '@/components/lab/algorithms/algorithms-viz'

export const metadata: Metadata = {
  title: 'Algorithm Patterns',
  description:
    'Four interview-classic patterns stepped through visually — sliding window, two pointers, binary search, and BFS on a grid.',
}

export default function AlgorithmsPage() {
  return (
    <VizShell
      eyebrow="DSA · Patterns"
      title="Algorithm Patterns"
      subtitle="Most algorithm interview questions are variations on a handful of patterns. Step through four classics — sliding window, two pointers, binary search, and BFS on a grid — and watch the indices, queues, and search ranges move in real time."
    >
      <AlgorithmsViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            How to recognize each pattern
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;The faster you can name the pattern, the faster you find the
            solution. Drill recognition over implementation.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Each pattern below has a signature in the problem statement. Memorize
            the signatures and 80% of LeetCode-mediums become 5-minute problems.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Sliding window
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Signal:</strong> &ldquo;longest
              / shortest / count of contiguous subarrays/substrings satisfying X&rdquo;.
              Two pointers (left, right) both moving forward; right expands, left
              shrinks on violation.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Two pointers
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Signal:</strong> sorted array
              + &ldquo;find pair / triple / partition&rdquo;. Pointers at opposite
              ends moving inward. Variants: in-place partitioning (move zeros, dutch flag).
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Binary search
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Signal:</strong> sorted array,
              OR a monotonic predicate over a range (&ldquo;smallest k such that
              feasible(k) is true&rdquo;). Time goes from O(n) to O(log n).
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              BFS / DFS on grid or graph
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Signal:</strong> 2D grid +
              &ldquo;connected regions&rdquo;, &ldquo;shortest path in unweighted&rdquo;,
              dependency order, cycle detection. BFS for shortest distance; DFS for
              connectivity or cycle.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Patterns this lab doesn&apos;t cover
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Dynamic programming, backtracking, monotonic stack, trie, union-find,
              topological sort. These appear at FAANG-tier interviews but are less
              common at BD market roles. The{' '}
              <code className="font-mono text-[12px] text-ink">06-dsa-frontend</code>{' '}
              prep doc has worked examples for each.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
