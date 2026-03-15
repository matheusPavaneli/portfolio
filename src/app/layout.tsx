import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MouseGlow } from "@/components/MouseGlow";
import { ScrollProgress } from "@/components/ScrollProgress";
import { LangSync } from "@/components/LangSync";
import { SkipLink } from "@/components/SkipLink";
import { LocaleTransition } from "@/components/LocaleTransition";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_PATH
      ? `https://matheusPavaneli.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
      : "http://localhost:3000"
  ),
  title: "Matheus Pavaneli — Fullstack Developer",
  description:
    "Software Engineer. Clean architecture, clear scope, systems built to last.",
  openGraph: {
    title: "Matheus Pavaneli — Fullstack Developer",
    description: "Software Engineer. Clean architecture, honest tradeoffs, durable systems.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matheus Pavaneli — Fullstack Developer",
    description: "Software Engineer. Clean architecture, honest tradeoffs, durable systems.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen">
        <Providers>
          <LangSync />
          <SkipLink />
          <ScrollProgress />
          <MouseGlow />
          <div className="relative z-10">
            <Header />
            <main id="main-content">
              <LocaleTransition>{children}</LocaleTransition>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
