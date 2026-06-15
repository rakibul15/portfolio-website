'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { HeapNodeState, HeapStep } from '@/lib/lab/heap-data'
import { springBouncy } from '@/lib/lab/motion'

interface HeapArrayViewProps {
  step: HeapStep
}

const CELL_STATE: Record<HeapNodeState, string> = {
  normal: 'bg-paper border-stroke text-ink',
  comparing: 'bg-lab-blue border-lab-blue text-paper',
  'swap-pair': 'bg-lab-amber border-lab-amber text-paper',
  'just-swapped': 'bg-lab-emerald border-lab-emerald text-paper',
  new: 'bg-lab-emerald-soft border-lab-emerald text-lab-emerald',
  'sift-target': 'bg-lab-amber-soft border-lab-amber text-lab-amber',
  extracted: 'bg-accent border-accent text-paper opacity-60',
  'leaf-skipped': 'bg-paper2 border-stroke text-faint',
  kth: 'bg-lab-purple border-lab-purple text-paper',
}

export function HeapArrayView({ step }: HeapArrayViewProps) {
  const { array, states, output, remaining, currentInput } = step

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-emerald tracking-[0.16em] uppercase">
          Array layout
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          a[i] · parent = (i−1) ≫ 1 · children = 2i+1, 2i+2
        </div>
      </div>

      <div className="bg-paper2 p-4 sm:p-5 overflow-x-auto">
        {array.length === 0 ? (
          <div className="font-mono text-[10px] text-faint italic tracking-[0.04em] py-3">
            empty
          </div>
        ) : (
          <div className="inline-flex flex-col gap-1.5 min-w-full">
            {/* Cells */}
            <div className="flex gap-1.5">
              <AnimatePresence initial={false}>
                {array.map((v, i) => {
                  const state: HeapNodeState = states[i] ?? 'normal'
                  return (
                    <motion.div
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.6, y: -6 }}
                      animate={{
                        opacity: 1,
                        scale:
                          state === 'new' || state === 'just-swapped'
                            ? [1, 1.18, 1]
                            : state === 'comparing'
                              ? [1, 1.08, 1]
                              : 1,
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.18 } }}
                      transition={
                        state === 'normal' || state === 'leaf-skipped'
                          ? springBouncy
                          : { duration: 0.5, ease: 'easeInOut' }
                      }
                      whileHover={{ scale: 1.06, y: -2 }}
                      className={`w-12 h-12 sm:w-14 sm:h-14 border-2 flex items-center justify-center font-serif text-[16px] sm:text-[18px] font-black ${CELL_STATE[state]} transition-colors cursor-default`}
                    >
                      {v}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Index row */}
            <div className="flex gap-1.5">
              {array.map((_, i) => (
                <div
                  key={i}
                  className="w-12 sm:w-14 flex items-center justify-center font-mono text-[10px] text-faint tracking-[0.06em]"
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remaining input stream (top-K scenario) */}
        {remaining && remaining.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stroke">
            <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-2">
              Stream remaining ({remaining.length})
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <AnimatePresence>
                {remaining.map((v, i) => (
                  <motion.span
                    key={`${i}-${v}`}
                    layout
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={springBouncy}
                    className="font-mono text-[11px] text-muted border border-stroke px-2 py-1 bg-paper"
                  >
                    {v}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {currentInput !== undefined && (
          <div className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.06em]">
            <span className="text-faint uppercase tracking-[0.1em]">
              processing:
            </span>
            <motion.span
              key={currentInput}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springBouncy}
              className="font-serif text-[14px] font-black border border-lab-amber bg-lab-amber text-paper px-2 py-1 leading-none"
            >
              {currentInput}
            </motion.span>
          </div>
        )}

        {/* Output (extract scenario) */}
        {output && (
          <div className="mt-4 pt-3 border-t border-stroke">
            <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-2">
              Output (extracted, in order)
            </div>
            <div className="flex gap-1.5 flex-wrap min-h-[40px] items-center">
              {output.length === 0 ? (
                <span className="font-mono text-[10px] text-faint italic">
                  []
                </span>
              ) : (
                <AnimatePresence>
                  {output.map((v, i) => (
                    <motion.span
                      key={`${i}-${v}`}
                      initial={{ opacity: 0, scale: 0.6, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={springBouncy}
                      className="font-serif text-[14px] font-black border border-lab-emerald bg-lab-emerald-soft text-lab-emerald px-2.5 py-1 leading-none"
                    >
                      {v}
                    </motion.span>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
