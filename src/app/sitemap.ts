import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN ?? "https://matheusPavaneli.github.io";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((lang) => ({
    url: `${ORIGIN}${BASE}/${lang}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: lang === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: `${ORIGIN}${BASE}/en/`,
        "pt-BR": `${ORIGIN}${BASE}/pt/`,
      },
    },
  }));
}
