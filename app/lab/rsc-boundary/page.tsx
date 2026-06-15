import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { BoundaryViz } from '@/components/lab/rsc-boundary/boundary-viz'

export const metadata: Metadata = {
  title: 'RSC Serialization Boundary',
  description:
    'What props can cross from a Server Component into a Client Component, and what the RSC payload looks like on the wire.',
}

export default function RSCBoundaryPage() {
  return (
    <VizShell
      eyebrow="React · Next.js"
      title="RSC Serialization Boundary"
      subtitle="The line between Server and Client Components is a serializer. Plain values cross. Functions don't — unless they're Server Actions. Watch four scenarios that explain what arrives on the client, what gets rejected, and what the RSC payload actually looks like on the wire."
    >
      <BoundaryViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The rule
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;A prop from server to client must survive a round-trip through
            JSON-with-extensions. If it can&apos;t, you need a different
            shape.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            The serializer crosses one direction only: server → client. Once a
            value lands on the client, it lives in client memory and can be
            anything (functions, class instances, the lot). The constraint is
            only at the boundary.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Crosses cleanly
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                Primitives:{' '}
                <code className="font-mono text-[12px] text-ink">
                  string, number, boolean, null, undefined, bigint
                </code>
              </li>
              <li>Plain arrays and plain objects (recursively serializable)</li>
              <li>
                Built-ins with extended encoding:{' '}
                <code className="font-mono text-[12px] text-ink">
                  Date, Map, Set, URL, RegExp, Uint8Array
                </code>
              </li>
              <li>
                <code className="font-mono text-[12px] text-ink">Promise</code>{' '}
                — the client unwraps with{' '}
                <code className="font-mono text-[12px] text-ink">use()</code>
              </li>
              <li>
                React elements (server-rendered JSX trees, passed as{' '}
                <code className="font-mono text-[12px] text-ink">children</code>{' '}
                or any prop)
              </li>
              <li>
                Server Actions (functions with{' '}
                <code className="font-mono text-[12px] text-ink">&apos;use server&apos;</code>{' '}
                — sent as an RPC reference, not the function itself)
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Doesn&apos;t cross
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>Plain functions (only Server Actions are allowed)</li>
              <li>
                Class instances with methods (the methods don&apos;t survive
                serialization)
              </li>
              <li>
                Symbols (other than well-known ones), DOM nodes, refs, native
                handles
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              The composition pattern
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              You cannot{' '}
              <code className="font-mono text-[12px] text-ink">import</code> a
              Server Component into a Client Component. But you{' '}
              <em>can</em> pass server-rendered JSX as a prop (usually{' '}
              <code className="font-mono text-[12px] text-ink">children</code>).
              That&apos;s how interactive containers wrap server-rendered content
              without making the whole tree client-side.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              The serialization rules explain half the runtime errors in App
              Router projects. Articulating the boundary as &quot;a JSON
              transport with extensions, plus a special case for Server
              Actions&quot; is a senior signal.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
