'use client'

import { motion } from 'framer-motion'
import { Mail, Linkedin, Github, Code2, Sparkles, Terminal, Cpu, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const fullText = 'Crafting beautiful, scalable, and accessible web experiences'

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.substring(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  }


  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/30 dark:from-gray-950 dark:via-violet-950/20 dark:to-gray-950">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-violet-400/30 to-purple-400/30 dark:from-violet-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 dark:from-indigo-600/20 dark:to-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-violet-500/20 dark:bg-violet-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Animated tech icons */}
      <motion.div
        className="absolute top-20 left-[10%] opacity-10 dark:opacity-20"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Code2 className="w-16 h-16 text-violet-600 dark:text-violet-400" />
      </motion.div>
      <motion.div
        className="absolute top-32 right-[15%] opacity-10 dark:opacity-20"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Terminal className="w-20 h-20 text-indigo-600 dark:text-indigo-400" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-[15%] opacity-10 dark:opacity-20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cpu className="w-18 h-18 text-purple-600 dark:text-purple-400" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-[10%] opacity-10 dark:opacity-20"
        animate={{
          y: [0, 35, 0],
          rotate: [0, -12, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Zap className="w-14 h-14 text-blue-600 dark:text-blue-400" />
      </motion.div>

      {/* Mouse follower gradient */}
      <motion.div
        className="absolute pointer-events-none w-96 h-96 bg-gradient-radial from-violet-500/10 to-transparent dark:from-violet-500/5 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glowing badge */}
        <motion.div
          variants={itemVariants}
          className="mb-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-violet-200 dark:border-violet-900 shadow-xl"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </motion.div>
          <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Open to opportunities
          </span>
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              delay: 0.2,
              duration: 0.8,
            }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              RAKIBUL HASAN
            </motion.span>
          </motion.h1>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-transparent via-violet-600 to-transparent dark:via-violet-400 rounded-full"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Code2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-transparent via-indigo-600 to-transparent dark:via-indigo-400 rounded-full"
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 shadow-2xl mb-6"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)" }}
            animate={{
              boxShadow: [
                "0 10px 30px rgba(139, 92, 246, 0.3)",
                "0 10px 40px rgba(139, 92, 246, 0.5)",
                "0 10px 30px rgba(139, 92, 246, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Terminal className="w-6 h-6 text-white" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Senior Frontend Developer
            </h2>
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-4 max-w-3xl mx-auto min-h-[4rem] px-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
              className="inline-block w-1 h-6 md:h-7 bg-violet-600 dark:bg-violet-400 ml-1"
            />
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech, i) => (
              <motion.span
                key={tech}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-violet-200 dark:border-violet-900"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 px-4"
        >
          <motion.a
            href="https://www.linkedin.com/in/rakibul-hasan-514649130/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 text-white font-semibold shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
            <Linkedin className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Connect on LinkedIn</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%', skewX: -15 }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.a>

          <motion.a
            href="https://github.com/rakibulhasan"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-gray-900 border-2 border-violet-600 dark:border-violet-400 text-violet-600 dark:text-violet-400 font-semibold shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Github className="w-5 h-5 relative z-10" />
            <span className="relative z-10">View GitHub</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold"
            >
              <Github className="w-5 h-5" />
              View GitHub
            </motion.span>
          </motion.a>

          <motion.a
            href="mailto:rakib251193@gmail.com"
            className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-300 font-semibold shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Mail className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Email Me</span>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>

      </motion.div>

      {/* Scroll indicator - positioned at bottom of section */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-slate-300 dark:border-slate-600 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-violet-600 dark:bg-violet-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}