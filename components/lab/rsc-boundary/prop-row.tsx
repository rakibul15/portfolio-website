'use client'

import { motion } from 'framer-motion'
import type { PropStatus, RSCProp } from '@/lib/lab/rsc-boundary-data'
import { springBouncy, wiggleBadge } from '@/lib/lab/motion'

interface PropRowProps {
  prop: RSCProp
  status: PropStatus
  side: 'server' | 'client'
  focused: boolean
}

const KIND_LABEL: Record<RSCProp['kind'], string> = {
  primitive: 'primitive',
  array: 'array',
  object: 'object',
  date: 'date',
  function: 'function',
  'server-action': "'use server'",
  jsx: 'jsx',
}

const KIND_TINT: Record<RSCProp['kind'], string> = {
  primitive: 'text-lab-blue',
  array: 'text-lab-blue',
  object: 'text-lab-blue',
  date: 'text-lab-amber',
  function: 'text-accent',
  'server-action': 'text-lab-emerald',
  jsx: 'text-lab-purple',
}

const STATUS_BADGE: Record<PropStatus, string> = {
  pending: 'border-stroke text-faint',
  'in-transit': 'border-lab-amber bg-lab-amber text-paper',
  accepted: 'border-lab-emerald bg-lab-emerald text-paper',
  rejected: 'border-accent bg-accent text-paper',
}

const STATUS_LABEL: Record<PropStatus, string> = {
  pending: 'waiting',
  'in-transit': 'checking',
  accepted: 'accepted',
  rejected: 'rejected',
}

export function PropRow({ prop, status, side, focused }: PropRowProps) {
  // On the client side, only show props that have been accepted or rejected.
  // (Pending / in-transit means it hasn't arrived yet.)
  const visibleOnClient =
    side === 'server' || status === 'accepted' || status === 'rejected'

  if (!visibleOnClient) {
    return (
      <div className="border border-stroke border-dashed bg-paper opacity-40">
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-faint tracking-[0.04em]">
            {prop.name}
          </span>
          <span className="font-mono text-[9px] text-faint tracking-[0.14em] uppercase">
            in transit
          </span>
        </div>
      </div>
    )
  }

  const showRejected = side === 'client' && status === 'rejected'
  const preview = side === 'server' ? prop.serverPreview : prop.clientPreview

  return (
    <motion.div
      layout
      animate={{ scale: focused ? [1, 1.03, 1] : 1 }}
      transition={focused ? { duration: 0.55, ease: 'easeInOut' } : springBouncy}
      whileHover={{ scale: 1.01 }}
      className={`border bg-paper transition-colors ${
        focused
          ? status === 'rejected'
            ? 'border-accent'
            : status === 'accepted'
              ? 'border-lab-emerald'
              : status === 'in-transit'
                ? 'border-lab-amber'
                : 'border-ink'
          : status === 'rejected'
            ? 'border-accent'
            : status === 'accepted'
              ? 'border-lab-emerald/50'
              : 'border-stroke'
      }`}
    >
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-serif text-[15px] sm:text-[17px] font-black tracking-tight leading-none">
                {prop.name}
              </span>
              <span
                className={`font-mono text-[9px] tracking-[0.12em] uppercase leading-none ${KIND_TINT[prop.kind]}`}
              >
                {KIND_LABEL[prop.kind]}
              </span>
            </div>
            <div className="font-mono text-[11px] text-muted tracking-[0.02em] leading-snug mt-1.5 break-all">
              {preview}
            </div>
            {showRejected && prop.rejectReason && (
              <div className="font-mono text-[10px] text-accent tracking-[0.02em] leading-snug mt-2 border-l-2 border-accent pl-2">
                {prop.rejectReason}
              </div>
            )}
          </div>
          <motion.div
            key={status}
            variants={wiggleBadge}
            initial="initial"
            animate="animate"
            className={`font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-1 border whitespace-nowrap leading-none ${STATUS_BADGE[status]}`}
          >
            {STATUS_LABEL[status]}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
