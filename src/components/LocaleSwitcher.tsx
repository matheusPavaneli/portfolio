"use client";

import { useLocale } from "@/context/LocaleContext";
import { motion } from "framer-motion";

const locales = [
  { value: "en" as const, labelKey: "locale.en" },
  { value: "pt-Br" as const, labelKey: "locale.pt" },
] as const;

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="relative flex items-center rounded-full p-1 bg-fg-muted/10 border border-fg-muted/10"
      role="group"
      aria-label={t("a11y.selectLanguage")}
    >
      {/* Sliding pill behind active */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-accent shadow-sm"
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          width: "calc(50% - 4px)",
          left: locale === "en" ? 4 : "calc(50% + 2px)",
        }}
      />
      {locales.map(({ value, labelKey }) => (
        <motion.button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className="relative z-10 min-w-[2.25rem] min-h-[44px] px-3 py-2.5 text-xs font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface flex items-center justify-center"
          whileHover={locale !== value ? { opacity: 0.9 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          {locale === value ? (
            <span className="relative z-10 text-on-accent font-semibold">
              {t(labelKey)}
            </span>
          ) : (
            <span className="text-fg-muted hover:text-fg">{t(labelKey)}</span>
          )}
        </motion.button>
      ))}
    </div>
  );
}
