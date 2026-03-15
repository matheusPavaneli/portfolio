"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

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
      className="relative py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 lg:px-20 border-t border-fg-muted/10 overflow-hidden"
    >
      <div className="max-w-5xl 2xl:max-w-6xl">

        {/* Section marker */}
        <motion.div
          className="flex items-center gap-4 mb-14 sm:mb-20"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-sans text-[9px] tracking-[0.4em] text-accent uppercase">
            {t("about.label")}
          </span>
          <span className="w-10 h-px bg-accent/35" />
          <span className="font-sans text-[9px] tracking-[0.3em] text-fg-muted/40">01</span>
        </motion.div>

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
          className="flex gap-7 sm:gap-10 items-start"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="hidden sm:block w-px self-stretch bg-accent/22 shrink-0" />
          <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[2] max-w-2xl">
            {t("about.body")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
