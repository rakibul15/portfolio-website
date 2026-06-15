import type { Metadata } from 'next'
import { VizShell } from '@/components/lab/viz-shell'
import { BSTViz } from '@/components/lab/bst/bst-viz'

export const metadata: Metadata = {
  title: 'Binary Search Tree',
  description:
    'Build a BST, search for a value, walk it in-order, and handle the two-children delete case — animated step-by-step with TypeScript and Go.',
}

export default function BSTPage() {
  return (
    <VizShell
      eyebrow="Data Structures · Trees"
      title="Binary Search Tree"
      subtitle="A BST keeps values ordered: everything in the left subtree is smaller; everything in the right is bigger. That single rule gives you O(log n) average lookup, free sorted output via in-order traversal, and a uniform mental model for insert/search/delete."
    >
      <BSTViz />

      <section className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            The invariant
          </div>
          <p className="font-serif text-[clamp(20px,2.5vw,28px)] leading-[1.4] font-normal italic text-ink">
            &ldquo;For every node N: left subtree &lt; N &lt; right subtree.
            That&apos;s it. Every algorithm falls out of preserving this rule.&rdquo;
          </p>
          <p className="text-[14px] text-muted leading-[1.7] font-light mt-6">
            Insert walks the tree until it finds a null slot in the right
            direction. Search walks the same path. In-order traversal yields
            sorted output. Delete is the only case that needs the in-order
            successor trick (visualized in scenario 4).
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why the &quot;avg O(log n)&quot; matters
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              A balanced BST has height ≈ log₂(n). A pathological one (insert
              sorted input) degenerates to a linked list with height n. The
              fix in practice:{' '}
              <strong className="text-ink font-medium">self-balancing trees</strong>{' '}
              (Red-Black, AVL) which keep height ≤ ~1.44 · log₂(n). Most
              standard libraries&apos; sorted-map types are RB-trees under
              the hood: Java&apos;s TreeMap, C++&apos;s std::map, Go&apos;s
              container/list (not BST but similar contract).
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Three delete cases
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">Leaf</strong> — just
                remove the link from its parent.
              </li>
              <li>
                <strong className="text-ink font-medium">One child</strong> —
                replace the node with its child. The child &quot;jumps up&quot;.
              </li>
              <li>
                <strong className="text-ink font-medium">Two children</strong> —
                the tricky case. Find the in-order successor (leftmost of right
                subtree), copy its value into the node being deleted, then delete
                the successor from the right subtree (which is now one of the
                first two cases).
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Traversal orders
            </div>
            <ul className="text-[14px] text-muted leading-[1.75] font-light space-y-2">
              <li>
                <strong className="text-ink font-medium">In-order</strong>{' '}
                (left, node, right) — sorted output. The free O(n) sort.
              </li>
              <li>
                <strong className="text-ink font-medium">Pre-order</strong>{' '}
                (node, left, right) — clone a tree, prefix-expression parsing.
              </li>
              <li>
                <strong className="text-ink font-medium">Post-order</strong>{' '}
                (left, right, node) — delete a tree safely, postfix evaluation.
              </li>
              <li>
                <strong className="text-ink font-medium">Level-order / BFS</strong>{' '}
                (queue-based, no recursion) — render row-by-row, shortest paths
                on trees.
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase mb-2">
              Why interviewers ask
            </div>
            <p className="text-[14px] text-muted leading-[1.7] font-light">
              BST problems test recursion, invariants, and edge-case thinking.
              &quot;Validate BST&quot;, &quot;K-th smallest in BST&quot;, and
              &quot;LCA in BST&quot; are all variations on traversal logic.
            </p>
          </div>
        </div>
      </section>
    </VizShell>
  )
}
