'use client'

import { motion } from 'framer-motion'
import type { Vital, VitalScore, Rating } from '@/lib/lab/web-vitals-data'

interface ScoreCardProps {
  vital: Vital
  score?: VitalScore
  focused?: boolean
}

const VITAL_LABEL: Record<Vital, string> = {
  lcp: 'LCP',
  inp: 'INP',
  cls: 'CLS',
}

const VITAL_SUBTITLE: Record<Vital, string> = {
  lcp: 'Largest Contentful Paint',
  inp: 'Interaction to Next Paint',
  cls: 'Cumulative Layout Shift',
}

const VITAL_GOOD: Record<Vital, string> = {
  lcp: '≤ 2.5s',
  inp: '≤ 200ms',
  cls: '≤ 0.1',
}

const RATING_BADGE: Record<Rating, string> = {
  pending: 'border-stroke text-faint',
  good: 'border-ink text-ink',
  'needs-improvement': 'border-stroke2 text-muted',
  poor: 'border-accent bg-accent text-paper',
}

const RATING_LABEL: Record<Rating, string> = {
  pending: 'pending',
  good: 'good',
  'needs-improvement': 'meh',
  poor: 'poor',
}

const RATING_BORDER: Record<Rating, string> = {
  pending: 'border-stroke',
  good: 'border-ink',
  'needs-improvement': 'border-stroke2',
  poor: 'border-accent',
}

function formatValue(vital: Vital, value: number): string {
  if (value === 0) return '—'
  if (vital === 'cls') return value.toFixed(2)
  if (value >= 1000) return `${(value / 1000).toFixed(1)}s`
  return `${value}ms`
}

export function ScoreCard({ vital, score, focused }: ScoreCardProps) {
  const rating: Rating = score?.rating ?? 'pending'
  const value = score?.value ?? 0

  return (
    <motion.div
      layout
      animate={{ scale: focused ? 1 : 0.998 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`border ${RATING_BORDER[rating]} bg-paper transition-colors ${
        focused ? '' : 'opacity-75'
      }`}
    >
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] text-faint tracking-[0.16em] uppercase">
              {VITAL_LABEL[vital]}
            </div>
            <div className="font-mono text-[10px] text-faint tracking-[0.06em] mt-1">
              {VITAL_SUBTITLE[vital]}
            </div>
          </div>
          <motion.div
            key={rating}
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-1 border whitespace-nowrap leading-none ${RATING_BADGE[rating]}`}
          >
            {RATING_LABEL[rating]}
          </motion.div>
        </div>

        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-[32px] sm:text-[36px] font-black tracking-tight leading-none"
        >
          {formatValue(vital, value)}
        </motion.div>

        <div className="font-mono text-[9px] text-faint tracking-[0.06em] leading-snug">
          Good {VITAL_GOOD[vital]}
        </div>
      </div>
    </motion.div>
  )
}
