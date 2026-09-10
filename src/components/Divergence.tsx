"use client";

import { useState } from "react";

import { DivergenceField } from "@/components/DivergenceField";
import { Module } from "@/components/Module";
import { drivers, gridFor, GRID_PITCH, singleValueCaseIds } from "@/lib/divergence";
import type { Messages } from "@/i18n";

/** The static grids, drawn in CSS so the screen is never blank and never needs WebGL to read. */
function CssGrids({ ratio }: { ratio: number }) {
  const { pitch, angle } = gridFor(ratio);
  const rule = (period: number, deg: number) => ({
    backgroundImage: `repeating-linear-gradient(${deg}deg, var(--color-dim-recess) 0 1px, transparent 1px ${period}px)`,
  });
  return (
    <>
      <div className="absolute inset-0" style={rule(GRID_PITCH, 90)} />
      <div className="absolute inset-0" style={rule(GRID_PITCH * pitch, 90 + angle)} />
    </>
  );
}

/**
 * The screen in the rack: the one module sunk into a recess, because that is where a meter
 * face or a scope goes. It is also the page's one loud element, and everything around it stays
 * plate-flat to pay for it.
 */
export function Divergence({ t }: { t: Messages }) {
  const [active, setActive] = useState(0);
  const current = drivers[active] ?? drivers[0];

  if (!current) return null;

  const ratioLabel = `${current.ratio.toFixed(2)}×`;

  return (
    <section id="instrument" className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="m-0 max-w-[24ch] text-xl" style={{ fontVariationSettings: '"wdth" 100' }}>
          {t.divergence.title}
        </h2>
        <p className="m-0 mt-2 max-w-[62ch] text-sm text-dim">{t.divergence.lede}</p>

        <Module
          ground="recess"
          legend={t.divergence.eyebrow}
          readout={ratioLabel}
          className="mt-7 overflow-hidden"
          bodyClassName="px-0 pb-0 pt-2 md:px-0"
        >
          <figure className="m-0">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[24/9]">
              <DivergenceField active={active}>
                <CssGrids ratio={current.ratio} />
              </DivergenceField>
            </div>

            <figcaption className="sr-only">
              {t.divergence.figureLabel} — {t.cases[current.id].name}: {current.before} →{" "}
              {current.after}, {ratioLabel}
            </figcaption>
          </figure>

          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-4 py-3 md:px-5">
            <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="legend text-dim-recess">
                {current.kind === "ceiling" ? t.reading.limit : t.divergence.estimated}
              </span>
              <span className="font-readout text-xs tabular-nums text-on-recess">
                {current.before}
              </span>
              <span aria-hidden className="text-dim-recess">
                ·
              </span>
              <span className="legend text-dim-recess">
                {current.kind === "ceiling" ? t.reading.heldAt : t.divergence.actual}
              </span>
              <span className="font-readout text-xs tabular-nums text-signal-recess">
                {current.after}
              </span>
            </p>
          </div>
        </Module>

        <div
          role="group"
          aria-label={t.divergence.controlLabel}
          className="mt-4 flex flex-wrap gap-x-5 gap-y-1"
        >
          {drivers.map((driver, index) => (
            <button
              key={driver.id}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={index === active}
              className="lamp legend inline-flex min-h-11 items-center text-dim"
            >
              {t.cases[driver.id].name}
            </button>
          ))}
        </div>

        <p className="m-0 mt-4 max-w-[62ch] text-sm text-dim">
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
