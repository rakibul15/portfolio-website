'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { MagneticButton } from './magnetic-button'

type NavLink = {
  label: string
  href: string
  // 'hash' = on-page section (only active when on '/')
  // 'route' = real route (active when pathname starts with href)
  type: 'hash' | 'route'
  // for hash links, the section id we track for active-state on homepage
  section?: string
}

const navLinks: NavLink[] = [
  { label: 'About', href: '/#about', type: 'hash', section: 'about' },
  { label: 'Work', href: '/#work', type: 'hash', section: 'work' },
  { label: 'Lab', href: '/lab', type: 'route' },
  { label: 'Experience', href: '/#experience', type: 'hash', section: 'experience' },
  { label: 'Philosophy', href: '/#philosophy', type: 'hash', section: 'philosophy' },
  { label: 'Contact', href: '/#contact', type: 'hash', section: 'contact' },
]

const homeSections = ['home', 'about', 'work', 'experience', 'philosophy', 'contact']

export function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const ticking = useRef(false)

  // SSR-safe theme detection via useSyncExternalStore (no setState-in-effect).
  // The blocking script in <head> sets the .dark class before hydration,
  // so reading classList here is safe and matches the rendered DOM.
  const mounted = useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
      return () => observer.disconnect()
    },
    () => true,
    () => false,
  )
  const isDark = useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
      return () => observer.disconnect()
    },
    () => document.documentElement.classList.contains('dark'),
    () => false,
  )

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40)

        // Only track active section on home page (hash links rely on it)
        if (isHome) {
          const scrollPos = window.scrollY + 120
          for (let i = homeSections.length - 1; i >= 0; i--) {
            const el = document.getElementById(homeSections[i])
            if (el && scrollPos >= el.offsetTop) {
              setActiveSection(homeSections[i])
              break
            }
          }
        }
        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const toggleTheme = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  const isLinkActive = (link: NavLink) => {
    if (link.type === 'route') {
      return pathname === link.href || pathname.startsWith(`${link.href}/`)
    }
    // hash link: only active when on home AND scroll matches
    return isHome && activeSection === link.section
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 px-6 lg:px-14 flex items-center justify-between transition-all duration-300 bg-paper ${
        isScrolled
          ? 'border-b border-stroke backdrop-blur-xl bg-paper/90'
          : 'border-b border-transparent'
      }`}
    >
      <Link
        href="/"
        className="font-serif text-[22px] font-black tracking-tight leading-none"
      >
        RH<span className="text-accent">.</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => {
          const isActive = isLinkActive(link)
          const LinkComponent = link.type === 'route' ? Link : 'a'
          return (
            <li key={link.label}>
              <LinkComponent
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
              </LinkComponent>
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
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}
        <MagneticButton strength={0.25}>
          <Link
            href="/#contact"
            className="font-mono text-[11px] tracking-[0.08em] uppercase bg-ink text-paper px-6 py-[11px] hover:bg-accent transition-colors inline-block"
          >
            Hire Me
          </Link>
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

      {/* Mobile menu */}
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
                const isActive = isLinkActive(link)
                const LinkComponent = link.type === 'route' ? Link : 'a'
                return (
                  <motion.span
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <LinkComponent
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`font-mono text-[12px] tracking-[0.1em] uppercase transition-colors py-3 border-b border-stroke block ${
                        isActive ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {isActive && <span className="text-accent mr-1">&rarr;</span>}
                      {link.label}
                    </LinkComponent>
                  </motion.span>
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
                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="font-mono text-[11px] tracking-[0.08em] uppercase bg-ink text-paper px-6 py-[11px]"
                >
                  Hire Me
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
