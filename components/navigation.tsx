'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { MagneticButton } from './magnetic-button'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const ticking = useRef(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))

    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40)

        // Detect active section
        const sections = ['home', 'about', 'work', 'experience', 'philosophy', 'contact']
        const scrollPos = window.scrollY + 120

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i])
          if (el && scrollPos >= el.offsetTop) {
            setActiveSection(sections[i])
            break
          }
        }
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-14 flex items-center justify-between transition-all duration-300 bg-paper ${
        isScrolled
          ? 'border-b border-stroke backdrop-blur-xl bg-paper/90'
          : 'border-b border-transparent'
      }`}
    >
      <a
        href="#home"
        className="font-serif text-[22px] font-black tracking-tight leading-none"
      >
        RH<span className="text-accent">.</span>
      </a>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => {
          const sectionId = link.href.substring(1)
          const isActive = activeSection === sectionId
          return (
            <li key={link.label}>
              <a
                href={link.href}
                className={`font-mono text-[11px] tracking-[0.1em] uppercase transition-colors relative ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            </li>
          )
        })}
      </ul>

      {/* Desktop right */}
      <div className="hidden md:flex items-center gap-4">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-ink transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        )}
        <MagneticButton strength={0.25}>
          <a
            href="#contact"
            className="font-mono text-[11px] tracking-[0.08em] uppercase bg-ink text-paper px-6 py-[11px] hover:bg-accent transition-colors inline-block"
          >
            Hire Me
          </a>
        </MagneticButton>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-ink"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu — animated */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-16 left-0 right-0 bg-paper border-b border-stroke md:hidden overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="px-6 py-6 flex flex-col gap-1"
            >
              {navLinks.map((link, i) => {
                const sectionId = link.href.substring(1)
                const isActive = activeSection === sectionId
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    className={`font-mono text-[12px] tracking-[0.1em] uppercase transition-colors py-3 border-b border-stroke ${
                      isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <span className="text-accent mr-1">&rarr;</span>
                    )}
                    {link.label}
                  </motion.a>
                )
              })}
              <div className="flex items-center justify-between pt-4">
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-muted hover:text-ink"
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </button>
                )}
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-mono text-[11px] tracking-[0.08em] uppercase bg-ink text-paper px-6 py-[11px]"
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
