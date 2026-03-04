"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { MagneticButton } from "@/components/effects/MagneticButton";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-center items-center px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 text-center overflow-hidden safe-x"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface-elevated transition-colors" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(5,150,105,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,255,136,0.08),transparent)] transition-opacity duration-500" />
      <ParticlesBackground />

      <motion.div
        className="relative z-10 w-full max-w-5xl 2xl:max-w-6xl flex flex-col items-center text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
        }}
      >
        {/* Linha verde alinhada logo acima do título Fullstack Developer */}
        <motion.div
          className="w-12 xs:w-16 h-px bg-accent hidden xs:block shrink-0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
        />
        <motion.p
          className="font-mono text-accent text-[11px] xs:text-xs sm:text-xs md:text-sm mb-4 sm:mb-6 tracking-[0.2em] xs:tracking-[0.3em] uppercase"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
        >
          {t("hero.title")}
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[2.5rem] xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold tracking-tightest text-fg leading-[0.95]"
            variants={{ hidden: { opacity: 0, y: "100%" }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.name.split(" ").map((word, i) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </motion.h1>
        </div>

        {/* Accent block under name */}
        <motion.div
          className="mx-auto mt-4 w-24 h-1 bg-accent"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ transformOrigin: "center" }}
        />

        <motion.p
          className="mt-6 sm:mt-8 text-sm xs:text-base md:text-lg text-fg-muted max-w-md mx-auto leading-relaxed px-1"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {t("hero.tagline")}
        </motion.p>

        <motion.div
          className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <MagneticButton
            href="#contact"
            className="group relative inline-flex items-center justify-center gap-2 min-h-[44px] px-5 xs:px-6 py-3 rounded-full bg-accent text-on-accent text-sm font-medium hover:bg-accent-dim transition-colors hover-shine"
          >
            <motion.span className="inline-flex items-center gap-2" whileTap={{ scale: 0.98 }}>
              {t("hero.getInTouch")}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </motion.span>
          </MagneticButton>
          <MagneticButton
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center px-4 xs:px-5 py-2.5 rounded-full border-2 border-fg-muted/30 text-fg text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            LinkedIn
          </MagneticButton>
          <MagneticButton
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center px-4 xs:px-5 py-2.5 rounded-full border-2 border-fg-muted/30 text-fg text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            GitHub
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 xs:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 text-fg-muted safe-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em]">{t("hero.scroll")}</span>
        <motion.div
          className="relative w-6 h-10 rounded-full border-2 border-current shrink-0"
          style={{ opacity: 0.8 }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="absolute left-1/2 top-2 -translate-x-1/2 w-0.5 h-1.5 rounded-full bg-current"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
