import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { FiberViz } from '@/components/lab/react-fiber/fiber-viz'

export const metadata: Metadata = {
  title: 'React Fiber Reconciliation',
  description:
    'Watch which components re-render when state changes, and how React.memo + useCallback change the cascade. Four step-by-step scenarios.',
}

export default function ReactFiberPage() {
  return (
    <VizShell
      eyebrow="React · Internals"
      title="Fiber Reconciliation"
      subtitle="When you call setState, React doesn't refresh the whole tree — it walks downward from the owning component. The default behavior re-renders everything beneath it. React.memo and useCallback let you carve out subtrees. Watch four scenarios that explain why your optimization works (or quietly doesn't)."
    >
      <FiberViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The rule
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;State change re-renders the owning component and every
            descendant. <em>Unless</em> React.memo finds the props unchanged.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            That&apos;s the mental model. The corollary is that an unmemoized
            parent &mdash; or a memo&apos;d parent with unstable props &mdash; leaks
            re-renders into its entire subtree. Most React perf bugs are exactly
            this leak.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              When memoization helps
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                The subtree is <strong className="text-ink font-medium">large</strong>{' '}
                (lists with many items, complex layouts).
              </li>
              <li>
                The component is <strong className="text-ink font-medium">expensive</strong>{' '}
                to render (heavy computation, chart libraries, large JSX).
              </li>
              <li>
                Props are <strong className="text-ink font-medium">already stable</strong>{' '}
                or easy to stabilize with useCallback / useMemo / state lifting.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              When it doesn&apos;t
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                Component is <strong className="text-ink font-medium">cheap</strong>{' '}
                &mdash; memo overhead can outweigh the saved render.
              </li>
              <li>
                Props change <strong className="text-ink font-medium">every render</strong>{' '}
                (inline functions, inline objects, new arrays). Memo
                comparison fails, child re-renders anyway, you paid for the check
                for nothing.
              </li>
              <li>
                You&apos;re using <strong className="text-ink font-medium">React Compiler</strong>{' '}
                &mdash; it auto-memoizes safe call-sites, often making manual
                memo unnecessary.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Knowing <em>when not to memoize</em> is a stronger signal than
              knowing how. Senior engineers describe the trade-off; juniors reach
              for useMemo on everything.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
