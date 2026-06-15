'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ArrayView } from '@/lib/lab/algorithms-data'

interface ArrayViewProps {
  view: ArrayView
}

const CELL_STATE: Record<NonNullable<ArrayView['cells'][number]['state']>, string> = {
  normal: 'bg-paper border-stroke text-ink',
  eliminated: 'bg-paper2 border-stroke text-faint line-through opacity-60',
  found: 'bg-ink border-ink text-paper',
}

const POINTER_TONE: Record<'accent' | 'ink' | 'muted', string> = {
  accent: 'text-accent border-accent',
  ink: 'text-ink border-ink',
  muted: 'text-muted border-stroke2',
}

const HIGHLIGHT_TONE: Record<'accent' | 'ink' | 'paper3', string> = {
  accent: 'bg-accent/15 border-accent',
  ink: 'bg-ink/8 border-ink',
  paper3: 'bg-paper3 border-stroke2',
}

export function ArrayViewRenderer({ view }: ArrayViewProps) {
  const { cells, pointers, highlights } = view

  return (
    <div className="border border-stroke bg-paper2 p-4 sm:p-6 overflow-x-auto">
      <div className="relative inline-block min-w-full">
        {/* Pointer row (above the cells) */}
        <div className="flex gap-1 mb-2">
          {cells.map((_, i) => {
            const ptrsHere = pointers.filter((p) => p.index === i)
            return (
              <div
                key={i}
                className="w-12 sm:w-14 flex flex-col items-center gap-1 min-h-[44px]"
              >
                <AnimatePresence>
                  {ptrsHere.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-[2px] border ${POINTER_TONE[p.tone]} bg-paper whitespace-nowrap leading-none`}
                    >
                      {p.label} ↓
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Cells */}
        <div className="flex gap-1 relative">
          {/* Highlight bands behind cells */}
          {highlights.map((h, hi) => {
            const left = h.from * (3.5 * 16 + 4) // 3.5rem cell + 4px gap, approx
            const width = (h.to - h.from + 1) * (3.5 * 16 + 4) - 4
            return (
              <motion.div
                key={hi}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ left, width }}
                className={`absolute -top-1 -bottom-1 border ${HIGHLIGHT_TONE[h.tone]} pointer-events-none`}
              />
            )
          })}

          {cells.map((cell, i) => {
            const state = cell.state ?? 'normal'
            return (
              <motion.div
                key={i}
                layout
                animate={{
                  scale: state === 'found' ? 1.05 : 1,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className={`relative w-12 sm:w-14 h-12 sm:h-14 border flex items-center justify-center font-serif text-[16px] sm:text-[18px] font-black ${CELL_STATE[state]} transition-colors`}
              >
                {cell.value}
              </motion.div>
            )
          })}
        </div>

        {/* Index row (below) */}
        <div className="flex gap-1 mt-1.5">
          {cells.map((_, i) => (
            <div
              key={i}
              className="w-12 sm:w-14 flex items-center justify-center font-mono text-[10px] text-faint tracking-[0.06em]"
            >
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
