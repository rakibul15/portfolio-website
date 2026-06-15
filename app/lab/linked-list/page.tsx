import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { LinkedListViz } from '@/components/lab/linked-list/linked-list-viz'

export const metadata: Metadata = {
  title: 'Linked List',
  description:
    'Four interview-classic linked-list operations stepped through visually — insert/delete, reverse, cycle detection (Floyd\'s), and doubly-linked insert. TS + Go implementations side-by-side.',
}

export default function LinkedListPage() {
  return (
    <VizShell
      eyebrow="Data Structures · Linked List"
      title="Linked List"
      subtitle="A linked list is just a node holding a value and a pointer to the next node. Every operation reduces to pointer rewires. Watch four classics — insert + delete, reverse, Floyd's cycle detection, and the doubly-linked variant — with TypeScript and Go side-by-side."
    >
      <LinkedListViz />

      {/* Concept section */}
      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            Why this matters
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;A linked list is a teaching device. You will rarely build one
            from scratch &mdash; but the interview asks about it because the
            answers reveal whether you can think in pointers.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Every senior frontend engineer should be able to draw a list on a
            whiteboard and execute insert / reverse / cycle-detect by tracking
            two or three pointers. That same skill is what carries you through
            DOM traversals, React reconciliation, and undo-stack design.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Singly vs Doubly
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">Singly</strong> — one
                pointer per node. Insert/delete need access to the{' '}
                <em>previous</em> node. Reverse is the canonical exercise.
              </li>
              <li>
                <strong className="text-ink font-medium">Doubly</strong> — two
                pointers per node (prev + next). Insert/delete are O(1) given a
                node reference. Costs: 2x memory, 4 pointer updates per
                operation.
              </li>
              <li>
                <strong className="text-ink font-medium">Circular</strong> — the
                tail wraps back to the head. Useful for round-robin schedulers,
                game loops, music playlists.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              The slow + fast pattern
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Floyd&apos;s tortoise-and-hare generalizes beyond cycle detection.
              Use it to find the <strong className="text-ink font-medium">middle
              node</strong> (slow moves 1, fast moves 2; when fast hits NULL,
              slow is at the middle) and the{' '}
              <strong className="text-ink font-medium">N-th from the end</strong>{' '}
              (fast advances N steps first, then both move together). Same
              technique, three questions.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Real-world doubly linked lists
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              <strong className="text-ink font-medium">LRU cache</strong>{' '}
              (HashMap + doubly linked list), browser{' '}
              <strong className="text-ink font-medium">history</strong> stack,
              text-editor <strong className="text-ink font-medium">undo / redo</strong>{' '}
              stacks, music{' '}
              <strong className="text-ink font-medium">playlist</strong>{' '}
              prev / next, image-gallery{' '}
              <strong className="text-ink font-medium">carousels</strong>.
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              Linked-list problems test pointer fluency, edge-case thinking
              (head, tail, empty list), and your ability to draw your way out of
              a corner. They&apos;re cheap to set up (whiteboard or paper) and
              expensive to fake.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
