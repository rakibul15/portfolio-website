'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ELItem } from '@/lib/lab/event-loop-data'

interface QueuePanelProps {
  title: string
  hint: string
  items: ELItem[]
  // 'stack' renders top→bottom with last item on top; queues render in order.
  variant: 'stack' | 'queue'
  count: number
}

const toneClass: Record<NonNullable<ELItem['tone']>, string> = {
  default: 'border-stroke2 bg-paper text-ink',
  callback: 'border-accent bg-paper text-ink',
  task: 'border-stroke2 bg-paper2 text-ink',
  log: 'border-stroke2 bg-paper text-muted',
}

export function QueuePanel({ title, hint, items, variant, count }: QueuePanelProps) {
  const displayItems = variant === 'stack' ? [...items].reverse() : items

  return (
    <div className="border border-stroke flex flex-col min-h-[280px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div>
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
            {title}
          </div>
          <div className="font-mono text-[10px] text-faint tracking-[0.06em] mt-1">
            {hint}
          </div>
        </div>
        <div className="font-mono text-[11px] text-muted tracking-[0.06em]">
          {String(count).padStart(2, '0')}
        </div>
      </div>

      {/* Items */}
      <div
        className={`flex-1 p-3 flex gap-2 ${
          variant === 'stack' ? 'flex-col justify-end' : 'flex-col'
        }`}
      >
        <AnimatePresence initial={false}>
          {displayItems.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[10px] text-faint tracking-[0.04em] italic self-center m-auto"
            >
              empty
            </motion.div>
          )}
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: variant === 'stack' ? -8 : 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className={`px-3 py-2.5 border font-mono text-[11px] tracking-[0.02em] leading-snug truncate ${
                toneClass[item.tone ?? 'default']
              }`}
            >
              {item.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
