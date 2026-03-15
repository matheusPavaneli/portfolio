"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

const PRINCIPLE_ICONS = [
  // Clean code — sparkle
  <svg key="clean" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
  </svg>,
  // Ship iteratively — rocket
  <svg key="rocket" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 2C8 2 11 4 11 8c0 2-1 3-1 3H6s-1-1-1-3c0-4 3-6 3-6Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <path d="M6 11 5 14h6l-1-3" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    <circle cx="8" cy="7" r="1" fill="currentColor" />
  </svg>,
  // Clear communication — speech bubble
  <svg key="speech" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2.5 2.5h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H5l-3 2.5V3a.5.5 0 0 1 .5-.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
  </svg>,
  // Own the outcome — aim
  <svg key="aim" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.25" />
    <circle cx="8" cy="8" r="0.75" fill="currentColor" />
  </svg>,
  // Leave it better — upward arrow loop
  <svg key="up" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M8 13V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 13h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.4" />
  </svg>,
  // Type everything — code
  <svg key="type" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M5 4 1.5 8 5 12M11 4l3.5 4-3.5 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 3l-3 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeOpacity="0.6" />
  </svg>,
];

export function Principles() {
  const { t } = useLocale();

  return (
    <section
      id="principles"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10"
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
            {t("principles.label")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">06</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
            {t("principles.titleLine1")}{" "}
            <em className="not-italic text-accent">{t("principles.titleLine2")}</em>
          </h2>
          <p className="mt-3 font-sans text-[9px] tracking-[0.3em] text-fg-muted/60 uppercase">
            {t("principles.subtitle")}
          </p>
        </motion.div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-fg-muted/12">
          {profile.principles.map((p, i) => (
            <motion.div
              key={p.titleKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-start gap-4 p-6 sm:p-7 bg-surface group hover:bg-surface-elevated transition-colors duration-300"
            >
              <div className="text-accent/50 group-hover:text-accent transition-colors duration-300 mt-0.5 shrink-0">
                {PRINCIPLE_ICONS[i]}
              </div>
              <div>
                <h3 className="font-sans text-[10px] tracking-[0.25em] uppercase text-fg group-hover:text-accent transition-colors duration-300 mb-1.5">
                  {t(p.titleKey)}
                </h3>
                <p className="font-sans text-[11px] text-fg-muted leading-[1.7]">
                  {t(p.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
