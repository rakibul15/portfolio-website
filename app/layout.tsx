import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl = "https://rakibulhasan.dev";

export const metadata: Metadata = {
  title: {
    default: "Rakibul Hasan — Senior Frontend Developer | React & Next.js Expert",
    template: "%s | Rakibul Hasan",
  },
  description:
    "Senior Frontend Developer with 5+ years of experience building scalable web applications with React, Next.js, and TypeScript. Shipped travel platforms serving 50K+ users and real-time delivery systems. Based in Dhaka, available globally.",
  keywords: [
    "Rakibul Hasan",
    "Rakibul Hasan portfolio",
    "Rakibul Hasan frontend developer",
    "Senior Frontend Developer",
    "Frontend Developer Bangladesh",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Web Developer Dhaka",
    "Frontend Engineer",
    "React Expert",
    "Portfolio",
    "Hire Frontend Developer",
    "TechnoNext",
    "FirstTrip Developer",
  ],
  authors: [{ name: "Rakibul Hasan", url: siteUrl }],
  creator: "Rakibul Hasan",
  publisher: "Rakibul Hasan",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rakibul Hasan — Senior Frontend Developer",
    description:
      "I craft interfaces that perform. 5+ years building scalable web applications with React, Next.js & TypeScript. Shipped products serving 50K+ users.",
    url: siteUrl,
    type: "website",
    siteName: "Rakibul Hasan — Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rakibul Hasan — Senior Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakibul Hasan — Senior Frontend Developer",
    description:
      "I craft interfaces that perform. 5+ years building scalable web apps with React, Next.js & TypeScript.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here:
    // google: "your-verification-code",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rakibul Hasan",
  jobTitle: "Senior Frontend Developer",
  description:
    "Senior Frontend Developer with 5+ years of experience in React, Next.js, TypeScript. Building scalable and accessible web applications.",
  url: siteUrl,
  image: `${siteUrl}/photo.jpg`,
  email: "rakib251193@gmail.com",
  telephone: "+8801777871569",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  sameAs: [
    "https://www.linkedin.com/in/rakibul-hasan-514649130/",
    "https://github.com/rakibulhasan",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Frontend Development",
    "Web Performance",
    "Responsive Design",
    "REST APIs",
    "Redux",
    "Tailwind CSS",
  ],
  worksFor: {
    "@type": "Organization",
    name: "TechnoNext Ltd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${jetbrains.variable} ${outfit.variable} antialiased`}
      >
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-accent focus:text-paper focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:tracking-[0.08em] focus:uppercase"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
