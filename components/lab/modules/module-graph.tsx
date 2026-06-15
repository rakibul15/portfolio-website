'use client'

import { motion } from 'framer-motion'
import type {
  Chunk,
  ModuleEdge,
  ModuleNode,
  ModuleState,
  ModuleStep,
} from '@/lib/lab/modules-data'
import { springBouncy } from '@/lib/lab/motion'

interface ModuleGraphProps {
  step: ModuleStep
}

const MOD_TONE: Record<ModuleState, string> = {
  normal: 'fill-paper stroke-stroke2',
  parsing: 'fill-lab-amber stroke-lab-amber',
  loaded: 'fill-lab-emerald-soft stroke-lab-emerald',
  shaken: 'fill-paper2 stroke-stroke',
  dynamic: 'fill-lab-purple-soft stroke-lab-purple',
}

const MOD_TEXT: Record<ModuleState, string> = {
  normal: 'fill-ink',
  parsing: 'fill-paper',
  loaded: 'fill-lab-emerald',
  shaken: 'fill-faint',
  dynamic: 'fill-lab-purple',
}

const EDGE_STROKE = {
  normal: 'stroke-stroke2',
  highlighted: 'stroke-lab-blue',
  dynamic: 'stroke-lab-purple',
}

export function ModuleGraph({ step }: ModuleGraphProps) {
  const { modules, edges, chunks } = step

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-stroke">
        <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
          <div className="font-mono text-[10px] text-lab-blue tracking-[0.16em] uppercase">
            Module graph
          </div>
          <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
            {modules.length} modules · {edges.length} imports
          </div>
        </div>

        <div className="bg-paper2 p-4">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-[320px] sm:h-[360px]"
          >
            <defs>
              <marker
                id="m-arrow-normal"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
                className="fill-stroke2"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <marker
                id="m-arrow-highlighted"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
                className="fill-lab-blue"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <marker
                id="m-arrow-dynamic"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
                className="fill-lab-purple"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>

            {edges.map((edge, i) => (
              <EdgeSvg key={i} edge={edge} modules={modules} />
            ))}
            {modules.map((mod) => (
              <ModuleSvg key={mod.id} mod={mod} />
            ))}
          </svg>
        </div>
      </div>

      {/* Per-export breakdown (tree-shake scenario uses this) */}
      {modules.some((m) => m.exports) && (
        <div className="border border-stroke">
          <div className="px-4 py-2.5 border-b border-stroke">
            <span className="font-mono text-[10px] text-lab-amber tracking-[0.16em] uppercase">
              Exports
            </span>
          </div>
          <div className="divide-y divide-stroke">
            {modules
              .filter((m) => m.exports)
              .map((m) => (
                <div key={m.id} className="px-4 py-2">
                  <div className="font-mono text-[10px] text-faint tracking-[0.1em] uppercase mb-1.5">
                    {m.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.exports!.map((ex) => (
                      <span
                        key={ex.name}
                        className={`font-mono text-[10px] tracking-[0.04em] border px-2 py-0.5 ${
                          ex.used
                            ? 'border-lab-emerald bg-lab-emerald-soft text-lab-emerald'
                            : 'border-stroke text-faint line-through opacity-60'
                        }`}
                      >
                        {ex.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bundle chunks */}
      {chunks && chunks.length > 0 && <ChunksPanel chunks={chunks} />}
    </div>
  )
}

function ModuleSvg({ mod }: { mod: ModuleNode }) {
  const cx = mod.x * 100
  const cy = mod.y * 100
  const w = 22
  const h = 8
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: mod.state === 'shaken' ? 0.4 : 1,
        scale: mod.state === 'parsing' || mod.state === 'loaded' ? [1, 1.05, 1] : 1,
      }}
      transition={
        mod.state === 'normal'
          ? springBouncy
          : { duration: 0.55, ease: 'easeInOut' }
      }
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <motion.rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        strokeWidth="0.6"
        className={`${MOD_TONE[mod.state]} transition-colors`}
        rx="0.5"
        strokeDasharray={mod.state === 'dynamic' ? '1 0.6' : undefined}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        className={`${MOD_TEXT[mod.state]} transition-colors`}
        style={{ fontSize: 2.6, fontWeight: 700, fontFamily: 'var(--font-mono)' }}
      >
        {mod.label}
      </text>
    </motion.g>
  )
}

function EdgeSvg({ edge, modules }: { edge: ModuleEdge; modules: ModuleNode[] }) {
  const from = modules.find((m) => m.id === edge.fromId)
  const to = modules.find((m) => m.id === edge.toId)
  if (!from || !to) return null

  const x1 = from.x * 100
  const y1 = from.y * 100
  const x2 = to.x * 100
  const y2 = to.y * 100

  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return null
  const ux = dx / len
  const uy = dy / len
  const margin = 5
  const sx = x1 + ux * margin
  const sy = y1 + uy * margin
  const ex = x2 - ux * margin
  const ey = y2 - uy * margin

  return (
    <g>
      <line
        x1={sx}
        y1={sy}
        x2={ex}
        y2={ey}
        strokeWidth={edge.state === 'normal' ? 0.5 : 0.9}
        strokeDasharray={edge.state === 'dynamic' ? '1.5 0.8' : undefined}
        markerEnd={`url(#m-arrow-${edge.state})`}
        className={`${EDGE_STROKE[edge.state]} transition-all`}
      />
      <text
        x={(sx + ex) / 2}
        y={(sy + ey) / 2 - 1.5}
        textAnchor="middle"
        className="fill-muted"
        style={{ fontSize: 2.2, fontFamily: 'var(--font-mono)' }}
      >
        {edge.imports.join(', ')}
      </text>
    </g>
  )
}

function ChunksPanel({ chunks }: { chunks: Chunk[] }) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-2.5 border-b border-stroke">
        <span className="font-mono text-[10px] text-lab-purple tracking-[0.16em] uppercase">
          Bundle chunks
        </span>
      </div>
      <div className="divide-y divide-stroke">
        {chunks.map((chunk) => (
          <motion.div
            key={chunk.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={springBouncy}
            className={`px-4 py-3 ${chunk.state === 'lazy' ? 'bg-lab-purple-soft' : 'bg-paper'}`}
          >
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className={`font-mono text-[11px] tracking-[0.04em] font-bold ${chunk.state === 'lazy' ? 'text-lab-purple' : 'text-ink'}`}>
                {chunk.label}
              </span>
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-faint">
                {chunk.state === 'lazy' ? 'lazy / split' : 'eager'}
              </span>
            </div>
            <div className="font-mono text-[10px] text-muted mt-1 leading-snug">
              modules: {chunk.modules.join(', ')}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
