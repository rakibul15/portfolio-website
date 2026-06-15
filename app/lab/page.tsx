'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { VizCard, type VizCardProps } from '@/components/lab/viz-card'

const visualizers: Omit<VizCardProps, 'index' | 'isInView'>[] = [
  {
    num: '01',
    name: 'Event Loop',
    sub: 'How the call stack, microtask queue, and macrotask queue interact — stepped through code',
    tags: ['JavaScript', 'Async'],
    href: '/lab/event-loop',
    status: 'live',
  },
  {
    num: '02',
    name: 'Next.js Caching Layers',
    sub: 'Router → Full Route → Request Memo → Data Cache — see what hits each, and what invalidates them',
    tags: ['Next.js', 'Performance'],
    href: '/lab/nextjs-caching',
    status: 'live',
  },
  {
    num: '03',
    name: 'React Fiber Reconciliation',
    sub: 'Watch which nodes re-render on setState, and how React.memo + useCallback change the cascade',
    tags: ['React', 'Internals'],
    href: '/lab/react-fiber',
    status: 'live',
  },
  {
    num: '04',
    name: 'RSC Serialization Boundary',
    sub: 'What crosses the server → client wire, what gets rejected, and what the RSC payload looks like',
    tags: ['React', 'Next.js'],
    href: '/lab/rsc-boundary',
    status: 'live',
  },
  {
    num: '05',
    name: 'useEffect vs useLayoutEffect',
    sub: 'Lifecycle timeline showing where each hook fires — and the flicker that justifies the layout one',
    tags: ['React', 'Hooks'],
    href: '/lab/effect-timing',
    status: 'live',
  },
  {
    num: '06',
    name: 'Stacking Context',
    sub: 'Why your z-index: 9999 isn’t working — four scenarios showing the trap and the portal fix',
    tags: ['CSS', 'Layout'],
    href: '/lab/stacking-context',
    status: 'live',
  },
  {
    num: '07',
    name: 'Core Web Vitals',
    sub: 'Three before/after walkthroughs for LCP, INP, and CLS — what causes each, what the canonical fix looks like',
    tags: ['Performance', 'CWV'],
    href: '/lab/web-vitals',
    status: 'live',
  },
  {
    num: '08',
    name: 'Algorithm Patterns',
    sub: 'Eight interview classics — sliding window, two pointers, binary search, BFS, DFS, hashmap, Kadane, merge sort — with TS + Go',
    tags: ['DSA', 'Algorithms'],
    href: '/lab/algorithms',
    status: 'live',
  },
  {
    num: '09',
    name: 'Async Patterns',
    sub: 'Timeline-based walkthroughs — debounce, throttle, Promise.all, Promise.race, pool, AbortController. JS + Go.',
    tags: ['JavaScript', 'Concurrency'],
    href: '/lab/async-patterns',
    status: 'live',
  },
  {
    num: '10',
    name: 'Linked List',
    sub: 'Insert + delete, reverse, Floyd\'s cycle detection, doubly-linked operations — with TypeScript and Go',
    tags: ['Data Structures', 'Pointers'],
    href: '/lab/linked-list',
    status: 'live',
  },
]

const ease = [0.25, 0.1, 0.25, 1] as const

export default function LabIndex() {
  const ref = useRef(null)
  const ghostRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const liveCount = visualizers.filter((v) => v.status === 'live').length

  return (
    <>
      {/* Hero */}
      <section className="pt-24 lg:pt-32 px-6 lg:px-14 pb-12 lg:pb-16 border-b border-stroke">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="w-9 h-px bg-accent shrink-0" />
          <span className="font-mono text-[11px] text-accent tracking-[0.14em] uppercase">
            Interactive Visualizers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="font-serif font-black text-[clamp(48px,7.5vw,96px)] leading-[0.92] tracking-tighter"
        >
          The <span className="italic font-normal text-muted">Lab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="max-w-[560px] text-[15px] text-muted leading-[1.75] font-light mt-8"
        >
          Interactive demos of the concepts I think about every day &mdash; the JS
          event loop, Next.js caching, React reconciliation, and more. Built to
          test my own understanding and share it with you.
        </motion.p>
      </section>

      {/* Header row */}
      <div className="px-6 lg:px-14 py-8 lg:py-14 pb-6 lg:pb-8 border-b border-stroke flex justify-between items-end">
        <div>
          <motion.span
            ref={ghostRef}
            style={{ y: ghostY }}
            className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
          >
            Lab
          </motion.span>
          <h2 className="font-serif text-[36px] lg:text-[42px] font-black tracking-tight">
            Visualizers
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted tracking-[0.08em]">
          {String(liveCount).padStart(2, '0')} live &middot;{' '}
          {String(visualizers.length - liveCount).padStart(2, '0')} soon
        </span>
      </div>

      {/* Cards */}
      <div ref={ref}>
        {visualizers.map((v, i) => (
          <VizCard key={v.num} {...v} index={i} isInView={isInView} />
        ))}
      </div>
    </>
  )
}
