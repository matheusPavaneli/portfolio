"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { SectionMarker } from "@/components/SectionMarker";

const categoryKeys: { key: Exclude<keyof typeof profile.skills, "softKeys"> | "soft"; msgKey: string }[] = [
  { key: "languages",    msgKey: "skills.languages"    },
  { key: "ai",           msgKey: "skills.ai"           },
  { key: "data",         msgKey: "skills.data"         },
  { key: "cloud",        msgKey: "skills.cloud"        },
  { key: "architecture", msgKey: "skills.architecture" },
  { key: "soft",         msgKey: "skills.soft"         },
];

export function Skills() {
  const { t } = useLocale();

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-line"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">

        <SectionMarker
          label={t("skills.title")}
          index="04"
          className="mb-10"
        />

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

                <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line"
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

                <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-2"
        >
          <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-fg-muted/50">
            {t("skills.languagesLabel")}
          </span>
          {profile.languages.map((lang) => (
            <span key={lang.nameKey} className="font-sans text-xs text-fg-muted">
              {t(lang.nameKey)}{" "}
              <span className="text-fg-muted/40">·</span>{" "}
              {t(lang.levelKey)}
            </span>
          ))}
          <span className="font-sans text-[11px] text-fg-muted/60 leading-relaxed basis-full sm:basis-auto sm:max-w-xl">
            {t("skills.englishNote")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
