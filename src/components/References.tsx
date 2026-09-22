import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/Section";
import {
  CLAIMS,
  countPassages,
  passages,
  pullQuote,
  recommendationsHref,
  references,
  type ReferenceEntry,
} from "@/content/references";
import type { Messages } from "@/i18n";

const markId = (entry: ReferenceEntry, claim: string) => `ref-${entry.id}-${claim}`;

const claimHighlightRules = [
  "#references:has(.refs-row:is(:hover,:focus-within)) .ref-mark{color:var(--color-text-muted);text-decoration-color:transparent}",
  ...CLAIMS.map(
    (claim) =>
      `#references:has(.refs-row[data-claim="${claim}"]:is(:hover,:focus-within)) .ref-mark[data-claim="${claim}"]{color:var(--color-text);text-decoration-color:var(--color-accent)}`,
  ),
].join("");

export function References({ t }: { t: Messages }) {
  const r = t.references;
  const date = new Intl.DateTimeFormat(t.locale.intl, { dateStyle: "medium", timeZone: "UTC" });
  const total = references.reduce(
    (n, entry) => n + CLAIMS.reduce((m, claim) => m + passages(entry, claim), 0),
    0,
  );

  return (
    <Section
      id="references"
      eyebrow={r.eyebrow}
      readout={`${references.length} · ${total}`}
      title={`“…${pullQuote}”`}
      titleLang="en"
      lede={r.lede}
    >
      <style href="references-light" precedence="default">
        {claimHighlightRules}
      </style>

      <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <table className="w-full border-collapse">
            <caption className="label border-b border-line pb-3 text-left text-text-muted">
              {r.indexLabel}
            </caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="label py-3 text-left font-medium text-text-muted">
                  {r.traitLabel}
                </th>
                {references.map((entry) => (
                  <th
                    key={entry.id}
                    scope="col"
                    className="label w-16 py-3 text-center font-medium text-text-muted"
                  >
                    <abbr title={entry.name} className="no-underline">
                      {entry.surname}
                    </abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLAIMS.map((claim) => (
                <tr key={claim} data-claim={claim} className="refs-row border-b border-line">
                  <th scope="row" className="py-1 pr-3 text-left text-small font-normal text-text">
                    {r.claims[claim]}
                  </th>
                  {references.map((entry) => {
                    const count = passages(entry, claim);
                    return (
                      <td key={entry.id} className="p-0 text-center">
                        {count > 0 ? (
                          <a
                            href={`#${markId(entry, claim)}`}
                            className="refs-cell mx-auto flex h-11 w-full items-center justify-center gap-1 rounded-sm"
                          >
                            {Array.from({ length: count }, (_, i) => (
                              <span key={i} aria-hidden className="refs-dot size-1.5 rounded-full" />
                            ))}
                            <span className="sr-only">
                              {entry.name}: {countPassages(count, t.locale.intl, r.passages)},{" "}
                              {r.claims[claim]}
                            </span>
                          </a>
                        ) : (
                          <span className="label text-text-muted">
                            <span aria-hidden>—</span>
                            <span className="sr-only">
                              {entry.name}: {countPassages(0, t.locale.intl, r.passages)}
                            </span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="label m-0 mt-4 text-text-muted">{r.indexHint}</p>
        </div>

        <div className="grid gap-14">
          {references.map((entry) => {
            const seen = new Set<string>();
            return (
              <figure key={entry.id} id={`ref-${entry.id}`} className="m-0 border-t border-line pt-6">
                <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="m-0 text-h3 text-text">{entry.name}</h3>
                    <p className="label m-0 mt-2 text-text-muted">{entry.headline}</p>
                  </div>
                  <p className="m-0 font-mono text-small tabular-nums text-text-muted">
                    <span className="whitespace-nowrap">{r.relations[entry.relation]}</span> ·{" "}
                    <span className="whitespace-nowrap">{entry.org}</span> ·{" "}
                    <time dateTime={entry.date} className="whitespace-nowrap">
                      {date.format(new Date(`${entry.date}T00:00:00Z`))}
                    </time>
                  </p>
                </figcaption>

                <blockquote cite={recommendationsHref} lang="en" className="m-0 mt-6 grid gap-5">
                  {entry.body.map((paragraph, p) => (
                    <p key={p} className="measure m-0 text-body-lg text-text-muted">
                      {paragraph.map((segment, s) => {
                        if (typeof segment === "string") return segment;
                        const id = markId(entry, segment.claim);
                        const first = !seen.has(id);
                        seen.add(id);
                        return (
                          <mark
                            key={s}
                            id={first ? id : undefined}
                            data-claim={segment.claim}
                            className="ref-mark"
                          >
                            {segment.text}
                          </mark>
                        );
                      })}
                    </p>
                  ))}
                </blockquote>

                <p className="label m-0 mt-5 text-text-muted">
                  <a
                    href={recommendationsHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link inline-flex items-center gap-1 text-text"
                  >
                    {r.source}
                    <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
                    <span className="sr-only">({t.a11y.externalLink})</span>
                  </a>
                </p>
              </figure>
            );
          })}
          <p className="label m-0 text-text-muted">{r.original}</p>
        </div>
      </div>
    </Section>
  );
}
