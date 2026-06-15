'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type {
  MemoryStep,
  HeapObject,
  ObjectState,
} from '@/lib/lab/memory-gc-data'
import { springBouncy } from '@/lib/lab/motion'

interface HeapViewProps {
  step: MemoryStep
}

const OBJ_TONE: Record<ObjectState, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  new: 'border-lab-emerald bg-lab-emerald text-paper',
  unreachable: 'border-lab-amber bg-lab-amber-soft text-lab-amber opacity-70',
  sweeping: 'border-accent bg-accent text-paper animate-pulse',
  collected: 'border-stroke bg-paper2 text-faint line-through opacity-40',
}

const OBJ_SIZE: Record<HeapObject['size'], string> = {
  small: 'w-24 h-12',
  huge: 'w-40 h-16',
}

export function HeapView({ step }: HeapViewProps) {
  const { roots, objects, refs, consoleOutput } = step

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-stroke">
        <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
          <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
            Heap
          </div>
          <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
            {objects.filter((o) => o.state !== 'collected').length} live ·{' '}
            {objects.filter((o) => o.state === 'collected').length} collected
          </div>
        </div>

        <div className="bg-paper2 p-4 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
          {/* Roots column */}
          <div className="border border-stroke bg-paper">
            <div className="px-3 py-2 border-b border-stroke">
              <span className="font-mono text-[10px] text-lab-purple tracking-[0.16em] uppercase">
                Roots
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {roots.map((root) => (
                <motion.div
                  key={root.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={springBouncy}
                  className="border border-lab-purple bg-lab-purple-soft px-3 py-2"
                >
                  <div className="font-mono text-[10px] text-lab-purple tracking-[0.1em] uppercase">
                    {root.label}
                  </div>
                  {root.detail && (
                    <div className="font-mono text-[9px] text-faint mt-1 leading-snug">
                      {root.detail}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Objects + refs */}
          <div className="border border-stroke bg-paper">
            <div className="px-3 py-2 border-b border-stroke">
              <span className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
                Objects
              </span>
            </div>
            <div className="p-4 min-h-[180px]">
              {objects.length === 0 ? (
                <div className="font-mono text-[10px] text-faint italic">
                  heap is empty
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence initial={false}>
                    {objects.map((obj) => (
                      <motion.div
                        key={obj.id}
                        layout
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                          opacity: obj.state === 'collected' ? 0.35 : 1,
                          scale:
                            obj.state === 'new' ||
                            obj.state === 'sweeping'
                              ? [1, 1.1, 1]
                              : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={
                          obj.state === 'normal' || obj.state === 'collected'
                            ? springBouncy
                            : { duration: 0.55, ease: 'easeInOut' }
                        }
                        className={`border-2 ${OBJ_TONE[obj.state]} ${OBJ_SIZE[obj.size]} flex flex-col items-center justify-center px-2 text-center transition-colors`}
                      >
                        <span className="font-mono text-[11px] leading-tight">
                          {obj.label}
                        </span>
                        {obj.detail && (
                          <span className="font-mono text-[8px] opacity-70 mt-0.5 leading-tight">
                            {obj.detail}
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Reference summary */}
              {refs.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stroke">
                  <div className="font-mono text-[9px] text-faint tracking-[0.1em] uppercase mb-2">
                    References
                  </div>
                  <div className="flex flex-col gap-1">
                    {refs.map((ref, i) => {
                      const fromRoot = roots.find((r) => r.id === ref.fromId)
                      const fromObj = objects.find((o) => o.id === ref.fromId)
                      const toObj = objects.find((o) => o.id === ref.toId)
                      const fromLabel = fromRoot?.label ?? fromObj?.label ?? ref.fromId
                      const toLabel = toObj?.label ?? ref.toId
                      const arrow = ref.kind === 'weak' ? '⇢' : '→'
                      const toneClass =
                        ref.state === 'broken'
                          ? 'text-faint line-through'
                          : ref.kind === 'weak'
                            ? 'text-lab-amber'
                            : 'text-ink'
                      return (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`font-mono text-[10px] ${toneClass}`}
                        >
                          {fromLabel} {arrow} {toLabel}{' '}
                          <span className="opacity-60">({ref.kind})</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {consoleOutput && consoleOutput.length > 0 && (
        <div className="border border-stroke">
          <div className="px-3 py-2 border-b border-stroke">
            <span className="font-mono text-[10px] text-lab-emerald tracking-[0.16em] uppercase">
              Output
            </span>
          </div>
          <pre className="p-3 bg-paper2 font-mono text-[11px] text-ink leading-snug">
            {consoleOutput.join('\n')}
          </pre>
        </div>
      )}
    </div>
  )
}
