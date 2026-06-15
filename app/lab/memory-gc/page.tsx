import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { MemoryGCViz } from '@/components/lab/memory-gc/memory-gc-viz'

export const metadata: Metadata = {
  title: 'Memory & GC',
  description:
    'Object lifecycle, closure-induced memory leaks, and WeakMap vs Map — visualized with reference graphs and GC sweeps.',
}

export default function MemoryGCPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Memory"
      title="Memory & GC"
      subtitle="JS doesn't expose manual free() — but you still cause memory leaks by holding references too long. Watch three scenarios: a clean lifecycle, the classic closure leak, and the WeakMap trick that lets you cache without pinning."
    >
      <MemoryGCViz />
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">The rule</div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;An object lives as long as a reachable path from a ROOT leads to it. Drop the last path, the GC reclaims it.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">Common leak sources</div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li><strong className="text-ink font-medium">Forgotten event listeners</strong> — handler closure pins everything it sees</li>
              <li><strong className="text-ink font-medium">Detached DOM nodes</strong> — removed from tree but still held by JS</li>
              <li><strong className="text-ink font-medium">Long-lived timers / intervals</strong> — same closure problem as listeners</li>
              <li><strong className="text-ink font-medium">Caches with no eviction</strong> — Map keyed by user objects grows forever</li>
              <li><strong className="text-ink font-medium">Modules referencing each other</strong> — circular imports prevent partial unloading</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">Tools</div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Chrome DevTools → Memory tab → Heap Snapshot. Take one, do the suspect interaction, take another. Compare: any objects retained that shouldn&apos;t be?
              Click an object to see its retainer chain — that&apos;s usually where the leak is hiding.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
