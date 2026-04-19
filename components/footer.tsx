'use client'

export function Footer() {
  return (
    <footer className="px-6 lg:px-14 py-7 border-t border-stroke flex flex-col sm:flex-row justify-between items-center gap-2">
      <span className="font-mono text-[11px] text-muted tracking-[0.06em]">
        &copy; {new Date().getFullYear()} Rakibul Hasan &mdash; Senior Frontend
        Developer
      </span>
      <span className="font-mono text-[11px] text-muted tracking-[0.06em]">
        Designed &amp; Built with precision
      </span>
    </footer>
  )
}
