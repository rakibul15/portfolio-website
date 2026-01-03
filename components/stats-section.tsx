'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Award, Users, Code, Coffee } from 'lucide-react'

// Generate particles once at module level
const particles = Array.from({ length: 10 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: 2 + Math.random() * 3,
  delay: Math.random() * 3
}))

const stats = [
  {
    icon: Award,
    value: 5,
    suffix: '+',
    label: 'Years Experience',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Code,
    value: 50,
    suffix: '+',
    label: 'Projects Completed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    value: 1000,
    suffix: '+',
    label: 'Happy Users',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Coffee,
    value: 999,
    suffix: '+',
    label: 'Cups of Coffee',
    color: 'from-orange-500 to-red-500',
  },
]

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(value * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return <span ref={ref}>{count}</span>
}

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="py-16 px-4 bg-linear-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background gradients */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-r from-violet-200/40 to-purple-200/40 dark:from-violet-600/10 dark:to-purple-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-linear-to-r from-blue-200/40 to-cyan-200/40 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-300/40 dark:bg-violet-500/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 50 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {/* Glowing border effect */}
                <motion.div
                  className={`absolute -inset-0.5 bg-linear-to-r ${stat.color} rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-500`}
                  animate={{
                    opacity: isInView ? [0, 0.3, 0] : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                <motion.div
                  className="relative bg-linear-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl p-4 sm:p-6 text-center shadow-xl border-2 border-slate-200/80 dark:border-gray-800 overflow-hidden backdrop-blur-sm"
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    borderColor: "rgba(139, 92, 246, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%", skewX: -15 }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Icon with pulsing animation */}
                  <motion.div
                    className={`inline-flex p-3 sm:p-4 rounded-xl bg-linear-to-r ${stat.color} mb-3 sm:mb-4 relative`}
                    whileHover={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.5 }}
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                        "0 0 30px rgba(139, 92, 246, 0.5)",
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                      ],
                    }}
                    style={{
                      transition: "box-shadow 2s ease-in-out infinite",
                    }}
                  >
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white relative z-10" />

                    {/* Pulsing ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-linear-to-r ${stat.color}`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Counter with gradient */}
                  <motion.div
                    className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent mb-2 drop-shadow-sm`}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{
                      delay: index * 0.15 + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Counter value={stat.value} />
                    {stat.suffix}
                  </motion.div>

                  {/* Label */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wide">
                    {stat.label}
                  </p>

                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.color}`}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: index * 0.15 + 0.5, duration: 0.6 }}
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
