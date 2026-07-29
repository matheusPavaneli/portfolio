"use client";

import { motion } from "framer-motion";
import { sideProjects } from "@/data/projects";
import { useLocale } from "@/context/LocaleContext";

export function ProjectList() {
  const { t } = useLocale();

  return (
    <div className="mt-14 sm:mt-16">
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <span className="font-sans text-[8px] tracking-[0.45em] uppercase text-fg-muted/40">
          {t("projects.moreLabel")}
        </span>
        <span className="flex-1 h-px bg-fg-muted/10" />
      </motion.div>

      <div>
        {sideProjects.map((project, i) => (
          <motion.a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="ruled-row group grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_auto] items-baseline gap-x-6 gap-y-2 py-5"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-sans text-[8px] tracking-[0.3em] text-fg-muted/25 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-display text-xl sm:text-2xl font-light text-fg group-hover:text-accent transition-colors duration-300">
                {project.name}
              </h4>
              {project.meta && (
                <span className="font-sans text-[7px] tracking-[0.35em] uppercase text-accent/45">
                  {project.meta}
                </span>
              )}
            </div>

            <p className="font-sans text-[10px] sm:text-[11px] text-fg-muted/70 leading-[1.8]">
              {t(project.descKey)}
            </p>

            <div className="flex items-center gap-3 justify-start sm:justify-end">
              <div className="hidden md:flex flex-wrap gap-1.5 justify-end">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="font-sans text-[7px] tracking-[0.28em] uppercase text-fg-muted/40 border border-fg-muted/12 px-2 py-[3px] group-hover:border-accent/25 group-hover:text-accent/60 transition-colors duration-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <span className="font-sans text-xs text-fg-muted/30 group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
