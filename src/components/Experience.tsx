"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

function RoleWithHighlight({ role }: { role: string }) {
  if (!role.includes("→")) return <>{role}</>;
  const [before, after] = role.split("→");
  return (
    <>
      {before}
      <span className="text-accent">→</span>
      {after}
    </>
  );
}

export function Experience() {
  const { t } = useLocale();

  return (
    <section
      id="experience"
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
            {t("experience.title")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">02</span>
        </motion.div>

        <motion.div
          className="mb-14 sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light text-fg leading-[1.05]">
            {t("experience.titleLine1")}{" "}
            <em className="not-italic text-accent">{t("experience.titleLine2")}</em>
          </h2>
          <p className="mt-3 font-sans text-[9px] tracking-[0.3em] text-fg-muted/60 uppercase">
            {t("experience.subtitle")}
          </p>
        </motion.div>

        {/* Ruled rows */}
        <ul>
          {profile.experiences.map((exp, i) => (
            <motion.li
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="ruled-row py-9 sm:py-11 group"
            >
              {/* Company + period */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <span className="font-display text-[clamp(1.5rem,3.5vw,2.6rem)] font-light text-fg group-hover:text-accent transition-colors duration-300 tracking-tight">
                  {exp.company}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  {"typeKey" in exp && exp.typeKey && (
                    <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-accent border border-accent/25 px-2 py-0.5">
                      {t(exp.typeKey)}
                    </span>
                  )}
                  <span className="font-sans text-[10px] text-fg-muted/60 tabular-nums">
                    {exp.period.replace("Present", t("profile.periodPresent"))}
                  </span>
                </div>
              </div>

              {/* Role + location */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-fg-muted">
                  <RoleWithHighlight role={t(exp.roleKey)} />
                </p>
                {t(exp.roleKey).includes("→") && (
                  <span className="font-sans text-[8px] tracking-[0.25em] uppercase text-accent/70">
                    ↑ {t("experience.promoted")}
                  </span>
                )}
                {"locationKey" in exp && exp.locationKey && (
                  <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-fg-muted/40">
                    {t(exp.locationKey)}
                  </span>
                )}
              </div>

              {/* Highlights */}
              <ul className="space-y-2.5">
                {exp.highlightKeys.map((key) => (
                  <li key={key} className="flex gap-3 items-start">
                    <span className="text-accent/50 mt-[0.4rem] shrink-0 text-[9px]">◆</span>
                    <span className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.85]">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
