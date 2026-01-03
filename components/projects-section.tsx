'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Plane,
  Heart,
  Package,
  Rocket,
  Sparkles,
  Globe,
  ArrowUpRight,
  Star,
} from 'lucide-react'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiChakraui,
  SiAntdesign,
} from 'react-icons/si'

const projects = [
  {
    name: 'FirstTrip',
    tagline: 'Create A New Story With Every Trip',
    description:
      "Bangladesh's top travel app offering flight, hotel, holiday, visa, and eSIM services with IATA and MoCAT certification.",
    url: 'https://firsttrip.com/',
    icon: Plane,
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    darkGradient: 'from-blue-700 via-cyan-700 to-teal-700',
    accentColor: 'bg-blue-600',
    features: ['Flight Booking', 'Hotel Reservations', 'Holiday Packages', 'Visa Services'],
    techStack: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    ],
    stats: { users: '50K+', bookings: '10K+' },
  },
  {
    name: 'Triplover',
    tagline: "It's time to explore the world",
    description:
      'A trusted flight booking platform partnering with 28+ major airlines including Emirates, Qatar Airways, and Singapore Airlines.',
    url: 'https://triplover.com/',
    icon: Heart,
    gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
    darkGradient: 'from-rose-700 via-pink-700 to-fuchsia-700',
    accentColor: 'bg-rose-600',
    features: ['Multi-city Booking', 'Student Fares', 'Mobile App', '28+ Airlines'],
    techStack: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'Redux', icon: SiRedux, color: '#764ABC' },
      { name: 'Ant Design', icon: SiAntdesign, color: '#0170FE' },
    ],
    stats: { airlines: '28+', routes: '500+' },
  },
  {
    name: 'CarryBee Merchant',
    tagline: 'Smart Delivery Management',
    description:
      'On-demand delivery platform with real-time tracking, handling 1000+ concurrent users for food and package delivery services.',
    url: 'https://merchant.carrybee.com/',
    icon: Package,
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    darkGradient: 'from-amber-700 via-orange-700 to-red-700',
    accentColor: 'bg-orange-600',
    features: ['Real-time Tracking', 'Order Management', 'Analytics Dashboard', 'Route Optimization'],
    techStack: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    ],
    stats: { orders: '1K+/day', partners: '200+' },
  },
  {
    name: 'TakeTrip',
    tagline: 'Revolutionizing Travel Booking',
    description:
      'Comprehensive travel booking platform providing hassle-free travel experiences with IATA certification and all-inclusive services.',
    url: 'https://www.taketrip.com/',
    icon: Rocket,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    darkGradient: 'from-emerald-700 via-teal-700 to-cyan-700',
    accentColor: 'bg-teal-600',
    features: ['Travel Booking', 'IATA Certified', 'Customer Support', 'Hassle-free Experience'],
    techStack: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'Chakra UI', icon: SiChakraui, color: '#319795' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    ],
    stats: { bookings: '5K+', satisfied: '98%' },
  },
]

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-20 px-4 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-violet-200/30 dark:bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 mb-4 border border-violet-200 dark:border-violet-800"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Featured Work</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Innovative projects serving thousands of users across multiple platforms
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon
            return (
              <motion.article
                key={project.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 h-full">
                  {/* Top gradient bar */}
                  <div className={`h-1.5 bg-gradient-to-r ${project.gradient}`} />

                  <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`p-4 rounded-xl bg-gradient-to-br ${project.gradient} shadow-lg`}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {project.name}
                          </h3>
                          <p className={`text-sm sm:text-base font-semibold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                            {project.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className={`text-3xl font-bold bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent mb-1`}>
                            {value}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 capitalize font-medium">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Key Features
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {project.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.gradient}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => {
                          const TechIcon = tech.icon
                          return (
                            <div
                              key={tech.name}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              <TechIcon className="w-3.5 h-3.5" style={{ color: tech.color }} />
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {tech.name}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Visit Button */}
                    <motion.a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r ${project.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full group/btn`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Visit Live Project</span>
                      <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </motion.a>
                  </div>

                  {/* Border glow on hover - dark themed */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.darkGradient} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500 -z-10`} />
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              Want to see more of my work?
            </p>
            <motion.a
              href="https://github.com/rakibulhasan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:shadow-2xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-5 h-5" />
              <span>Explore More on GitHub</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}