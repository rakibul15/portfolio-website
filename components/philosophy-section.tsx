'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const pillars = [
  {
    title: 'Performance first',
    body: 'I treat Core Web Vitals as product requirements, not afterthoughts. Fast interfaces are respectful interfaces.',
  },
  {
    title: 'Scalable architecture',
    body: 'Components that grow with the product. Design systems, clean abstractions, and code that the next engineer can read.',
  },
  {
    title: 'Accessible by default',
    body: 'Keyboard navigation, screen readers, responsive layouts. Every user deserves the full experience.',
  },
]

export function PhilosophySection() {
  const ghostRef = useRef(null)
  const quoteRef = useRef(null)
  const pillarsRef = useRef(null)
  const isInView = useInView(pillarsRef, { once: true, amount: 0.2 })

  const { scrollYProgress: ghostProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(ghostProgress, [0, 1], [40, -40])

  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ['start end', 'end start'],
  })
  const quoteY = useTransform(quoteProgress, [0, 1], [44, -44])

  return (
    <section
      id="philosophy"
      className="section-dark bg-paper text-ink px-6 lg:px-14 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 border-b border-stroke"
    >
      {/* Left — Quote */}
      <div>
        <motion.span
          ref={ghostRef}
          style={{ y: ghostY }}
          className="font-serif text-[80px] lg:text-[120px] font-black text-ink/10 leading-none mb-[-20px] block will-change-transform"
        >
          05
        </motion.span>
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-9">
          Philosophy
        </div>
        <motion.div
          ref={quoteRef}
          style={{ y: quoteY }}
          className="font-serif text-[clamp(24px,3.5vw,44px)] font-normal italic leading-[1.25] tracking-tight will-change-transform"
        >
          &ldquo;Great frontend is{' '}
          <strong className="not-italic font-black text-ink">
            invisible.
          </strong>{' '}
          The user never thinks about it&mdash;they just{' '}
          <em>feel</em> it.&rdquo;
        </motion.div>
      </div>

      {/* Right — Pillars */}
      <div ref={pillarsRef} className="flex flex-col">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`py-6 border-t border-ink/10 ${
              index === pillars.length - 1 ? 'border-b border-b-ink/10' : ''
            }`}
          >
            <div className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-2.5">
              {pillar.title}
            </div>
            <div className="text-[14px] text-ink/60 leading-[1.65] font-light">
              {pillar.body}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
