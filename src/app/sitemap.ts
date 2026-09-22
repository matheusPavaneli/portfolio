import type { MetadataRoute } from "next";

import { LOCALES } from "@/i18n";
import { absolute } from "@/lib/href";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((lang) => ({
    url: absolute(`/${lang}/`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: lang === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: absolute("/en/"),
        "pt-BR": absolute("/pt/"),
      },
    },
  }));
}
