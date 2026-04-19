'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const experiences = [
  {
    num: '01',
    title: 'Senior Software Engineer (Frontend)',
    company: 'TechnoNext Ltd',
    period: 'Aug 2024 – Present',
    location: 'Dhaka, Bangladesh',
    highlight:
      'Architecting CarryBee delivery platform with real-time tracking for 1000+ concurrent users',
  },
  {
    num: '02',
    title: 'Software Engineer (Frontend)',
    company: 'TechnoNext Ltd',
    period: 'May 2022 – Aug 2024',
    location: 'Dhaka, Bangladesh',
    highlight:
      'Led frontend for US-Bangla Airlines, FirstTrip & Triplover — delivered 20+ production features',
  },
  {
    num: '03',
    title: 'Frontend Developer',
    company: 'EastWestNet',
    period: 'Jan 2022 – May 2022',
    location: 'Dhaka, Bangladesh',
    highlight:
      'Built interactive web apps with secure auth, increasing user engagement by 45%',
  },
  {
    num: '04',
    title: 'Junior Frontend Developer',
    company: 'Ghuri Express Limited',
    period: 'Mar 2021 – Jan 2022',
    location: 'Dhaka, Bangladesh',
    highlight:
      'Delivered 15+ UI components for dashboards, boosting conversion rates by 25%',
  },
  {
    num: '05',
    title: 'Junior Frontend Developer',
    company: 'Stickerdriver',
    period: 'Mar 2020 – Feb 2021',
    location: 'Dhaka, Bangladesh',
    highlight:
      'Created 10+ responsive pages and a reusable design system, improving load speed by 50%',
  },
]

export function ExperienceSection() {
  const ref = useRef(null)
  const ghostRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="experience" className="border-b border-stroke">
      {/* Header */}
      <div className="px-6 lg:px-14 py-8 lg:py-14 pb-6 lg:pb-8 border-b border-stroke flex justify-between items-end">
        <div>
          <motion.span
            ref={ghostRef}
            style={{ y: ghostY }}
            className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
          >
            03
          </motion.span>
          <h2 className="font-serif text-[36px] lg:text-[42px] font-black tracking-tight">
            Experience
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted tracking-[0.08em]">
          05 positions
        </span>
      </div>

      {/* Experience rows */}
      <div ref={ref}>
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.num}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="border-b border-stroke hover:bg-paper2 transition-colors"
          >
            <div className="px-6 lg:px-14 py-8 flex items-start gap-4 lg:gap-8">
              <span className="font-mono text-[11px] text-faint pt-2 hidden sm:block w-10 shrink-0">
                {exp.num}
              </span>

              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg lg:text-[22px] font-black tracking-tight leading-tight">
                  {exp.title}
                </div>
                <div className="text-[14px] text-accent font-medium mt-1">
                  {exp.company}
                </div>
                <div className="text-[13px] text-muted mt-2 font-light leading-relaxed">
                  {exp.highlight}
                </div>
              </div>

              <div className="hidden sm:block text-right shrink-0">
                <div className="font-mono text-[11px] text-muted tracking-[0.04em]">
                  {exp.period}
                </div>
                <div className="font-mono text-[10px] text-faint mt-1">
                  {exp.location}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 -mt-2 flex gap-4 text-[11px] font-mono text-faint sm:hidden">
              <span>{exp.period}</span>
              <span>&middot;</span>
              <span>{exp.location}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
