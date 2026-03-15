"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

const STEP_ICONS = [
  // Scope — target circle
  <svg key="scope" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
  </svg>,
  // Estimates — clock
  <svg key="clock" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1" />
    <path d="M9 5v4.5l3 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>,
  // Async — speech
  <svg key="msg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M2.5 3.5h13a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H5.5L2 15.5V4a.5.5 0 0 1 .5-.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
  </svg>,
  // Stack — code brackets
  <svg key="code" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M6 5 2 9l4 4M12 5l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Remote — globe
  <svg key="globe" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1" />
    <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5M9 1.5C9 1.5 12 5 12 9s-3 7.5-3 7.5M1.5 9h15" stroke="currentColor" strokeWidth="1" />
  </svg>,
];

export function Freelancer() {
  const { t } = useLocale();

  return (
    <section
      id="freelance"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10 bg-surface-elevated/25"
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
            {t("freelance.label")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">05</span>
        </motion.div>

        {/* Heading + availability */}
        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
              {t("freelance.titleLine1")}{" "}
              <em className="not-italic text-accent">{t("freelance.titleLine2")}</em>
            </h2>
            {profile.freelance.available && (
              <span className="inline-flex items-center gap-1.5 border border-accent/30 px-2.5 py-1 font-sans text-[8px] tracking-[0.35em] uppercase text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {t("freelance.available")}
              </span>
            )}
          </div>
          <p className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/60 uppercase">
            {t("freelance.subtitle")}
          </p>
        </motion.div>

        {/* How-I-work cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-fg-muted/12 mb-12">
          {profile.freelance.highlightKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="p-6 bg-surface group hover:bg-surface-elevated transition-colors duration-300"
            >
              <div className="text-accent/60 group-hover:text-accent transition-colors duration-300 mb-4">
                {STEP_ICONS[i]}
              </div>
              <p className="font-sans text-xs text-fg-muted group-hover:text-fg transition-colors duration-300 leading-[1.75]">
                {t(key)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.35em] uppercase text-fg-muted hover:text-accent transition-colors"
          >
            {t("freelance.cta")}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
