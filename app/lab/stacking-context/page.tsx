import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { StackingViz } from '@/components/lab/stacking-context/stacking-viz'
import { CONTEXT_CREATORS } from '@/lib/lab/stacking-context-data'

export const metadata: Metadata = {
  title: 'Stacking Context',
  description:
    'Why your z-index: 9999 isn\'t working — visualized. Four scenarios showing what creates a stacking context and how to escape one.',
}

export default function StackingContextPage() {
  return (
    <VizShell
      eyebrow="CSS · Layout"
      title="Stacking Context"
      subtitle="z-index doesn't compare elements globally — it compares them within the same stacking context. Certain CSS properties silently create new contexts, trapping a child's z-index inside. Walk four scenarios that explain why your modal is hidden and how to free it."
    >
      <StackingViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The rule
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;z-index only compares elements <em>within the same stacking
            context</em>. A child can never beat an outside element that beats
            its parent.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            That&apos;s the whole rule. A nested element with{' '}
            <code className="font-mono text-[12px] text-ink">z-index: 9999</code>{' '}
            still loses to an outside element with{' '}
            <code className="font-mono text-[12px] text-ink">z-index: 1</code>{' '}
            if the nested element&apos;s ancestor created a new context.
          </p>

          <div className="mt-8">
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-3">
              The fix
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Three options, in order of preference:
            </p>
            <ol className="text-[14px] text-muted leading-[1.75] font-light space-y-2 mt-3 list-decimal pl-5">
              <li>
                <strong className="text-ink font-medium">Portal</strong> the
                element out of its ancestor (
                <code className="font-mono text-[12px] text-ink">
                  React.createPortal
                </code>
                ). Cleanest fix for modals, tooltips, popovers.
              </li>
              <li>
                <strong className="text-ink font-medium">Don&apos;t create</strong>{' '}
                the trap in the first place. Audit the ancestors for opacity /
                transform / filter / mix-blend-mode. Remove what isn&apos;t needed.
              </li>
              <li>
                <strong className="text-ink font-medium">Embrace the scope</strong>{' '}
                with{' '}
                <code className="font-mono text-[12px] text-ink">
                  isolation: isolate
                </code>{' '}
                on a wrapper, then manage z-index inside that scope. Useful for
                widgets shipped into unknown host apps.
              </li>
            </ol>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-3">
            CSS properties that create a stacking context
          </div>
          <p className="text-[14px] text-muted leading-[1.7] font-light mb-5">
            Memorize the surprising ones. They&apos;re the cause of 95% of the
            bugs:
          </p>
          <div className="border border-stroke">
            {CONTEXT_CREATORS.map((c, i) => (
              <div
                key={c.rule}
                className={`px-4 py-3 flex items-start justify-between gap-4 ${
                  i < CONTEXT_CREATORS.length - 1 ? 'border-b border-stroke' : ''
                }`}
              >
                <code className="font-mono text-[12px] text-ink tracking-[0.02em] leading-tight shrink-0">
                  {c.rule}
                </code>
                <span className="font-mono text-[10px] text-muted tracking-[0.02em] leading-snug text-right">
                  {c.cond}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Every senior frontend engineer has spent hours debugging this
              once. Knowing the rule prevents the next loss. The textbook answer
              also signals you actually read MDN at some point.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
