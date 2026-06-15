import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'

export const metadata: Metadata = {
  title: {
    default: 'Lab — Interactive Frontend Visualizers',
    template: '%s — Lab | Rakibul Hasan',
  },
  description:
    'Interactive visualizers for the frontend concepts I think about — the JS event loop, Next.js caching, React reconciliation, and more.',
  openGraph: {
    title: 'Lab — Interactive Frontend Visualizers | Rakibul Hasan',
    description:
      'Interactive demos of the JS event loop, Next.js caching layers, React reconciliation, and more.',
    type: 'website',
  },
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  )
}
