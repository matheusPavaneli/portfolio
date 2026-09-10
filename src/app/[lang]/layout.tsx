import type { Metadata } from "next";
import { Anybody, Familjen_Grotesk, Martian_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getMessages, HTML_LANG, isLocale, LOCALES, type Locale } from "@/i18n";
import { profile } from "@/content/profile";

/**
 * The panel face. A real width axis is the point: silkscreened legends on a bezel are
 * condensed because that is what fits, and the module headings are the same face opened up.
 * One family, two registers, one download.
 */
const display = Anybody({
  variable: "--face-display",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

/** Chosen for reading, not for character — the rule for a body face. */
const body = Familjen_Grotesk({
  variable: "--face-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/** The readout. Wide, even, tabular: a value on an instrument, not code in a terminal. */
const readout = Martian_Mono({
  variable: "--face-readout",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
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

/**
 * Runs before first paint, so the theme is never wrong for a frame. This is the whole reason
 * `next-themes` is not installed: the provider it needs at the root of the tree is what turned
 * 31 of 39 files in the outgoing build into client components.
 */
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
      className={`${display.variable} ${body.variable} ${readout.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: t.masthead.role,
              email: `mailto:${profile.email}`,
              url: `${ORIGIN}${BASE}/${lang}/`,
              sameAs: [profile.github, profile.linkedin],
              address: { "@type": "PostalAddress", addressLocality: "Maringá", addressCountry: "BR" },
            }),
          }}
        />
      </head>
      <body className="bg-page text-ink antialiased">
        <a
          href="#file"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-recess focus:bg-signal focus:px-4 focus:text-on-signal legend"
        >
          {t.a11y.skipToContent}
        </a>
        <Header locale={lang} t={t} />
        <main id="file">{children}</main>
        <Footer t={t} />
      </body>
    </html>
  );
}
