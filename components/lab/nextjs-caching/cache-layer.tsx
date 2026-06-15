'use client'

import { motion } from 'framer-motion'
import type { CacheStatus } from '@/lib/lab/nextjs-caching-data'
import { springBouncy, wiggleBadge } from '@/lib/lab/motion'

interface CacheLayerProps {
  title: string
  side: string // short location label: "Client" or "Server"
  description: string
  meta: string // sub-description: what it stores, default TTL
  status: CacheStatus
  focused: boolean
}

const STATUS_LABEL: Record<CacheStatus, string> = {
  idle: 'Idle',
  checking: 'Checking…',
  hit: 'Hit',
  miss: 'Miss',
  storing: 'Storing',
  invalidated: 'Invalidated',
  skip: 'Skipped',
}

// Semantic palette: hit = good (emerald), miss = bad (red), checking = active
// (blue), storing = in-progress (amber), invalidated = wiped (purple-strike).
const STATUS_BADGE: Record<CacheStatus, string> = {
  idle: 'border-stroke text-faint',
  checking: 'border-lab-blue bg-lab-blue text-paper',
  hit: 'border-lab-emerald bg-lab-emerald text-paper',
  miss: 'border-accent bg-accent text-paper',
  storing: 'border-lab-amber bg-lab-amber text-paper',
  invalidated: 'border-lab-purple text-lab-purple line-through decoration-lab-purple',
  skip: 'border-stroke text-faint italic',
}

const CARD_BORDER: Record<CacheStatus, string> = {
  idle: 'border-stroke',
  checking: 'border-lab-blue',
  hit: 'border-lab-emerald',
  miss: 'border-accent',
  storing: 'border-lab-amber',
  invalidated: 'border-lab-purple',
  skip: 'border-stroke',
}

export function CacheLayer({
  title,
  side,
  description,
  meta,
  status,
  focused,
}: CacheLayerProps) {
  return (
    <motion.div
      layout
      animate={{
        scale: focused ? [1, 1.02, 1] : 1,
      }}
      transition={
        focused ? { duration: 0.6, ease: 'easeInOut' } : springBouncy
      }
      className={`border ${CARD_BORDER[status]} bg-paper transition-colors`}
    >
      <div className="flex items-stretch">
        {/* Side label rail */}
        <div className="w-12 sm:w-16 shrink-0 border-r border-stroke flex items-center justify-center bg-paper2">
          <span className="font-mono text-[9px] text-faint tracking-[0.2em] uppercase -rotate-90 whitespace-nowrap">
            {side}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <div className="font-serif text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
                {title}
              </div>
              <div className="text-[13px] text-muted leading-snug mt-1 font-light">
                {description}
              </div>
              <div className="font-mono text-[10px] text-faint tracking-[0.04em] mt-2 leading-snug">
                {meta}
              </div>
            </div>

            {/* Status badge */}
            <motion.div
              key={status}
              variants={wiggleBadge}
              initial="initial"
              animate="animate"
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 border self-start whitespace-nowrap ${STATUS_BADGE[status]}`}
            >
              {STATUS_LABEL[status]}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
