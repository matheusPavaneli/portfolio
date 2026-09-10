export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

/** The `lang` attribute each locale sets on `<html>`. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  pt: "pt-BR",
};

/** What the switcher calls each locale, in that locale. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "pt" : "en";
}
