import { ArrowUpRight } from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { Module } from "@/components/Module";
import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

/**
 * The top of the rack.
 *
 * The thesis is the claim, set at a size that is a decision, with the panel's own status strip
 * under it: three plates reporting what this is, where it is, and what it is open to. No stat
 * tiles and no gradient — legends and readouts, which is what a panel actually says about
 * itself.
 */
export function Masthead({ t }: { t: Messages }) {
  const strip = [
    { legend: t.masthead.stripRole, value: t.masthead.stripRoleValue, live: false },
    { legend: t.masthead.stripBase, value: t.masthead.location, live: false },
    { legend: t.masthead.stripStatus, value: t.masthead.stripStatusValue, live: true },
  ];

  return (
    <section className="px-4 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-[1240px]">
        <h1
          className="m-0 max-w-[16ch] text-display font-bold"
          style={{ fontVariationSettings: '"wdth" 108' }}
        >
          {t.masthead.headline}
        </h1>

        <p className="mt-7 max-w-[54ch] text-md text-dim">{t.masthead.lede}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="legend inline-flex h-11 items-center gap-2 rounded-recess bg-signal px-5 text-on-signal"
          >
            {t.masthead.cta}
            <ArrowUpRight aria-hidden size={14} strokeWidth={2.25} />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="legend inline-flex h-11 items-center gap-2 rounded-recess px-3 text-dim ring-1 ring-edge hover:text-ink"
          >
            <BrandMark brand="github" size={14} />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="legend inline-flex h-11 items-center gap-2 rounded-recess px-3 text-dim ring-1 ring-edge hover:text-ink"
          >
            <BrandMark brand="linkedin" size={14} />
            LinkedIn
          </a>
        </div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-3">
          {strip.map((item) => (
            <Module as="li" key={item.legend} legend={item.legend}>
              <p className="m-0 flex items-center gap-2 text-base text-ink">
                {item.live ? (
                  <span aria-hidden className="inline-block size-2 shrink-0 rounded-lamp bg-signal" />
                ) : null}
                {item.value}
              </p>
            </Module>
          ))}
        </ul>
      </div>
    </section>
  );
}
