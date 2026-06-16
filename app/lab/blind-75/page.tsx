import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { Blind75Viz } from '@/components/lab/blind-75/blind75-viz'

export const metadata: Metadata = {
  title: 'Blind 75 — LeetCode interview tracker (JS · TS · Go)',
  description:
    'The canonical Blind 75 LeetCode list — all 75 problems with TypeScript, JavaScript, and Go solutions inline, plus links into matching algorithm visualizers.',
}

export default function Blind75Page() {
  return (
    <VizShell
      eyebrow="DSA · Blind 75"
      title="Blind 75"
      subtitle="The canonical 75-problem LeetCode interview list. Every entry has a one-line approach, three idiomatic solutions (TypeScript, JavaScript, Go), a direct LeetCode link, and — where one exists — a jump into the matching algorithm visualizer."
    >
      <Blind75Viz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            How to use this list
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Don&apos;t grind 500 problems. Grind these 75 — but grind them
            until you can re-derive each one cold.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              The 10 patterns
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1.5">
              <li>
                <strong className="text-ink font-medium">Array</strong> &mdash;
                two pointers, sliding window, prefix product
              </li>
              <li>
                <strong className="text-ink font-medium">Binary</strong> &mdash;
                bit manipulation, sum without `+`
              </li>
              <li>
                <strong className="text-ink font-medium">DP</strong> &mdash;
                1D / 2D tables, decode ways, edit distance
              </li>
              <li>
                <strong className="text-ink font-medium">Graph</strong> &mdash;
                DFS / BFS, topological sort, union-find
              </li>
              <li>
                <strong className="text-ink font-medium">Interval</strong>{' '}
                &mdash; sort by start, merge overlap, meeting rooms
              </li>
              <li>
                <strong className="text-ink font-medium">Linked List</strong>{' '}
                &mdash; dummy heads, slow/fast pointers, reverse
              </li>
              <li>
                <strong className="text-ink font-medium">Matrix</strong> &mdash;
                rotate in place, spiral, set-zero mark rows
              </li>
              <li>
                <strong className="text-ink font-medium">String</strong> &mdash;
                expand around center, sliding window, anagram via Map
              </li>
              <li>
                <strong className="text-ink font-medium">Tree</strong> &mdash;
                recursion, BFS levels, DFS path, BST invariants
              </li>
              <li>
                <strong className="text-ink font-medium">Heap</strong> &mdash;
                top-K, median (two heaps), merge K lists
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Suggested cadence
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1.5">
              <li>
                <strong className="text-ink font-medium">Week 1&ndash;2</strong>{' '}
                &mdash; Arrays + Strings (20 problems). Most interview rounds
                live here.
              </li>
              <li>
                <strong className="text-ink font-medium">Week 3</strong> &mdash;
                Linked List + Tree (20 problems). Build pointer intuition.
              </li>
              <li>
                <strong className="text-ink font-medium">Week 4</strong> &mdash;
                Graph + Heap + Interval (14 problems). Pattern muscle.
              </li>
              <li>
                <strong className="text-ink font-medium">Week 5</strong> &mdash;
                DP + Matrix + Binary (21 problems). Hardest last.
              </li>
              <li>
                <strong className="text-ink font-medium">Week 6</strong> &mdash;
                Re-do all 75 from scratch. If you can&apos;t finish one in 25
                min, re-study its pattern.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
