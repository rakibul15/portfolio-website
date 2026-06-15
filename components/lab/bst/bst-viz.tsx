'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, GripVertical } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { scenarios, type BSTScenario } from '@/lib/lab/bst-data'
import { TreeView } from './tree-view'
import { CodePanel } from '../event-loop/code-panel'

const SPEEDS = [
  { label: '0.5×', ms: 1800 },
  { label: '1×', ms: 1100 },
  { label: '2×', ms: 550 },
]

type Language = 'js' | 'go'

export function BSTViz() {
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

  const scenario: BSTScenario = scenarios[scenarioIndex]
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
            <div className="flex items-center gap-3 font-mono text-[10px] text-faint tracking-[0.06em]">
              <span>
                <span className="text-muted">time:</span>{' '}
                <span className="text-ink">{scenario.complexity.time}</span>
              </span>
              <span className="text-stroke2">·</span>
              <span>
                <span className="text-muted">space:</span>{' '}
                <span className="text-ink">{scenario.complexity.space}</span>
              </span>
            </div>
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

        <div className="px-4 py-3 bg-paper2">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">
            Now
          </div>
          <div className="font-mono text-[12px] text-ink leading-[1.6]">{step.note}</div>
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="flex lg:hidden flex-col gap-4">
        <TreeView step={step} />
        <VariablesPanel vars={step.vars} />
        <div className="flex flex-col gap-2 min-w-0">
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

      {/* Desktop: resizable */}
      <div className="hidden lg:block">
        <Group orientation="horizontal" className="min-h-[560px]">
          <Panel defaultSize={60} minSize={30} className="min-w-0">
            <div className="flex flex-col gap-4 pr-2 h-full overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col gap-4">
                <TreeView step={step} />
                <VariablesPanel vars={step.vars} />
              </div>
            </div>
          </Panel>
          <Separator className="group relative w-1 mx-2 bg-stroke hover:bg-accent active:bg-accent transition-colors cursor-col-resize">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 border border-stroke bg-paper2 text-muted group-hover:border-accent group-hover:text-accent transition-colors">
              <GripVertical className="w-3 h-3" />
            </div>
          </Separator>
          <Panel defaultSize={40} minSize={25} className="min-w-0">
            <div className="flex flex-col gap-2 pl-2 h-full">
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
              <div className="flex-1 min-h-0 overflow-y-auto border border-stroke">
                <CodePanel
                  code={scenario.code[language]}
                  activeLine={step.codeLine ?? 0}
                />
              </div>
            </div>
          </Panel>
        </Group>
      </div>
    </div>
  )
}

function VariablesPanel({
  vars,
}: {
  vars: Array<{ label: string; value: string }>
}) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-2.5 border-b border-stroke flex items-center justify-between">
        <span className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          Variables
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {vars.length} tracked
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 divide-y divide-stroke sm:divide-y-0 sm:divide-x lg:divide-y lg:divide-x-0 xl:divide-y-0 xl:divide-x">
        {vars.map((v) => (
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
  )
}
