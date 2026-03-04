"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { SectionLabel } from "@/components/SectionLabel";

const categoryKeys: { key: keyof typeof profile.skills; msgKey: string }[] = [
  { key: "frontend", msgKey: "skills.frontend" },
  { key: "backend", msgKey: "skills.backend" },
  { key: "databases", msgKey: "skills.databases" },
  { key: "devops", msgKey: "skills.devops" },
  { key: "messaging", msgKey: "skills.messaging" },
  { key: "soft", msgKey: "skills.soft" },
];

export function Skills() {
  const { t } = useLocale();

  return (
    <section
      id="skills"
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 bg-surface-elevated/30 border-t border-fg-muted/10"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
        <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0">
          <SectionLabel number="04" />
        </div>
        <div className="min-w-0 flex-1">
          <motion.h2
            className="font-display text-2xl xs:text-3xl md:text-4xl font-bold text-fg mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("skills.titleLine1")}{" "}
            <span className="text-accent">{t("skills.titleLine2")}</span>
          </motion.h2>
          <p className="text-fg-muted font-mono text-sm mb-12 max-w-xl">
            {t("skills.subtitle")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryKeys.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                className="group p-6 rounded-2xl bg-surface border border-fg-muted/10 hover:border-accent/25 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] transition-all duration-300"
              >
                <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">
                  {t(cat.msgKey)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills[cat.key].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-lg bg-fg-muted/10 text-fg border border-transparent group-hover:border-fg-muted/20 transition-all duration-300 group-hover:scale-[1.02]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-fg-muted/10"
          >
            <h3 className="font-mono text-xs text-accent uppercase tracking-wider mb-4">
              {t("skills.languages")}
            </h3>
            <div className="flex flex-wrap gap-4 text-fg-muted">
              {profile.languages.map((lang) => (
                <span key={lang.name}>
                  {lang.name} <span className="text-fg-muted/70">—</span> {lang.level}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
