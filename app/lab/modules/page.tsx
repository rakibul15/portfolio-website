import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { ModulesViz } from '@/components/lab/modules/modules-viz'

export const metadata: Metadata = {
  title: 'Modules — ESM, tree-shake, dynamic import',
  description:
    'How the ESM dependency graph resolves, how bundlers tree-shake unused exports, and how dynamic import creates separate chunks for code splitting.',
}

export default function ModulesPage() {
  return (
    <VizShell
      eyebrow="JavaScript · Modules"
      title="Modules"
      subtitle="ESM is a STATIC graph — every import is resolved at parse time. That static-ness is what enables tree-shaking and code splitting. See how the graph evaluates, how unused exports are eliminated, and how a single dynamic import creates a separate chunk."
    >
      <ModulesViz />
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">Why static matters</div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;CJS lets you do `require(dynamicPath)`. ESM doesn&apos;t. That single restriction is what makes tree-shaking possible.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">ESM vs CJS — when each</div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li><strong className="text-ink font-medium">ESM</strong> — modern browsers, modern Node (with `.mjs` or `&quot;type&quot;: &quot;module&quot;`), bundler-first projects. Static imports, top-level await, tree-shakable.</li>
              <li><strong className="text-ink font-medium">CJS</strong> — legacy Node, scripts. Dynamic `require()`, synchronous, NOT tree-shakable.</li>
              <li><strong className="text-ink font-medium">Interop</strong> — Node can import CJS from ESM (with caveats). Webpack/Vite/Turbopack handle both. Some npm packages publish dual builds.</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">Code splitting playbook</div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>Split per route (Next.js does this automatically)</li>
              <li>Split heavy modal / chart / editor libs — anything used by &lt;20% of users</li>
              <li>Split polyfills behind feature detection</li>
              <li>Use `next/dynamic` for React components; <code className="font-mono text-[12px] text-ink">import()</code> for plain modules</li>
            </ul>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
