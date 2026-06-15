'use client'

import { motion } from 'framer-motion'
import type { CacheStatus } from '@/lib/lab/nextjs-caching-data'

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

const STATUS_BADGE: Record<CacheStatus, string> = {
  idle: 'border-stroke text-faint',
  checking: 'border-ink text-ink',
  hit: 'border-ink bg-ink text-paper',
  miss: 'border-accent text-accent',
  storing: 'border-ink text-ink bg-paper3',
  invalidated: 'border-stroke2 text-muted line-through decoration-stroke2',
  skip: 'border-stroke text-faint italic',
}

const CARD_BORDER: Record<CacheStatus, string> = {
  idle: 'border-stroke',
  checking: 'border-ink',
  hit: 'border-ink',
  miss: 'border-accent',
  storing: 'border-ink',
  invalidated: 'border-stroke2',
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
        scale: focused ? 1 : 0.998,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
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
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
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
