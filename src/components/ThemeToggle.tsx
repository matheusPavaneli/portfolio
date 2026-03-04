"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useLocale();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span className="w-9 h-9 rounded-full border border-fg-muted/30 inline-block" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-fg-muted hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors flex items-center justify-center overflow-hidden shrink-0"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? t("theme.light") : t("theme.dark")}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 0 : 180,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sun */}
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M18.75 12v2.25m-1.591 1.591-1.591-1.591"
          />
        </svg>
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? -180 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Moon */}
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </motion.span>
    </motion.button>
  );
}
