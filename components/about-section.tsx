'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const coreSkills = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Redux',
  'Tailwind CSS',
  'Ant Design',
  'Chakra UI',
  'REST APIs',
  'Git',
  'Figma',
  'Vercel',
  'Responsive Design',
  'Performance Optimization',
]

export function AboutSection() {
  const ghostRef = useRef(null)
  const contentRef = useRef(null)
  const isInView = useInView(contentRef, { once: true, amount: 0.2 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="about" className="border-b border-stroke">
      <div ref={contentRef} className="px-6 lg:px-14 py-12 lg:py-16">
        <motion.span
          ref={ghostRef}
          style={{ y: ghostY }}
          className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
        >
          01
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-[36px] lg:text-[42px] font-black tracking-tight mb-7"
        >
          About me
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[15px] text-muted leading-[1.8] font-light max-w-[620px]"
        >
          I&apos;m a frontend engineer who thrives at the intersection of
          engineering precision and design sensitivity. I care as much about
          Core Web Vitals as I do about the pixel spacing of a button.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px] text-muted leading-[1.8] font-light max-w-[620px] mt-4"
        >
          I&apos;ve led frontend teams, built scalable applications for travel
          platforms and delivery services, and shipped products used by
          thousands. I write the code, review the PRs, and obsess over the
          details that most engineers skip.
        </motion.p>

        <div className="h-px bg-stroke my-9" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-4">
            Core skills
          </div>
          <div className="flex gap-2 flex-wrap">
            {coreSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[11px] tracking-[0.04em] border border-stroke text-ink px-4 py-[7px] cursor-default hover:bg-ink hover:text-paper hover:border-ink transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
