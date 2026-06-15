import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { GraphViz } from '@/components/lab/graph/graph-viz'

export const metadata: Metadata = {
  title: 'Graph',
  description:
    'BFS, DFS, topological sort (Kahn\'s), and cycle detection (3-color DFS) on real graphs — visualized step-by-step. TS + Go.',
}

export default function GraphPage() {
  return (
    <VizShell
      eyebrow="Data Structures · Graph"
      title="Graph"
      subtitle="A graph is a set of nodes connected by edges. Real graphs aren't grids — they're irregular shapes, sometimes directed, sometimes cyclic. Watch four canonical algorithms — BFS, DFS, topological sort, and cycle detection — on graphs designed to make each lesson obvious."
    >
      <GraphViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            BFS vs DFS — which to pick
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;BFS for shortest paths and level-by-level questions. DFS for
            connectivity, cycles, topological order, and anything where the
            recursion structure does the work.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Both walk every node and every edge once → O(V + E). They differ in
            <strong className="text-ink font-medium"> order</strong>, not cost.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Topological sort gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                Only works on a <strong className="text-ink font-medium">DAG</strong>{' '}
                (directed acyclic graph). If a cycle exists, no topological order.
              </li>
              <li>
                Kahn&apos;s output length &lt; total nodes ⇒ cycle detected
                &mdash; bonus property of the algorithm.
              </li>
              <li>
                Multiple valid orders are usually possible. Kahn&apos;s gives one
                deterministic order (the FIFO of indegree-0 nodes).
              </li>
              <li>
                Real-world use: <code className="font-mono text-[12px] text-ink">npm install</code>{' '}
                resolving dependency order, Webpack module graph, course
                prerequisites, build systems, async task scheduling.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              3-color DFS for cycle detection
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              In a <strong className="text-ink font-medium">directed</strong>{' '}
              graph, &quot;already visited&quot; isn&apos;t enough — you have to
              distinguish nodes on the current DFS path (gray) from finished
              ones (black). A gray-gray edge is a back edge = cycle. Common
              interview question: &quot;Can you finish all courses?&quot; (LC
              207).
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Representation choices
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">Adjacency list</strong>{' '}
              (Map of node → neighbors) for sparse graphs — what 95% of FE
              problems use.{' '}
              <strong className="text-ink font-medium">Adjacency matrix</strong>{' '}
              (2D boolean array) for dense graphs or O(1) edge lookups. Edge
              list for tiny inputs or when you stream from a file.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Real-world FE graphs
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              The DOM is a tree (special graph). React&apos;s render dependency
              graph is a DAG. The browser&apos;s back / forward history is a
              graph. Routing tables, social-graph traversals (mutuals, friends
              of friends), and CSS specificity calculations are all graph
              problems wearing different clothes.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Graph problems are the &quot;reveal the abstraction&quot;
              category &mdash; the question is rarely about a graph on the
              surface (&quot;courses&quot;, &quot;packages&quot;, &quot;words
              that differ by one letter&quot;). Recognizing the underlying graph
              is the test.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
