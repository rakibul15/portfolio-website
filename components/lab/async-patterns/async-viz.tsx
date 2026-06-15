'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { scenarios, type AsyncPatternScenario } from '@/lib/lab/async-patterns-data'
import { Timeline } from './timeline'
import { CodePanel } from '../event-loop/code-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1800 },
  { label: '1×', ms: 1100 },
  { label: '2×', ms: 550 },
]

type Language = 'js' | 'go'

export function AsyncViz() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(1)
  const [language, setLanguage] = useState<Language>('js')
  const [prevScenarioIndex, setPrevScenarioIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  if (prevScenarioIndex !== scenarioIndex) {
    setPrevScenarioIndex(scenarioIndex)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const scenario: AsyncPatternScenario = scenarios[scenarioIndex]
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

  return (
    <div className="flex flex-col gap-6">
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

      <p className="text-[14px] text-muted leading-[1.75] font-light max-w-[680px] -mt-2">
        {scenario.blurb}
      </p>

      {/* Controls */}
      <div className="border border-stroke">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-stroke">
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

          <div className="flex items-center gap-4 flex-wrap">
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

        {/* Step note */}
        <div className="px-4 py-3 bg-paper2">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
            Now
          </div>
          <div className="font-mono text-[12px] text-ink leading-[1.6]">{step.note}</div>
        </div>
      </div>

      {/* Two-column: timeline + variables on the left, code on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(360px,440px)] gap-6 items-start">
        <div className="flex flex-col gap-4 min-w-0">
          <Timeline scenario={scenario} events={step.events} nowMs={step.nowMs} />

          {/* Variables */}
          <div className="border border-stroke">
            <div className="px-4 py-2.5 border-b border-stroke flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
                Variables
              </span>
              <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
                {step.vars.length} tracked
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 divide-y divide-stroke sm:divide-y-0 sm:divide-x lg:divide-y lg:divide-x-0 xl:divide-y-0 xl:divide-x">
              {step.vars.map((v) => (
                <div
                  key={v.label}
                  className="flex items-baseline justify-between gap-3 px-4 py-2 min-w-0"
                >
                  <span className="font-mono text-[10px] text-muted tracking-[0.1em] uppercase whitespace-nowrap">
                    {v.label}
                  </span>
                  <span className="font-mono text-[12px] text-ink text-right truncate min-w-0">
                    {v.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code with language tabs */}
        <div className="lg:sticky lg:top-20 lg:self-start min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-1 self-start">
            {(['js', 'go'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 border transition-colors ${
                  language === lang
                    ? 'border-ink bg-ink text-paper'
                    : 'border-stroke text-muted hover:text-ink hover:border-ink'
                }`}
              >
                {lang === 'js' ? 'TypeScript' : 'Go'}
              </button>
            ))}
          </div>
          <CodePanel code={scenario.code[language]} activeLine={step.codeLine ?? 0} />
        </div>
      </div>
    </div>
  )
}
