'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { examples, type ELExample } from '@/lib/lab/event-loop-data'
import { QueuePanel } from './queue-panel'
import { CodePanel } from './code-panel'
import { ConsolePanel } from './console-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 900 },
  { label: '2×', ms: 450 },
]

export function EventLoopViz() {
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  // Track the example index seen during last render. When it changes,
  // we reset stepIndex and isPlaying during render (the React-recommended
  // pattern for "reset state when a prop changes" — avoids setState-in-effect).
  const [prevExampleIndex, setPrevExampleIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  if (prevExampleIndex !== exampleIndex) {
    setPrevExampleIndex(exampleIndex)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const example: ELExample = examples[exampleIndex]
  const totalSteps = example.steps.length
  const step = example.steps[stepIndex]
  const isAtEnd = stepIndex >= totalSteps - 1

  const reset = useCallback(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [])

  // Auto-advance when playing. When we reach the end, the effect simply
  // stops scheduling new ticks — the button reads `isAtEnd` to switch
  // its icon to "replay", so we don't need to flip `isPlaying` here.
  useEffect(() => {
    if (!isPlaying || isAtEnd) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
    }, SPEEDS[speedIndex].ms)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [isPlaying, stepIndex, speedIndex, isAtEnd, totalSteps])

  const next = () => setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0))

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {/* Example picker */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex, i) => (
          <button
            key={ex.id}
            onClick={() => setExampleIndex(i)}
            className={`font-mono text-[11px] tracking-[0.06em] px-4 py-2 border transition-colors ${
              i === exampleIndex
                ? 'border-ink bg-ink text-paper'
                : 'border-stroke text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Blurb */}
      <p className="text-[14px] text-muted leading-[1.75] font-light max-w-[680px] -mt-4">
        {example.blurb}
      </p>

      {/* Controls */}
      <div className="border border-stroke">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-b border-stroke">
          <div className="flex items-center gap-1.5">
            <button
              onClick={reset}
              className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors"
              aria-label="Reset"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted disabled:hover:border-stroke"
              aria-label="Previous step"
              title="Step back"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (isAtEnd) {
                  setStepIndex(0)
                  setIsPlaying(true)
                } else {
                  setIsPlaying((p) => !p)
                }
              }}
              className="p-2 border border-ink bg-ink text-paper hover:bg-accent hover:border-accent transition-colors"
              aria-label={isAtEnd ? 'Replay' : isPlaying ? 'Pause' : 'Play'}
            >
              {isAtEnd ? (
                <RotateCcw className="w-3.5 h-3.5" />
              ) : isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={next}
              disabled={isAtEnd}
              className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted disabled:hover:border-stroke"
              aria-label="Next step"
              title="Step forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mr-1">
                Speed
              </span>
              {SPEEDS.map((sp, i) => (
                <button
                  key={sp.label}
                  onClick={() => setSpeedIndex(i)}
                  className={`font-mono text-[10px] px-2.5 py-1 border transition-colors ${
                    i === speedIndex
                      ? 'border-ink text-ink'
                      : 'border-stroke text-muted hover:text-ink hover:border-ink'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            <div className="font-mono text-[11px] text-muted tracking-[0.06em]">
              Step{' '}
              <span className="text-ink">
                {String(stepIndex + 1).padStart(2, '0')}
              </span>
              {' / '}
              {String(totalSteps).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Step note */}
        <div className="px-4 py-3 bg-paper2">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
            Now
          </div>
          <div className="font-mono text-[12px] text-ink leading-[1.6]">
            {step.note}
          </div>
        </div>
      </div>

      {/* Code + Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodePanel code={example.code} activeLine={step.line} />
        <ConsolePanel output={step.output} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QueuePanel
          title="Call Stack"
          hint="LIFO — runs synchronously"
          items={step.stack}
          variant="stack"
          count={step.stack.length}
        />
        <QueuePanel
          title="Microtask Queue"
          hint="Promises · drained between tasks"
          items={step.micro}
          variant="queue"
          count={step.micro.length}
        />
        <QueuePanel
          title="Macrotask Queue"
          hint="setTimeout · I/O · UI events"
          items={step.macro}
          variant="queue"
          count={step.macro.length}
        />
      </div>
    </div>
  )
}
