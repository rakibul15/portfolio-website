import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { AsyncViz } from '@/components/lab/async-patterns/async-viz'

export const metadata: Metadata = {
  title: 'Async & Concurrency Patterns',
  description:
    'Timeline-based walkthroughs of the six async patterns every senior JS engineer should know — debounce, throttle, Promise.all, Promise.race, Promise pool, AbortController.',
}

export default function AsyncPatternsPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Async"
      title="Async Patterns"
      subtitle="The six async patterns that show up in every senior frontend interview. Each scenario plays out on a swim-lane timeline so you can see exactly when each function is invoked, which calls overlap, and what gets cancelled. JS implementation paired with the idiomatic Go equivalent."
    >
      <AsyncViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            Pattern picker
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Debounce when you want the <em>last</em> event. Throttle when
            you want events at a <em>steady rate</em>.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            That one sentence covers 80% of the rate-limiting decisions you&apos;ll
            make. The rest is about parallelism and cancellation.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Debounce vs Throttle
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">Debounce</strong> — fires
                after the user stops. Use for: search-as-you-type, validate-on-blur,
                save drafts.
              </li>
              <li>
                <strong className="text-ink font-medium">Throttle</strong> — fires
                at a max rate. Use for: scroll handlers, mouse-move, infinite scroll
                trigger, analytics ping.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Promise combinators
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <code className="font-mono text-[12px] text-ink">Promise.all</code>{' '}
                — all-or-nothing. First rejection short-circuits.
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">Promise.allSettled</code>{' '}
                — wait for everything, never rejects. (Not in this lab — easy
                variant of `all`.)
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">Promise.race</code>{' '}
                — first to settle wins. Useful for timeouts, but losers keep
                running.
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">Promise.any</code>{' '}
                — first to <em>fulfill</em> wins; rejections are aggregated.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Concurrency limits
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              A <strong className="text-ink font-medium">pool</strong> is the
              middle ground between &ldquo;all serial&rdquo; (too slow) and
              &ldquo;all parallel&rdquo; (rate-limited, OOM, server hammered). 3-10
              concurrent uploads is usually the sweet spot for end-user APIs.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Cancellation
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <code className="font-mono text-[12px] text-ink">AbortController</code>{' '}
              (browser) and <code className="font-mono text-[12px] text-ink">context.Context</code>{' '}
              (Go) are the same idea: a signal you pass to long-running operations
              so they can stop on demand. The canonical fix for stale-response
              race conditions in search-as-you-type.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              &ldquo;Implement debounce&rdquo; is the single most-asked JS interview
              question across BD and international markets. Being able to draw the
              timeline AS you explain it is the senior signal.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
