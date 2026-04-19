'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const projects = [
  {
    num: '01',
    name: 'FirstTrip',
    sub: 'Top travel app — flights, hotels, holidays, visa & eSIM · IATA certified · 50K+ users',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    url: 'https://firsttrip.com/',
  },
  {
    num: '02',
    name: 'Triplover',
    sub: 'Flight booking platform · 28+ major airlines · Multi-city & student fares',
    tags: ['React', 'Next.js', 'Redux', 'Ant Design'],
    url: 'https://triplover.com/',
  },
  {
    num: '03',
    name: 'CarryBee Merchant',
    sub: 'On-demand delivery · Real-time tracking · 1000+ concurrent users · Route optimization',
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    url: 'https://merchant.carrybee.com/',
  },
  {
    num: '04',
    name: 'TakeTrip',
    sub: 'Comprehensive travel booking · IATA certified · Hassle-free booking experience',
    tags: ['React', 'Next.js', 'Chakra UI', 'TypeScript'],
    url: 'https://www.taketrip.com/',
  },
]

export function ProjectsSection() {
  const ref = useRef(null)
  const ghostRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="work" ref={ref} className="border-b border-stroke">
      {/* Header */}
      <div className="px-6 lg:px-14 py-8 lg:py-14 pb-6 lg:pb-8 border-b border-stroke flex justify-between items-end">
        <div>
          <motion.span
            ref={ghostRef}
            style={{ y: ghostY }}
            className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
          >
            02
          </motion.span>
          <h2 className="font-serif text-[36px] lg:text-[42px] font-black tracking-tight">
            Selected work
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted tracking-[0.08em]">
          04 projects
        </span>
      </div>

      {/* Project rows */}
      <div>
        {projects.map((project, index) => (
          <motion.a
            key={project.num}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group block border-b border-stroke hover:bg-paper2 transition-colors cursor-pointer"
          >
            <div className="px-6 lg:px-14 py-8 flex items-start gap-4 lg:gap-8">
              <span className="font-mono text-[11px] text-faint pt-2 hidden sm:block w-10 shrink-0 group-hover:text-accent transition-colors">
                {project.num}
              </span>

              <div className="flex-1 min-w-0">
                <div className="font-serif text-xl lg:text-2xl font-black tracking-tight">
                  {project.name}
                </div>
                <div className="text-[13px] text-muted mt-1 font-light">
                  {project.sub}
                </div>
                <div className="flex gap-1.5 mt-3 flex-wrap sm:hidden">
                  {project.tags.map((tag) => (
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
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] text-muted border border-stroke px-2.5 py-1 tracking-[0.04em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[18px] text-stroke2 group-hover:text-accent group-hover:translate-x-[5px] group-hover:-translate-y-[5px] transition-all inline-block">
                  &#8599;
                </span>
              </div>

              <span className="text-[18px] text-stroke2 group-hover:text-accent transition-colors sm:hidden pt-1 shrink-0">
                &#8599;
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
