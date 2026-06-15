import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { TSTypesViz } from '@/components/lab/ts-types/ts-types-viz'

export const metadata: Metadata = {
  title: 'TypeScript Type System',
  description:
    'Type narrowing, generics with constraints, conditional types + infer, and mapped types — animated step-by-step.',
}

export default function TSTypesPage() {
  return (
    <VizShell
      eyebrow="TypeScript · Types"
      title="TypeScript Type System"
      subtitle="Senior TypeScript interview questions almost always touch four mechanisms: narrowing, generics, conditional + infer, and mapped types. Step through each so the compiler's reasoning is visible — not just the result."
    >
      <TSTypesViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The mental model
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;Types are sets. Narrowing shrinks the set. Generics
            parameterize over sets. Conditional types branch on set membership.
            Mapped types build new sets from old ones.&rdquo;
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">When each comes up</div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li><strong className="text-ink font-medium">Narrowing</strong> — every reducer, every event handler with a discriminated union</li>
              <li><strong className="text-ink font-medium">Generics</strong> — reusable utility functions, React component props, typed fetch wrappers</li>
              <li><strong className="text-ink font-medium">Conditional + infer</strong> — ReturnType, Awaited, Parameters, custom utility types</li>
              <li><strong className="text-ink font-medium">Mapped types</strong> — Partial, Required, Readonly, plus DeepPartial / DeepReadonly variants</li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">Why interviewers ask</div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              These four mechanisms let you write code that the compiler can verify is correct at every call site. The senior signal is using them
              <em> intentionally</em>: a discriminated union for state machines, a generic constraint for safe API surfaces, a conditional type to
              re-derive a return type, a mapped type for a partial-update DTO.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
