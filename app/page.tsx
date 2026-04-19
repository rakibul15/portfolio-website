import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { Marquee } from '@/components/marquee'
import { AboutSection } from '@/components/about-section'
import { ProjectsSection } from '@/components/projects-section'
import { ExperienceSection } from '@/components/experience-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { PhilosophySection } from '@/components/philosophy-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { PageLoader } from '@/components/page-loader'
import { BackToTop } from '@/components/back-to-top'

export default function Home() {
  return (
    <>
      <PageLoader />
      <Navigation />
      <main>
        <HeroSection />
        <Marquee />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <PhilosophySection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
