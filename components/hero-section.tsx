'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MagneticButton } from './magnetic-button'

function Counter({
  value,
  suffix = '',
  duration = 2,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)
      if (progress < 1) {
        setCount(Math.floor(value * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()

  const eyebrowY = useTransform(scrollY, [0, 700], [0, 48])
  const headlineY = useTransform(scrollY, [0, 700], [0, 100])
  const bottomY = useTransform(scrollY, [0, 700], [0, 30])
  const stat1Y = useTransform(scrollY, [0, 700], [0, -60])
  const stat2Y = useTransform(scrollY, [0, 700], [0, -90])

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  }

  const ease = [0.25, 0.1, 0.25, 1] as const

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease },
    },
  }

  const fadeUpSlow = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease, delay: 0.9 },
    },
  }

  const statReveal = (delay: number) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease, delay },
    },
  })

  return (
    <section
      id="home"
      className="min-h-screen pt-16 grid grid-cols-1 lg:grid-cols-[1fr_400px] border-b border-stroke"
    >
      {/* Left content */}
      <div className="px-6 lg:px-14 py-12 lg:py-[72px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stroke overflow-hidden min-h-[60vh] lg:min-h-0">
        <div>
          {/* Eyebrow */}
          <motion.div
            style={{ y: eyebrowY }}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 mb-10 will-change-transform"
          >
            <motion.div
              className="w-9 h-px bg-accent shrink-0 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <span className="font-mono text-[11px] text-accent tracking-[0.14em] uppercase">
              Senior Frontend Developer
            </span>
          </motion.div>

          {/* Headline — staggered lines */}
          <motion.div
            style={{ y: headlineY }}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="font-serif font-black text-[clamp(48px,7.5vw,96px)] leading-[0.92] tracking-tighter will-change-transform"
          >
            <motion.div variants={fadeUp}>I craft</motion.div>
            <motion.div variants={fadeUp} className="italic font-normal text-muted">
              interfaces
            </motion.div>
            <motion.div variants={fadeUp}>
              that <span className="text-accent">perform.</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          style={{ y: bottomY }}
          variants={fadeUpSlow}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-10 border-t border-stroke gap-8 will-change-transform"
        >
          <p className="max-w-[360px] text-[15px] text-muted leading-[1.75] font-light">
            5+ years crafting high-performance UIs. From travel platforms to
            delivery apps&mdash;I engineer experiences that are fast, accessible,
            and scalable.
          </p>
          <div className="flex gap-3 shrink-0">
            <MagneticButton strength={0.3}>
              <a
                href="#work"
                className="font-mono text-[11px] tracking-[0.07em] uppercase bg-ink text-paper px-6 py-[13px] hover:bg-accent transition-colors inline-block"
              >
                View Work &rarr;
              </a>
            </MagneticButton>
            <MagneticButton strength={0.3}>
              <a
                href="/resume.pdf"
                download="Rakibul_Hasan_Resume.pdf"
                className="font-mono text-[11px] tracking-[0.07em] uppercase border border-stroke2 text-muted px-6 py-[13px] hover:border-ink hover:text-ink transition-all inline-block"
              >
                Resume
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Right stats */}
      <div className="bg-paper2 grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2">
        <motion.div
          style={{ y: stat1Y }}
          variants={statReveal(0.6)}
          initial="hidden"
          animate="visible"
          className="p-8 lg:p-11 border-b border-r lg:border-r-0 border-stroke flex flex-col justify-between overflow-hidden will-change-transform min-h-[200px] lg:min-h-0"
        >
          <div className="font-serif text-[64px] lg:text-[80px] font-black leading-none">
            <Counter value={5} suffix="+" duration={1.5} />
          </div>
          <div>
            <div className="font-mono text-[11px] text-muted tracking-[0.1em] uppercase mt-3">
              Years of experience
            </div>
            <div className="text-[13px] text-faint leading-snug mt-1.5 font-light">
              Across startups &amp; enterprise products
            </div>
          </div>
        </motion.div>
        <motion.div
          style={{ y: stat2Y }}
          variants={statReveal(0.8)}
          initial="hidden"
          animate="visible"
          className="p-8 lg:p-11 flex flex-col justify-between overflow-hidden will-change-transform min-h-[200px] lg:min-h-0"
        >
          <div className="font-serif text-[64px] lg:text-[80px] font-black leading-none">
            <Counter value={50} suffix="+" duration={2} />
          </div>
          <div>
            <div className="font-mono text-[11px] text-muted tracking-[0.1em] uppercase mt-3">
              Projects shipped
            </div>
            <div className="text-[13px] text-faint leading-snug mt-1.5 font-light">
              React, Next.js, TypeScript&mdash;at scale
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
