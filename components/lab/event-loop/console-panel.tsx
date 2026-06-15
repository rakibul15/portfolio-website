'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConsolePanelProps {
  output: string[]
}

export function ConsolePanel({ output }: ConsolePanelProps) {
  return (
    <div className="border border-stroke flex flex-col">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Console
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {String(output.length).padStart(2, '0')} lines
        </div>
      </div>
      <div className="p-4 min-h-[120px]">
        <AnimatePresence initial={false}>
          {output.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] text-faint tracking-[0.04em] italic"
            >
              No output yet.
            </motion.div>
          ) : (
            output.map((line, i) => (
              <motion.div
                key={`${i}-${line}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-[12px] leading-[1.7] flex gap-3"
              >
                <span className="text-faint select-none">&gt;</span>
                <span className="text-ink">{line}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
