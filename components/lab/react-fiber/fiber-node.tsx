'use client'

import { motion } from 'framer-motion'
import type { FiberTreeNode, RenderStatus } from '@/lib/lab/react-fiber-data'
import { springBouncy, wiggleBadge } from '@/lib/lab/motion'

interface FiberNodeProps {
  node: FiberTreeNode
  states: Record<string, RenderStatus>
  depth: number
}

const STATUS_LABEL: Record<RenderStatus, string> = {
  idle: 'idle',
  'state-change': 'setState',
  scheduled: 'scheduled',
  rendering: 'render',
  committed: 'ok',
  'skipped-memo': 'memo skip',
}

// state-change = the source of the cascade (accent red)
// scheduled    = queued, about to run (lab-blue)
// rendering    = currently running the function (lab-amber)
// committed    = done, output committed (lab-emerald)
// skipped-memo = the memo optimization won (lab-purple, italic)
const STATUS_BADGE: Record<RenderStatus, string> = {
  idle: 'border-stroke text-faint',
  'state-change': 'border-accent bg-accent text-paper',
  scheduled: 'border-lab-blue bg-lab-blue-soft text-lab-blue',
  rendering: 'border-lab-amber bg-lab-amber text-paper',
  committed: 'border-lab-emerald bg-lab-emerald text-paper',
  'skipped-memo': 'border-lab-purple bg-lab-purple-soft text-lab-purple italic',
}

const CARD_BORDER: Record<RenderStatus, string> = {
  idle: 'border-stroke',
  'state-change': 'border-accent',
  scheduled: 'border-lab-blue',
  rendering: 'border-lab-amber',
  committed: 'border-lab-emerald',
  'skipped-memo': 'border-lab-purple',
}

const CARD_BG: Record<RenderStatus, string> = {
  idle: 'bg-paper',
  'state-change': 'bg-paper',
  scheduled: 'bg-paper',
  rendering: 'bg-paper',
  committed: 'bg-paper',
  'skipped-memo': 'bg-paper2',
}

const CARD_OPACITY: Record<RenderStatus, string> = {
  idle: 'opacity-60',
  'state-change': 'opacity-100',
  scheduled: 'opacity-85',
  rendering: 'opacity-100',
  committed: 'opacity-100',
  'skipped-memo': 'opacity-55',
}

export function FiberNode({ node, states, depth }: FiberNodeProps) {
  const status: RenderStatus = states[node.id] ?? 'idle'
  const children = node.children ?? []

  return (
    <div>
      <motion.div
        layout
        animate={{
          scale:
            status === 'rendering' || status === 'state-change'
              ? [1, 1.04, 1]
              : 1,
        }}
        transition={
          status === 'rendering' || status === 'state-change'
            ? { duration: 0.5, ease: 'easeInOut' }
            : springBouncy
        }
        style={{ marginLeft: depth * 20 }}
        whileHover={{ scale: 1.015 }}
        className={`border ${CARD_BORDER[status]} ${CARD_BG[status]} ${CARD_OPACITY[status]} transition-colors mb-1.5`}
      >
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="min-w-0 flex items-baseline gap-2 flex-wrap">
            <span className="font-serif text-[16px] sm:text-[18px] font-black tracking-tight leading-none">
              {node.name}
            </span>
            {node.isMemo && (
              <span className="font-mono text-[9px] text-accent tracking-[0.14em] uppercase border border-accent px-1.5 py-[2px] leading-none">
                memo
              </span>
            )}
            {node.propsLabel && (
              <span className="font-mono text-[10px] text-faint tracking-[0.04em] leading-snug truncate">
                {node.propsLabel}
              </span>
            )}
          </div>
          <motion.div
            key={status}
            variants={wiggleBadge}
            initial="initial"
            animate="animate"
            className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-1 border whitespace-nowrap leading-none ${STATUS_BADGE[status]}`}
          >
            {STATUS_LABEL[status]}
          </motion.div>
        </div>
      </motion.div>

      {children.length > 0 && (
        <div>
          {children.map((child) => (
            <FiberNode
              key={child.id}
              node={child}
              states={states}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
