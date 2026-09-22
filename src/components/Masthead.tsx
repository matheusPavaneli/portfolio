import { ArrowRight } from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { DeltaBoard } from "@/components/DeltaBoard";
import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

export function Masthead({ t }: { t: Messages }) {
  const facts = [
    { label: t.masthead.stripNow, value: t.masthead.stripNowValue },
    { label: t.masthead.stripStack, value: t.masthead.stripStackValue },
    { label: t.masthead.stripBase, value: t.masthead.stripBaseValue },
  ];

  return (
    <section className="px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
      <div className="mx-auto max-w-shell">
        <p className="m-0 text-h3 text-text">{profile.name}</p>
        <p className="label m-0 mt-1 text-text-muted">{t.masthead.role}</p>

        <h1 className="m-0 mt-8 max-w-[15ch] text-display-xl text-text">
          {t.masthead.headlineLead}{" "}
          <span className="text-text-muted">{t.masthead.headlineTail}</span>
        </h1>

        <p className="measure m-0 mt-6 text-body-lg text-text-muted">{t.masthead.lede}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="label inline-flex h-11 items-center gap-2 rounded-sm bg-accent-fill px-5 text-on-accent transition-colors duration-(--duration-tint) hover:bg-accent-fill-hover"
          >
            {t.masthead.cta}
            <ArrowRight aria-hidden size={14} strokeWidth={1.75} />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="control label inline-flex h-11 items-center gap-2 rounded-sm px-4 text-text-muted"
          >
            <BrandMark brand="github" size={14} />
            GitHub
            <span className="sr-only">({t.a11y.externalLink})</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="control label inline-flex h-11 items-center gap-2 rounded-sm px-4 text-text-muted"
          >
            <BrandMark brand="linkedin" size={14} />
            LinkedIn
            <span className="sr-only">({t.a11y.externalLink})</span>
          </a>
        </div>

        <p className="m-0 mt-6 flex items-center gap-2 sm:hidden">
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent-fill" />
          <span className="label text-text-muted">{t.masthead.stripStatusValue}</span>
        </p>

        <dl className="m-0 mt-10 grid grid-cols-1 border-t border-line md:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-line px-0 py-4 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"
            >
              <dt className="label m-0 text-text-muted">{fact.label}</dt>
              <dd className="m-0 mt-2 text-body text-text">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 md:mt-14">
          <DeltaBoard t={t} />
          <p className="measure m-0 mt-4 text-small text-text-muted">{t.board.lede}</p>
        </div>
      </div>
    </section>
  );
}
