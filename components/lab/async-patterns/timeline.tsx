'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type {
  AsyncPatternScenario,
  TimelineEvent,
} from '@/lib/lab/async-patterns-data'

interface TimelineProps {
  scenario: AsyncPatternScenario
  events: TimelineEvent[]
  nowMs: number
}

const TONE_BG: Record<NonNullable<TimelineEvent['tone']>, string> = {
  accent: 'bg-accent text-paper border-accent',
  ink: 'bg-ink text-paper border-ink',
  muted: 'bg-paper3 text-ink border-stroke2',
  success: 'bg-ink text-paper border-ink',
}

const TONE_TICK: Record<NonNullable<TimelineEvent['tone']>, string> = {
  accent: 'bg-accent',
  ink: 'bg-ink',
  muted: 'bg-stroke2',
  success: 'bg-ink',
}

export function Timeline({ scenario, events, nowMs }: TimelineProps) {
  const { totalDurationMs, gridStepMs, lanes } = scenario

  const toPercent = (ms: number) => (ms / totalDurationMs) * 100

  // Gridline timestamps (ms)
  const grid: number[] = []
  for (let t = 0; t <= totalDurationMs; t += gridStepMs) grid.push(t)

  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Timeline
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          t = {nowMs >= 1000 ? `${(nowMs / 1000).toFixed(2)}s` : `${nowMs}ms`}
        </div>
      </div>

      <div className="bg-paper2 p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[520px]">
          {/* Time axis */}
          <div className="relative h-6 ml-[120px] sm:ml-[140px]">
            {grid.map((t) => (
              <div
                key={t}
                style={{ left: `${toPercent(t)}%` }}
                className="absolute top-0 -translate-x-1/2"
              >
                <span className="font-mono text-[9px] text-faint tracking-[0.04em]">
                  {t >= 1000 ? `${(t / 1000).toFixed(1)}s` : `${t}`}
                </span>
              </div>
            ))}
          </div>

          {/* Lanes */}
          <div className="flex flex-col gap-2">
            {lanes.map((lane) => {
              const laneEvents = events.filter((e) => e.laneId === lane.id)
              return (
                <div key={lane.id} className="flex items-stretch gap-3">
                  {/* Lane label */}
                  <div className="w-[108px] sm:w-[128px] shrink-0 flex flex-col justify-center py-2 px-2 border-r border-stroke2">
                    <div className="font-mono text-[10px] text-ink tracking-[0.06em] leading-tight">
                      {lane.label}
                    </div>
                    {lane.hint && (
                      <div className="font-mono text-[9px] text-faint tracking-[0.04em] leading-snug mt-0.5">
                        {lane.hint}
                      </div>
                    )}
                  </div>

                  {/* Lane track */}
                  <div className="relative flex-1 h-12 sm:h-14 bg-paper border border-stroke">
                    {/* Vertical gridlines */}
                    {grid.map((t) => (
                      <div
                        key={t}
                        style={{ left: `${toPercent(t)}%` }}
                        className="absolute top-0 bottom-0 w-px bg-stroke2/40"
                      />
                    ))}

                    {/* "Now" marker */}
                    {nowMs >= 0 && nowMs <= totalDurationMs && (
                      <motion.div
                        layout
                        animate={{ left: `${toPercent(nowMs)}%` }}
                        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                        className="absolute top-0 bottom-0 w-[2px] bg-accent z-20"
                      />
                    )}

                    {/* Events */}
                    <AnimatePresence initial={false}>
                      {laneEvents.map((event) => {
                        const isInstant = event.timeMs !== undefined
                        const tone = event.tone ?? 'muted'

                        if (isInstant) {
                          return (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.2 }}
                              style={{ left: `${toPercent(event.timeMs!)}%` }}
                              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
                            >
                              <div className={`w-2.5 h-2.5 ${TONE_TICK[tone]}`} />
                              <span className="font-mono text-[9px] tracking-[0.04em] whitespace-nowrap text-ink bg-paper px-1.5 py-[2px] border border-stroke">
                                {event.label}
                              </span>
                            </motion.div>
                          )
                        }

                        // Ranged event
                        const left = toPercent(event.startMs ?? 0)
                        const width =
                          toPercent((event.endMs ?? 0) - (event.startMs ?? 0))
                        return (
                          <motion.div
                            key={event.id}
                            layout
                            initial={{ opacity: 0, scaleX: 0.8 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              transformOrigin: 'left center',
                            }}
                            className={`absolute top-1/2 -translate-y-1/2 h-7 sm:h-8 border flex items-center px-2 truncate font-mono text-[9.5px] tracking-[0.04em] ${TONE_BG[tone]} z-10`}
                          >
                            <span className="truncate">{event.label}</span>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
