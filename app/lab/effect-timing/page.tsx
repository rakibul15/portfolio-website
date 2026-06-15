import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { EffectViz } from '@/components/lab/effect-timing/effect-viz'

export const metadata: Metadata = {
  title: 'useEffect vs useLayoutEffect',
  description:
    'Where each hook fires in the React lifecycle, and why the difference shows up as visible flicker in real apps.',
}

export default function EffectTimingPage() {
  return (
    <VizShell
      eyebrow="React · Hooks"
      title="useEffect vs useLayoutEffect"
      subtitle="Both hooks run after React commits — but on opposite sides of the browser paint. useEffect runs asynchronously, after the user sees the new DOM. useLayoutEffect runs synchronously, blocking paint until it finishes. Step through four scenarios, including the classic flicker bug that justifies useLayoutEffect's existence."
    >
      <EffectViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The picture
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Both hooks run after commit. useLayoutEffect runs <em>before</em>{' '}
            the user sees anything; useEffect runs <em>after</em>.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            That&apos;s the whole rule. Everything else &mdash; flicker, blocking,
            cleanup ordering &mdash; falls out of it.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Use useLayoutEffect for
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">DOM measurement</strong> +
                immediate style adjustment (tooltips, popovers, auto-scroll to bottom).
              </li>
              <li>
                <strong className="text-ink font-medium">Reading scroll position</strong>{' '}
                before paint to avoid layout jumps.
              </li>
              <li>
                <strong className="text-ink font-medium">Synchronizing imperative APIs</strong>{' '}
                (chart libraries, refs to third-party widgets) where a one-frame
                lag is visible.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Use useEffect for
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">Data fetching</strong>,
                subscriptions, timers.
              </li>
              <li>
                <strong className="text-ink font-medium">Logging</strong>, analytics,
                anything the user shouldn&apos;t wait on.
              </li>
              <li>
                Default choice &mdash; reach for useLayoutEffect only when you
                actually see flicker.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">SSR</strong>:
                useLayoutEffect throws a warning on the server (no DOM to measure).
                Use{' '}
                <code className="font-mono text-[12px] text-ink">
                  useIsomorphicLayoutEffect
                </code>{' '}
                or move the effect into a client-only component.
              </li>
              <li>
                <strong className="text-ink font-medium">Heavy work</strong> in
                useLayoutEffect blocks paint. The page freezes. Same callback in
                useEffect would let the user see something first.
              </li>
              <li>
                <strong className="text-ink font-medium">React 19 + Strict Mode</strong>:
                both effects run twice in dev. Cleanup is critical &mdash; otherwise
                you double-subscribe.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
