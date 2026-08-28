"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { featuredEntries, type FeaturedEntry } from "@/data/featured";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { FeaturedAnchorCard } from "@/components/FeaturedAnchorCard";
import { FeaturedSealCard } from "@/components/FeaturedSealCard";
import { FeaturedNanquimCard } from "@/components/FeaturedNanquimCard";
import { FeaturedPlate } from "@/components/FeaturedPlate";
import { FeaturedTechnologyArtCard } from "@/components/FeaturedTechnologyArtCard";
import { ProjectList } from "@/components/ProjectList";
import { SectionMarker } from "@/components/SectionMarker";

const CARDS: Record<FeaturedEntry["id"], ReactNode> = {
  nanquim: <FeaturedNanquimCard />,
  seal: <FeaturedSealCard />,
  anchor: <FeaturedAnchorCard />,
  art: <FeaturedTechnologyArtCard />,
};

export function Projects() {
  const { t } = useLocale();

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-line bg-surface-elevated/20 pattern-cross"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">

        <SectionMarker
          label={t("projects.title")}
          index="02"
          className="mb-10"
        />

        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
            {t("projects.titleLine1")}{" "}
            <em className="not-italic text-accent">{t("projects.titleLine2")}</em>
          </h2>
          <p className="mt-3 font-sans text-[9px] tracking-[0.3em] text-fg-muted/60 uppercase">
            {t("projects.subtitle")}
          </p>
        </motion.div>

                <motion.div
          className="flex items-center gap-4 mb-2"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="font-sans text-[8px] tracking-[0.45em] uppercase text-fg-muted/40">
            {t("projects.featuredSetLabel")}
          </span>
          <span className="flex-1 h-px bg-line" />
          <span className="font-sans text-[8px] tracking-[0.3em] text-fg-muted/30 tabular-nums">
            {featuredEntries.length.toString().padStart(2, "0")}
          </span>
        </motion.div>

        <div className="border-b border-line">
          {featuredEntries.map((entry, i) => (
            <FeaturedPlate key={entry.id} entry={entry} lead={i === 0} order={i}>
              {CARDS[entry.id]}
            </FeaturedPlate>
          ))}
        </div>

        <ProjectList />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.35em] uppercase text-fg-muted hover:text-accent transition-colors"
          >
            {t("projects.viewAll")}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

