'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type {
  LLEdge,
  LLNode,
  LLPointer,
  LLStep,
  NodeState,
  PointerTone,
} from '@/lib/lab/linked-list-data'
import { springBouncy } from '@/lib/lab/motion'

interface ListViewProps {
  step: LLStep
}

const NODE_STATE: Record<NodeState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  new: 'border-lab-emerald bg-lab-emerald text-paper',
  removing: 'border-accent bg-accent text-paper opacity-60',
  visiting: 'border-lab-amber bg-lab-amber text-paper',
  'cycle-target': 'border-lab-purple bg-lab-purple-soft text-lab-purple',
}

const POINTER_BG: Record<PointerTone, string> = {
  accent: 'border-accent bg-paper text-accent',
  'lab-blue': 'border-lab-blue bg-paper text-lab-blue',
  'lab-amber': 'border-lab-amber bg-paper text-lab-amber',
  'lab-emerald': 'border-lab-emerald bg-paper text-lab-emerald',
  'lab-purple': 'border-lab-purple bg-paper text-lab-purple',
}

const POINTER_ARROW: Record<PointerTone, string> = {
  accent: 'text-accent',
  'lab-blue': 'text-lab-blue',
  'lab-amber': 'text-lab-amber',
  'lab-emerald': 'text-lab-emerald',
  'lab-purple': 'text-lab-purple',
}

const EDGE_STATE: Record<LLEdge['state'], string> = {
  normal: 'text-stroke2',
  new: 'text-lab-emerald font-bold',
  breaking: 'text-accent line-through',
  cycle: 'text-lab-purple',
}

export function ListView({ step }: ListViewProps) {
  const { nodes, pointers, edges, showNullTerminator } = step

  // Build a lookup: forward edges keyed by fromId → toId, with their state.
  const forwardByFrom: Record<string, { toId: string | null; state: LLEdge['state'] }> = {}
  // Backward edges keyed by toId → fromId (for the doubly linked back arrow under each node)
  const backwardByFrom: Record<string, { toId: string | null; state: LLEdge['state'] }> = {}

  for (const edge of edges) {
    if (edge.direction === 'forward') {
      forwardByFrom[edge.fromId] = { toId: edge.toId, state: edge.state }
    } else {
      backwardByFrom[edge.fromId] = { toId: edge.toId, state: edge.state }
    }
  }

  // Detect cycle edges — edges whose target is a node that appears BEFORE the source.
  const cycleEdge = edges.find((e) => e.state === 'cycle')

  // Group pointers by which node they point to.
  const pointersByNode: Record<string, LLPointer[]> = {}
  const nullPointers: LLPointer[] = []
  for (const p of pointers) {
    if (p.nodeId === null) nullPointers.push(p)
    else {
      pointersByNode[p.nodeId] = pointersByNode[p.nodeId] ?? []
      pointersByNode[p.nodeId].push(p)
    }
  }

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          Linked List
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'}
        </div>
      </div>

      <div className="bg-paper2 p-5 sm:p-7 overflow-x-auto">
        <div className="inline-flex items-start gap-1.5 min-w-full">
          <AnimatePresence initial={false}>
            {nodes.map((node, idx) => {
              const forward = forwardByFrom[node.id]
              const backward = backwardByFrom[node.id]
              const ptrsHere = pointersByNode[node.id] ?? []
              return (
                <NodeWithArrow
                  key={node.id}
                  node={node}
                  pointers={ptrsHere}
                  forwardTo={forward ?? null}
                  backwardTo={backward ?? null}
                  isLast={idx === nodes.length - 1}
                  showNull={
                    idx === nodes.length - 1 &&
                    showNullTerminator &&
                    forward?.toId === null
                  }
                />
              )
            })}
          </AnimatePresence>

          {/* NULL pointers (off the end) */}
          {nullPointers.length > 0 && (
            <div className="flex flex-col items-center gap-2 ml-3 mt-9">
              {nullPointers.map((p) => (
                <motion.span
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springBouncy}
                  className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-1 border ${POINTER_BG[p.tone]} whitespace-nowrap leading-none`}
                >
                  {p.label} → NULL
                </motion.span>
              ))}
            </div>
          )}
        </div>

        {/* Cycle-back indicator (rendered as a labelled annotation on the right) */}
        {cycleEdge && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springBouncy}
            className="mt-5 flex items-center gap-2 font-mono text-[10px] text-lab-purple tracking-[0.06em]"
          >
            <span className="inline-block w-6 border-t-2 border-lab-purple border-dashed" />
            <span className="border border-lab-purple bg-lab-purple-soft px-2 py-1">
              ↺ cycle: last node points back to node{' '}
              <strong>
                {nodes.find((n) => n.id === cycleEdge.toId)?.value ?? '?'}
              </strong>
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function NodeWithArrow({
  node,
  pointers,
  forwardTo,
  backwardTo,
  isLast,
  showNull,
}: {
  node: LLNode
  pointers: LLPointer[]
  forwardTo: { toId: string | null; state: LLEdge['state'] } | null
  backwardTo: { toId: string | null; state: LLEdge['state'] } | null
  isLast: boolean
  showNull: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      transition={springBouncy}
      className="flex items-stretch shrink-0"
    >
      {/* Node with pointer labels above */}
      <div className="flex flex-col items-center min-w-[68px]">
        <div className="h-9 flex flex-col items-center justify-end gap-1">
          <AnimatePresence>
            {pointers.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 0, y: 6, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.7 }}
                transition={springBouncy}
                className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-[2px] border ${POINTER_BG[p.tone]} whitespace-nowrap leading-none`}
              >
                {p.label}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
        <div
          className={`h-3 w-px ${pointers.length ? POINTER_ARROW[pointers[0].tone] : 'text-transparent'} flex items-end justify-center`}
        >
          {pointers.length > 0 && (
            <span
              className={`font-mono text-[10px] leading-none ${POINTER_ARROW[pointers[0].tone]}`}
            >
              ↓
            </span>
          )}
        </div>

        <motion.div
          layout
          animate={{
            scale:
              node.state === 'new'
                ? [1, 1.15, 1]
                : node.state === 'visiting'
                  ? [1, 1.08, 1]
                  : node.state === 'removing'
                    ? [1, 0.85]
                    : 1,
          }}
          transition={
            node.state === 'normal'
              ? springBouncy
              : { duration: 0.5, ease: 'easeInOut' }
          }
          className={`w-14 h-14 border-2 flex items-center justify-center font-serif text-[18px] font-black ${NODE_STATE[node.state]} transition-colors`}
        >
          {node.value}
        </motion.div>

        {/* Backward arrow under the node for doubly linked lists */}
        <div className="h-4 flex items-center justify-center">
          {backwardTo && (
            <motion.span
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`font-mono text-[12px] leading-none ${EDGE_STATE[backwardTo.state]}`}
            >
              ↑
            </motion.span>
          )}
        </div>
      </div>

      {/* Forward edge */}
      {!isLast && forwardTo && forwardTo.toId !== null && (
        <div className="flex items-center pb-3.5 self-center mt-9">
          <motion.div
            layout
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={springBouncy}
            style={{ transformOrigin: 'left center' }}
            className={`flex items-center gap-0.5 ${EDGE_STATE[forwardTo.state]} font-mono text-[18px]`}
          >
            <span className="inline-block w-5 border-t-2 border-current" />
            <span className="leading-none">▶</span>
          </motion.div>
        </div>
      )}

      {/* NULL terminator */}
      {showNull && (
        <div className="flex items-center pb-3.5 self-center mt-9">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springBouncy}
            className="flex items-center gap-1"
          >
            <span className="inline-block w-5 border-t-2 border-stroke2" />
            <span className="font-mono text-[11px] tracking-[0.1em] text-faint uppercase">
              NULL
            </span>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
