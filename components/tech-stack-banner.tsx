'use client'

import { motion } from 'framer-motion'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiThreedotjs,
} from 'react-icons/si'

const technologies = [
  { name: 'React 19', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js 16', icon: SiNextdotjs, color: '#000000' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Framer Motion', icon: SiFramer, color: '#0055FF' },
  { name: 'Three.js', icon: SiThreedotjs, color: '#000000' },
]

export function TechStackBanner() {
  return (
    <div className="py-12 px-4 border-y border-slate-200 dark:border-slate-800 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Built With Modern Technologies
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-4">
            This portfolio showcases my expertise in cutting-edge web development tools
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6">
          {technologies.map((tech, index) => {
            const Icon = tech.icon
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group"
              >
                <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                      style={{ color: tech.color }}
                    />
                  </motion.div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}