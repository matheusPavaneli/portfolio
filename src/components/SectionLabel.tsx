"use client";

import { motion } from "framer-motion";

type Props = { number: string; className?: string };

export function SectionLabel({ number, className = "" }: Props) {
  return (
    <motion.span
      className={`font-mono text-[clamp(2.5rem,12vw,8rem)] font-bold leading-none text-fg-muted/15 select-none pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      aria-hidden
    >
      {number}
    </motion.span>
  );
}
