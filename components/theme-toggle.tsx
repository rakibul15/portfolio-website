'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // This is intentional for client-side hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return <div className="w-14 h-7" /> // Placeholder to prevent layout shift
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center transition-colors duration-300"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center"
        animate={{
          x: isDark ? 28 : 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-violet-600" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
    </motion.button>
  )
}