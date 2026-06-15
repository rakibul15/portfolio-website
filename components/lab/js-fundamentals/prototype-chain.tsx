'use client'

import { motion } from 'framer-motion'
import type { ProtoLink } from '@/lib/lab/js-fundamentals-data'
import { springBouncy } from '@/lib/lab/motion'

interface PrototypeChainProps {
  chain: ProtoLink[]
}

const STATE_TONE: Record<NonNullable<ProtoLink['state']>, string> = {
  normal: 'border-stroke2 bg-paper text-ink',
  searching: 'border-lab-amber bg-lab-amber-soft text-lab-amber',
  miss: 'border-stroke2 bg-paper2 text-faint',
  found: 'border-lab-emerald bg-lab-emerald text-paper',
}

export function PrototypeChain({ chain }: PrototypeChainProps) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-lab-purple tracking-[0.16em] uppercase">
          Prototype chain
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          lookup walks up
        </div>
      </div>

      <div className="bg-paper2 p-4 flex flex-col gap-2">
        {chain.map((link, i) => {
          const tone = STATE_TONE[link.state ?? 'normal']
          const isLast = i === chain.length - 1
          return (
            <div key={link.label} className="flex flex-col items-center gap-1">
              <motion.div
                layout
                animate={{
                  scale:
                    link.state === 'searching' || link.state === 'found'
                      ? [1, 1.04, 1]
                      : 1,
                }}
                transition={
                  link.state === 'normal'
                    ? springBouncy
                    : { duration: 0.5, ease: 'easeInOut' }
                }
                className={`w-full border ${tone} px-4 py-3 transition-colors`}
              >
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div className="font-mono text-[11px] tracking-[0.06em] font-bold">
                    {link.label}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.14em] uppercase opacity-70">
                    {link.state ?? ''}
                  </div>
                </div>
                {link.members.length > 0 && (
                  <div className="font-mono text-[10px] mt-1.5 opacity-80 leading-snug">
                    {link.members.join(' · ')}
                  </div>
                )}
              </motion.div>
              {!isLast && (
                <span className="font-mono text-[12px] text-stroke2 leading-none">
                  ↓ __proto__
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
