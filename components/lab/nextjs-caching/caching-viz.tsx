'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { scenarios, type CachingScenario } from '@/lib/lab/nextjs-caching-data'
import { CacheLayer } from './cache-layer'
import { OriginNode } from './origin-node'

const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 900 },
  { label: '2×', ms: 450 },
]

export function CachingViz() {
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

  const scenario: CachingScenario = scenarios[scenarioIndex]
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

      {/* Blurb */}
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

        {/* Step note + timing */}
        <div className="px-4 py-3 bg-paper2 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
          <div className="flex-1">
            <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
              Now
            </div>
            <div className="font-mono text-[12px] text-ink leading-[1.6]">
              {step.note}
            </div>
          </div>
          {typeof step.timeMs === 'number' && (
            <div className="shrink-0 sm:text-right">
              <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
                Elapsed
              </div>
              <div className="font-serif text-[20px] font-black leading-none">
                {step.timeMs}
                <span className="font-mono text-[11px] text-muted font-normal ml-1">
                  ms
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cache pipeline */}
      <div className="flex flex-col gap-3">
        <CacheLayer
          title="Router Cache"
          side="Client"
          description="Client-side, in-memory store of RSC payloads per visited route. Powers instant <Link> navigation."
          meta="Default: 30s soft / 5min hard · cleared by hard refresh"
          status={step.router}
          focused={step.focus === 'router' || step.focus === 'client'}
        />
        <CacheLayer
          title="Full Route Cache"
          side="Server"
          description="Server-side, prerendered RSC payload + HTML for static routes. Survives across requests."
          meta="Default: persistent until revalidate / deploy · skipped on dynamic routes"
          status={step.fullRoute}
          focused={step.focus === 'fullRoute'}
        />
        <CacheLayer
          title="Request Memoization"
          side="Server"
          description="Per-render dedup for identical fetch() calls. Lives only as long as one server render."
          meta="Default: on for fetch(); reset between renders · React feature, not Next.js"
          status={step.requestMemo}
          focused={step.focus === 'requestMemo'}
        />
        <CacheLayer
          title="Data Cache"
          side="Server"
          description="Server-side, persistent cache of fetch() responses keyed by URL and options."
          meta="Default: cache forever · opt out with { cache: 'no-store' } or { next: { revalidate } }"
          status={step.data}
          focused={step.focus === 'data'}
        />
        <OriginNode status={step.origin} focused={step.focus === 'origin'} />
      </div>
    </div>
  )
}
