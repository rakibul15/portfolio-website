'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import type { HeapNodeState, HeapStep } from '@/lib/lab/heap-data'
import { springBouncy } from '@/lib/lab/motion'

interface HeapTreeViewProps {
  step: HeapStep
  heapKind: 'min' | 'max'
}

const NODE_STATE: Record<HeapNodeState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  comparing: 'border-lab-blue bg-lab-blue text-paper',
  'swap-pair': 'border-lab-amber bg-lab-amber text-paper',
  'just-swapped': 'border-lab-emerald bg-lab-emerald text-paper',
  new: 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald',
  'sift-target': 'border-lab-amber bg-lab-amber-soft text-lab-amber',
  extracted: 'border-accent bg-accent text-paper opacity-60',
  'leaf-skipped': 'border-stroke bg-paper2 text-faint italic',
  kth: 'border-lab-purple bg-lab-purple text-paper',
}

const NODE_SIZE = 52
const ROW_HEIGHT = 84

// Compute (x in [0,1], y depth) for a node at array index i, given total n.
function indexToPosition(i: number): { x: number; y: number } {
  // Depth = floor(log2(i+1))
  const depth = Math.floor(Math.log2(i + 1))
  // Index of node within its level
  const indexInLevel = i - (Math.pow(2, depth) - 1)
  const totalInLevel = Math.pow(2, depth)
  const x = (indexInLevel + 0.5) / totalInLevel
  return { x, y: depth }
}

export function HeapTreeView({ step, heapKind }: HeapTreeViewProps) {
  const { array, states, compare } = step

  const positions = useMemo(
    () => array.map((_, i) => indexToPosition(i)),
    [array],
  )

  // Canvas height based on max depth
  const maxDepth = positions.reduce((m, p) => Math.max(m, p.y), 0)
  const canvasHeight = (maxDepth + 1) * ROW_HEIGHT + NODE_SIZE

  // Build edge list (parent index → child index)
  const edges = useMemo(() => {
    const list: Array<{ from: number; to: number }> = []
    for (let i = 1; i < array.length; i++) {
      const parent = (i - 1) >> 1
      list.push({ from: parent, to: i })
    }
    return list
  }, [array])

  // Helper to determine if an edge is in the compare highlight set
  const isCompareEdge = (from: number, to: number): boolean => {
    if (!compare) return false
    const [a, b] = compare
    return (
      (from === a && to === b) || (from === b && to === a)
    )
  }

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div
          className={`font-mono text-[10px] tracking-[0.16em] uppercase ${heapKind === 'max' ? 'text-lab-amber' : 'text-lab-blue'}`}
        >
          {heapKind === 'max' ? 'Max-Heap' : 'Min-Heap'} (tree view)
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {array.length} {array.length === 1 ? 'node' : 'nodes'}
        </div>
      </div>

      <div className="bg-paper2 p-5 sm:p-7 overflow-x-auto">
        {array.length === 0 ? (
          <div className="font-mono text-[10px] text-faint italic tracking-[0.04em] h-32 flex items-center justify-center">
            heap is empty
          </div>
        ) : (
          <div
            className="relative mx-auto min-w-[420px]"
            style={{ height: canvasHeight, maxWidth: 680 }}
          >
            {/* SVG edges */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {edges.map((edge) => {
                const from = positions[edge.from]
                const to = positions[edge.to]
                if (!from || !to) return null
                const highlight = isCompareEdge(edge.from, edge.to)
                return (
                  <line
                    key={`${edge.from}-${edge.to}`}
                    x1={`${from.x * 100}%`}
                    y1={from.y * ROW_HEIGHT + NODE_SIZE / 2}
                    x2={`${to.x * 100}%`}
                    y2={to.y * ROW_HEIGHT + NODE_SIZE / 2}
                    strokeWidth={highlight ? '2.5' : '2'}
                    className={`${highlight ? 'stroke-lab-blue' : 'stroke-stroke2'} transition-colors`}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {array.map((value, i) => {
                const pos = positions[i]
                const state: HeapNodeState = states[i] ?? 'normal'
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, scale: 0.4, y: -8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale:
                        state === 'new' || state === 'just-swapped'
                          ? [1, 1.18, 1]
                          : state === 'comparing' || state === 'sift-target'
                            ? [1, 1.08, 1]
                            : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2 } }}
                    transition={
                      state === 'normal' || state === 'leaf-skipped'
                        ? springBouncy
                        : { duration: 0.55, ease: 'easeInOut' }
                    }
                    whileHover={{ scale: 1.06 }}
                    style={{
                      position: 'absolute',
                      left: `${pos.x * 100}%`,
                      top: pos.y * ROW_HEIGHT,
                      width: NODE_SIZE,
                      height: NODE_SIZE,
                      marginLeft: -NODE_SIZE / 2,
                    }}
                    className={`border-2 flex flex-col items-center justify-center font-serif text-[16px] font-black ${NODE_STATE[state]} transition-colors cursor-default`}
                  >
                    <span className="leading-none">{value}</span>
                    <span className="font-mono text-[8px] tracking-[0.06em] opacity-70 mt-0.5 leading-none">
                      [{i}]
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
