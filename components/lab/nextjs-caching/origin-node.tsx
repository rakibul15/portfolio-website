'use client'

import { motion } from 'framer-motion'
import type { OriginStatus } from '@/lib/lab/nextjs-caching-data'
import { springBouncy, wiggleBadge } from '@/lib/lab/motion'

interface OriginNodeProps {
  status: OriginStatus
  focused: boolean
}

const STATUS_LABEL: Record<OriginStatus, string> = {
  idle: 'Idle',
  fetching: 'Fetching…',
  responded: 'Responded',
}

const STATUS_BADGE: Record<OriginStatus, string> = {
  idle: 'border-stroke text-faint',
  fetching: 'border-lab-amber bg-lab-amber text-paper',
  responded: 'border-lab-emerald bg-lab-emerald text-paper',
}

const BORDER: Record<OriginStatus, string> = {
  idle: 'border-stroke',
  fetching: 'border-lab-amber',
  responded: 'border-lab-emerald',
}

export function OriginNode({ status, focused }: OriginNodeProps) {
  return (
    <motion.div
      layout
      animate={{ scale: focused ? [1, 1.03, 1] : 1 }}
      transition={focused ? { duration: 0.6, ease: 'easeInOut' } : springBouncy}
      className={`border ${BORDER[status]} bg-paper2`}
    >
      <div className="flex items-stretch">
        <div className="w-12 sm:w-16 shrink-0 border-r border-stroke flex items-center justify-center">
          <span className="font-mono text-[9px] text-faint tracking-[0.2em] uppercase -rotate-90 whitespace-nowrap">
            Origin
          </span>
        </div>
        <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div>
            <div className="font-serif text-[20px] sm:text-[22px] font-black tracking-tight leading-tight">
              Database / API
            </div>
            <div className="text-[13px] text-muted leading-snug mt-1 font-light">
              The actual data source. Hitting it is the slow path you want to avoid.
            </div>
            <div className="font-mono text-[10px] text-faint tracking-[0.04em] mt-2 leading-snug">
              ~50–500ms · cost scales with traffic
            </div>
          </div>
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
    </motion.div>
  )
}
