'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function SummarySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-violet-100/40 dark:bg-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-100/40 dark:bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 p-8 md:p-12 rounded-3xl shadow-xl border border-violet-100 dark:border-slate-700/50"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Professional Summary
          </h2>
          <motion.p
            className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Senior Frontend Developer with 5+ years of experience designing and building scalable,
            accessible, and interactive web applications. Expertise in translating UI/UX designs
            into responsive and high-performance interfaces. Proficient in modern JavaScript
            frameworks, TypeScript, RESTful APIs, and state management libraries. Experienced in
            leading frontend teams, conducting code reviews, and ensuring best practices in
            large-scale projects.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}