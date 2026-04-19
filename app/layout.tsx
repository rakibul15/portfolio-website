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

export const metadata: Metadata = {
  title: "Rakibul Hasan — Senior Frontend Developer",
  description:
    "Senior Frontend Developer with 5+ years of experience in React, Next.js, TypeScript, and modern web technologies. Building scalable and accessible web applications.",
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Rakibul Hasan",
    "Senior Frontend Engineer",
    "Portfolio",
  ],
  authors: [{ name: "Rakibul Hasan" }],
  creator: "Rakibul Hasan",
  metadataBase: new URL("https://rakibulhasan.dev"),
  openGraph: {
    title: "Rakibul Hasan — Senior Frontend Developer",
    description:
      "I craft interfaces that perform. 5+ years building scalable web applications with React, Next.js & TypeScript.",
    type: "website",
    siteName: "Rakibul Hasan Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakibul Hasan — Senior Frontend Developer",
    description:
      "I craft interfaces that perform. 5+ years building scalable web applications with React, Next.js & TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
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
