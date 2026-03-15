"use client";

import { useLocale } from "@/context/LocaleContext";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-on-accent focus:font-sans focus:text-xs focus:tracking-[0.2em] focus:uppercase focus:outline-none"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
