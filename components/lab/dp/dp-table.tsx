'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { CellState, DPCell, DPStep } from '@/lib/lab/dp-data'
import { springBouncy } from '@/lib/lab/motion'

interface DPTableProps {
  step: DPStep
}

const CELL_TONE: Record<CellState, string> = {
  empty: 'border-stroke bg-paper2 text-faint',
  computing: 'border-lab-amber bg-lab-amber text-paper animate-pulse',
  filled: 'border-stroke2 bg-paper text-ink',
  reading: 'border-lab-blue bg-lab-blue-soft text-lab-blue',
  answer: 'border-lab-emerald bg-lab-emerald text-paper',
}

export function DPTable({ step }: DPTableProps) {
  const { row1d, grid, rowLabels, colLabels, formula } = step

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          DP table
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {row1d ? '1D' : grid ? '2D' : ''}
        </div>
      </div>

      <div className="bg-paper2 p-4 sm:p-5 overflow-x-auto">
        {row1d && <Row1D cells={row1d} />}
        {grid && (
          <Grid2D
            grid={grid}
            rowLabels={rowLabels}
            colLabels={colLabels}
          />
        )}

        {formula && (
          <div className="mt-4 border border-stroke bg-paper px-3 py-2">
            <div className="font-mono text-[10px] text-lab-amber tracking-[0.14em] uppercase mb-1">
              Formula
            </div>
            <code className="font-mono text-[12px] text-ink leading-snug">
              {formula}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}

function CellBox({ cell, index }: { cell: DPCell; index?: number | string }) {
  return (
    <motion.div
      layout
      animate={{
        scale:
          cell.state === 'computing' || cell.state === 'reading'
            ? [1, 1.1, 1]
            : 1,
      }}
      transition={
        cell.state === 'empty' || cell.state === 'filled'
          ? springBouncy
          : { duration: 0.5, ease: 'easeInOut' }
      }
      className={`min-w-[44px] h-12 sm:h-14 border-2 flex flex-col items-center justify-center font-serif text-[15px] font-black ${CELL_TONE[cell.state]} transition-colors`}
    >
      {cell.value === null ? (
        <span className="font-mono text-[9px] opacity-70">?</span>
      ) : (
        <span className="leading-none">{cell.value}</span>
      )}
      {index !== undefined && (
        <span className="font-mono text-[8px] tracking-[0.08em] opacity-60 mt-0.5">
          {index}
        </span>
      )}
    </motion.div>
  )
}

function Row1D({ cells }: { cells: DPCell[] }) {
  return (
    <div className="inline-flex gap-1.5">
      <AnimatePresence initial={false}>
        {cells.map((cell, i) => (
          <CellBox key={i} cell={cell} index={i} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Grid2D({
  grid,
  rowLabels,
  colLabels,
}: {
  grid: DPCell[][]
  rowLabels?: string[]
  colLabels?: string[]
}) {
  return (
    <div className="inline-flex flex-col gap-1.5">
      {/* Column headers */}
      {colLabels && (
        <div className="inline-flex gap-1.5">
          {/* Top-left corner spacer */}
          <div className="min-w-[40px] h-10 flex items-center justify-center font-mono text-[10px] text-faint tracking-[0.08em] uppercase">
            i \ j
          </div>
          {colLabels.map((label, j) => (
            <div
              key={j}
              className="min-w-[44px] h-10 flex items-center justify-center font-mono text-[11px] tracking-[0.04em] text-lab-amber font-bold"
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {grid.map((row, i) => (
        <div key={i} className="inline-flex gap-1.5 items-center">
          {rowLabels && (
            <div className="min-w-[40px] h-12 sm:h-14 flex items-center justify-center font-mono text-[11px] tracking-[0.04em] text-lab-amber font-bold">
              {rowLabels[i]}
            </div>
          )}
          {row.map((cell, j) => (
            <CellBox key={j} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}
