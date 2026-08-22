"use client";

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
