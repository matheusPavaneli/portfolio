import { Eyebrow } from "@/components/Eyebrow";
import { cases, type Reading } from "@/content/cases";
import type { Messages } from "@/i18n";

/** The one-line form of a reading, for a row that has to stay on one line. */
function shortReading(reading: Reading): string {
  if (reading.kind === "delta") return `${reading.before.label} → ${reading.after.label}`;
  if (reading.kind === "ceiling") return reading.value.label;
  return reading.value.label;
}

/**
 * The densest block on the page, and its composition: the index is not navigation, it is the
 * argument. Eight cases, every one of them readable in a single screen, before the reader has
 * committed to any of them. Section padding here is the 7x step.
 */
export function CaseIndex({ t }: { t: Messages }) {
  return (
    <section id="index" className="border-b border-rule px-5 py-14 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.index.eyebrow}</Eyebrow>
        <h2 className="mt-5 text-xl font-light tracking-[-0.02em]">{t.index.title}</h2>
        <p className="mt-3 max-w-[58ch] text-base text-muted">{t.index.lede}</p>

        <table className="mt-10 w-full border-collapse text-left">
          <caption className="sr-only">{t.index.title}</caption>
          <thead>
            <tr className="border-b border-edge">
              <th
                scope="col"
                className="py-2 pr-4 font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted"
              >
                {t.index.colCase}
              </th>
              <th
                scope="col"
                className="py-2 pr-4 font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted"
              >
                {t.index.colReading}
              </th>
              <th
                scope="col"
                className="hidden py-2 text-right font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted sm:table-cell"
              >
                {t.index.colYear}
              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((entry) => (
              <tr key={entry.id} className="border-b border-rule">
                <th scope="row" className="py-3 pr-4 align-baseline font-normal">
                  <a
                    href={`#case-${entry.id}`}
                    className="u-rule inline-flex min-h-11 items-baseline gap-3 py-2 text-base text-text"
                  >
                    <span className="font-mono text-xs tabular-nums text-muted">
                      {entry.ordinal}
                    </span>
                    <span>{t.cases[entry.id].name}</span>
                  </a>
                </th>
                <td className="py-3 pr-4 align-baseline font-mono text-sm tabular-nums text-accent">
                  {shortReading(entry.reading)}
                </td>
                <td className="hidden py-3 text-right align-baseline font-mono text-xs tabular-nums text-muted sm:table-cell">
                  {entry.year}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
