"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/effects/TiltCard";
import { useLocale } from "@/context/LocaleContext";

const LINKS = {
  site: "https://matheuspavaneli.github.io/art/",
  repo: "https://github.com/matheusPavaneli/art",
} as const;

const ERAS = [
  { ordinal: "01", label: "Lomekwi", date: "~3.3 Ma", accent: "#FF3D00", gap: 0 },
  { ordinal: "02", label: "Fire", date: "~400 ka", accent: "#FFAE00", gap: 2_900_000 },
  { ordinal: "03", label: "Grain", date: "~10 ka", accent: "#C6FF1F", gap: 390_000 },
  { ordinal: "04", label: "Cuneiform", date: "~3200 BCE", accent: "#00F0A8", gap: 4_800 },
  { ordinal: "05", label: "Press", date: "1450", accent: "#00D9FF", gap: 4_650 },
  { ordinal: "06", label: "Steam", date: "1769", accent: "#2F6BFF", gap: 319 },
  { ordinal: "07", label: "Transistor", date: "1947", accent: "#9B4DFF", gap: 178 },
  { ordinal: "08", label: "Inference", date: "2012", accent: "#FF2D8F", gap: 65 },
] as const;

const MIN_VH = 62;
const MAX_VH = 190;
const CHAPTER_VH = 300;
const SHORTEST_GAP = 65;
const LONGEST_GAP = 2_900_000;

function thresholdVh(years: number): number {
  if (years <= SHORTEST_GAP) return MIN_VH;
  const low = Math.log10(SHORTEST_GAP);
  const high = Math.log10(LONGEST_GAP);
  const t = Math.min((Math.log10(years) - low) / (high - low), 1);
  return MIN_VH + (MAX_VH - MIN_VH) * t;
}

function railPositions(): number[] {
  const offsets: number[] = [];
  let cursor = 0;
  for (const era of ERAS) {
    cursor += era.gap ? thresholdVh(era.gap) : 0;
    offsets.push(cursor + CHAPTER_VH / 2);
    cursor += CHAPTER_VH;
  }
  return offsets.map((offset) => offset / cursor);
}

const POSITIONS = railPositions();

const METRICS = [
  { value: "100", label: "desktop" },
  { value: "99", label: "mobile" },
  { value: "79", label: "ms TBT" },
  { value: "0", label: "CLS" },
] as const;

const PRACTICES = [
  "One conserved point cloud — eight forms, only ever reassembled",
  "Deep time is scroll distance: log-scaled intervals set page height",
  "Colour is position — one accent interpolated across eight eras",
  "three.js and GSAP load on the reader's first move, not on load",
  "Lines are split for the reveal only within a screen of the viewport",
  "Canvas tiered by device — no blur passes, fewer points, on a phone",
  "Reduced motion drops the animation, never the colour or the content",
  "52 invariant tests on node:test — a gate with no test dependency",
] as const;

const STACK_GROUPS = [
  { label: "Web", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"] },
  { label: "3D", items: ["three.js", "React Three Fiber", "GLSL", "postprocessing"] },
  { label: "Mot", items: ["GSAP", "ScrollTrigger", "SplitText", "Lenis"] },
  { label: "Ops", items: ["node:test", "GitHub Actions", "Static export"] },
] as const;

export function FeaturedTechnologyArtCard() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const railRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(0);
  const walk = useMotionValue(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => setRailWidth(rail.getBoundingClientRect().width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || reduceMotion || railWidth === 0) return;
    const controls = animate(walk, 1, {
      duration: 6.5,
      ease: "linear",
      delay: 1.1,
      repeat: Infinity,
      repeatDelay: 3.5,
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, railWidth, walk]);

  const stops = ERAS.map((_, i) => i / (ERAS.length - 1));
  const markerX = useTransform(
    walk,
    stops,
    POSITIONS.map((position) => position * railWidth),
  );
  const markerColour = useTransform(
    walk,
    stops,
    ERAS.map((era) => era.accent),
  );

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <TiltCard className="overflow-hidden bg-surface relative" intensity={0.22}>
                <motion.div
          className="absolute top-0 left-0 h-[1.5px] bg-accent z-10"
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />

        <div className="p-8 sm:p-10 md:p-12">
                    <div className="flex items-center justify-between gap-4 mb-7">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="relative flex h-[7px] w-[7px]" aria-hidden>
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 animate-ping" />
                <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-accent" />
              </span>
              <span className="font-sans text-[8px] tracking-[0.45em] uppercase text-accent/70">
                {t("projects.statusLive")}
              </span>
              <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-fg-muted/30 pl-2.5 border-l border-line">
                {t("projects.kindEssay")} · WebGL
              </span>
            </div>
            <a
              href={LINKS.site}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[8px] tracking-[0.3em] uppercase text-fg-muted/40 hover:text-accent transition-colors shrink-0"
            >
              {t("projects.readIt")} ↗
            </a>
          </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px] gap-8 lg:gap-14 mb-9">
            <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.9] max-w-[56ch]">
              {t("profile.project3.description")}
            </p>

            <div className="lg:border-l lg:border-line lg:pl-8 self-start">
              <span className="block font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30 mb-4">
                Lighthouse
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-6">
                {METRICS.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.08 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="font-display text-2xl sm:text-3xl font-light text-fg leading-none tabular-nums w-[2.6ch] text-right">
                      {metric.value}
                    </span>
                    <span className="font-sans text-[7px] tracking-[0.35em] uppercase text-fg-muted/40">
                      {metric.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

                    <div
            className="relative border border-line bg-surface-elevated/40 px-5 sm:px-8 pt-7 pb-9 mb-9"
            aria-hidden
          >
            <span className="absolute top-2 left-3 font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30">
              deep time as distance
            </span>
            <span className="absolute top-2 right-3 font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30">
              3.3 Ma → 2012
            </span>

            <div ref={railRef} className="relative mt-6 h-14">
                            <motion.span
                className="absolute left-0 top-4 h-px bg-line origin-left"
                style={{ width: "100%" }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />

                            {ERAS.map((era, i) => (
                <motion.span
                  key={era.ordinal}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(POSITIONS[i] ?? 0) * 100}%` }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.09 }}
                >
                                    <span
                    className="w-px h-8 -translate-x-1/2 [filter:brightness(0.68)_saturate(1.25)] dark:[filter:none]"
                    style={{ background: era.accent, opacity: 0.9 }}
                  />
                  <span className="font-sans text-[7px] tracking-[0.2em] text-fg-muted/45 tabular-nums -translate-x-1/2 mt-2">
                    {era.ordinal}
                  </span>
                </motion.span>
              ))}

                            {!reduceMotion && railWidth > 0 && (
                <motion.span
                  className="absolute left-0 top-[13px] w-[5px] h-[5px] rounded-full [filter:brightness(0.68)_saturate(1.25)] dark:[filter:none]"
                  style={{
                    x: markerX,
                    backgroundColor: markerColour,
                    translateX: "-50%",
                  }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.1 }}
                />
              )}
            </div>

                        <div className="flex items-baseline justify-between mt-1">
              <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-fg-muted/40">
                Lomekwi core
              </span>
              <span className="font-sans text-[7px] tracking-[0.3em] uppercase text-fg-muted/40">
                Learned machines
              </span>
            </div>

            <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.12em] text-fg-muted/45 leading-relaxed mt-5 max-w-[62ch]">
              Every gap on this rail is the scroll it costs to cross. The
              2,900,000 years between the first worked stone and controlled fire
              is the tallest silence on the page; the 65 between the transistor
              and learned machines passes in less than a screen.
            </p>
          </div>

                    <div className="space-y-2 mb-9">
            {PRACTICES.map((practice, i) => (
              <motion.div
                key={practice}
                initial={{ opacity: 0, x: -6 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.28, delay: 0.55 + i * 0.055 }}
                className="flex items-baseline gap-2.5"
              >
                <span className="font-sans text-[8px] text-accent/45 shrink-0 select-none">›</span>
                <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.12em] text-fg-muted/55 leading-relaxed">
                  {practice}
                </span>
              </motion.div>
            ))}
          </div>

                    <div className="border-t border-line pt-6 space-y-2.5">
            {STACK_GROUPS.map((group, gi) => (
              <div key={group.label} className="flex items-baseline gap-3 flex-wrap">
                <span className="font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30 w-7 shrink-0">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item, ii) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.22, delay: 0.85 + gi * 0.08 + ii * 0.035 }}
                      className="font-sans text-[7px] sm:text-[8px] tracking-[0.28em] uppercase text-accent/70 border border-accent/18 px-2 py-[3px]"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>

                    <div className="border-t border-line mt-6 pt-5 flex flex-wrap gap-x-7 gap-y-2">
            <CardLink href={LINKS.site} label="matheuspavaneli.github.io/art" />
            <CardLink href={LINKS.repo} label="matheusPavaneli/art" />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function CardLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group font-sans text-[8px] sm:text-[9px] tracking-[0.32em] uppercase text-fg-muted/50 hover:text-accent transition-colors"
    >
      {label}
      <span className="inline-block ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </a>
  );
}
