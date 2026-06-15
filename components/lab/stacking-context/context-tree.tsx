'use client'

import { motion } from 'framer-motion'
import type { StackingBox } from '@/lib/lab/stacking-context-data'

interface ContextTreeProps {
  boxes: StackingBox[]
  highlightIds: string[]
  showPaintOrder: boolean
}

interface TreeNode {
  box: StackingBox
  children: TreeNode[]
}

function buildTree(boxes: StackingBox[]): TreeNode[] {
  const byParent = new Map<string | undefined, StackingBox[]>()
  for (const b of boxes) {
    const key = b.parentId
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key)!.push(b)
  }
  const collect = (parentId?: string): TreeNode[] => {
    const children = byParent.get(parentId) ?? []
    return children.map((box) => ({ box, children: collect(box.id) }))
  }
  return collect(undefined)
}

function TreeNodeRow({
  node,
  depth,
  highlightIds,
  showPaintOrder,
}: {
  node: TreeNode
  depth: number
  highlightIds: string[]
  showPaintOrder: boolean
}) {
  const { box } = node
  const isHighlighted = highlightIds.includes(box.id)
  const createsContext = Boolean(box.contextReason)

  return (
    <div>
      <motion.div
        layout
        style={{ marginLeft: depth * 20 }}
        className={`border mb-1.5 transition-colors px-3 py-2.5 ${
          isHighlighted
            ? 'border-accent bg-paper'
            : createsContext
              ? 'border-stroke2 bg-paper2'
              : 'border-stroke bg-paper'
        }`}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="font-serif text-[15px] sm:text-[17px] font-black tracking-tight leading-none">
              {box.label}
            </span>
            {createsContext && (
              <span className="font-mono text-[9px] text-accent tracking-[0.14em] uppercase border border-accent px-1.5 py-[2px] leading-none">
                new context
              </span>
            )}
            {box.declaredZ !== undefined && (
              <span className="font-mono text-[10px] text-muted tracking-[0.06em]">
                z-index: {box.declaredZ}
              </span>
            )}
            {showPaintOrder && (
              <span className="font-mono text-[10px] text-ink tracking-[0.06em]">
                paint: {box.paintOrder}
              </span>
            )}
          </div>
          {box.contextReason && (
            <span className="font-mono text-[10px] text-faint tracking-[0.02em] leading-snug">
              {box.contextReason}
            </span>
          )}
        </div>
      </motion.div>

      {node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNodeRow
              key={child.box.id}
              node={child}
              depth={depth + 1}
              highlightIds={highlightIds}
              showPaintOrder={showPaintOrder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ContextTree({ boxes, highlightIds, showPaintOrder }: ContextTreeProps) {
  const tree = buildTree(boxes)
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Stacking Context Tree
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {boxes.filter((b) => b.contextReason).length} new contexts
        </div>
      </div>
      <div className="p-3 sm:p-4">
        {tree.map((node) => (
          <TreeNodeRow
            key={node.box.id}
            node={node}
            depth={0}
            highlightIds={highlightIds}
            showPaintOrder={showPaintOrder}
          />
        ))}
      </div>
    </div>
  )
}
