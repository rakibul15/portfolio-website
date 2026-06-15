'use client'

interface CodePanelProps {
  code: string[]
  activeLine: number // 1-indexed; 0 means none
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  return (
    <div className="border border-stroke">
      <div className="px-4 py-3 border-b border-stroke flex justify-between items-center">
        <div className="font-mono text-[10px] text-accent tracking-[0.16em] uppercase">
          Source
        </div>
        <div className="font-mono text-[10px] text-faint tracking-[0.06em]">
          {String(code.length).padStart(2, '0')} lines
        </div>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-[12.5px] leading-[1.85] block">
          {code.map((line, i) => {
            const lineNum = i + 1
            const active = lineNum === activeLine
            return (
              <div
                key={i}
                className={`flex gap-4 px-2 -mx-2 transition-colors ${
                  active ? 'bg-paper3' : ''
                }`}
              >
                <span
                  className={`select-none w-6 text-right shrink-0 ${
                    active ? 'text-accent' : 'text-faint'
                  }`}
                >
                  {String(lineNum).padStart(2, '0')}
                </span>
                <span className={active ? 'text-ink' : 'text-muted'}>{line}</span>
              </div>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
