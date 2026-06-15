import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { HeapViz } from '@/components/lab/heap/heap-viz'

export const metadata: Metadata = {
  title: 'Heap',
  description:
    'Insert (sift up), extract (sift down), O(n) heapify, and top-K with a min-heap — animated step-by-step with dual tree + array view. TS + Go.',
}

export default function HeapPage() {
  return (
    <VizShell
      eyebrow="Data Structures · Heap"
      title="Heap"
      subtitle="A heap is an array pretending to be a complete binary tree. For index i, the parent is (i−1)≫1 and the children are 2i+1, 2i+2. Watch the array and the tree side-by-side as we sift up, sift down, heapify in O(n), and use a min-heap to find the top K in a stream."
    >
      <HeapViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The trick
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;A heap stores a tree inside an array. The indices ARE the
            parent / child relationships.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            For index <code className="font-mono text-[12px] text-ink">i</code>:
            parent = <code className="font-mono text-[12px] text-ink">(i − 1) ≫ 1</code>,
            left child = <code className="font-mono text-[12px] text-ink">2i + 1</code>,
            right child = <code className="font-mono text-[12px] text-ink">2i + 2</code>.
            That&apos;s the whole abstraction. Everything else is two functions
            — sift up and sift down.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Max-heap vs Min-heap
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Max-heap</strong>: parent
              ≥ children (root is the max). Used for sorted-by-priority
              extraction.{' '}
              <strong className="text-ink font-medium">Min-heap</strong>: parent
              ≤ children (root is the min). Used for top-K largest (the heap
              holds the K largest, the min of them sits at root for fast
              ejection).
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why heapify is O(n), not O(n log n)
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Insert-one-at-a-time would be O(n log n). Bottom-up heapify works
              because <strong className="text-ink font-medium">most nodes are
              near the bottom</strong> and need very few siftDown steps. The
              math: sum over depths d of (n / 2^(d+1)) × d = O(n).
              Counter-intuitive but true.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Real-world uses
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">Dijkstra&apos;s</strong>{' '}
                shortest path — priority queue of next-closest nodes
              </li>
              <li>
                <strong className="text-ink font-medium">Top-K problems</strong> —
                trending tweets, leaderboard, &quot;n most expensive items&quot;
              </li>
              <li>
                <strong className="text-ink font-medium">Scheduling</strong> —
                event loops, OS process schedulers, animation frames
              </li>
              <li>
                <strong className="text-ink font-medium">Median</strong> of a
                stream — two heaps (max-heap for lower half, min-heap for upper
                half)
              </li>
              <li>
                <strong className="text-ink font-medium">Heap sort</strong> —
                heapify + repeatedly extract = O(n log n) in-place sort
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Heap problems test whether you can recognize when O(n log K)
              beats O(n log n) sorting — a classic intermediate-to-senior
              signal. JavaScript doesn&apos;t ship a built-in priority queue
              (yet), so &quot;implement a min-heap&quot; is a fair
              follow-up.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
