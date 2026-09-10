import { profile } from "@/content/profile";
import type { Locale, Messages } from "@/i18n";

export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 md:flex-row md:items-baseline md:justify-between md:px-8">
        <p className="m-0 max-w-[52ch] text-sm text-muted">{t.footer.built}</p>
        <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          <span className="tabular-nums">{new Date().getFullYear()}</span> · {profile.name} ·{" "}
          <a className="u-rule text-muted hover:text-text" href={profile.github} rel="me">
            {t.footer.source}
          </a>{" "}
          · <span lang={locale === "pt" ? "pt-BR" : "en"}>{t.masthead.location}</span>
        </p>
      </div>
    </footer>
  );
}
