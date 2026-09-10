import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

/**
 * The emptiest block on the page: one long declarative line at a measure and size that would
 * be wrong anywhere else. Nothing else — the three readings that used to sit here moved into
 * the instrument band, which is what pays for the page's one loud element. Section padding here is the 20x
 * step of the 8 px unit — the page's rhythm is variation over the unit, not repetition of it.
 */
export function Masthead({ t }: { t: Messages }) {
  return (
    <section className="border-b border-rule px-5 py-20 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1180px]">
        <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {t.masthead.role}
        </p>

        <h1 className="mt-8 max-w-[22ch] text-display font-light tracking-[-0.02em]">
          {t.masthead.headline}
        </h1>

        <p className="mt-8 max-w-[58ch] text-md text-muted">{t.masthead.lede}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#contact"
            className="inline-flex h-11 items-center bg-accent px-6 font-mono text-xs uppercase tracking-[0.08em] text-on-accent"
          >
            {t.masthead.cta}
          </a>
          <a
            className="u-rule inline-flex h-11 items-center font-mono text-xs uppercase tracking-[0.08em] text-muted hover:text-text"
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <a
            className="u-rule inline-flex h-11 items-center font-mono text-xs uppercase tracking-[0.08em] text-muted hover:text-text"
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
        </div>

      </div>
    </section>
  );
}
