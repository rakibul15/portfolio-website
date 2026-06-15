'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Eye, EyeOff } from 'lucide-react'
import { scenarios, type TrickyOutputScenario } from '@/lib/lab/tricky-outputs-data'
import { springBouncy } from '@/lib/lab/motion'

const SPEEDS = [
  { label: '0.5×', ms: 2200 },
  { label: '1×', ms: 1400 },
  { label: '2×', ms: 700 },
]

export function TrickyViz() {
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

  const scenario: TrickyOutputScenario = scenarios[scenarioIndex]
  const totalSteps = scenario.steps.length
  const effectiveStepIndex =
    prevScenarioIndex !== scenarioIndex ? 0 : stepIndex
  const step = scenario.steps[effectiveStepIndex]
  const isAtEnd = effectiveStepIndex >= totalSteps - 1

  useEffect(() => {
    if (!isPlaying || isAtEnd) {
      if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null }
      return
    }
    timerRef.current = window.setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
    }, SPEEDS[speedIndex].ms)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [isPlaying, stepIndex, speedIndex, isAtEnd, totalSteps])

  const next = () => setStepIndex((i) => Math.min(i + 1, totalSteps - 1))
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc, i) => (
          <button key={sc.id} onClick={() => setScenarioIndex(i)} className={`font-mono text-[11px] tracking-[0.06em] px-4 py-2 border transition-colors ${i === scenarioIndex ? 'border-ink bg-ink text-paper' : 'border-stroke text-muted hover:border-ink hover:text-ink'}`}>
            {sc.name}
          </button>
        ))}
      </div>
      <p className="text-[14px] text-muted leading-[1.75] font-light max-w-[680px] -mt-2">{scenario.blurb}</p>

      {/* Difficulty pill */}
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-1 border ${scenario.difficulty === 'hard' ? 'border-accent text-accent' : 'border-lab-amber text-lab-amber'}`}>
          {scenario.difficulty}
        </span>
      </div>

      <div className="border border-stroke">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-stroke">
          <div className="flex items-center gap-1.5">
            <button onClick={() => { setStepIndex(0); setIsPlaying(false) }} className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors" aria-label="Reset"><RotateCcw className="w-3.5 h-3.5" /></button>
            <button onClick={prev} disabled={effectiveStepIndex === 0} className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous"><SkipBack className="w-3.5 h-3.5" /></button>
            <button onClick={() => { if (isAtEnd) { setStepIndex(0); setIsPlaying(true) } else { setIsPlaying(p => !p) } }} className="p-2 border border-ink bg-ink text-paper hover:bg-accent hover:border-accent transition-colors">
              {isAtEnd ? <RotateCcw className="w-3.5 h-3.5" /> : isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button onClick={next} disabled={isAtEnd} className="p-2 border border-stroke text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next"><SkipForward className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mr-1">Speed</span>
              {SPEEDS.map((sp, i) => (
                <button key={sp.label} onClick={() => setSpeedIndex(i)} className={`font-mono text-[10px] px-2.5 py-1 border transition-colors ${i === speedIndex ? 'border-ink text-ink' : 'border-stroke text-muted hover:text-ink hover:border-ink'}`}>{sp.label}</button>
              ))}
            </div>
            <div className="font-mono text-[11px] text-muted tracking-[0.06em]">
              Step <span className="text-ink">{String(effectiveStepIndex + 1).padStart(2, '0')}</span> / {String(totalSteps).padStart(2, '0')}
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-paper2">
          <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1">Now</div>
          <div className="font-mono text-[12px] text-ink leading-[1.6]">{step.note}</div>
        </div>
      </div>

      {/* Code panel with progressive reveal + annotations */}
      <div className="border border-stroke">
        <div className="px-4 py-3 border-b border-stroke flex items-center justify-between">
          <span className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">Code</span>
          <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
            {step.visibleCodeLines} / {scenario.code.length} lines visible
          </span>
        </div>
        <pre className="p-4 overflow-x-auto bg-paper">
          <code className="font-mono text-[12.5px] leading-[1.85] block">
            {scenario.code.slice(0, step.visibleCodeLines).map((line, i) => {
              const lineNum = i + 1
              const ann = step.annotations?.find((a) => a.line === lineNum)
              return (
                <motion.div
                  key={lineNum}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={springBouncy}
                  className={`flex gap-3 px-2 -mx-2 ${ann ? 'bg-lab-amber-soft' : ''}`}
                >
                  <span className="select-none w-6 text-right shrink-0 text-faint">{String(lineNum).padStart(2, '0')}</span>
                  <span className="text-ink">{line || ' '}</span>
                  {ann && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="ml-auto font-mono text-[10px] text-lab-amber tracking-[0.04em] italic shrink-0 text-right max-w-[280px]"
                    >
                      ← {ann.text}
                    </motion.span>
                  )}
                </motion.div>
              )
            })}
          </code>
        </pre>
      </div>

      {/* Predict vs answer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-stroke">
          <div className="px-4 py-2.5 border-b border-stroke">
            <span className="font-mono text-[10px] text-lab-amber tracking-[0.16em] uppercase">
              Common wrong prediction
            </span>
          </div>
          <div className="p-4 bg-paper2">
            <code className="font-mono text-[11.5px] text-muted leading-snug">
              {scenario.commonWrongAnswer}
            </code>
          </div>
        </div>

        <div className="border border-stroke">
          <div className="px-4 py-2.5 border-b border-stroke flex items-center gap-2">
            {step.showAnswer ? (
              <Eye className="w-3.5 h-3.5 text-lab-emerald" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-faint" />
            )}
            <span className={`font-mono text-[10px] tracking-[0.16em] uppercase ${step.showAnswer ? 'text-lab-emerald' : 'text-faint'}`}>
              {step.showAnswer ? 'Actual output' : 'Hidden — predict first'}
            </span>
          </div>
          <div className="p-4 bg-paper min-h-[80px]">
            <AnimatePresence mode="wait">
              {step.showAnswer ? (
                <motion.div
                  key="ans"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={springBouncy}
                >
                  <pre className="font-mono text-[13px] text-lab-emerald font-bold leading-[1.7]">
                    {scenario.output.join('\n')}
                  </pre>
                </motion.div>
              ) : (
                <motion.div
                  key="hide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-[11px] text-faint italic"
                >
                  Predict in your head, then click Step Forward.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Explanation revealed at the end */}
      <AnimatePresence>
        {isAtEnd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-lab-emerald overflow-hidden"
          >
            <div className="px-4 py-2.5 border-b border-lab-emerald bg-lab-emerald text-paper">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                Full explanation
              </span>
            </div>
            <div className="p-4 bg-lab-emerald-soft">
              <ul className="text-[13px] text-ink leading-[1.7] font-light space-y-2 list-disc pl-5">
                {scenario.explanation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
