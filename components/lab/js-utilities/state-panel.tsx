'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type {
  CacheEntry,
  CellState,
  JSUtilStep,
  SubscriberRow,
  TreeBlob,
} from '@/lib/lab/js-utilities-data'
import { springBouncy } from '@/lib/lab/motion'

interface StatePanelProps {
  step: JSUtilStep
}

const CELL_TONE: Record<CellState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  new: 'border-lab-emerald bg-lab-emerald text-paper',
  updated: 'border-lab-amber bg-lab-amber text-paper',
  evicted: 'border-accent bg-accent text-paper opacity-60',
  hit: 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald',
  miss: 'border-accent bg-accent text-paper',
}

export function StatePanel({ step }: StatePanelProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* deepClone: side-by-side trees */}
      {step.inputTree && step.outputTree && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TreePanel label="Input" tone="lab-blue" tree={step.inputTree} />
          <TreePanel label="Clone (output)" tone="lab-emerald" tree={step.outputTree} />
        </div>
      )}

      {/* memoize / LRU: cache table */}
      {step.cache && (
        <CachePanel
          cache={step.cache}
          limit={step.cacheLimit}
          isLRU={typeof step.cacheLimit === 'number'}
        />
      )}

      {/* Event emitter: subscribers */}
      {step.subscribers && <SubscriberPanel rows={step.subscribers} />}

      {/* Variables */}
      <VariablesPanel vars={step.vars} />
    </div>
  )
}

function TreePanel({
  label,
  tone,
  tree,
}: {
  label: string
  tone: 'lab-blue' | 'lab-emerald'
  tree: TreeBlob
}) {
  const labelTone = tone === 'lab-blue' ? 'text-lab-blue' : 'text-lab-emerald'
  return (
    <div className="border border-stroke">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span className={`font-mono text-[10px] ${labelTone} tracking-[0.16em] uppercase`}>
          {label}
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">tree</span>
      </div>
      <pre className="p-3 bg-paper2 overflow-x-auto">
        <code className="font-mono text-[11.5px] leading-[1.7] block">
          {tree.lines.map((line, i) => {
            const active = tree.activeLine === i
            return (
              <div
                key={i}
                className={`flex gap-3 px-1 -mx-1 transition-colors ${active ? 'bg-lab-amber-soft text-ink' : 'text-muted'}`}
              >
                <span className="select-none w-4 text-right shrink-0 text-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={active ? 'font-medium' : ''}>{line || ' '}</span>
              </div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

function CachePanel({
  cache,
  limit,
  isLRU,
}: {
  cache: CacheEntry[]
  limit?: number
  isLRU: boolean
}) {
  return (
    <div className="border border-stroke">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          {isLRU ? 'LRU cache' : 'Memo cache'}
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {cache.length}
          {limit !== undefined ? ` / ${limit}` : ''}
          {isLRU && ' · oldest → newest'}
        </span>
      </div>
      <div className="p-3 min-h-[56px]">
        {cache.length === 0 ? (
          <span className="font-mono text-[10px] text-faint italic">empty</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {cache.map((entry) => {
                const tone = CELL_TONE[entry.state ?? 'normal']
                return (
                  <motion.div
                    key={entry.key}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{
                      opacity: 1,
                      scale: entry.state && entry.state !== 'normal' ? [1, 1.1, 1] : 1,
                    }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
                    transition={
                      entry.state && entry.state !== 'normal'
                        ? { duration: 0.5, ease: 'easeInOut' }
                        : springBouncy
                    }
                    className={`border ${tone} px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] transition-colors`}
                  >
                    <span className="opacity-80">{entry.key}</span>
                    <span className="mx-1.5 opacity-60">→</span>
                    <span className="font-bold">{entry.value}</span>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function SubscriberPanel({ rows }: { rows: SubscriberRow[] }) {
  return (
    <div className="border border-stroke">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span className="font-mono text-[10px] text-lab-purple tracking-[0.16em] uppercase">
          Subscribers
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {rows.reduce((s, r) => s + r.handlers.length, 0)} handlers · {rows.length} events
        </span>
      </div>
      <div className="divide-y divide-stroke">
        {rows.length === 0 ? (
          <div className="p-3">
            <span className="font-mono text-[10px] text-faint italic">no subscribers</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {rows.map((row) => {
              const tone = CELL_TONE[row.state ?? 'normal']
              return (
                <motion.div
                  key={row.event}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={springBouncy}
                  className="px-3 py-2 flex items-baseline gap-3 flex-wrap"
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.06em] uppercase border px-2 py-1 ${tone}`}
                  >
                    {row.event}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {row.handlers.map((h) => (
                      <span
                        key={h}
                        className="font-mono text-[11px] text-ink border border-stroke px-2 py-0.5 bg-paper2"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function VariablesPanel({ vars }: { vars: Array<{ label: string; value: string }> }) {
  if (vars.length === 0) return null
  return (
    <div className="border border-stroke">
      <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
        <span className="font-mono text-[10px] text-lab-amber tracking-[0.16em] uppercase">
          Variables
        </span>
        <span className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {vars.length}
        </span>
      </div>
      <div className="divide-y divide-stroke">
        {vars.map((v) => (
          <div
            key={v.label}
            className="flex items-baseline justify-between gap-3 px-3 py-1.5"
          >
            <span className="font-mono text-[10px] text-muted tracking-[0.1em] uppercase whitespace-nowrap">
              {v.label}
            </span>
            <span className="font-mono text-[11px] text-ink text-right truncate min-w-0">
              {v.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
