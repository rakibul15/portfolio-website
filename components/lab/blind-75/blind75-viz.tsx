'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import {
  problems,
  allCategories,
  allDifficulties,
  type Category,
  type Difficulty,
} from '@/lib/lab/blind75-data'
import { ProblemCard } from './problem-card'

type Lang = 'js' | 'ts' | 'go'

const diffPillStyle: Record<Difficulty, { active: string; idle: string }> = {
  Easy: {
    active: 'bg-lab-emerald text-paper border-lab-emerald',
    idle: 'border-stroke text-muted hover:border-lab-emerald hover:text-lab-emerald',
  },
  Medium: {
    active: 'bg-lab-amber text-paper border-lab-amber',
    idle: 'border-stroke text-muted hover:border-lab-amber hover:text-lab-amber',
  },
  Hard: {
    active: 'bg-accent text-paper border-accent',
    idle: 'border-stroke text-muted hover:border-accent hover:text-accent',
  },
}

export function Blind75Viz() {
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All')
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<Lang>('ts')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return problems.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (difficulty !== 'All' && p.difficulty !== difficulty) return false
      if (q && !p.title.toLowerCase().includes(q)) return false
      return true
    })
  }, [category, difficulty, query])

  const counts = useMemo(() => {
    const byCat = new Map<Category, number>()
    for (const c of allCategories) byCat.set(c, 0)
    for (const p of problems) byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1)
    return byCat
  }, [])

  const vizCount = filtered.filter((p) => p.vizLink).length

  return (
    <div className="space-y-7">
      {/* Filter controls */}
      <div className="border border-stroke bg-paper p-4 lg:p-5 space-y-4">
        {/* Difficulty + Language */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] text-faint tracking-[0.14em] uppercase">
            Difficulty
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDifficulty('All')}
              className={`font-mono text-[10.5px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
                difficulty === 'All'
                  ? 'bg-ink text-paper border-ink'
                  : 'border-stroke text-muted hover:border-ink hover:text-ink'
              }`}
            >
              All
            </button>
            {allDifficulties.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`font-mono text-[10.5px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
                  difficulty === d ? diffPillStyle[d].active : diffPillStyle[d].idle
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <span className="hidden md:inline-block w-px h-5 bg-stroke mx-1" />

          <span className="font-mono text-[10px] text-faint tracking-[0.14em] uppercase">
            Default lang
          </span>
          <div className="flex gap-1.5">
            {(['ts', 'js', 'go'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`font-mono text-[10.5px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
                  language === l
                    ? 'bg-lab-blue text-paper border-lab-blue'
                    : 'border-stroke text-muted hover:border-lab-blue hover:text-lab-blue'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-faint tracking-[0.14em] uppercase mr-1">
            Category
          </span>
          <button
            type="button"
            onClick={() => setCategory('All')}
            className={`font-mono text-[10.5px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
              category === 'All'
                ? 'bg-ink text-paper border-ink'
                : 'border-stroke text-muted hover:border-ink hover:text-ink'
            }`}
          >
            All · 75
          </button>
          {allCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`font-mono text-[10.5px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
                category === c
                  ? 'bg-lab-purple text-paper border-lab-purple'
                  : 'border-stroke text-muted hover:border-lab-purple hover:text-lab-purple'
              }`}
            >
              {c} · {counts.get(c) ?? 0}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title — try 'sum', 'tree', 'window'..."
            className="w-full bg-paper border border-stroke pl-9 pr-9 py-2 font-mono text-[12.5px] text-ink placeholder:text-faint focus:outline-none focus:border-lab-blue transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Result strip */}
      <motion.div
        key={`${category}-${difficulty}-${query}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-baseline justify-between gap-4 border-b border-stroke pb-3"
      >
        <div className="font-mono text-[11px] text-muted tracking-[0.08em]">
          <span className="text-ink font-medium">
            {String(filtered.length).padStart(2, '0')}
          </span>
          <span> / 75 problems</span>
          {vizCount > 0 && (
            <span className="ml-3 text-lab-purple">
              {vizCount} with visualizer
            </span>
          )}
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase">
          Tap a row to expand
        </div>
      </motion.div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="border border-dashed border-stroke px-6 py-16 text-center">
          <div className="font-mono text-[11px] text-muted tracking-[0.12em] uppercase mb-2">
            No matches
          </div>
          <p className="text-[13.5px] text-muted font-light">
            Try clearing a filter or your search.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <ProblemCard key={p.id} problem={p} language={language} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
