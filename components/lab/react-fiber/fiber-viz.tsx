'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react'
import { scenarios, type FiberScenario, type RenderStatus } from '@/lib/lab/react-fiber-data'
import { FiberNode } from './fiber-node'
import { CodePanel } from '../event-loop/code-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 900 },
  { label: '2×', ms: 450 },
]

// Walk the tree and collect all node IDs so we can count statuses.
function flattenIds(node: FiberScenario['tree']): string[] {
  const ids = [node.id]
  for (const child of node.children ?? []) {
    ids.push(...flattenIds(child))
  }
  return ids
}

function countByStatus(
  states: Record<string, RenderStatus>,
  ids: string[],
): { rendered: number; skipped: number; total: number } {
  let rendered = 0
  let skipped = 0
  for (const id of ids) {
    const s = states[id]
    if (s === 'rendering' || s === 'committed' || s === 'state-change') rendered++
    else if (s === 'skipped-memo') skipped++
  }
  return { rendered, skipped, total: ids.length }
}

export function FiberViz() {
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

  const scenario: FiberScenario = scenarios[scenarioIndex]
  const totalSteps = scenario.steps.length
  const effectiveStepIndex =
    prevScenarioIndex !== scenarioIndex ? 0 : stepIndex
  const step = scenario.steps[effectiveStepIndex]
  const isAtEnd = effectiveStepIndex >= totalSteps - 1

  const nodeIds = useMemo(() => flattenIds(scenario.tree), [scenario])
  const counts = countByStatus(step.states, nodeIds)

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
              disabled={effectiveStepIndex === 0}
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
              {step.note || ' '}
            </div>
          </div>
          <div className="shrink-0 flex gap-6 sm:text-right">
            <div>
              <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
                Rendered
              </div>
              <div className="font-serif text-[20px] font-black leading-none">
                {String(counts.rendered).padStart(2, '0')}
                <span className="font-mono text-[11px] text-muted font-normal ml-1">
                  / {String(counts.total).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
                Skipped
              </div>
              <div className="font-serif text-[20px] font-black leading-none">
                {String(counts.skipped).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code + Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6">
        <CodePanel code={scenario.code} activeLine={step.codeLine ?? 0} />

        <motion.div layout className="border border-stroke">
          <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
            <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
              Component Tree
            </div>
            <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
              {String(counts.total).padStart(2, '0')} nodes
            </div>
          </div>
          <div className="p-4">
            <FiberNode node={scenario.tree} states={step.states} depth={0} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
