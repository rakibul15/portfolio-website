'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  SiJavascript, SiTypescript, SiHtml5, SiCss3, SiSass,
  SiReact, SiNextdotjs, SiRedux, SiTailwindcss,
  SiGit, SiGithub, SiVercel, SiNetlify, SiJira,
  SiFigma, SiChakraui, SiAntdesign, SiBootstrap
} from 'react-icons/si'
import { Code2, Target, Sparkles, Zap } from 'lucide-react'
import { IconType } from 'react-icons'

type SkillItem = {
  name: string
  icon: IconType | typeof Code2
  color: string
}

// Generate particles once at module level
const particles = Array.from({ length: 8 }, () => ({
  left: 10 + Math.random() * 80,
  top: 10 + Math.random() * 80,
  x: Math.random() * 20 - 10,
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 3
}))

const skills = {
  'Languages': {
    icon: Code2,
    gradient: 'from-blue-500 to-cyan-500',
    items: [
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
      { name: 'SASS', icon: SiSass, color: '#CC6699' },
    ] as SkillItem[],
  },
  'Frameworks & Libraries': {
    icon: SiReact,
    gradient: 'from-violet-500 to-purple-500',
    items: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'Redux', icon: SiRedux, color: '#764ABC' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Chakra UI', icon: SiChakraui, color: '#319795' },
      { name: 'Ant Design', icon: SiAntdesign, color: '#0170FE' },
      { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    ] as SkillItem[],
  },
  'Tools & Platforms': {
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    items: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub, color: '#181717' },
      { name: 'Vercel', icon: SiVercel, color: '#000000' },
      { name: 'Netlify', icon: SiNetlify, color: '#00C7B7' },
      { name: 'Jira', icon: SiJira, color: '#0052CC' },
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    ] as SkillItem[],
  },
  'Specializations': {
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-500',
    items: [
      { name: 'Responsive Design', icon: Target, color: '#8B5CF6' },
      { name: 'Web Accessibility', icon: Target, color: '#10B981' },
      { name: 'Performance', icon: Zap, color: '#F59E0B' },
      { name: 'PWA', icon: Target, color: '#3B82F6' },
    ] as SkillItem[],
  },
}

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="py-20 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-violet-200/30 to-purple-200/30 dark:from-violet-600/10 dark:to-purple-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating skill particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-violet-400/20 dark:bg-violet-500/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, particle.x, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-4 border border-violet-200 dark:border-violet-800"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Code2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Tech Stack</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Technical Skills
          </h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, data], categoryIndex) => {
            const Icon = data.icon
            return (
              <motion.div
                key={category}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: categoryIndex * 0.15, duration: 0.6, type: "spring" }}
              >
                {/* Glowing border on hover */}
                <motion.div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${data.gradient} rounded-3xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-500`}
                />

                <motion.div
                  className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-100 dark:border-gray-800 overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%", skewX: -15 }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${data.gradient} shadow-lg relative`}
                      whileHover={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white relative z-10" />

                      {/* Pulsing ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${data.gradient}`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                    <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
                      {category}
                    </h3>
                  </div>

                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {data.items.map((skill, skillIndex) => {
                      const SkillIcon = skill.icon
                      return (
                        <motion.div
                          key={skill.name}
                          className="group/skill relative"
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
                          transition={{
                            delay: categoryIndex * 0.15 + skillIndex * 0.05,
                            duration: 0.4,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <motion.div
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-xl border-2 border-slate-200 dark:border-gray-700 cursor-default shadow-sm relative overflow-hidden"
                            whileHover={{
                              scale: 1.1,
                              y: -5,
                              borderColor: skill.color,
                              boxShadow: `0 10px 30px ${skill.color}40`
                            }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {/* Glow effect on hover */}
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover/skill:opacity-20"
                              style={{ background: `linear-gradient(135deg, ${skill.color}, transparent)` }}
                              transition={{ duration: 0.3 }}
                            />

                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <SkillIcon
                                className="w-4 h-4 sm:w-5 sm:h-5 relative z-10"
                                style={{ color: skill.color }}
                              />
                            </motion.div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 relative z-10">
                              {skill.name}
                            </span>

                            {/* Bottom accent */}
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-0.5"
                              style={{ background: skill.color }}
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.div>

                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/skill:opacity-100 transition-opacity pointer-events-none z-20">
                            <motion.div
                              className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap"
                              initial={{ y: 5 }}
                              whileHover={{ y: 0 }}
                            >
                              {skill.name}
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Bottom gradient accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${data.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: categoryIndex * 0.15 + 0.5, duration: 0.8 }}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}