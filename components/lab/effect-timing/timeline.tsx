'use client'

import { motion } from 'framer-motion'
import type { EffectScenario, EffectStep, PhaseStatus } from '@/lib/lab/effect-timing-data'

interface TimelineProps {
  phases: EffectScenario['phases']
  statuses: EffectStep['phaseStatus']
}

// pending = not yet reached (faint)
// active  = the phase happening NOW (lab-amber)
// done    = already happened (lab-emerald subtle)
// skipped = phase that won't run in this scenario (muted strike)
const PILL: Record<PhaseStatus, string> = {
  pending: 'border-stroke text-faint bg-paper',
  active: 'border-lab-amber bg-lab-amber text-paper',
  done: 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald',
  skipped: 'border-stroke text-faint bg-paper2 line-through opacity-60',
}

export function Timeline({ phases, statuses }: TimelineProps) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Lifecycle Timeline
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {phases.length} phases
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 sm:gap-0">
          {phases.map((phase, i) => {
            const status: PhaseStatus = statuses[phase.id] ?? 'pending'
            return (
              <div key={phase.id} className="flex items-center sm:flex-1 sm:min-w-0">
                <motion.div
                  layout
                  className={`flex-1 sm:flex-none sm:flex-1 border ${PILL[status]} transition-colors px-3 py-3 sm:px-4 sm:py-4 min-w-0`}
                >
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-80 leading-none">
                    Phase {i + 1}
                  </div>
                  <div className="font-serif text-[16px] sm:text-[18px] font-black tracking-tight mt-1.5 leading-tight truncate">
                    {phase.label}
                  </div>
                  {phase.sublabel && (
                    <div className="font-mono text-[10px] tracking-[0.04em] opacity-75 mt-1 leading-snug truncate">
                      {phase.sublabel}
                    </div>
                  )}
                </motion.div>

                {/* Arrow between pills (desktop) */}
                {i < phases.length - 1 && (
                  <div
                    className={`hidden sm:flex items-center justify-center w-6 shrink-0 font-mono text-[14px] ${
                      status === 'done' ? 'text-lab-emerald' : 'text-stroke2'
                    } transition-colors`}
                    aria-hidden
                  >
                    →
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
