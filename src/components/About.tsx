"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { profile } from "@/data/profile";
import { SectionMarker } from "@/components/SectionMarker";

function HeadlineWithAccent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <em key={i} className="not-italic text-accent">
            {part.slice(2, -2)}
          </em>
        ) : (
          part
        )
      )}
    </>
  );
}

export function About() {
  const { t } = useLocale();

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-line overflow-hidden"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">

        <SectionMarker
          label={t("about.label")}
          index="01"
          className="mb-14 sm:mb-20"
        />

        {/* Pull-quote headline */}
        <motion.h2
          className="font-display text-[clamp(2.1rem,5.8vw,4.8rem)] font-light text-fg leading-[1.08] tracking-tight mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeadlineWithAccent text={t("about.headline")} />
        </motion.h2>

        {/* Body text with left rule */}
        <motion.div
          className="flex gap-7 sm:gap-10 items-start mb-12 sm:mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="hidden sm:block w-px self-stretch bg-accent/40 shrink-0" />
          <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[2] max-w-2xl">
            {t("about.body")}
          </p>
        </motion.div>

        {/* Trait chips */}
        <motion.div
          className="flex flex-wrap gap-2.5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          {profile.aboutTraitKeys.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 border border-line px-3.5 py-1.5 font-sans text-[10px] tracking-[0.25em] uppercase text-fg-muted hover:border-accent/40 hover:text-accent transition-colors duration-300"
            >
              <span className="text-accent/50 text-[8px]">◆</span>
              {t(key)}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
