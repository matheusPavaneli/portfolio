"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { FeaturedEntry } from "@/data/featured";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  entry: FeaturedEntry;
  children: ReactNode;
  /** The lead plate is always open: it carries the section's rank. */
  lead?: boolean;
  order?: number;
};

export function FeaturedPlate({ entry, children, lead = false, order = 0 }: Props) {
  const { t } = useLocale();

  const row = <PlateRow entry={entry} lead={lead} />;

  if (lead) {
    return (
      <motion.section
        aria-labelledby={`featured-${entry.id}`}
        className="border-t border-line"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        {row}
        <div className="pb-8 sm:pb-10">{children}</div>
      </motion.section>
    );
  }

  return (
    <motion.details
      className="border-t border-line group/plate"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: order * 0.06 }}
    >
      <summary
        className="list-none cursor-pointer select-none outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-1 focus-visible:ring-accent/50"
        aria-label={`${entry.name} — ${t(entry.kickerKey)}`}
      >
        {row}
      </summary>
      <div className="pb-8 sm:pb-10">{children}</div>
    </motion.details>
  );
}

function PlateRow({ entry, lead }: { entry: FeaturedEntry; lead: boolean }) {
  const { t } = useLocale();

  return (
    <div className="grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 sm:py-7 min-h-[44px]">
      <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.28em] text-accent/45 tabular-nums self-baseline">
        {entry.ordinal}
      </span>

      <div className="min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3
            id={`featured-${entry.id}`}
            className={`font-display font-light text-fg tracking-tight leading-[1.05] transition-colors duration-300 ${
              lead
                ? "text-[clamp(1.9rem,3.6vw,2.9rem)]"
                : "text-[clamp(1.5rem,2.6vw,2.1rem)] group-open/plate:text-accent group-hover/plate:text-accent"
            }`}
          >
            {entry.name}
          </h3>
          <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.45em] uppercase text-accent/60">
            {t(entry.statusKey)}
          </span>
          <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.35em] uppercase text-fg-muted/30 pl-2.5 border-l border-line">
            {entry.meta}
          </span>
        </div>

        <p className="mt-2 font-sans text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-fg-muted/55 leading-relaxed max-w-[62ch]">
          {t(entry.kickerKey)}
        </p>
      </div>

      <div className="flex items-center gap-4 justify-self-end">
        <div className="hidden md:flex flex-wrap gap-1.5 justify-end">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-[7px] tracking-[0.28em] uppercase text-fg-muted/40 border border-line px-2 py-[3px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {lead ? (
          <span className="font-sans text-[7px] tracking-[0.4em] uppercase text-accent/45 whitespace-nowrap">
            {t("projects.leadLabel")}
          </span>
        ) : (
          <span className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline font-sans text-[7px] tracking-[0.35em] uppercase text-fg-muted/35 group-open/plate:hidden">
              {t("projects.openLabel")}
            </span>
            <span className="hidden font-sans text-[7px] tracking-[0.35em] uppercase text-fg-muted/35 group-open/plate:sm:inline">
              {t("projects.closeLabel")}
            </span>
            <span
              aria-hidden
              className="font-sans text-[10px] text-fg-muted/40 transition-transform duration-300 group-open/plate:rotate-180 group-open/plate:text-accent motion-reduce:transition-none"
            >
              ↓
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
