import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { TrickyViz } from '@/components/lab/tricky-outputs/tricky-viz'

export const metadata: Metadata = {
  title: 'Tricky Outputs',
  description:
    'Six classic "what does this print?" JS interview gotchas. Predict, reveal, then walk through the reasoning step-by-step.',
}

export default function TrickyOutputsPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Gotchas"
      title="Tricky Outputs"
      subtitle="Six classic 'what does this print?' interview questions. The format: code on top, predict in your head, step forward to reveal, then walk through the why. The ones that come up in screens are the same six topics: coercion, typeof, hoisting, `this`, mutation, microtask ordering."
    >
      <TrickyViz />
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">How to approach these in an interview</div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Trace through aloud. Senior signal isn&apos;t knowing the answer — it&apos;s having a process that arrives at the answer.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">The 6 traps, summarized</div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li><strong className="text-ink font-medium">==</strong> triggers multi-step coercion. Use ===.</li>
              <li><strong className="text-ink font-medium">typeof null</strong> is &quot;object&quot; — historical bug.</li>
              <li><strong className="text-ink font-medium">var</strong> hoists the binding (undefined) but not the assignment.</li>
              <li><strong className="text-ink font-medium">this</strong> is decided at the call site. setTimeout / addEventListener default to undefined (strict). Use arrows.</li>
              <li><strong className="text-ink font-medium">Array mutation</strong>: sort, reverse, splice, push, pop, shift, unshift, fill mutate. slice, map, filter, reduce don&apos;t.</li>
              <li><strong className="text-ink font-medium">Microtasks drain</strong> fully between macrotasks. Promise.then beats setTimeout(0).</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">When you get one wrong</div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Don&apos;t panic. Senior interviewers care about your trace, not your gut answer. Say: &quot;Let me walk through it carefully&quot; — start at line 1, narrate the engine&apos;s steps, get to the right answer slowly. That earns the same signal as instant correctness.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
