'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ELItem } from '@/lib/lab/event-loop-data'
import { springBouncy, stackPop, slideIn } from '@/lib/lab/motion'

interface QueuePanelProps {
  title: string
  hint: string
  items: ELItem[]
  // 'stack' renders top→bottom with last item on top; queues render in order.
  variant: 'stack' | 'queue'
  count: number
}

// Tone palette for items moving through the runtime:
//   default  → synchronous calls / generic frames
//   callback → microtasks (Promise.then) — lab-amber
//   task     → macrotasks (setTimeout, I/O) — lab-blue
//   log      → console output / passive — neutral
const toneClass: Record<NonNullable<ELItem['tone']>, string> = {
  default: 'border-stroke2 bg-paper text-ink',
  callback: 'border-lab-amber bg-lab-amber-soft text-lab-amber font-medium',
  task: 'border-lab-blue bg-lab-blue-soft text-lab-blue font-medium',
  log: 'border-stroke bg-paper text-muted italic',
}

export function QueuePanel({ title, hint, items, variant, count }: QueuePanelProps) {
  const displayItems = variant === 'stack' ? [...items].reverse() : items

  return (
    <div className="border border-stroke flex flex-col min-h-[280px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div>
          <div
            className={`font-mono text-[10px] tracking-[0.16em] uppercase ${
              variant === 'stack'
                ? 'text-lab-purple'
                : title.toLowerCase().includes('microtask')
                  ? 'text-lab-amber'
                  : 'text-lab-blue'
            }`}
          >
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
              variants={variant === 'stack' ? stackPop : slideIn}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springBouncy}
              whileHover={{ scale: 1.04, y: -1 }}
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
