import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { JSUtilitiesViz } from '@/components/lab/js-utilities/js-utilities-viz'

export const metadata: Metadata = {
  title: 'JS Utility Implementations',
  description:
    'deepClone, memoize, LRU cache, Event Emitter — the four most-asked FE coding interview problems, animated step-by-step with the relevant state structure on screen.',
}

export default function JSUtilitiesPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Utilities"
      title="JS Utility Implementations"
      subtitle="The four utility-implementation problems that come up most in FE phone screens. Each scenario shows the relevant state structure — input/output trees, cache table, subscriber map — live, so you can correlate each line of code with what it mutates."
    >
      <JSUtilitiesViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            What &quot;senior&quot; means here
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Anyone can implement debounce. Senior is knowing the edge cases
            without being asked.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            deepClone with circular refs. Memoize with custom hashing. LRU
            with O(1) eviction. Event Emitter with auto-unsubscribe. Each of
            these has a 5-line &quot;works&quot; version and a 20-line
            &quot;senior&quot; version &mdash; the difference is the gotchas
            you proactively handle.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              deepClone gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1">
              <li>Don&apos;t use JSON-stringify-parse — fails on Date/Map/Set/circular</li>
              <li>WeakMap for circular ref tracking (don&apos;t leak)</li>
              <li>Date, Map, Set, RegExp, Uint8Array need special branches</li>
              <li>structuredClone() (native) handles most of these now, in modern browsers</li>
              <li>Functions can&apos;t be cloned. Decide: copy reference or throw?</li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              memoize gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1">
              <li>Hashing object args — JSON.stringify is the easy default, breaks on cycles</li>
              <li>Cache eviction policy: unbounded growth is a memory leak</li>
              <li>WeakMap-keyed memoization for object args avoids the GC issue</li>
              <li>Methods with `this` need binding consideration</li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              LRU gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1">
              <li>
                JS Map preserves insertion order. Delete + re-set is the trick that gives O(1).
              </li>
              <li>
                Classic implementation uses HashMap + Doubly Linked List — verbose but explicit.
              </li>
              <li>
                Real-world: TanStack Query, SWR, image / route prefetch caches.
              </li>
              <li>Test: capacity = 0, get on missing key, put/get/put pattern.</li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Event Emitter gotchas
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-1">
              <li>Use Set, not Array — handles duplicate-subscribe and O(1) off().</li>
              <li>
                Return an unsubscribe function from on() — way cleaner caller code
                than tracking the original fn reference.
              </li>
              <li>
                emit() handler that throws should NOT halt other handlers — try/catch each.
              </li>
              <li>
                once(event, fn) — wrap fn in a self-unsubscribing version.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
