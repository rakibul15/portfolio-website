import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { CachingViz } from '@/components/lab/nextjs-caching/caching-viz'

export const metadata: Metadata = {
  title: 'Next.js Caching Layers',
  description:
    'Step through the four caches that power the Next.js App Router — Router, Full Route, Request Memoization, and Data Cache — with realistic scenarios.',
}

export default function NextjsCachingPage() {
  return (
    <VizShell
      eyebrow="Next.js · Performance"
      title="Caching Layers"
      subtitle="The Next.js App Router has four overlapping caches. Most senior frontend candidates can name them but stumble on what each invalidates. Step through five real scenarios — cold cache, warm Link nav, hard refresh, revalidateTag, and fetch deduplication — and watch where the request actually goes."
    >
      <CachingViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The mental model
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;A request walks <em>down</em> looking for a hit, and the
            response walks <em>back up</em> filling each cache on the way.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Two caches live on the <strong className="text-ink font-medium">client</strong>{' '}
            (Router) and three on the{' '}
            <strong className="text-ink font-medium">server</strong> (Full Route,
            Request Memoization, Data). Memoization is a React feature that Next.js
            inherits &mdash; the other three are Next.js features.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Which invalidation does what
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <code className="font-mono text-[12px] text-ink">
                  revalidateTag(tag)
                </code>{' '}
                &mdash; clears Data Cache entries with that tag, cascades to Full
                Route Cache entries that depended on them.
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">
                  revalidatePath(path)
                </code>{' '}
                &mdash; clears the Full Route Cache for that path. Data Cache
                untouched unless paired with tags.
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">router.refresh()</code>{' '}
                &mdash; client-side. Drops Router Cache for the current route and
                re-fetches from the server.
              </li>
              <li>
                Hard refresh &mdash; clears Router Cache only. Server caches
                untouched.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Opting out of the Data Cache
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Use{' '}
              <code className="font-mono text-[12px] text-ink">
                fetch(url, &#123; cache: &apos;no-store&apos; &#125;)
              </code>{' '}
              for always-fresh data, or{' '}
              <code className="font-mono text-[12px] text-ink">
                &#123; next: &#123; revalidate: 60 &#125; &#125;
              </code>{' '}
              for time-based stale-while-revalidate.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              The cache model explains why your edit didn&apos;t show up, why
              static routes feel instant, and why two layouts hitting the same API
              don&apos;t actually fire two requests. Articulating it cleanly is a
              strong senior signal.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
