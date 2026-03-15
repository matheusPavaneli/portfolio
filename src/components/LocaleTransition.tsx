"use client";

// Locale transition strategy: fade out (150ms) → swap locale → fade in (200ms).
// Opacity is driven by `isTransitioning` from LocaleContext.
// prefers-reduced-motion is handled globally in globals.css (transition-duration: 0.01ms).
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import type { ReactNode } from "react";

export function LocaleTransition({ children }: { children: ReactNode }) {
  const { isTransitioning } = useLocale();

  return (
    <motion.div
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
