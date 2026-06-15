'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { scenarios, type CWVScenario, type Vital } from '@/lib/lab/web-vitals-data'
import { ScoreCard } from './score-card'
import { ViewportMockup } from './viewport-mockup'
import { CodePanel } from '../event-loop/code-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 1000 },
  { label: '2×', ms: 500 },
]

const PHASE_LABEL: Record<'before-fix' | 'transition' | 'after-fix', string> = {
  'before-fix': 'Before fix',
  transition: 'Applying fix',
  'after-fix': 'After fix',
}

const PHASE_BORDER: Record<'before-fix' | 'transition' | 'after-fix', string> = {
  'before-fix': 'border-accent',
  transition: 'border-stroke2',
  'after-fix': 'border-ink',
}

export function WebVitalsViz() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [prevScenarioIndex, setPrevScenarioIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  if (prevScenarioIndex !== scenarioIndex) {
    setPrevScenarioIndex(scenarioIndex)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const scenario: CWVScenario = scenarios[scenarioIndex]
  const totalSteps = scenario.steps.length
  const step = scenario.steps[stepIndex]
  const isAtEnd = stepIndex >= totalSteps - 1

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

  // For each scenario, only the focused vital is "active" — others stay pending
  // visually so the user keeps a sense of all three. But the only score we
  // populate in step data is the focused vital.
  const vitals: Vital[] = ['lcp', 'inp', 'cls']

  // Choose code based on phase
  const code =
    step.phase === 'before-fix'
      ? scenario.before
      : step.phase === 'after-fix'
        ? scenario.after
        : scenario.after // transition step shows the "after" code
  const codeTitle =
    step.phase === 'before-fix'
      ? 'Source — before fix'
      : step.phase === 'after-fix'
        ? 'Source — after fix'
        : 'Source — applying fix'

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {/* Scenario picker */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => setScenarioIndex(i)}
            className={`font-mono text-[11px] tracking-[0.06em] px-4 py-2 border transition-colors ${
              i === scenarioIndex
                ? 'border-ink bg-ink text-paper'
                : 'border-stroke text-muted hover:border-ink hover:text-ink'
            }`}
          >
            {sc.name}
          </button>
        ))}
      </div>

      <p className="text-[14px] text-muted leading-[1.75] font-light max-w-[680px] -mt-4">
        {scenario.blurb}
      </p>

      {/* Controls */}
      <div className="border border-stroke">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-3 border-b border-stroke">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setStepIndex(0)
                setIsPlaying(false)
              }}
              className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors"
              aria-label="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted disabled:hover:border-stroke"
              aria-label="Previous step"
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
              <span className="text-ink">{String(stepIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(totalSteps).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Phase banner */}
        <motion.div
          key={step.phase}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className={`px-4 py-2 border-b ${PHASE_BORDER[step.phase]}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink">
              {PHASE_LABEL[step.phase]}
            </span>
            <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
              {step.event}
            </span>
          </div>
        </motion.div>

        {/* Step note */}
        <div className="px-4 py-3 bg-paper2">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
            Now
          </div>
          <div className="font-mono text-[12px] text-ink leading-[1.6]">{step.note}</div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {vitals.map((v) => (
          <ScoreCard
            key={v}
            vital={v}
            score={step.scores[v]}
            focused={v === scenario.vital}
          />
        ))}
      </div>

      {/* Viewport + code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ViewportMockup
          blocks={step.blocks}
          timeMs={step.timeMs}
          event={step.event}
        />
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase">
            {codeTitle}
          </div>
          <CodePanel code={code} activeLine={step.codeLine ?? 0} />
        </div>
      </div>
    </div>
  )
}
