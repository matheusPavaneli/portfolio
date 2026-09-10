"use client";

import { useState } from "react";

import { DivergenceField } from "@/components/DivergenceField";
import { Eyebrow } from "@/components/Eyebrow";
import { drivers, gridFor, singleValueCaseIds } from "@/lib/divergence";
import type { Messages } from "@/i18n";

const PITCH = 15;

/** The static grids, drawn in CSS so the band is never blank and never needs WebGL to read. */
function CssGrids({ ratio }: { ratio: number }) {
  const { pitch, angle } = gridFor(ratio);
  const rule = (period: number, deg: number) => ({
    backgroundImage: `repeating-linear-gradient(${deg}deg, var(--color-edge) 0 1px, transparent 1px ${period}px)`,
  });
  return (
    <>
      <div className="absolute inset-0" style={rule(PITCH, 90)} />
      <div className="absolute inset-0" style={rule(PITCH * pitch, 90 + angle)} />
    </>
  );
}

export function Divergence({ t }: { t: Messages }) {
  const [active, setActive] = useState(0);
  const current = drivers[active] ?? drivers[0];

  if (!current) return null;

  const ratio = current.ratio;
  // 1.00× is the whole point of the two ceiling cases: value exactly at limit, no divergence.
  const ratioLabel = `${ratio.toFixed(2)}×`;

  return (
    <section id="divergence" className="border-b border-rule px-5 py-14 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.divergence.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[26ch] text-xl font-light tracking-[-0.02em]">
          {t.divergence.title}
        </h2>
        <p className="mt-3 max-w-[58ch] text-base text-muted">{t.divergence.lede}</p>

        <figure className="m-0 mt-10">
          <div className="relative aspect-[4/3] w-full border border-rule sm:aspect-[16/9] lg:aspect-[21/9]">
            <DivergenceField active={active}>
              <CssGrids ratio={ratio} />
            </DivergenceField>

            {/* The reading gets its own plate: a label on an instrument, never type on a grid. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule bg-surface px-4 py-3 md:px-6">
              <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                <span>
                  {current.kind === "ceiling" ? t.reading.limit : t.divergence.estimated}
                </span>
                <span className="tabular-nums text-text">{current.before}</span>
                <span aria-hidden>·</span>
                <span>
                  {current.kind === "ceiling" ? t.reading.heldAt : t.divergence.actual}
                </span>
                <span className="tabular-nums text-accent">{current.after}</span>
              </p>
              <p className="m-0 shrink-0 font-mono text-md tabular-nums text-accent">
                {ratioLabel}
              </p>
            </div>
          </div>

          <figcaption className="sr-only">
            {t.divergence.figureLabel} — {t.cases[current.id].name}: {current.before} →{" "}
            {current.after}, {ratioLabel}
          </figcaption>
        </figure>

        <div
          role="group"
          aria-label={t.divergence.controlLabel}
          className="mt-6 flex flex-wrap gap-x-2 gap-y-1"
        >
          {drivers.map((driver, index) => (
            <button
              key={driver.id}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              className={`u-rule inline-flex min-h-11 items-center px-2 font-mono text-xs uppercase tracking-[0.08em] ${
                index === active ? "text-accent" : "text-muted hover:text-text"
              }`}
            >
              {t.cases[driver.id].name}
            </button>
          ))}
        </div>

        <p className="mt-6 max-w-[58ch] text-sm text-muted">
          {t.divergence.excluded}{" "}
          {singleValueCaseIds.map((id, index) => (
            <span key={id}>
              {index > 0 ? ", " : ""}
              {t.cases[id].name}
            </span>
          ))}
          .
        </p>
      </div>
    </section>
  );
}
