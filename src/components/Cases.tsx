import { ArrowUpRight } from "lucide-react";

import { Meter } from "@/components/Meter";
import { Module } from "@/components/Module";
import { cases, type Case } from "@/content/cases";
import type { Messages } from "@/i18n";

/**
 * The rack.
 *
 * Modules of genuinely different sizes on a twelve-column sheet — the cases that carry the
 * argument take eight or twelve columns, the rest take four or six. That is where the density
 * variation comes from, rather than one band repeated eight times with different words in it.
 *
 * There is no `01 / 02 / 03` anywhere: eight cases are a set, not a sequence, and numbering a
 * set is decoration pretending to be structure.
 */

const SPAN: Record<Case["id"], string> = {
  orchestration: "lg:col-span-8",
  query: "lg:col-span-4",
  seal: "lg:col-span-6",
  nanquim: "lg:col-span-6",
  anchor: "lg:col-span-4",
  artefacts: "lg:col-span-4",
  dashboard: "lg:col-span-4",
  image: "lg:col-span-12",
};

export function Cases({ t }: { t: Messages }) {
  return (
    <section id="cases" className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="m-0 max-w-[20ch] text-xl" style={{ fontVariationSettings: '"wdth" 100' }}>
          {t.cases.title}
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {cases.map((entry) => (
            <CaseModule key={entry.id} entry={entry} t={t} span={SPAN[entry.id]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseModule({ entry, t, span }: { entry: Case; t: Messages; span: string }) {
  const copy = t.cases[entry.id];
  const wide = span.includes("col-span-8") || span.includes("col-span-12");

  return (
    <Module
      as="article"
      id={`case-${entry.id}`}
      aria-labelledby={`case-${entry.id}-name`}
      legend={copy.org}
      readout={entry.year}
      className={`scroll-mt-24 ${span}`}
    >
      <div className={wide ? "grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_300px]" : ""}>
        <div>
          <h3
            id={`case-${entry.id}-name`}
            className="m-0 text-lg"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            {copy.name}
          </h3>
          <p className="m-0 mt-2 max-w-[52ch] text-base text-ink">{copy.kicker}</p>
          <p className="m-0 mt-3 max-w-[62ch] text-sm text-dim">{copy.body}</p>

          <p className="m-0 mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            {entry.stack.map((item) => (
              <span key={item} className="legend rounded-recess px-2 py-1 text-dim ring-1 ring-edge">
                {item}
              </span>
            ))}
          </p>

          {entry.links.length > 0 ? (
            <p className="m-0 mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {entry.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="legend inline-flex items-center gap-1 text-signal hover:underline"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden size={12} strokeWidth={2.25} />
                  <span className="sr-only">({t.a11y.externalLink})</span>
                </a>
              ))}
            </p>
          ) : null}
        </div>

        <figure className={`m-0 ${wide ? "" : "mt-6"}`}>
          <Meter reading={entry.reading} t={t.reading} />
          <figcaption className="mt-3 max-w-[38ch] text-xs text-dim">{copy.caption}</figcaption>
        </figure>
      </div>
    </Module>
  );
}
