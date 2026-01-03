'use client'

import { motion } from 'framer-motion'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiThreedotjs } from 'react-icons/si'
import { Heart } from 'lucide-react'

export function Footer() {
  const techStack = [
    { icon: SiReact, color: '#61DAFB', name: 'React' },
    { icon: SiNextdotjs, color: '#000000', name: 'Next.js' },
    { icon: SiTypescript, color: '#3178C6', name: 'TypeScript' },
    { icon: SiTailwindcss, color: '#06B6D4', name: 'Tailwind' },
    { icon: SiFramer, color: '#0055FF', name: 'Framer' },
    { icon: SiThreedotjs, color: '#000000', name: 'Three.js' },
  ]

  return (
    <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Tech Stack Icons */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-6">
            {techStack.map((tech, index) => {
              const Icon = tech.icon
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -3 }}
                  className="group relative"
                >
                  <Icon
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ color: tech.color }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {tech.name}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-center gap-2 flex-wrap px-4">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
            <span>using modern web technologies</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 mb-2 px-4">
            © {new Date().getFullYear()} Rakibul Hasan. All rights reserved.
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-600 px-4">
            Senior Frontend Developer | React & Next.js Expert
          </p>
        </motion.div>
      </div>
    </footer>
  )
}