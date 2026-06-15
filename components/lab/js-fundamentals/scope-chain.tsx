'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Scope, ScopeKind, ScopeVar } from '@/lib/lab/js-fundamentals-data'
import { springBouncy } from '@/lib/lab/motion'

interface ScopeChainProps {
  scopes: Scope[]
  thisContext?: string
}

const SCOPE_TONE: Record<ScopeKind, string> = {
  global: 'border-stroke2 bg-paper text-ink',
  function: 'border-lab-blue bg-lab-blue-soft text-ink',
  block: 'border-stroke2 bg-paper text-ink',
  closure: 'border-lab-purple bg-lab-purple-soft text-ink',
  partial: 'border-lab-amber bg-lab-amber-soft text-ink',
}

const SCOPE_LABEL_TONE: Record<ScopeKind, string> = {
  global: 'text-faint',
  function: 'text-lab-blue',
  block: 'text-faint',
  closure: 'text-lab-purple',
  partial: 'text-lab-amber',
}

const VAR_STATE_TONE: Record<NonNullable<ScopeVar['state']>, string> = {
  normal: 'text-ink',
  new: 'text-lab-emerald font-medium',
  changed: 'text-lab-amber font-medium',
  hoisted: 'text-faint italic',
}

export function ScopeChain({ scopes, thisContext }: ScopeChainProps) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
          Scope chain
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {scopes.length} scope{scopes.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="bg-paper2 p-4 space-y-2">
        {thisContext && (
          <div className="border border-lab-amber bg-lab-amber-soft px-3 py-2">
            <div className="font-mono text-[9px] text-lab-amber tracking-[0.14em] uppercase mb-1">
              this
            </div>
            <div className="font-mono text-[11px] text-ink leading-snug">
              {thisContext}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {scopes
            .slice()
            .reverse() // innermost on top
            .map((scope) => (
              <motion.div
                key={scope.id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: scope.active ? [1, 1.03, 1] : 1,
                }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={
                  scope.active
                    ? { duration: 0.5, ease: 'easeInOut' }
                    : springBouncy
                }
                className={`border ${SCOPE_TONE[scope.kind]} ${scope.active ? 'ring-2 ring-lab-amber ring-offset-1 ring-offset-paper2' : ''}`}
              >
                <div className="px-3 py-2 border-b border-stroke/40 flex items-center justify-between gap-2">
                  <div
                    className={`font-mono text-[10px] tracking-[0.14em] uppercase ${SCOPE_LABEL_TONE[scope.kind]}`}
                  >
                    {scope.label}
                  </div>
                  <div className="font-mono text-[9px] text-faint tracking-[0.06em]">
                    {scope.kind}
                  </div>
                </div>
                <div className="px-3 py-2 flex flex-col gap-1 min-h-[28px]">
                  {scope.variables.length === 0 ? (
                    <span className="font-mono text-[10px] text-faint italic">
                      no bindings
                    </span>
                  ) : (
                    scope.variables.map((v) => (
                      <div
                        key={v.name}
                        className="flex items-baseline justify-between gap-3 font-mono text-[11px]"
                      >
                        <span
                          className={`${VAR_STATE_TONE[v.state ?? 'normal']} font-bold`}
                        >
                          {v.name}
                        </span>
                        <span className={VAR_STATE_TONE[v.state ?? 'normal']}>
                          = {v.value}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
