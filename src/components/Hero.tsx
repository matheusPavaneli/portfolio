"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { MagneticButton } from "@/components/effects/MagneticButton";

export function Hero() {
  const { t } = useLocale();
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const stats = [
    { value: `0${profile.experiences.length}`, label: t("hero.companies") },
    { value: profile.location.split(",")[0],    label: t("hero.basedIn") },
    { value: t(profile.languages[1].levelKey), label: t("hero.english") },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-between px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden safe-x"
    >
      {/* Dot grid backdrop */}
      <div className="absolute inset-0 pattern-dot opacity-60 pointer-events-none" aria-hidden />

      {/* Vertical architectural lines */}
      <div
        className="absolute top-0 right-[18%] w-px h-full bg-fg-muted/6 hidden lg:block pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 right-[36%] w-px h-[60%] bg-fg-muted/4 hidden xl:block pointer-events-none"
        aria-hidden
      />

      {/* Fade to surface at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-surface to-transparent pointer-events-none"
        aria-hidden
      />

      {/* ── Top bar ── */}
      <motion.div
        className="relative z-10 flex items-center justify-between pt-24 sm:pt-28 max-w-5xl"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <span className="font-sans text-[11px] tracking-[0.4em] text-fg-muted uppercase">
          {t("hero.title")}
        </span>
        <span className="font-sans text-[11px] tracking-[0.25em] text-fg-muted/50 tabular-nums">
          {new Date().getFullYear()}
        </span>
      </motion.div>

      {/* ── Main name block ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-10 sm:py-14 max-w-5xl">
        <div className="mb-6 sm:mb-8">
          {profile.name.split(" ").map((word, i) => (
            <div key={word} className="overflow-hidden">
              <h1
                className="font-display text-[clamp(3.8rem,11.5vw,10rem)] lg:text-[clamp(4.5rem,12vw,11.5rem)] font-light italic text-fg leading-[0.88] tracking-tight"
                style={
                  prefersReduced
                    ? undefined
                    : {
                        animation: `hero-reveal 0.70s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + i * 0.08}s both`,
                      }
                }
              >
                {word}
              </h1>
            </div>
          ))}
        </div>

        {/* Gold accent rule */}
        <motion.div
          className="w-14 h-px bg-accent mb-7 sm:mb-9"
          initial={prefersReduced ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />

        {/* Tagline + CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-7 sm:gap-16 lg:gap-24">
          <motion.p
            className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.85] max-w-[22rem]"
            initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            {t("hero.tagline")}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 sm:gap-5"
            initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <MagneticButton
              href="#contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-on-accent font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-accent-dim transition-colors hover-shine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span>{t("hero.getInTouch")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </MagneticButton>

            <MagneticButton
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-fg-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              LinkedIn <span className="text-[10px]">↗</span>
            </MagneticButton>

            <MagneticButton
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans text-[10px] tracking-[0.2em] uppercase text-fg-muted hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              GitHub <span className="text-[10px]">↗</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom stats bar ── */}
      <motion.div
        className="relative z-10 border-t border-fg-muted/12 py-5 sm:py-6 max-w-5xl"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.15 }}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 sm:gap-x-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-display text-lg sm:text-xl text-fg font-light">
                {stat.value}
              </span>
              <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-fg-muted/60">
                {stat.label}
              </span>
            </div>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase text-fg-muted/40">
              {t("hero.scroll")}
            </span>
            <motion.span
              className="text-accent text-xs leading-none"
              animate={prefersReduced ? {} : { y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
