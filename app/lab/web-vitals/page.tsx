import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { WebVitalsViz } from '@/components/lab/web-vitals/web-vitals-viz'

export const metadata: Metadata = {
  title: 'Core Web Vitals',
  description:
    'Three before/after walkthroughs of the LCP, INP, and CLS metrics — what causes each, what fixes them, and what the score looks like in practice.',
}

export default function WebVitalsPage() {
  return (
    <VizShell
      eyebrow="Performance · CWV"
      title="Core Web Vitals"
      subtitle="The three vitals — LCP (loading), INP (interactivity, replaced FID in 2024), and CLS (visual stability). Each scenario walks through a default-poor outcome, applies the canonical fix, and runs again with a passing score."
    >
      <WebVitalsViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The thresholds
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Good is the 75th-percentile experience &mdash; not the median,
            not the worst case.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Google scores you against the 75th percentile of real-user
            measurements over a 28-day rolling window. A test on your laptop
            doesn&apos;t represent your users in Sylhet on a mid-tier Android
            phone &mdash; only RUM data does.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              LCP — Largest Contentful Paint
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              When the largest above-the-fold element finishes painting. Good
              &le; 2.5s, poor &gt; 4s. Common LCP elements: hero images, large
              text blocks, video posters. Fixes: preload hint, priority hint,
              CDN, image format (AVIF / WebP), eliminate render-blocking CSS / JS.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              INP — Interaction to Next Paint
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Time from user input to the next visible paint. Replaced FID in
              March 2024. Good &le; 200ms, poor &gt; 500ms. Caused by long
              tasks, expensive React renders, hydration cost. Fixes:{' '}
              <code className="font-mono text-[12px] text-ink">useDeferredValue</code>,{' '}
              <code className="font-mono text-[12px] text-ink">useTransition</code>,{' '}
              <code className="font-mono text-[12px] text-ink">scheduler.yield()</code>,
              debouncing, code splitting.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              CLS — Cumulative Layout Shift
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Sum of unexpected layout shifts during the page&apos;s lifetime.
              Good &le; 0.1, poor &gt; 0.25. Sources: images / iframes /
              ads without dimensions, web fonts (FOUT), late-injected content,
              dynamic ad slots. Fixes: width + height attributes, CSS{' '}
              <code className="font-mono text-[12px] text-ink">aspect-ratio</code>,{' '}
              <code className="font-mono text-[12px] text-ink">font-display: optional</code>,
              reserve ad-slot space at SSR.
            </p>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              The vitals are the closest thing the FE world has to a shared
              quality bar. Senior candidates can name the thresholds, the common
              causes, and at least one concrete fix per vital.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
