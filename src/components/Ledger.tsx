import { ArrowUpRight, ChevronRight } from "lucide-react";

import { Section } from "@/components/Section";
import { cases, headlineCaseIds, ownProjects, productionCases, type Case } from "@/content/cases";
import { formatRatio, readingText, rows } from "@/lib/board";
import { formatYears } from "@/lib/dates";
import type { Messages } from "@/i18n";

export function Ledger({ t }: { t: Messages }) {
  const readings = new Map(rows.map((row) => [row.id, row]));

  return (
    <Section
      id="cases"
      eyebrow={t.index.eyebrow}
      readout={`${cases.length}`}
      title={t.cases.title}
      lede={t.index.lede}
    >
      <div className="border-t border-line">
        <div className="hidden grid-cols-[minmax(0,1fr)_11rem_10rem_6.5rem] gap-x-6 border-b border-line px-2 py-2.5 lg:grid">
          <p className="label m-0 text-text-muted">{t.index.colCase}</p>
          <p className="label m-0 text-text-muted">{t.index.colOrg}</p>
          <p className="label m-0 text-text-muted">{t.board.ratioLabel}</p>
          <p className="label m-0 text-right text-text-muted">{t.index.colYear}</p>
        </div>

        {[
          { label: t.index.production, set: productionCases },
          { label: t.index.own, set: ownProjects },
        ].map((group) => (
          <div key={group.label}>
            <h3 className="label m-0 border-b border-line px-2 pb-3 pt-8 text-text-muted">{group.label}</h3>
            {group.set.map((entry) => {
              const row = readings.get(entry.id);
              return (
                <Row
                  key={entry.id}
                  entry={entry}
                  t={t}
                  reading={row === undefined ? "" : readingText(row)}
                  ratio={
                    row?.group === "moved" && row.ratio !== null
                      ? formatRatio(row.ratio)
                      : row?.group === "held"
                        ? t.board.held
                        : "—"
                  }
                  open={(headlineCaseIds as readonly string[]).includes(entry.id)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Row({
  entry,
  t,
  reading,
  ratio,
  open,
}: {
  entry: Case;
  t: Messages;
  reading: string;
  ratio: string;
  open: boolean;
}) {
  const copy = t.cases[entry.id];

  return (
    <details
      id={`case-${entry.id}`}
      open={open}
      className="border-b border-line [&[open]]:bg-surface"
    >
      <summary className="ledger-summary grid grid-cols-1 gap-x-6 gap-y-2 px-2 py-5 lg:grid-cols-[minmax(0,1fr)_11rem_10rem_6.5rem] lg:items-start">
        <div className="flex min-w-0 gap-2.5">
          <ChevronRight
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="ledger-caret mt-1 shrink-0 text-text-muted"
          />
          <div className="min-w-0">
            <h4 className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-h3 font-medium text-text">
              {copy.name}
              {entry.origin.kind === "own" ? (
                <span className="chip label">{t.index[entry.origin.status]}</span>
              ) : null}
            </h4>
            <p className="measure-tight m-0 mt-1.5 text-body text-text-muted">{copy.kicker}</p>
          </div>
        </div>

        <p className="m-0 pl-6.5 text-small text-text-muted lg:pl-0">{copy.org}</p>

        <p
          className={`m-0 pl-6.5 font-mono text-small tabular-nums lg:pl-0 ${
            ratio.endsWith("×") ? "text-accent" : "text-text-muted"
          }`}
        >
          <span className="sr-only">{t.board.ratioLabel}: </span>
          {ratio}
        </p>

        <p className="m-0 pl-6.5 font-mono text-small tabular-nums text-text-muted lg:pl-0 lg:text-right">
          {formatYears(entry.years, t.locale.present)}
        </p>
      </summary>

      <div className="grid gap-x-10 gap-y-8 px-2 pb-8 pl-6.5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:pl-9">
        <div>
          <p className="measure m-0 text-body text-text-muted">{copy.body}</p>

          <p className="m-0 mt-6 flex flex-wrap items-center gap-2">
            <span className="sr-only">{t.cases.stack}: </span>
            {entry.stack.map((item) => (
              <span key={item} className="chip label">
                {item}
              </span>
            ))}
          </p>

          {entry.links.length > 0 ? (
            <p className="m-0 mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {entry.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link label inline-flex items-center gap-1 text-text"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
                  <span className="sr-only">({t.a11y.externalLink})</span>
                </a>
              ))}
            </p>
          ) : null}
        </div>

        <aside data-reading className="border-t border-line pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="label m-0 text-text-muted">{t.index.colReading}</p>
          <p className="m-0 mt-2 font-mono text-metric tabular-nums text-accent">{reading}</p>
          <p className="m-0 mt-2 text-small text-text-muted">{copy.caption}</p>
        </aside>
      </div>
    </details>
  );
}
