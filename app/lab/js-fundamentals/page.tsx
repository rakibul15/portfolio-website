import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { JSFundamentalsViz } from '@/components/lab/js-fundamentals/js-fundamentals-viz'

export const metadata: Metadata = {
  title: 'JavaScript Fundamentals',
  description:
    'The JS interview essentials, visualized — closures, currying, hoisting, `this` binding, and the prototype chain. Watch scope chains, partial-application chains, and prototype-lookup walks in real time.',
}

export default function JSFundamentalsPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Language"
      title="JS Fundamentals"
      subtitle="The five JS concepts that come up in every senior frontend interview. Closures, currying, hoisting, `this` binding, and the prototype chain — each animated as the runtime would actually walk through your code."
    >
      <JSFundamentalsViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The single mental model
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Variable resolution walks UP the scope chain. Property
            resolution walks UP the prototype chain. `this` is decided at the
            call site.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Three of the five concepts on this page are variations on the same
            theme: lookup walks. Once you see them as the same thing, half of
            JS&apos;s &quot;weird&quot; behavior stops being weird.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Closures, in one sentence
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              A function holds a reference to the scope where it was defined.
              That scope outlives its enclosing function call. Use closures
              for: private state (the counter pattern), partial application,
              factory functions, module-pattern privacy.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Currying = closures, twice
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Each partial application produces a function closed over the args
              collected so far. The chain only collapses when arity is
              satisfied. Useful for: pre-binding config (
              <code className="font-mono text-[12px] text-ink">
                createLogger(level)(message)
              </code>
              ), function pipelines, point-free composition.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Hoisting cheatsheet
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1">
              <li>
                <code className="font-mono text-[12px] text-ink">var</code> —
                hoisted as <code className="font-mono text-[12px] text-ink">undefined</code>
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">function</code>{' '}
                declarations — hoisted with body (callable above source line)
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">let</code> /
                <code className="font-mono text-[12px] text-ink"> const</code> —
                hoisted but in TDZ until the declaration line
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">class</code> —
                same as let/const (TDZ)
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              The 4 `this` rules, in priority
            </div>
            <ol className="text-[14px] text-muted leading-[1.75] font-light space-y-1 list-decimal pl-5">
              <li>
                <code className="font-mono text-[12px] text-ink">new Person()</code>{' '}
                — fresh empty object
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">
                  fn.call(ctx) / .apply / .bind
                </code>{' '}
                — explicit
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">obj.method()</code>{' '}
                — implicit (object before the dot)
              </li>
              <li>
                Bare call <code className="font-mono text-[12px] text-ink">fn()</code>{' '}
                — undefined (strict) or window (sloppy)
              </li>
            </ol>
            <p className="text-[13px] text-muted leading-[1.7] font-light mt-2">
              Arrow functions ignore all of this — they inherit{' '}
              <code className="font-mono text-[12px] text-ink">this</code> from
              the enclosing scope at declaration time.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              These five concepts produce the &quot;tricky output&quot; questions
              that fill phone screens. Knowing them in your bones means you
              don&apos;t guess — you trace through. Trace through aloud in the
              interview; that&apos;s the senior signal.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
