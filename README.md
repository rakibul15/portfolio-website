# Rakibul Hasan - Portfolio Website

A modern, animated portfolio website built with Next.js 16.1, TypeScript, Tailwind CSS, Three.js, and Framer Motion.

## Features

- **3D Background Animation**: Multi-layered particle system with floating effects using Three.js and React Three Fiber
- **Scroll Progress Bar**: Visual progress indicator at the top of the page
- **Animated Statistics**: Counter animations showcasing years of experience and achievements
- **Featured Projects**: Interactive project cards with hover effects and live links
- **Smooth Animations**: Page transitions, scroll-based animations, and micro-interactions using Framer Motion
- **Icon-Enhanced Sections**: Colorful icons for skills categories and project types
- **Responsive Design**: Mobile-first design that works flawlessly on all devices
- **Modern Tech Stack**: Built with the latest web technologies
- **SEO Optimized**: Proper metadata and semantic HTML
- **Dark Mode Support**: Built-in dark mode compatibility
- **Performance Optimized**: Fast loading and smooth 60fps animations

## Tech Stack

- **Next.js 16.1**: React framework for production
- **TypeScript**: Type-safe code
- **Tailwind CSS 4**: Utility-first CSS framework
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── 3d-background.tsx   # Three.js animated background with particles
│   ├── scroll-progress.tsx # Scroll progress indicator
│   ├── navigation.tsx      # Sticky navigation bar
│   ├── hero-section.tsx    # Hero section with floating animations
│   ├── stats-section.tsx   # Animated statistics counters
│   ├── summary-section.tsx # Professional summary
│   ├── skills-section.tsx  # Technical skills with icons
│   ├── projects-section.tsx # Featured projects showcase
│   ├── experience-section.tsx # Work experience timeline
│   ├── contact-section.tsx # Contact information and education
│   └── footer.tsx          # Footer
└── lib/
    └── utils.ts            # Utility functions
```

## Sections

1. **Hero**: Animated introduction with floating emojis, gradient text, and social links
2. **Statistics**: Animated counters showing years of experience, projects, users, and coffee consumed
3. **About**: Professional summary with fade-in animations
4. **Skills**: Icon-enhanced technical skills organized by category with hover effects
5. **Projects**: Featured project cards with live links to FirstTrip, Triplover, CarryBee, and TakeTrip
6. **Experience**: Interactive timeline showcasing 5 years of professional work history
7. **Contact**: Contact information, education, and language proficiency

## Customization

To customize the portfolio for your own use:

1. Update personal information in the components
2. Modify colors in Tailwind config
3. Add or remove sections as needed
4. Update metadata in `app/layout.tsx`

## Deployment

This project can be deployed to:

- **Vercel**: `vercel deploy` - [Deploy on Vercel](https://vercel.com/new)
- **Netlify**: Connect your repository
- **Any Node.js hosting**: Use the build output

## License

© 2026 Rakibul Hasan. All rights reserved.
