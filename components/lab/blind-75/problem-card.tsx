'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Check, ChevronDown, Copy, ExternalLink, Sparkles } from 'lucide-react'
import type { Blind75Problem, Difficulty } from '@/lib/lab/blind75-data'

type Lang = 'js' | 'ts' | 'go'

interface ProblemCardProps {
  problem: Blind75Problem
  language: Lang
  index: number
}

const diffStyle: Record<Difficulty, string> = {
  Easy: 'bg-lab-emerald-soft text-lab-emerald border-lab-emerald/30',
  Medium: 'bg-lab-amber-soft text-lab-amber border-lab-amber/30',
  Hard: 'bg-accent/10 text-accent border-accent/30',
}

export function ProblemCard({ problem, language, index }: ProblemCardProps) {
  const [open, setOpen] = useState(false)
  const [localLang, setLocalLang] = useState<Lang>(language)
  const [copied, setCopied] = useState(false)

  const activeLang = localLang
  const codeStr = problem.code[activeLang]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeStr)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* noop */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.015, 0.25) }}
      className="border border-stroke bg-paper"
    >
      {/* Header row */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 lg:px-5 py-4 flex items-center gap-3 hover:bg-stroke/30 transition-colors"
      >
        <span className="font-mono text-[10px] text-faint tracking-[0.08em] w-7 shrink-0">
          {String(problem.id).padStart(2, '0')}
        </span>
        <span
          className={`font-mono text-[9.5px] tracking-[0.12em] uppercase px-2 py-[3px] border ${diffStyle[problem.difficulty]} shrink-0`}
        >
          {problem.difficulty}
        </span>
        <span className="font-serif text-[15px] lg:text-[16px] font-medium text-ink flex-1 truncate">
          {problem.title}
        </span>
        <span className="hidden md:inline font-mono text-[10px] text-muted tracking-[0.08em]">
          {problem.category}
        </span>
        {problem.vizLink && (
          <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] text-lab-purple tracking-[0.08em]">
            <Sparkles className="w-3 h-3" />
            viz
          </span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0">
          <ChevronDown className="w-4 h-4 text-muted" />
        </motion.span>
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-stroke"
          >
            <div className="px-4 lg:px-5 py-5 space-y-4">
              {/* Approach */}
              <div>
                <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase mb-2">
                  Approach
                </div>
                <p className="text-[13.5px] text-ink leading-[1.7] font-light">
                  {problem.approach}
                </p>
              </div>

              {/* Action row */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase border border-stroke px-3 py-1.5 hover:bg-lab-blue-soft hover:border-lab-blue hover:text-lab-blue transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open on LeetCode
                </Link>
                {problem.vizLink && (
                  <Link
                    href={problem.vizLink}
                    className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.1em] uppercase border border-lab-purple/40 bg-lab-purple-soft text-lab-purple px-3 py-1.5 hover:bg-lab-purple hover:text-paper transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Visualize
                  </Link>
                )}
              </div>

              {/* Code block */}
              <div className="border border-stroke bg-paper">
                <div className="px-3 py-2 border-b border-stroke flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {(['ts', 'js', 'go'] as Lang[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLocalLang(l)}
                        className={`font-mono text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 border transition-colors ${
                          activeLang === l
                            ? 'border-lab-blue bg-lab-blue text-paper'
                            : 'border-stroke text-muted hover:text-ink hover:border-ink'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-muted hover:text-ink transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-lab-emerald" />
                        <span className="text-lab-emerald">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="font-mono text-[12.5px] leading-[1.7] text-ink whitespace-pre">
                    {codeStr}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
