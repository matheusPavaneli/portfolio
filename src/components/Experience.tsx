"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { SectionLabel } from "@/components/SectionLabel";

function RoleWithHighlight({ role }: { role: string }) {
  if (!role.includes("→")) return <>{role}</>;
  const [before, after] = role.split("→");
  return (
    <>
      {before}
      <span className="text-accent font-semibold px-0.5">→</span>
      {after}
    </>
  );
}

export function Experience() {
  const { t } = useLocale();

  const PromotedBadge = () => (
    <span className="inline-flex items-center gap-1.5 text-xs text-accent font-mono mt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden />
      {t("experience.promoted")}
    </span>
  );

  return (
    <section
      id="experience"
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 bg-surface-elevated/40 border-t border-fg-muted/10 pattern-grid-opacity"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
        <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0">
          <SectionLabel number="02" />
        </div>
        <div className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl xs:text-3xl md:text-4xl font-bold text-fg mb-2">
              {t("experience.titleLine1")}{" "}
              <span className="text-accent">{t("experience.titleLine2")}</span>
            </h2>
            <p className="text-fg-muted font-mono text-sm">{t("experience.subtitle")}</p>
          </motion.div>

          <div className="relative">
            {/* Thick accent line - full height of timeline */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent/30 rounded-full" />
            <ul className="space-y-16">
              {profile.experiences.map((exp, i) => (
                <motion.li
                  key={exp.company}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative pl-10 md:pl-12 group"
                >
                  <span
                    className={`absolute left-0 top-1 w-3 h-3 rounded-full bg-accent border-2 border-surface -translate-x-[5px] ${
                      exp.role.includes("→") ? "ring-4 ring-accent/25" : ""
                    }`}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="font-display text-xl md:text-2xl font-semibold text-fg group-hover:text-accent transition-colors">
                      {exp.company}
                    </span>
                    {exp.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-mono">
                        {exp.type}
                      </span>
                    )}
                  </div>
                  <p className="text-accent font-mono text-sm mb-1">
                    <RoleWithHighlight role={exp.role} />
                  </p>
                  {exp.role.includes("→") && <PromotedBadge />}
                  <p className="text-fg-muted text-sm mt-1">{exp.period}</p>
                  {"location" in exp && exp.location && (
                    <p className="text-fg-muted/80 text-xs mt-0.5 mb-4">{exp.location}</p>
                  )}
                  {(!("location" in exp) || !exp.location) && <div className="mb-4" />}
                  <ul className="space-y-2 text-fg-muted text-sm md:text-base leading-relaxed">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="text-accent mt-1.5 shrink-0">—</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
