'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { scenarios, type RSCScenario } from '@/lib/lab/rsc-boundary-data'
import { PropRow } from './prop-row'
import { CodePanel } from '../event-loop/code-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 900 },
  { label: '2×', ms: 450 },
]

export function BoundaryViz() {
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

  const scenario: RSCScenario = scenarios[scenarioIndex]
  const totalSteps = scenario.steps.length
  const effectiveStepIndex =
    prevScenarioIndex !== scenarioIndex ? 0 : stepIndex
  const step = scenario.steps[effectiveStepIndex]
  const isAtEnd = effectiveStepIndex >= totalSteps - 1

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

  // Counts for the status banner
  let accepted = 0
  let rejected = 0
  for (const p of scenario.props) {
    if (step.states[p.id] === 'accepted') accepted++
    else if (step.states[p.id] === 'rejected') rejected++
  }

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
              disabled={effectiveStepIndex === 0}
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
              <span className="text-ink">{String(effectiveStepIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(totalSteps).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Step note + counts */}
        <div className="px-4 py-3 bg-paper2 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
          <div className="flex-1">
            <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
              Now
            </div>
            <div className="font-mono text-[12px] text-ink leading-[1.6]">
              {step.note}
            </div>
          </div>
          <div className="shrink-0 flex gap-6">
            <div>
              <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
                Accepted
              </div>
              <div className="font-serif text-[20px] font-black leading-none">
                {String(accepted).padStart(2, '0')}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
                Rejected
              </div>
              <div
                className={`font-serif text-[20px] font-black leading-none ${
                  rejected > 0 ? 'text-accent' : ''
                }`}
              >
                {String(rejected).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {step.failed && (
          <div className="px-4 py-3 border-t border-accent bg-paper">
            <div className="font-mono text-[11px] text-accent tracking-[0.06em] leading-snug">
              Render failed at the boundary. The RSC payload is incomplete. The
              page would throw a runtime error.
            </div>
          </div>
        )}
      </div>

      {/* Server | Boundary | Client */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start">
        {/* Server side */}
        <PropSide
          title="Server Component"
          subtitle={`<${scenario.serverComponent} />`}
          side="server"
          props={scenario.props}
          states={step.states}
          focus={step.focus}
        />

        {/* Boundary divider */}
        <div className="hidden lg:flex flex-col items-center gap-2 pt-6 self-stretch">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-faint -rotate-90 whitespace-nowrap mt-8">
            Boundary
          </div>
          <div className="flex-1 w-px bg-stroke2 my-2" />
          <div className="font-mono text-[9px] text-accent tracking-[0.12em] uppercase">
            →
          </div>
          <div className="flex-1 w-px bg-stroke2 my-2" />
        </div>

        {/* Client side */}
        <PropSide
          title="Client Component"
          subtitle={`<${scenario.clientComponent} />`}
          side="client"
          props={scenario.props}
          states={step.states}
          focus={step.focus}
        />
      </div>

      {/* Payload */}
      <div className="border border-stroke">
        <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
            RSC Payload (wire format)
          </div>
          <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
            what crosses the network
          </div>
        </div>
        <pre className="p-4 sm:p-5 font-mono text-[11.5px] leading-[1.85] overflow-x-auto bg-paper2 min-h-[120px]">
          {step.payload.length === 0 ? (
            <span className="text-faint italic">{'// nothing crossed yet'}</span>
          ) : (
            <code className="text-ink">
              {'{\n'}
              <AnimatePresence initial={false}>
                {step.payload.map((line, i) => (
                  <motion.span
                    key={`${i}-${line}`}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="block pl-4"
                  >
                    {line}
                    {i < step.payload.length - 1 ? ',' : ''}
                  </motion.span>
                ))}
              </AnimatePresence>
              {'}'}
            </code>
          )}
        </pre>
      </div>

      {/* Source code */}
      <CodePanel code={scenario.serverCode} activeLine={step.codeLine ?? 0} />
    </div>
  )
}

function PropSide({
  title,
  subtitle,
  side,
  props,
  states,
  focus,
}: {
  title: string
  subtitle: string
  side: 'server' | 'client'
  props: RSCScenario['props']
  states: Record<string, string>
  focus: string | null
}) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          {title}
        </div>
        <div className="font-mono text-[12px] text-ink tracking-[0.02em] mt-1">
          {subtitle}
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-2">
        {props.map((p) => (
          <PropRow
            key={p.id}
            prop={p}
            status={(states[p.id] ?? 'pending') as never}
            side={side}
            focused={focus === p.id}
          />
        ))}
      </div>
    </div>
  )
}
