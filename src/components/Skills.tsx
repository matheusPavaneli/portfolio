"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

const categoryKeys: { key: Exclude<keyof typeof profile.skills, "softKeys"> | "soft"; msgKey: string }[] = [
  { key: "frontend",  msgKey: "skills.frontend"  },
  { key: "backend",   msgKey: "skills.backend"   },
  { key: "databases", msgKey: "skills.databases" },
  { key: "devops",    msgKey: "skills.devops"    },
  { key: "messaging", msgKey: "skills.messaging" },
  { key: "soft",      msgKey: "skills.soft"      },
];

export function Skills() {
  const { t } = useLocale();

  return (
    <section
      id="skills"
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
            {t("skills.title")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">04</span>
        </motion.div>

        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
            {t("skills.titleLine1")}{" "}
            <em className="not-italic text-accent">{t("skills.titleLine2")}</em>
          </h2>
          <p className="mt-3 font-sans text-[9px] tracking-[0.3em] text-fg-muted/60 uppercase">
            {t("skills.subtitle")}
          </p>
        </motion.div>

        {/* Newspaper column grid — gap-px bg trick for clean column lines */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-fg-muted/12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {categoryKeys.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="p-5 sm:p-6 bg-surface group"
            >
              <h3 className="font-sans text-[8px] tracking-[0.4em] uppercase text-accent mb-5">
                {t(cat.msgKey)}
              </h3>
              <ul className="space-y-2.5">
                {(cat.key === "soft" ? profile.skills.softKeys : profile.skills[cat.key]).map((skill) => (
                  <li
                    key={typeof skill === "string" ? skill : skill}
                    className="font-sans text-[11px] text-fg-muted group-hover:text-fg transition-colors duration-300 leading-relaxed"
                  >
                    {cat.key === "soft" ? t(skill) : skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Languages row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-2"
        >
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-fg-muted/50">
            {t("skills.languages")}
          </span>
          {profile.languages.map((lang) => (
            <span key={lang.nameKey} className="font-sans text-xs text-fg-muted">
              {t(lang.nameKey)}{" "}
              <span className="text-fg-muted/40">·</span>{" "}
              {t(lang.levelKey)}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
