"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { SectionLabel } from "@/components/SectionLabel";

function HeadlineWithAccent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <span key={i} className="text-accent">
            {part.slice(2, -2)}
          </span>
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
      className="relative py-20 xs:py-24 sm:py-28 md:py-40 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 border-t border-fg-muted/10 overflow-hidden"
    >
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex items-baseline gap-0">
        <div className="w-[clamp(3.5rem,14vw,9rem)] shrink-0 pt-7">
          <SectionLabel number="01" />
        </div>
        <div className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-accent text-xs tracking-[0.2em] uppercase mb-2">
              {t("about.label")}
            </p>
            <h2 className="font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-fg mb-8 leading-[1.1] tracking-tight">
              <HeadlineWithAccent text={t("about.headline")} />
            </h2>
            <p className="text-base xs:text-lg md:text-xl text-fg-muted leading-relaxed max-w-2xl">
              {t("about.body")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
