'use client'

import { motion } from 'framer-motion'
import { springBouncy, floatNudge } from '@/lib/lab/motion'

interface CodePanelProps {
  code: string[]
  activeLine: number // 1-indexed; 0 means none
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  return (
    <div className="border border-stroke bg-paper flex flex-col h-full">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="w-2 h-2 rounded-full bg-lab-amber" />
            <span className="w-2 h-2 rounded-full bg-lab-emerald" />
          </div>
          <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase ml-2">
            Source
          </div>
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {String(code.length).padStart(2, '0')} lines
        </div>
      </div>
      <pre className="p-4 overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <code className="font-mono text-[12.5px] leading-[1.85] block">
          {code.map((line, i) => {
            const lineNum = i + 1
            const active = lineNum === activeLine
            return (
              <motion.div
                key={i}
                layout
                animate={{
                  backgroundColor: active
                    ? 'var(--lab-amber-soft)'
                    : 'rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 px-2 -mx-2 relative"
              >
                {/* Active line gutter marker — bouncy slide between lines */}
                {active && (
                  <motion.span
                    layoutId="code-marker"
                    className="absolute left-[-12px] top-0 bottom-0 w-[3px] bg-lab-amber"
                    transition={springBouncy}
                  />
                )}
                <span
                  className={`select-none w-6 text-right shrink-0 transition-colors ${
                    active ? 'text-lab-amber font-bold' : 'text-faint'
                  }`}
                >
                  {String(lineNum).padStart(2, '0')}
                </span>
                <span
                  className={`transition-colors ${
                    active ? 'text-ink font-medium' : 'text-muted'
                  }`}
                >
                  {line || ' '}
                </span>
                {active && (
                  <motion.span
                    initial={{ opacity: 0, x: -8, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={springBouncy}
                    variants={floatNudge}
                    className="ml-auto font-mono text-[9px] text-lab-amber tracking-[0.14em] uppercase shrink-0"
                  >
                    <motion.span variants={floatNudge} animate="animate" className="inline-block">
                      ▶ running
                    </motion.span>
                  </motion.span>
                )}
              </motion.div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
