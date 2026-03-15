"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

export function Education() {
  const { t } = useLocale();

  return (
    <section
      id="education"
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
            {t("education.title")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">03</span>
        </motion.div>

        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
            {t("education.titleLine1")}{" "}
            <em className="not-italic text-accent">{t("education.titleLine2")}</em>
          </h2>
        </motion.div>

        {/* Education rows */}
        <ul>
          {profile.education.map((edu, i) => (
            <motion.li
              key={edu.institution}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="ruled-row py-8 sm:py-9 group"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <span className="font-display text-xl sm:text-2xl font-light text-fg group-hover:text-accent transition-colors duration-300">
                  {edu.institution}
                </span>
                <span className="font-sans text-[10px] text-fg-muted/60 tabular-nums shrink-0">
                  {edu.period}
                </span>
              </div>
              <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-accent/70">
                {t(edu.degreeKey)} · {t(edu.fieldKey)}
              </p>
            </motion.li>
          ))}
        </ul>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14"
        >
          <p className="font-sans text-[9px] tracking-[0.45em] uppercase text-fg-muted/50 mb-1">
            {t("education.certifications")}
          </p>
          <ul>
            {profile.certifications.map((cert) => (
              <li
                key={`${cert.issuerKey}-${cert.nameKey}`}
                className="ruled-row py-4 flex flex-wrap items-baseline justify-between gap-3"
              >
                <span className="font-sans text-xs sm:text-sm text-fg">{t(cert.nameKey)}</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-xs text-fg-muted">{t(cert.issuerKey)}</span>
                  <span className="font-sans text-[10px] text-fg-muted/50 tabular-nums">{cert.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
