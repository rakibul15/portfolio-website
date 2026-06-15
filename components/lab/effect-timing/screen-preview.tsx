'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ScreenState } from '@/lib/lab/effect-timing-data'

interface ScreenPreviewProps {
  screen: ScreenState
}

export function ScreenPreview({ screen }: ScreenPreviewProps) {
  return (
    <div className="border border-stroke flex flex-col">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          What the user sees
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {screen.mode === 'counter' ? (
            screen.counterPainted ? 'Painted' : 'Pending paint'
          ) : screen.tooltipPainted ? (
            screen.tooltipFlicker ? 'Painted — flicker!' : 'Painted'
          ) : (
            'Pending paint'
          )}
        </div>
      </div>

      <div className="flex-1 p-6 min-h-[220px] sm:min-h-[260px] flex items-center justify-center bg-paper2">
        {screen.mode === 'counter' ? (
          <CounterScreen screen={screen} />
        ) : (
          <TooltipScreen screen={screen} />
        )}
      </div>
    </div>
  )
}

function CounterScreen({ screen }: { screen: ScreenState }) {
  // If unpainted, show the previous value (counterValue - 1).
  // We rely on counterValue being the post-render value.
  const visible = screen.counterPainted
    ? screen.counterValue ?? 0
    : Math.max(0, (screen.counterValue ?? 0) - 1)

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase">
        click to increment
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={visible}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="font-serif text-[72px] sm:text-[88px] font-black leading-none border border-stroke px-10 py-4 bg-paper"
        >
          {visible}
        </motion.div>
      </AnimatePresence>
      {!screen.counterPainted && (
        <div className="font-mono text-[10px] text-accent tracking-[0.14em] uppercase">
          DOM updated, browser hasn&apos;t painted yet
        </div>
      )}
    </div>
  )
}

function TooltipScreen({ screen }: { screen: ScreenState }) {
  // tooltipTop is "%" of viewport space (0 = top of viewport, 100 = bottom)
  const top = screen.tooltipTop ?? 0
  const flicker = screen.tooltipFlicker && screen.tooltipPainted

  return (
    <div className="relative w-full h-[200px] sm:h-[240px] border border-stroke2 bg-paper overflow-hidden">
      {/* Viewport label */}
      <div className="absolute top-2 left-2 font-mono text-[9px] text-faint tracking-[0.12em] uppercase">
        viewport
      </div>
      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-faint tracking-[0.12em] uppercase">
        bottom edge
      </div>

      {/* Bottom edge indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-stroke2" />

      {/* Tooltip */}
      {screen.tooltipPainted && (
        <motion.div
          key={`${top}-${flicker}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute',
            top: `${Math.max(0, Math.min(100, top))}%`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className={`border px-4 py-2 font-mono text-[11px] tracking-[0.06em] whitespace-nowrap ${
            flicker
              ? 'border-accent bg-paper text-accent'
              : 'border-lab-emerald bg-lab-emerald text-paper'
          }`}
        >
          Tooltip
          {flicker && (
            <span className="ml-2 text-[9px] tracking-[0.14em] uppercase">
              ← clipped
            </span>
          )}
        </motion.div>
      )}

      {/* "Not painted" overlay */}
      {!screen.tooltipPainted && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] text-accent tracking-[0.14em] uppercase">
            DOM updated, browser hasn&apos;t painted yet
          </span>
        </div>
      )}
    </div>
  )
}
