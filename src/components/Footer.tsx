import { profile } from "@/content/profile";
import type { Locale, Messages } from "@/i18n";
import { href } from "@/lib/href";

export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <footer className="border-t border-line px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-shell flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
        <p className="measure m-0 text-small text-text-muted">{t.footer.built}</p>
        <p className="label m-0 shrink-0 text-text-muted">
          <span className="tabular-nums">{new Date().getFullYear()}</span> · {profile.name} ·{" "}
          <a
            className="link text-text-muted"
            href={profile.github}
            rel="me"
          >
            {t.footer.source}
          </a>
          <br />
          {t.machine.footer}:{" "}
          <a className="link text-text-muted" href={href("/llms.txt")} type="text/plain">
            llms.txt
          </a>{" "}
          ·{" "}
          <a className="link text-text-muted" href={href(`/${locale}/index.md`)} type="text/markdown">
            Markdown
          </a>{" "}
          ·{" "}
          <a className="link text-text-muted" href={href("/resume.json")} type="application/json">
            JSON Resume
          </a>
        </p>
      </div>
    </footer>
  );
}
