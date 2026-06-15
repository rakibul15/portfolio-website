'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import type {
  GraphEdge,
  GraphEdgeState,
  GraphNode,
  GraphNodeState,
  GraphStep,
} from '@/lib/lab/graph-data'
import { springBouncy } from '@/lib/lab/motion'

interface GraphViewProps {
  step: GraphStep
  // For the title color and arrowhead marker
  flavor: 'bfs' | 'dfs' | 'toposort' | 'cycle'
}

// Map node state → tailwind classes (used by SVG attributes via CSS vars)
const NODE_FILL: Record<GraphNodeState, string> = {
  normal: 'fill-paper stroke-stroke2',
  current: 'fill-lab-amber stroke-lab-amber',
  visited: 'fill-lab-emerald stroke-lab-emerald',
  'in-queue': 'fill-lab-amber-soft stroke-lab-amber',
  'in-stack': 'fill-lab-amber-soft stroke-lab-amber',
  gray: 'fill-paper3 stroke-lab-purple',
  black: 'fill-ink stroke-ink',
  sorted: 'fill-lab-emerald stroke-lab-emerald',
  cycle: 'fill-accent stroke-accent',
}

const NODE_TEXT: Record<GraphNodeState, string> = {
  normal: 'fill-ink',
  current: 'fill-paper',
  visited: 'fill-paper',
  'in-queue': 'fill-lab-amber',
  'in-stack': 'fill-lab-amber',
  gray: 'fill-lab-purple',
  black: 'fill-paper',
  sorted: 'fill-paper',
  cycle: 'fill-paper',
}

const EDGE_STROKE: Record<GraphEdgeState, string> = {
  normal: 'stroke-stroke2',
  highlighted: 'stroke-lab-blue',
  traversed: 'stroke-lab-emerald',
  'back-edge': 'stroke-accent',
}

const NODE_RADIUS = 22

export function GraphView({ step, flavor }: GraphViewProps) {
  const { nodes, edges, queue, stack, output } = step

  const title = useMemo(() => {
    switch (flavor) {
      case 'bfs':
        return { label: 'BFS — graph traversal', tone: 'text-lab-blue' }
      case 'dfs':
        return { label: 'DFS — graph traversal', tone: 'text-lab-purple' }
      case 'toposort':
        return { label: 'Topological sort', tone: 'text-lab-emerald' }
      case 'cycle':
        return { label: 'Cycle detection (3-color DFS)', tone: 'text-accent' }
    }
  }, [flavor])

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className={`font-mono text-[10px] ${title.tone} tracking-[0.16em] uppercase`}>
          {title.label}
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {nodes.length} nodes · {edges.length} edges
        </div>
      </div>

      <div className="bg-paper2 p-4 sm:p-6">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-[300px] sm:h-[360px]"
        >
          <defs>
            {/* Arrowhead markers for directed edges */}
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
              className="fill-stroke2"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker
              id="arrow-back-edge"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
              className="fill-accent"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => (
            <Edge key={`${edge.fromId}-${edge.toId}-${i}`} edge={edge} nodes={nodes} />
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <Node key={node.id} node={node} />
          ))}
        </svg>

        {/* Queue / stack panels */}
        {(queue !== undefined || stack !== undefined) && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {queue !== undefined && (
              <DataStructurePanel label="Queue (BFS)" items={queue} tone="lab-amber" />
            )}
            {stack !== undefined && (
              <DataStructurePanel label="Call stack (DFS)" items={stack} tone="lab-amber" />
            )}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="mt-3 border border-stroke bg-paper">
            <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
              <span className="font-mono text-[10px] text-lab-emerald tracking-[0.16em] uppercase">
                {flavor === 'toposort' ? 'Topological order' : 'Visit order'}
              </span>
              <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
                {output.length} node{output.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-1.5 min-h-[40px] items-center">
              {output.length === 0 ? (
                <span className="font-mono text-[10px] text-faint italic">[]</span>
              ) : (
                <AnimatePresence>
                  {output.map((id, i) => (
                    <motion.span
                      key={`${i}-${id}`}
                      initial={{ opacity: 0, scale: 0.6, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={springBouncy}
                      className="font-serif text-[14px] font-black border border-lab-emerald bg-lab-emerald-soft text-lab-emerald px-2.5 py-1 leading-none"
                    >
                      {id}
                    </motion.span>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Node({ node }: { node: GraphNode }) {
  const cx = node.x * 100
  const cy = node.y * 100
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{
        opacity: 1,
        scale:
          node.state === 'current' || node.state === 'cycle'
            ? [1, 1.15, 1]
            : 1,
      }}
      transition={
        node.state === 'normal'
          ? springBouncy
          : { duration: 0.55, ease: 'easeInOut' }
      }
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <motion.circle
        cx={cx}
        cy={cy}
        r={NODE_RADIUS / 7} // SVG viewBox is 0-100, so radius is in viewbox units
        strokeWidth="0.8"
        className={`${NODE_FILL[node.state]} transition-colors`}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className={`${NODE_TEXT[node.state]} transition-colors`}
        style={{ fontSize: 3.2, fontWeight: 900, fontFamily: 'var(--font-serif)' }}
      >
        {node.label}
      </text>
    </motion.g>
  )
}

function Edge({ edge, nodes }: { edge: GraphEdge; nodes: GraphNode[] }) {
  const fromNode = nodes.find((n) => n.id === edge.fromId)
  const toNode = nodes.find((n) => n.id === edge.toId)
  if (!fromNode || !toNode) return null

  const x1 = fromNode.x * 100
  const y1 = fromNode.y * 100
  const x2 = toNode.x * 100
  const y2 = toNode.y * 100

  // Shorten the line by the node radius so it doesn't overlap the node circle.
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return null
  const ux = dx / len
  const uy = dy / len
  // Convert visual radius (px-ish) to viewBox units: NODE_RADIUS / 7 from above
  const margin = NODE_RADIUS / 7 + 0.5
  const sx = x1 + ux * margin
  const sy = y1 + uy * margin
  const ex = x2 - ux * margin
  const ey = y2 - uy * margin

  const markerId =
    edge.state === 'back-edge' ? 'arrow-back-edge' : 'arrow-normal'

  return (
    <motion.line
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      x1={sx}
      y1={sy}
      x2={ex}
      y2={ey}
      strokeWidth={edge.state === 'normal' ? 0.6 : 1}
      strokeDasharray={edge.state === 'back-edge' ? '2 1' : undefined}
      markerEnd={edge.directed ? `url(#${markerId})` : undefined}
      className={`${EDGE_STROKE[edge.state]} transition-all`}
    />
  )
}

function DataStructurePanel({
  label,
  items,
  tone,
}: {
  label: string
  items: string[]
  tone: 'lab-amber' | 'lab-emerald' | 'lab-blue'
}) {
  const headerTone =
    tone === 'lab-amber'
      ? 'text-lab-amber'
      : tone === 'lab-emerald'
        ? 'text-lab-emerald'
        : 'text-lab-blue'
  const chipTone =
    tone === 'lab-amber'
      ? 'border-lab-amber bg-lab-amber-soft text-lab-amber'
      : tone === 'lab-emerald'
        ? 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald'
        : 'border-lab-blue bg-lab-blue-soft text-lab-blue'

  return (
    <div className="border border-stroke bg-paper">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span
          className={`font-mono text-[10px] ${headerTone} tracking-[0.16em] uppercase`}
        >
          {label}
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {items.length === 0 ? 'empty' : `${items.length}`}
        </span>
      </div>
      <div className="p-3 flex flex-wrap gap-1.5 min-h-[40px] items-center">
        {items.length === 0 ? (
          <span className="font-mono text-[10px] text-faint italic">∅</span>
        ) : (
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.span
                key={`${i}-${item}`}
                layout
                initial={{ opacity: 0, x: -8, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.7 }}
                transition={springBouncy}
                className={`font-mono text-[10px] tracking-[0.06em] border px-2 py-1 ${chipTone}`}
              >
                {item}
              </motion.span>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
