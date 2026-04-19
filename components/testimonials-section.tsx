'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const testimonials = [
  {
    quote:
      'Rakibul consistently delivers clean, performant code. His attention to detail on the FirstTrip platform was exceptional — he optimized our booking flow to handle peak traffic seamlessly.',
    name: 'Project Lead',
    role: 'TechnoNext Ltd',
  },
  {
    quote:
      'One of the most reliable frontend engineers I have worked with. He doesn\'t just write code — he thinks about architecture, scalability, and the end user experience at every step.',
    name: 'Engineering Manager',
    role: 'TechnoNext Ltd',
  },
  {
    quote:
      'Rakibul took our design system from zero to production. His React components are well-structured, well-tested, and a pleasure for other developers to work with.',
    name: 'Senior Developer',
    role: 'EastWestNet',
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const ghostRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const { scrollYProgress } = useScroll({
    target: ghostRef,
    offset: ['start end', 'end start'],
  })
  const ghostY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      className="border-b border-stroke px-6 lg:px-14 py-16 lg:py-24"
    >
      {/* Header */}
      <div className="flex justify-between items-end mb-12 lg:mb-16">
        <div>
          <motion.span
            ref={ghostRef}
            style={{ y: ghostY }}
            className="font-serif text-[80px] lg:text-[120px] font-black text-stroke leading-none mb-[-20px] block will-change-transform"
          >
            04
          </motion.span>
          <h2 className="font-serif text-[36px] lg:text-[42px] font-black tracking-tight">
            What people say
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted tracking-[0.08em] hidden sm:block">
          03 testimonials
        </span>
      </div>

      {/* Testimonial grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stroke">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="bg-paper p-8 lg:p-10 flex flex-col justify-between"
          >
            <div>
              <span className="font-serif text-[48px] text-stroke2 leading-none block mb-4">
                &ldquo;
              </span>
              <p className="text-[14px] text-muted leading-[1.75] font-light">
                {t.quote}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stroke">
              <div className="font-mono text-[12px] text-ink tracking-[0.04em]">
                {t.name}
              </div>
              <div className="font-mono text-[11px] text-faint tracking-[0.04em] mt-0.5">
                {t.role}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
