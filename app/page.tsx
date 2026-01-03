import { Background3D } from '@/components/3d-background'
import { Navigation } from '@/components/navigation'
import { ScrollProgress } from '@/components/scroll-progress'
import { HeroSection } from '@/components/hero-section'
import { StatsSection } from '@/components/stats-section'
import { SummarySection } from '@/components/summary-section'
import { SkillsSection } from '@/components/skills-section'
import { TechStackBanner } from '@/components/tech-stack-banner'
import { ProjectsSection } from '@/components/projects-section'
import { ExperienceSection } from '@/components/experience-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Background3D />
      <ScrollProgress />
      <Navigation />
      <main className="relative">
        <div id="home">
          <HeroSection />
        </div>
        <StatsSection />
        <div id="about">
          <SummarySection />
        </div>
        <div id="skills">
          <SkillsSection />
        </div>
        <TechStackBanner />
        <div id="projects">
          <ProjectsSection />
        </div>
        <div id="experience">
          <ExperienceSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
