'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface VizShellProps {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
}

const ease = [0.25, 0.1, 0.25, 1] as const

export function VizShell({ eyebrow, title, subtitle, children }: VizShellProps) {
  return (
    <article className="border-b border-stroke">
      {/* Header */}
      <header className="px-6 lg:px-14 pt-24 pb-10 lg:pt-32 lg:pb-14 border-b border-stroke">
        <Link
          href="/lab"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-muted hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Lab
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-7"
        >
          <span className="w-9 h-px bg-accent shrink-0" />
          <span className="font-mono text-[11px] text-accent tracking-[0.14em] uppercase">
            {eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="font-serif text-[clamp(36px,6vw,72px)] font-black tracking-tight leading-[0.95]"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="max-w-[640px] text-[15px] text-muted leading-[1.75] font-light mt-7"
        >
          {subtitle}
        </motion.p>
      </header>

      {/* Body */}
      <div className="px-6 lg:px-14 py-12 lg:py-16">{children}</div>
    </article>
  )
}
