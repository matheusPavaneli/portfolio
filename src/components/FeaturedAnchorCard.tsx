"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TiltCard } from "@/components/effects/TiltCard";
import { useLocale } from "@/context/LocaleContext";

const HALF_CIRC = Math.PI * 50; // π × r=50 ≈ 157.08
const TARGET_SCORE = 73;

const STACK_GROUPS = [
  { label: "Core", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"] },
  { label: "Data", items: ["Supabase", "PostgreSQL", "Stripe", "Resend"] },
  { label: "AI",   items: ["Anthropic Claude"] },
  { label: "Ops",  items: ["Sentry", "Upstash", "Vercel", "GitHub Actions"] },
  { label: "Test", items: ["Vitest", "Playwright"] },
];

const PRACTICES = [
  "App Router · Server Actions · Route Handlers",
  "Row-Level Security — 19 Supabase migrations",
  "Billing gates per plan tier (Stripe)",
  "Health Score 0–100 · weight-learning signals engine",
  "Weekly cron: signal extraction + Claude brief generation",
  "OAuth token encryption · share-link crypto",
  "Zod validation at all API boundaries",
  "SEO: sitemap · JSON-LD · OpenGraph metadata",
];

export function FeaturedAnchorCard() {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setScore(Math.round(eased * TARGET_SCORE));
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isInView]);

  const filled = (score / 100) * HALF_CIRC;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-px"
    >
      <TiltCard className="overflow-hidden bg-surface" intensity={0.25}>
        <a
          href="https://getanchor.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative"
        >
          {/* Animated accent top bar */}
          <motion.div
            className="absolute top-0 left-0 h-[1.5px] bg-accent z-10"
            initial={{ width: 0 }}
            animate={isInView ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          />

          <div className="p-8 sm:p-10 md:p-12">
            {/* Top meta row */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <span className="relative flex h-[7px] w-[7px]" aria-hidden>
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent/50 animate-ping" />
                  <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-accent" />
                </span>
                <span className="font-sans text-[8px] tracking-[0.45em] uppercase text-accent/70">
                  Production
                </span>
                <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-fg-muted/30 pl-2.5 border-l border-fg-muted/15">
                  SaaS · B2B
                </span>
              </div>
              <span className="font-sans text-sm text-fg-muted/35 group-hover:text-accent transition-colors duration-300">
                ↗
              </span>
            </div>

            {/* Main layout: content left, gauge right */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] xl:grid-cols-[1fr_220px] gap-8 lg:gap-14 mb-8">

              {/* Left: identity + description + practices */}
              <div>
                <h3 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-light text-fg group-hover:text-accent transition-colors duration-300 tracking-tight leading-[1.0] mb-3">
                  Anchor
                </h3>
                <p className="font-sans text-[8px] tracking-[0.38em] uppercase text-accent/60 mb-5 leading-relaxed">
                  Retention intelligence for performance agencies
                </p>
                <p className="font-sans text-xs sm:text-sm text-fg-muted leading-[1.9] mb-8 max-w-[52ch]">
                  {t("profile.project1.description")}
                </p>

                {/* Practices — terminal-style monospace list */}
                <div className="space-y-2">
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
              </div>

              {/* Right: Health score gauge */}
              <div className="flex flex-col items-center justify-center gap-4 self-start lg:self-center lg:pt-2">
                <div className="relative">
                  <svg
                    viewBox="0 0 120 72"
                    className="w-32 sm:w-36 lg:w-40"
                    aria-label={`Health score: ${score} out of 100`}
                  >
                    {/* Background track */}
                    <path
                      d="M 10,65 A 50,50 0 0,1 110,65"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ stroke: "rgb(var(--fg-muted) / 0.13)" }}
                    />
                    {/* Filled arc */}
                    <path
                      d="M 10,65 A 50,50 0 0,1 110,65"
                      fill="none"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${filled} ${HALF_CIRC}`}
                      style={{
                        stroke: "rgb(var(--color-accent))",
                        transition: "stroke-dasharray 0.016s linear",
                      }}
                    />
                    {/* End ticks */}
                    <line x1="10" y1="65" x2="10" y2="71" strokeWidth="1.5" style={{ stroke: "rgb(var(--fg-muted) / 0.25)" }} />
                    <line x1="110" y1="65" x2="110" y2="71" strokeWidth="1.5" style={{ stroke: "rgb(var(--fg-muted) / 0.25)" }} />
                  </svg>

                  {/* Centered score display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
                    <span className="font-display text-[2.4rem] sm:text-[2.8rem] font-light text-fg leading-none tabular-nums">
                      {score}
                    </span>
                    <span className="font-sans text-[7px] tracking-[0.45em] uppercase text-fg-muted/35 mt-0.5">
                      health
                    </span>
                  </div>
                </div>

                {/* Risk tier badge */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.1, duration: 0.35 }}
                  className="flex items-center gap-2 border border-fg-muted/12 px-3 py-1.5"
                >
                  <span className="w-[6px] h-[6px] rounded-full bg-[#f59e0b]" aria-hidden />
                  <span className="font-sans text-[7px] tracking-[0.38em] uppercase text-fg-muted/50">
                    Attention
                  </span>
                </motion.div>

                {/* Scale labels */}
                <div className="flex justify-between w-32 sm:w-36 lg:w-40 -mt-1">
                  <span className="font-sans text-[6px] tracking-[0.3em] text-fg-muted/30">0</span>
                  <span className="font-sans text-[6px] tracking-[0.3em] text-fg-muted/30">100</span>
                </div>
              </div>
            </div>

            {/* Stack chips — grouped by category */}
            <div className="border-t border-fg-muted/10 pt-6 space-y-2.5">
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
          </div>
        </a>
      </TiltCard>
    </motion.div>
  );
}
