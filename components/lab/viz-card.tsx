'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export interface VizCardProps {
  num: string
  name: string
  sub: string
  tags: string[]
  href: string
  status: 'live' | 'soon'
  index?: number
  isInView?: boolean
}

export function VizCard({
  num,
  name,
  sub,
  tags,
  href,
  status,
  index = 0,
  isInView = true,
}: VizCardProps) {
  const isLive = status === 'live'

  const inner = (
    <div className="px-6 lg:px-14 py-8 flex items-start gap-4 lg:gap-8">
      <span
        className={`font-mono text-[11px] pt-2 hidden sm:block w-10 shrink-0 transition-colors ${
          isLive ? 'text-faint group-hover:text-accent' : 'text-faint'
        }`}
      >
        {num}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <div
            className={`font-serif text-xl lg:text-2xl font-black tracking-tight ${
              isLive ? '' : 'text-muted'
            }`}
          >
            {name}
          </div>
          {!isLive && (
            <span className="font-mono text-[9px] text-faint tracking-[0.14em] uppercase border border-stroke px-2 py-[3px]">
              Coming soon
            </span>
          )}
        </div>
        <div className="text-[13px] text-muted mt-1 font-light">{sub}</div>
        <div className="flex gap-1.5 mt-3 flex-wrap sm:hidden">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-muted border border-stroke px-2.5 py-1 tracking-[0.04em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-2.5 shrink-0">
        <div className="flex gap-1.5 flex-wrap justify-end">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] text-muted border border-stroke px-2.5 py-1 tracking-[0.04em]"
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          className={`text-[18px] inline-block transition-all ${
            isLive
              ? 'text-stroke2 group-hover:text-accent group-hover:translate-x-[5px] group-hover:-translate-y-[5px]'
              : 'text-stroke2 opacity-50'
          }`}
        >
          &#8599;
        </span>
      </div>

      <span
        className={`text-[18px] sm:hidden pt-1 shrink-0 transition-colors ${
          isLive ? 'text-stroke2 group-hover:text-accent' : 'text-stroke2 opacity-50'
        }`}
      >
        &#8599;
      </span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`border-b border-stroke ${
        isLive
          ? 'group hover:bg-paper2 transition-colors cursor-pointer'
          : 'cursor-not-allowed opacity-80'
      }`}
    >
      {isLive ? (
        <Link href={href} className="block">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  )
}
