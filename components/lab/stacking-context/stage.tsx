'use client'

import { motion } from 'framer-motion'
import type { StackingBox, StackingScenario } from '@/lib/lab/stacking-context-data'

interface StageProps {
  scenario: StackingScenario
  highlightIds: string[]
  showPaintOrder: boolean
  showWinner: boolean
}

// accent → an antagonist box (the one that beats the modal in the bug scenarios)
// ink    → the central / focused element (modal, hero)
// paper3 → an ancestor that creates a stacking context — wrap in muted lab-purple
//          to mark it as a "trap" element when the scenario is buggy
// paper2 → background / generic
const TONE_PAINTED: Record<StackingBox['tone'], string> = {
  accent: 'bg-accent text-paper border-accent',
  ink: 'bg-lab-blue text-paper border-lab-blue',
  paper3: 'bg-lab-purple-soft text-lab-purple border-lab-purple',
  paper2: 'bg-paper2 text-muted border-stroke',
}

export function Stage({
  scenario,
  highlightIds,
  showPaintOrder,
  showWinner,
}: StageProps) {
  const winnerBox = scenario.boxes.find((b) => b.id === scenario.winnerId)

  return (
    <div className="border border-stroke flex flex-col">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Rendered result
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {String(scenario.boxes.length).padStart(2, '0')} boxes
        </div>
      </div>

      <div className="relative bg-paper2 p-4 sm:p-5">
        {/* Stage area */}
        <div className="relative w-full h-[320px] sm:h-[360px] border border-stroke bg-paper">
          {scenario.boxes
            // Render in paint-order so higher paintOrder is on top
            .slice()
            .sort((a, b) => a.paintOrder - b.paintOrder)
            .map((box) => {
              const isHighlighted = highlightIds.includes(box.id)
              return (
                <motion.div
                  key={box.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow: isHighlighted
                      ? '0 0 0 2px var(--red)'
                      : '0 0 0 0px transparent',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: `${box.y}%`,
                    left: `${box.x}%`,
                    width: `${box.w}%`,
                    height: `${box.h}%`,
                  }}
                  className={`border ${TONE_PAINTED[box.tone]} flex flex-col items-center justify-center gap-1.5 p-2`}
                >
                  <span className="font-serif text-[15px] sm:text-[17px] font-black tracking-tight leading-none">
                    {box.label}
                  </span>
                  {(box.declaredZ !== undefined || box.contextReason) && (
                    <span className="font-mono text-[9px] tracking-[0.06em] opacity-85 text-center leading-snug px-1">
                      {box.declaredZ !== undefined && `z: ${box.declaredZ}`}
                      {box.contextReason && (
                        <>
                          {box.declaredZ !== undefined && ' · '}
                          {box.contextReason}
                        </>
                      )}
                    </span>
                  )}
                  {showPaintOrder && (
                    <span className="font-mono text-[9px] tracking-[0.16em] uppercase px-1.5 py-[2px] border border-current opacity-90 mt-1">
                      paint #{box.paintOrder}
                    </span>
                  )}
                </motion.div>
              )
            })}

          {/* Winner callout */}
          {showWinner && winnerBox && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 border whitespace-nowrap font-mono text-[10px] tracking-[0.14em] uppercase ${
                scenario.isBug
                  ? 'bg-accent border-accent text-paper'
                  : 'bg-lab-emerald border-lab-emerald text-paper'
              }`}
            >
              {scenario.isBug ? '⚠ bug — ' : '✓ '}
              {winnerBox.label} is on top
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
