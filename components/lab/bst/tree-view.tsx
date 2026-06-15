'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import {
  layoutTree,
  type BSTNode,
  type BSTNodeState,
  type BSTStep,
} from '@/lib/lab/bst-data'
import { springBouncy } from '@/lib/lab/motion'

interface TreeViewProps {
  step: BSTStep
}

const NODE_STATE: Record<BSTNodeState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  visiting: 'border-lab-amber bg-lab-amber text-paper',
  comparing: 'border-lab-blue bg-lab-blue text-paper',
  found: 'border-lab-emerald bg-lab-emerald text-paper',
  new: 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald',
  'in-path': 'border-lab-blue bg-lab-blue-soft text-lab-blue',
  removing: 'border-accent bg-accent text-paper opacity-60',
  successor: 'border-lab-purple bg-lab-purple text-paper',
}

const EDGE_COLOR_FROM_STATE = (
  parent: BSTNodeState,
  child: BSTNodeState,
): string => {
  if (child === 'found') return 'stroke-lab-emerald'
  if (parent === 'in-path' && child === 'in-path') return 'stroke-lab-blue'
  if (parent === 'in-path' || child === 'in-path') return 'stroke-lab-blue/60'
  if (parent === 'comparing' || child === 'comparing') return 'stroke-lab-blue'
  if (parent === 'visiting' || child === 'visiting') return 'stroke-lab-amber'
  return 'stroke-stroke2'
}

const NODE_SIZE = 56 // px
const ROW_HEIGHT = 92 // px between levels

export function TreeView({ step }: TreeViewProps) {
  const { rootId, nodes, output } = step

  // Compute positions for all visible nodes
  const positions = useMemo(() => layoutTree(rootId, nodes), [rootId, nodes])

  // Determine max depth so we can size the canvas
  const maxDepth = useMemo(() => {
    let max = 0
    for (const p of Object.values(positions)) max = Math.max(max, p.y)
    return max
  }, [positions])

  const canvasHeight = (maxDepth + 1) * ROW_HEIGHT + NODE_SIZE

  // Pre-compute edges (parent → child) for SVG rendering
  const edges = useMemo(() => {
    const list: Array<{
      fromId: string
      toId: string
      fromState: BSTNodeState
      toState: BSTNodeState
    }> = []
    for (const node of Object.values(nodes)) {
      if (node.leftId && nodes[node.leftId]) {
        list.push({
          fromId: node.id,
          toId: node.leftId,
          fromState: node.state,
          toState: nodes[node.leftId].state,
        })
      }
      if (node.rightId && nodes[node.rightId]) {
        list.push({
          fromId: node.id,
          toId: node.rightId,
          fromState: node.state,
          toState: nodes[node.rightId].state,
        })
      }
    }
    return list
  }, [nodes])

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          Binary Search Tree
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {Object.keys(nodes).length}{' '}
          {Object.keys(nodes).length === 1 ? 'node' : 'nodes'}
        </div>
      </div>

      <div className="bg-paper2 p-5 sm:p-7 overflow-x-auto">
        <div
          className="relative mx-auto min-w-[480px]"
          style={{ height: canvasHeight, maxWidth: 720 }}
        >
          {/* SVG layer for edges */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
          >
            {edges.map((edge) => {
              const from = positions[edge.fromId]
              const to = positions[edge.toId]
              if (!from || !to) return null
              return (
                <Edge
                  key={`${edge.fromId}-${edge.toId}`}
                  fromX={from.x}
                  fromY={from.y}
                  toX={to.x}
                  toY={to.y}
                  className={EDGE_COLOR_FROM_STATE(edge.fromState, edge.toState)}
                />
              )
            })}
          </svg>

          {/* Node layer */}
          <AnimatePresence>
            {Object.values(nodes).map((node) => {
              const pos = positions[node.id]
              if (!pos) return null
              return (
                <TreeNodeChip key={node.id} node={node} x={pos.x} y={pos.y} />
              )
            })}
          </AnimatePresence>
        </div>

        {/* Traversal output */}
        {output && (
          <div className="mt-5 border border-stroke bg-paper">
            <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
              <span className="font-mono text-[10px] text-lab-emerald tracking-[0.16em] uppercase">
                Output
              </span>
              <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
                {output.length} value{output.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {output.length === 0 ? (
                <span className="font-mono text-[10px] text-faint italic tracking-[0.04em]">
                  []
                </span>
              ) : (
                output.map((v, i) => (
                  <motion.span
                    key={`${i}-${v}`}
                    initial={{ opacity: 0, scale: 0.6, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={springBouncy}
                    className="font-serif text-[14px] font-black border border-lab-emerald bg-lab-emerald-soft text-lab-emerald px-2.5 py-1 leading-none"
                  >
                    {v}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TreeNodeChip({ node, x, y }: { node: BSTNode; x: number; y: number }) {
  // Convert (x in [0,1], y depth) to (left%, top px)
  const leftPercent = x * 100
  const topPx = y * ROW_HEIGHT

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.4, y: -10 }}
      animate={{
        opacity: 1,
        scale:
          node.state === 'new'
            ? [1, 1.18, 1]
            : node.state === 'comparing' || node.state === 'visiting'
              ? [1, 1.1, 1]
              : 1,
        y: 0,
      }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
      transition={
        node.state === 'new' ||
        node.state === 'comparing' ||
        node.state === 'visiting'
          ? { duration: 0.55, ease: 'easeInOut' }
          : springBouncy
      }
      whileHover={{ scale: 1.06 }}
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        top: topPx,
        width: NODE_SIZE,
        height: NODE_SIZE,
        marginLeft: -NODE_SIZE / 2,
      }}
      className={`border-2 flex items-center justify-center font-serif text-[18px] font-black ${NODE_STATE[node.state]} transition-colors cursor-default`}
    >
      {node.value}
    </motion.div>
  )
}

function Edge({
  fromX,
  fromY,
  toX,
  toY,
  className,
}: {
  fromX: number
  fromY: number
  toX: number
  toY: number
  className: string
}) {
  // Compute pixel positions from normalized coords.
  // x is %, y is depth (rows). We use SVG viewBox-like math: x as a percentage
  // string and y as pixels. To make SVG paths render correctly we use
  // `vectorEffect="non-scaling-stroke"` and `preserveAspectRatio="none"` on
  // the parent so the line spans the right visual span.
  //
  // We render the line from (fromX%, fromY*ROW + NODE/2) to
  // (toX%, toY*ROW + NODE/2). The viewport coords here use the parent's
  // 100%-wide, canvasHeight-tall coordinate space.

  return (
    <line
      x1={`${fromX * 100}%`}
      y1={fromY * ROW_HEIGHT + NODE_SIZE / 2}
      x2={`${toX * 100}%`}
      y2={toY * ROW_HEIGHT + NODE_SIZE / 2}
      strokeWidth="2"
      className={`${className} transition-colors`}
      vectorEffect="non-scaling-stroke"
    />
  )
}
