"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { SectionLabel } from "@/components/SectionLabel";

export function Education() {
  const { t } = useLocale();

  return (
    <section
      id="education"
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 border-t border-fg-muted/10"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
        <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0">
          <SectionLabel number="03" />
        </div>
        <div className="min-w-0 flex-1">
          <motion.h2
            className="font-display text-2xl xs:text-3xl md:text-4xl font-bold text-fg mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("education.titleLine1")}{" "}
            <span className="text-accent">{t("education.titleLine2")}</span>
          </motion.h2>
          <p className="text-fg-muted font-mono text-sm mb-12">{t("education.subtitle")}</p>
          <div className="space-y-10">
            {profile.education.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-l-2 border-accent/40 pl-6 relative"
              >
                <span className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-accent" />
                <p className="font-display text-lg font-semibold text-fg">
                  {edu.institution}
                </p>
                <p className="text-accent font-mono text-sm mt-1">
                  {edu.degree} · {edu.field}
                </p>
                <p className="text-fg-muted text-sm mt-1">{edu.period}</p>
              </motion.div>
            ))}
            <div className="pt-6">
              <h3 className="font-mono text-xs text-fg-muted uppercase tracking-widest mb-4">
                {t("education.certifications")}
              </h3>
              <ul className="space-y-3">
                {profile.certifications.map((cert, i) => (
                  <motion.li
                    key={`${cert.issuer}-${cert.name}`}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex flex-wrap items-baseline gap-2 text-sm"
                  >
                    <span className="text-fg font-medium">{cert.name}</span>
                    <span className="text-fg-muted">· {cert.issuer}</span>
                    <span className="text-fg-muted/80 text-xs">{cert.date}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
