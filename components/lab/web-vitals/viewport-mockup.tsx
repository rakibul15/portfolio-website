'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ViewportBlock } from '@/lib/lab/web-vitals-data'

interface ViewportMockupProps {
  blocks: ViewportBlock[]
  timeMs: number
  event: string
}

const KIND_STYLE: Record<ViewportBlock['kind'], { painted: string; placeholder: string }> = {
  header: {
    painted: 'bg-ink text-paper',
    placeholder: 'bg-paper2 text-faint',
  },
  text: {
    painted: 'bg-paper text-ink border-stroke',
    placeholder: 'bg-paper2 text-faint border-stroke',
  },
  hero: {
    painted: 'bg-paper3 text-ink border-stroke2',
    placeholder: 'bg-paper2 text-faint border-stroke',
  },
  ad: {
    painted: 'bg-paper2 text-muted border-stroke2',
    placeholder: 'bg-paper2 text-faint border-stroke',
  },
  cta: {
    painted: 'bg-paper text-ink border-ink',
    placeholder: 'bg-paper2 text-faint border-stroke',
  },
  footer: {
    painted: 'bg-paper text-muted border-stroke',
    placeholder: 'bg-paper2 text-faint border-stroke',
  },
}

const HEIGHT_PX = 28 // height of one "unit"

export function ViewportMockup({ blocks, timeMs, event }: ViewportMockupProps) {
  return (
    <div className="border border-stroke flex flex-col">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Viewport
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          t = {timeMs >= 1000 ? `${(timeMs / 1000).toFixed(1)}s` : `${timeMs}ms`}
        </div>
      </div>

      {/* Browser chrome */}
      <div className="px-3 py-2 border-b border-stroke bg-paper2 flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-stroke2" />
          <span className="w-2 h-2 rounded-full bg-stroke2" />
          <span className="w-2 h-2 rounded-full bg-stroke2" />
        </div>
        <div className="flex-1 font-mono text-[10px] text-faint tracking-[0.04em] truncate">
          {event}
        </div>
      </div>

      {/* Viewport area */}
      <div className="bg-paper2 p-3 sm:p-4 min-h-[260px] flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {blocks.map((block) => {
            if (block.state === 'absent') return null

            const style =
              block.state === 'painted' || block.state === 'reserved'
                ? KIND_STYLE[block.kind].painted
                : KIND_STYLE[block.kind].placeholder

            const isReserved = block.state === 'reserved'
            const isLoading = block.state === 'loading'

            return (
              <motion.div
                key={block.id}
                layout
                // Shift-from animation: if shiftedFromY is set, the block animates
                // *from* that offset to its current position — i.e. the user sees
                // the jump.
                initial={
                  block.shiftedFromY
                    ? { y: block.shiftedFromY * HEIGHT_PX, opacity: 1 }
                    : { opacity: 0, scale: 0.98 }
                }
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  block.shiftedFromY
                    ? { type: 'spring', stiffness: 280, damping: 22 }
                    : { duration: 0.3 }
                }
                style={{ height: Math.max(HEIGHT_PX * block.height, HEIGHT_PX / 2) }}
                className={`border px-3 flex items-center font-mono text-[10px] tracking-[0.06em] uppercase truncate ${style} ${
                  isReserved ? 'border-dashed' : ''
                } ${isLoading ? 'animate-pulse' : ''}`}
              >
                <span className="truncate">
                  {isLoading && <span className="opacity-60">↻ </span>}
                  {isReserved && <span className="opacity-60">⬚ </span>}
                  {block.label}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
