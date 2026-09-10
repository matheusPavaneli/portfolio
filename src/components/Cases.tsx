import { Eyebrow } from "@/components/Eyebrow";
import { ReadingBlock } from "@/components/Reading";
import { cases, type Case } from "@/content/cases";
import type { Messages } from "@/i18n";

/**
 * The asymmetric pair, held for every case and never alternating: prose is the primary,
 * the reading is the secondary, and they do not swap. Below `lg` the pair collapses with the
 * reading *above* its prose, so a phone reader meets the number first.
 */
export function Cases({ t }: { t: Messages }) {
  return (
    <section id="cases" className="border-b border-rule px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.cases.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[22ch] text-xl font-light tracking-[-0.02em]">
          {t.cases.title}
        </h2>

        <div className="mt-14">
          {cases.map((entry) => (
            <CaseEntry key={entry.id} entry={entry} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseEntry({ entry, t }: { entry: Case; t: Messages }) {
  const copy = t.cases[entry.id];

  return (
    <article
      id={`case-${entry.id}`}
      aria-labelledby={`case-${entry.id}-name`}
      className="grid scroll-mt-24 grid-cols-1 gap-x-12 gap-y-8 border-t border-rule py-12 lg:grid-cols-[minmax(0,2fr)_260px]"
    >
      {/* Order is set per breakpoint, not by DOM order: the reading is second in the document
          for a screen reader and first on a phone. */}
      <div className="order-2 lg:order-1">
        <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          <span className="tabular-nums">{entry.ordinal}</span>
          <span>{copy.org}</span>
          <span className="tabular-nums">{entry.year}</span>
        </p>

        <h3 id={`case-${entry.id}-name`} className="mt-4 text-lg font-light tracking-[-0.02em]">
          {copy.name}
        </h3>

        <p className="mt-3 max-w-[58ch] text-md italic text-text">{copy.kicker}</p>
        <p className="mt-5 max-w-[58ch] text-base text-muted">{copy.body}</p>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span className="uppercase tracking-[0.08em]">{t.cases.stack}</span>
          {entry.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </p>

        {entry.links.length > 0 ? (
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {entry.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="u-rule font-mono text-xs uppercase tracking-[0.08em] text-accent"
              >
                {link.label}
                <span className="sr-only"> ({t.a11y.externalLink})</span>
              </a>
            ))}
          </p>
        ) : null}
      </div>

      <div className="order-1 lg:order-2">
        <ReadingBlock reading={entry.reading} caption={copy.caption} t={t.reading} />
      </div>
    </article>
  );
}
