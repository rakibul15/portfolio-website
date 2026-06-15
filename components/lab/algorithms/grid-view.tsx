'use client'

import { motion } from 'framer-motion'
import type { GridView, GridCellState } from '@/lib/lab/algorithms-data'
import { springBouncy } from '@/lib/lab/motion'

interface GridViewProps {
  view: GridView
}

const CELL_STYLE: Record<GridCellState, string> = {
  water: 'bg-lab-blue-soft border-lab-blue/30 text-lab-blue',
  land: 'bg-paper3 border-stroke2 text-ink',
  visiting: 'bg-lab-amber border-lab-amber text-paper',
  visited: 'bg-lab-emerald border-lab-emerald text-paper',
}

const CELL_LABEL: Record<GridCellState, string> = {
  water: '0',
  land: '1',
  visiting: '1',
  visited: '1',
}

export function GridViewRenderer({ view }: GridViewProps) {
  const { cols, cells, queue } = view

  return (
    <div className="border border-stroke bg-paper2 p-4 sm:p-6">
      <div className="grid gap-1.5 mb-5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: cols * 56 }}
      >
        {cells.map((state, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          return (
            <motion.div
              key={i}
              layout
              animate={{
                scale:
                  state === 'visiting'
                    ? [1, 1.15, 1.06]
                    : state === 'visited'
                      ? [1, 0.94, 1]
                      : 1,
                rotate: state === 'visiting' ? [0, -3, 3, 0] : 0,
              }}
              transition={
                state === 'visiting' || state === 'visited'
                  ? { duration: 0.55, ease: 'easeInOut' }
                  : springBouncy
              }
              whileHover={{ scale: 1.08, y: -2 }}
              className={`aspect-square border flex flex-col items-center justify-center font-mono text-[12px] sm:text-[13px] tracking-[0.04em] ${CELL_STYLE[state]} transition-colors cursor-default`}
            >
              <span className="font-serif text-[15px] sm:text-[18px] font-black leading-none">
                {CELL_LABEL[state]}
              </span>
              <span className="font-mono text-[8px] tracking-[0.04em] opacity-65 mt-0.5">
                {r},{c}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Queue */}
      <div className="border border-stroke bg-paper">
        <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
          <span className="font-mono text-[10px] text-lab-amber tracking-[0.16em] uppercase">
            BFS Queue
          </span>
          <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
            {queue.length === 0 ? 'empty' : `${queue.length} item${queue.length === 1 ? '' : 's'}`}
          </span>
        </div>
        <div className="p-3 flex flex-wrap gap-1.5 min-h-[44px] items-center">
          {queue.length === 0 ? (
            <span className="font-mono text-[10px] text-faint italic tracking-[0.04em]">
              ∅
            </span>
          ) : (
            queue.map((p, i) => (
              <motion.span
                key={`${p.r},${p.c},${i}`}
                initial={{ opacity: 0, x: -10, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                transition={springBouncy}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="font-mono text-[10px] tracking-[0.06em] border border-lab-amber bg-lab-amber-soft text-lab-amber px-2 py-1 cursor-default"
              >
                ({p.r}, {p.c})
              </motion.span>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] text-muted tracking-[0.04em]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-lab-blue/30 bg-lab-blue-soft" /> water
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-stroke2 bg-paper3" /> land
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-lab-amber bg-lab-amber" /> in queue / current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 border border-lab-emerald bg-lab-emerald" /> visited
        </span>
      </div>
    </div>
  )
}
