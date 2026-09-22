import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { Rail } from "@/components/Rail";
import { Footer } from "@/components/Footer";
import { getMessages, HTML_LANG, isLocale, LOCALES, type Locale } from "@/i18n";
import { inlineJson, jsonLd } from "@/lib/machine";

const sans = Geist({
  variable: "--face-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--face-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN ?? "https://matheusPavaneli.github.io";

export function generateStaticParams(): { lang: Locale }[] {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getMessages(lang);

  return {
    metadataBase: new URL(ORIGIN),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `${BASE}/${lang}/`,
      languages: {
        en: `${BASE}/en/`,
        "pt-BR": `${BASE}/pt/`,
        "x-default": `${BASE}/en/`,
      },
      types: {
        "text/markdown": `${BASE}/${lang}/index.md`,
        "application/json": `${BASE}/resume.json`,
      },
    },
    openGraph: {
      type: "profile",
      locale: lang === "pt" ? "pt_BR" : "en_US",
      title: t.meta.title,
      description: t.meta.description,
      url: `${ORIGIN}${BASE}/${lang}/`,
      images: [{ url: `${BASE}/og-${lang}.png`, width: 1200, height: 630, alt: t.meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [`${BASE}/og-${lang}.png`],
    },
    icons: { icon: `${BASE}/favicon.svg` },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

const THEME_SCRIPT = `(function(){try{var k="case-file-theme";var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t;}catch(_){}})();`;

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getMessages(lang);

  return (
    <html
      lang={HTML_LANG[lang]}
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: inlineJson(jsonLd(lang)) }}
        />
      </head>
      <body className="bg-bg text-text antialiased">
        <a
          href="#file"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-sm focus:bg-accent-fill focus:px-4 focus:text-on-accent"
        >
          {t.a11y.skipToContent}
        </a>
        <Rail locale={lang} t={t} />
        <main id="file">{children}</main>
        <Footer locale={lang} t={t} />
      </body>
    </html>
  );
}
