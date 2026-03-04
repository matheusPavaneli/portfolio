import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MouseGlow } from "@/components/MouseGlow";
import { FloatingOrbs } from "@/components/FloatingOrbs";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matheus Pavaneli — Fullstack Developer",
  description:
    "Software Engineer. Fullstack developer specializing in React, Next.js, Node.js, and scalable architecture.",
  openGraph: {
    title: "Matheus Pavaneli — Fullstack Developer",
    description: "Software Engineer. Building scalable systems and clean code.",
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
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans min-h-screen">
        <Providers>
          <MouseGlow />
          <FloatingOrbs />
          <div className="relative z-10">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
