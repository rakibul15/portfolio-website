import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { EventLoopViz } from '@/components/lab/event-loop/event-loop-viz'

export const metadata: Metadata = {
  title: 'Event Loop',
  description:
    'Step through the JavaScript event loop — call stack, microtask queue, and macrotask queue — with annotated examples.',
}

export default function EventLoopPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Async"
      title="Event Loop"
      subtitle="The runtime model behind every Promise, setTimeout, and async function. Step through three examples and watch how the call stack, microtask queue, and macrotask queue interact."
    >
      <EventLoopViz />

      {/* Concept callout */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The rule in one sentence
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Run all synchronous code. Drain microtasks until empty. Run one
            macrotask. Repeat.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Microtasks
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Promise callbacks, <code className="font-mono text-[12px] text-ink">queueMicrotask</code>,
              and <code className="font-mono text-[12px] text-ink">MutationObserver</code>.
              The queue is fully drained before the next macrotask &mdash; even if new
              microtasks are added mid-drain.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Macrotasks
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <code className="font-mono text-[12px] text-ink">setTimeout</code>,
              <code className="font-mono text-[12px] text-ink"> setInterval</code>, I/O,
              UI events, <code className="font-mono text-[12px] text-ink">postMessage</code>.
              Exactly one runs per loop iteration.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Predicting output order separates engineers who memorize from those who
              understand. The model also explains <em>why</em>{' '}
              <code className="font-mono text-[12px] text-ink">setTimeout(fn, 0)</code>{' '}
              is never truly zero &mdash; it waits for the microtask drain.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
