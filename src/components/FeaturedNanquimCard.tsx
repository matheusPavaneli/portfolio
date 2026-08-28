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
  site: "https://matheuspavaneli.github.io/NANQUIM/",
  repo: "https://github.com/matheusPavaneli/NANQUIM",
} as const;

const PATH = [
  { ordinal: "01", label: "idle" },
  { ordinal: "02", label: "creating" },
  { ordinal: "03", label: "awaiting" },
  { ordinal: "04", label: "paid" },
] as const;

const BRANCHES = [
  { from: 1, label: "expired" },
  { from: 2, label: "failed" },
] as const;

const METRICS = [
  { value: "0", label: "runtime deps" },
  { value: "12.1", label: "kB gz core" },
  { value: "81", label: "unit tests" },
  { value: "0", label: "3rd-party reqs" },
] as const;

const BUDGET = [
  { pkg: "core · esm", measured: 12.14, limit: 12.5 },
  { pkg: "core · cdn", measured: 12.24, limit: 12.5 },
  { pkg: "abacatepay", measured: 0.92, limit: 3 },
  { pkg: "react", measured: 0.59, limit: 2 },
] as const;

const PRACTICES = [
  "No onSuccess: the browser is never the source of truth — the signed webhook is",
  "The SDK takes functions, not credentials — no PSP key can reach the bundle",
  "Shadow DOM both ways: the host page cannot leak in, the surface cannot leak out",
  "Backoff with jitter, paused on a hidden tab, hard-stopped at the deadline",
  "Expiry read from the local clock, so a skewed device is never shown a dead code",
  "The promised price is an invariant — another amount fails amount_mismatch",
  "Idempotency from a CSPRNG or not at all: a double click is still one charge",
  "Our own QR encoder, byte mode EC M, instead of 30 kB of generic library",
  "Exactly-once crediting: claim the event id, keep the claim only on success",
] as const;

const STACK_GROUPS = [
  { label: "SDK", items: ["TypeScript", "Zero deps", "Shadow DOM", "tsdown"] },
  { label: "Sec", items: ["HMAC", "Replay window", "Idempotency", "CSPRNG"] },
  { label: "Ops", items: ["node:test", "Playwright", "axe-core", "size-limit"] },
  { label: "Doc", items: ["VitePress", "Mermaid", "GitHub Pages"] },
] as const;

export function FeaturedNanquimCard() {
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
      duration: 4.2,
      ease: [0.65, 0, 0.35, 1],
      delay: 1.1,
      repeat: Infinity,
      repeatDelay: 3.2,
    });
    return () => controls.stop();
  }, [isInView, reduceMotion, railWidth, walk]);

  const stops = PATH.map((_, i) => i / (PATH.length - 1));
  const markerX = useTransform(
    walk,
    stops,
    PATH.map((_, i) => (i / (PATH.length - 1)) * railWidth),
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
                {t("projects.statusOpenSource")}
              </span>
              <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-fg-muted/30 pl-2.5 border-l border-line">
                {t("projects.kindSdk")} · Pix
              </span>
            </div>
            <a
              href={LINKS.site}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[8px] tracking-[0.3em] uppercase text-fg-muted/40 hover:text-accent transition-colors shrink-0"
            >
              {t("projects.readDocs")} ↗
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px] gap-8 lg:gap-14 mb-9">
            <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.9] max-w-[56ch]">
              {t("profile.project4.description")}
            </p>

            <div className="lg:border-l lg:border-line lg:pl-8 self-start">
              <span className="block font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30 mb-4">
                Measured
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
                    <span className="font-display text-2xl sm:text-3xl font-light text-fg leading-none tabular-nums w-[3.4ch] text-right">
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
              illegal states unrepresentable
            </span>
            <span className="absolute top-2 right-3 font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30">
              6 states · 2 branches
            </span>

            <div ref={railRef} className="relative mt-7 h-20">
              <motion.span
                className="absolute left-0 top-3 h-px bg-line origin-left"
                style={{ width: "100%" }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />

              {PATH.map((state, i) => (
                <motion.span
                  key={state.label}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(i / (PATH.length - 1)) * 100}%` }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
                >
                  <span className="w-px h-6 -translate-x-1/2 bg-accent/80" />
                  <span className="font-sans text-[7px] tracking-[0.2em] text-fg-muted/45 tabular-nums -translate-x-1/2 mt-2">
                    {state.ordinal}
                  </span>
                  <span className="hidden sm:block font-sans text-[7px] tracking-[0.24em] uppercase text-fg-muted/55 -translate-x-1/2 mt-1.5 whitespace-nowrap">
                    {state.label}
                  </span>
                </motion.span>
              ))}

              {BRANCHES.map((branch, i) => (
                <motion.span
                  key={branch.label}
                  className="absolute top-3 block"
                  style={{ left: `${(branch.from / (PATH.length - 1)) * 100}%` }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.95 + i * 0.1 }}
                >
                  <span className="absolute top-0 left-0 w-px h-9 bg-line" />
                  <span className="absolute top-9 left-0 w-8 sm:w-12 h-px bg-line" />
                  <span className="absolute top-9 left-8 sm:left-12 ml-1.5 -translate-y-1/2 font-sans text-[7px] tracking-[0.24em] uppercase text-fg-muted/35 whitespace-nowrap">
                    {branch.label}
                  </span>
                </motion.span>
              ))}

              {!reduceMotion && railWidth > 0 && (
                <motion.span
                  className="absolute left-0 top-[10px] w-[5px] h-[5px] rounded-full bg-accent"
                  style={{ x: markerX, translateX: "-50%" }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1.1 }}
                />
              )}
            </div>

            <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.12em] text-fg-muted/45 leading-relaxed mt-6 max-w-[62ch]">
              A discriminated union and one pure <code>transition()</code> of ~60 lines:
              every state carries exactly the data that state has, so there is no
              &ldquo;paid but no receipt&rdquo; to render. The two branches below the line
              are the only ways out that are not payment — and there is no way back in.
            </p>
          </div>

          <div className="border border-line bg-surface-elevated/40 px-5 sm:px-8 py-7 mb-9" aria-hidden>
            <div className="flex items-baseline justify-between mb-5">
              <span className="font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30">
                the byte gate
              </span>
              <span className="font-sans text-[7px] tracking-[0.4em] uppercase text-fg-muted/30">
                gzipped · measured
              </span>
            </div>

            <div className="space-y-3.5">
              {BUDGET.map((row, i) => (
                <div
                  key={row.pkg}
                  className="grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7rem_1fr_auto] items-center gap-3 sm:gap-4"
                >
                  <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.28em] uppercase text-fg-muted/45 truncate">
                    {row.pkg}
                  </span>
                  <span className="relative block h-[3px] bg-line/60">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-accent/70 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={
                        isInView
                          ? { scaleX: row.measured / row.limit }
                          : { scaleX: 0 }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { duration: 0.9, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }
                      }
                      style={{ width: "100%" }}
                    />
                  </span>
                  <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.16em] text-fg-muted/50 tabular-nums whitespace-nowrap">
                    {row.measured.toFixed(2)} / {row.limit.toFixed(1)} kB
                  </span>
                </div>
              ))}
            </div>

            <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.12em] text-fg-muted/45 leading-relaxed mt-6 max-w-[62ch]">
              The core budget was 12 kB until a security pass added the CSPRNG-only
              idempotency key, the amount invariant and the skew-free deadline. They cost
              330 B and the budget moved, deliberately: none of them is optional in a
              payment surface, and the alternative was to keep a number and drop a
              guarantee.
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
            <CardLink href={LINKS.site} label="matheuspavaneli.github.io/NANQUIM" />
            <CardLink href={LINKS.repo} label="matheusPavaneli/NANQUIM" />
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
