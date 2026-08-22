"use client";

import { motion } from "framer-motion";

type Props = {
  label: string;
  index: string;
  className?: string;
};

export function SectionMarker({ label, index, className = "mb-10" }: Props) {
  return (
    <motion.div
      className={`flex items-center gap-4 ${className}`}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-sans text-[9px] tracking-[0.4em] text-accent uppercase">
        {label}
      </span>
      <span className="w-10 h-px bg-accent/35" aria-hidden />
      <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40 tabular-nums">
        {index}
      </span>
    </motion.div>
  );
}
