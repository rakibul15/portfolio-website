'use client'

const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Redux',
  'Tailwind CSS',
  'REST APIs',
  'HTML5 / CSS3',
  'SASS',
  'Ant Design',
  'Chakra UI',
  'Bootstrap',
  'Git',
  'Figma',
  'Vercel',
  'Performance',
]

export function Marquee() {
  return (
    <div className="bg-paper3 py-5 overflow-hidden border-y border-stroke">
      <div
        className="flex whitespace-nowrap hover:[animation-play-state:paused]"
        style={{ animation: 'marquee 35s linear infinite' }}
      >
        {[...skills, ...skills].map((skill, i) => (
          <span
            key={i}
            className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted px-10 flex items-center gap-10"
          >
            {skill}
            <span className="w-1 h-1 bg-accent rounded-full shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
