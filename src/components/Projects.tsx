"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { FeaturedAnchorCard } from "@/components/FeaturedAnchorCard";
import { FeaturedSealCard } from "@/components/FeaturedSealCard";
import { ProjectList } from "@/components/ProjectList";

export function Projects() {
  const { t } = useLocale();

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10 bg-surface-elevated/20 pattern-cross"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">

        {/* Section marker */}
        <motion.div
          className="flex items-center gap-4 mb-10"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-sans text-[9px] tracking-[0.4em] text-accent uppercase">
            {t("projects.title")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">07</span>
        </motion.div>

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

        {/* Featured rail */}
        <FeaturedMarker index="01" label={t("projects.featuredLabel")} />
        <FeaturedSealCard />

        <div className="mt-14 sm:mt-16">
          <FeaturedMarker index="02" label={t("projects.featuredLabel")} />
          <FeaturedAnchorCard />
        </div>

        {/* Remaining repositories */}
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

function FeaturedMarker({ index, label }: { index: string; label: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 mb-4"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <span className="font-sans text-[8px] tracking-[0.3em] text-accent/50 tabular-nums">
        {index}
      </span>
      <span className="w-6 h-px bg-accent/25" />
      <span className="font-sans text-[8px] tracking-[0.45em] uppercase text-fg-muted/40">
        {label}
      </span>
    </motion.div>
  );
}
