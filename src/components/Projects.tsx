"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { SectionLabel } from "@/components/SectionLabel";
import { TiltCard } from "@/components/effects/TiltCard";
import { ShineBorder } from "@/components/effects/ShineBorder";

export function Projects() {
  const { t } = useLocale();
  const projects = profile.projects;

  return (
    <section
      id="projects"
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 bg-surface-elevated/40 border-t border-fg-muted/10 pattern-grid-opacity"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
        <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0">
          <SectionLabel number="05" />
        </div>
        <div className="min-w-0 flex-1">
          <motion.h2
            className="font-display text-2xl xs:text-3xl md:text-4xl font-bold text-fg mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("projects.titleLine1")}{" "}
            <span className="text-accent">{t("projects.titleLine2")}</span>
          </motion.h2>
          <p className="text-fg-muted font-mono text-sm mb-12 max-w-xl">
            {t("projects.subtitle")}
          </p>

          {/* Bento grid: first project large, rest in grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 overflow-hidden">
            {projects.map((project, i) => {
              const cardContent = (
                <motion.a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                  className={`group block p-6 md:p-8 rounded-2xl bg-surface border border-fg-muted/15 hover:border-accent/35 transition-all duration-300 h-full ${
                    i === 0 ? "md:col-span-2 md:row-span-1" : ""
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-fg group-hover:text-accent transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-fg-muted mt-2 mb-4 flex-1 text-sm md:text-base">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded-lg bg-accent/10 text-accent font-mono transition-transform duration-300 group-hover:scale-105"
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
                  className={`overflow-hidden rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}`}
                  intensity={i === 0 ? 0.7 : 1}
                >
                  {i === 0 ? (
                    <ShineBorder className="h-full block overflow-hidden rounded-2xl">
                      {cardContent}
                    </ShineBorder>
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
            className="mt-10 text-center"
          >
            <motion.a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-sm text-accent hover:underline"
              whileHover={{ gap: "0.5rem" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {t("projects.viewAll")}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
