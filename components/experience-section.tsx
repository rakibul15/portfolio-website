'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Briefcase, Calendar, MapPin, Award, TrendingUp, ChevronDown } from 'lucide-react'

const experiences = [
  {
    title: 'Senior Software Engineer (Frontend)',
    company: 'TechnoNext Ltd',
    period: 'Aug 2024 – Present',
    location: 'Dhaka, Bangladesh',
    achievements: [
      'Architected and developed scalable frontend solutions for CarryBee on-demand delivery platform with real-time tracking',
      'Built responsive web applications handling 1000+ concurrent users for food and package delivery services',
      'Implemented real-time order tracking system using WebSocket integration, improving customer satisfaction by 35%',
      'Optimized delivery routing interface reducing order processing time by 25% through efficient state management',
      'Applied modern frontend technologies including React, Next.js, TanStack Query, and ShadCN UI for enhanced UX',
    ],
  },
  {
    title: 'Software Engineer (Frontend)',
    company: 'TechnoNext Ltd',
    period: 'May 2022 – Aug 2024',
    location: 'Dhaka, Bangladesh',
    achievements: [
      'Designed and executed scalable frontend architectures for clients including US-Bangla Airlines, FirstTrip, and Triplove',
      'Developed reusable React and Next.js components integrated with REST APIs for high-performance web applications',
      'Led frontend development team, providing mentorship, conducting code reviews, and enforcing best practices',
      'Ensured accessibility and responsiveness across multiple devices and browsers',
      'Delivered 20+ production-ready features, reducing client feedback iterations by 40%',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'EastWestNet',
    period: 'January 2022 – May 2022',
    location: 'Dhaka, Bangladesh',
    achievements: [
      'Built interactive web applications for Taamid with secure authentication, increasing user engagement by 45%',
      'Optimized global state management using Redux, reducing API call frequency by 35% and improving load times',
      'Achieved 98% cross-browser compatibility across Chrome, Firefox, Safari, and Edge with mobile-first responsive design',
    ],
  },
  {
    title: 'Junior Frontend Developer',
    company: 'Ghuri Express Limited',
    period: 'March 2021 – January 2022',
    location: 'Dhaka, Bangladesh',
    achievements: [
      'Delivered 15+ UI components for landing pages and dashboards, increasing conversion rates by 25%',
      'Collaborated with 5-member cross-functional team to ship production-ready interfaces 20% faster than previous timelines',
      'Reduced frontend bugs by 40% through comprehensive testing protocols and quality assurance processes',
    ],
  },
  {
    title: 'Junior Frontend Developer',
    company: 'Stickerdriver',
    period: 'March 2020 – February 2021',
    location: 'Dhaka, Bangladesh',
    achievements: [
      'Created 10+ responsive landing pages and admin templates, achieving 95% mobile compatibility score',
      'Improved page load speed by 50% through code optimization and performance best practices',
      'Established reusable design system components, reducing development time by 30% across project',
    ],
  },
]

export function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">5+ Years Journey</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Professional Experience
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A journey of growth, innovation, and delivering exceptional web experiences
          </p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const isExpanded = expandedIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative"
              >
                <motion.div
                  className="group relative bg-white dark:bg-slate-800/60 dark:backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 dark:border-slate-700/50 hover:border-violet-300 dark:hover:border-violet-800/50"
                  whileHover={{ y: -2, scale: 1.005 }}
                  layout
                >
                  {/* Top gradient bar */}
                  <div className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600" />

                  <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <motion.div
                            className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                              {exp.title}
                            </h3>
                            <p className="text-base sm:text-lg font-semibold text-violet-600 dark:text-violet-400">
                              {exp.company}
                            </p>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium">{exp.period}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expand button */}
                      <motion.button
                        onClick={() => toggleExpand(index)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </motion.div>
                      </motion.button>
                    </div>

                    {/* Preview - first 2 achievements */}
                    {!isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        {exp.achievements.slice(0, 2).map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {achievement}
                            </p>
                          </div>
                        ))}
                        {exp.achievements.length > 2 && (
                          <button
                            onClick={() => toggleExpand(index)}
                            className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline mt-2"
                          >
                            + {exp.achievements.length - 2} more achievements
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* Expanded - all achievements */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {exp.achievements.map((achievement, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/30">
                              <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                              {achievement}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Hover effect gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Career stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'Companies', value: '5', icon: Briefcase },
            { label: 'Years Experience', value: '5+', icon: Award },
            { label: 'Projects', value: '50+', icon: TrendingUp },
            { label: 'Technologies', value: '15+', icon: Award },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border border-violet-200 dark:border-violet-900/30"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}