'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { TSStep, TypeBox, TypeBoxState } from '@/lib/lab/ts-types-data'
import { springBouncy } from '@/lib/lab/motion'

interface TypePanelProps {
  step: TSStep
}

const BOX_TONE: Record<TypeBoxState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  active: 'border-lab-amber bg-lab-amber text-paper',
  narrowed: 'border-lab-blue bg-lab-blue text-paper',
  eliminated: 'border-stroke bg-paper2 text-faint line-through opacity-60',
  inferred: 'border-lab-purple bg-lab-purple-soft text-lab-purple',
  result: 'border-lab-emerald bg-lab-emerald text-paper',
}

export function TypePanel({ step }: TypePanelProps) {
  const { expression, boxes, compare } = step

  return (
    <div className="flex flex-col gap-3">
      {expression && (
        <div className="border border-stroke bg-paper2 px-4 py-3">
          <div className="font-mono text-[10px] text-lab-purple tracking-[0.16em] uppercase mb-1.5">
            Expression
          </div>
          <code className="font-mono text-[12px] text-ink leading-snug block">
            {expression}
          </code>
        </div>
      )}

      {boxes && boxes.length > 0 && <TypeBoxes boxes={boxes} />}

      {compare && <CompareBlock compare={compare} />}
    </div>
  )
}

function TypeBoxes({ boxes }: { boxes: TypeBox[] }) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-2.5 border-b border-stroke flex items-center justify-between">
        <span className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          Types
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {boxes.length} candidates
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {boxes.map((box) => (
            <motion.div
              key={box.id}
              layout
              initial={{ opacity: 0, x: -8, scale: 0.95 }}
              animate={{
                opacity: 1,
                x: 0,
                scale:
                  box.state === 'active' ||
                  box.state === 'inferred' ||
                  box.state === 'result'
                    ? [1, 1.04, 1]
                    : 1,
              }}
              exit={{ opacity: 0, x: 8, transition: { duration: 0.2 } }}
              transition={
                box.state === 'normal'
                  ? springBouncy
                  : { duration: 0.5, ease: 'easeInOut' }
              }
              className={`border ${BOX_TONE[box.state]} px-3 py-2 transition-colors`}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <code className="font-mono text-[11.5px] tracking-[0.02em] leading-snug">
                  {box.label}
                </code>
                <span className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-80">
                  {box.state.replace('-', ' ')}
                </span>
              </div>
              {box.detail && (
                <div className="font-mono text-[10px] opacity-75 mt-1 leading-snug">
                  {box.detail}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CompareBlock({ compare }: { compare: NonNullable<TSStep['compare']> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Block label={compare.before.label} tone="lab-blue" lines={compare.before.lines} />
      <Block label={compare.after.label} tone="lab-emerald" lines={compare.after.lines} />
    </div>
  )
}

function Block({
  label,
  tone,
  lines,
}: {
  label: string
  tone: 'lab-blue' | 'lab-emerald'
  lines: string[]
}) {
  const headerTone = tone === 'lab-blue' ? 'text-lab-blue' : 'text-lab-emerald'
  return (
    <div className="border border-stroke">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span className={`font-mono text-[10px] ${headerTone} tracking-[0.16em] uppercase`}>
          {label}
        </span>
      </div>
      <pre className="p-3 bg-paper2 overflow-x-auto">
        <code className="font-mono text-[11.5px] leading-[1.7] block text-ink">
          {lines.map((line, i) => (
            <div key={i}>{line || ' '}</div>
          ))}
        </code>
      </pre>
    </div>
  )
}
