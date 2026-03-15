"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { TiltCard } from "@/components/effects/TiltCard";
import { ShineBorder } from "@/components/effects/ShineBorder";

export function Projects() {
  const { t } = useLocale();
  const projects = profile.projects;

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

        {/* Grid — gap-px for sharp column lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-fg-muted/12">
          {projects.map((project, i) => {
            const cardContent = (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group block p-8 sm:p-10 bg-surface h-full ${
                  i === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex flex-col h-full min-h-[160px]">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <h3 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-light text-fg group-hover:text-accent transition-colors duration-300 tracking-tight leading-[1.1]">
                      {project.name}
                    </h3>
                    <span className="shrink-0 font-sans text-sm text-fg-muted/35 group-hover:text-accent transition-colors mt-0.5">
                      ↗
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.9] mb-7 flex-1">
                    {t(project.descriptionKey)}
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/75"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            );

            return (
              <TiltCard
                key={project.name}
                className={`overflow-hidden bg-surface ${i === 0 ? "md:col-span-2" : ""}`}
                intensity={i === 0 ? 0.4 : 0.7}
              >
                {i === 0 ? (
                  <ShineBorder className="h-full block">{cardContent}</ShineBorder>
                ) : (
                  cardContent
                )}
              </TiltCard>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8"
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
