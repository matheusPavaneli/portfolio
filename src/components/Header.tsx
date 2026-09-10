import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import { href } from "@/lib/href";
import { LOCALE_LABEL, LOCALES, type Locale, type Messages } from "@/i18n";

const SECTIONS = ["index", "cases", "method", "record", "contact"] as const;

/**
 * Server component. The mobile disclosure is a native `<details>`, so it is keyboard
 * operable, findable by find-in-page and open before hydration — the only client code in the
 * header is the theme switch.
 */
export function Header({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-surface">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <a
          href={href(`/${locale}/`)}
          className="u-rule font-mono text-xs uppercase tracking-[0.08em] text-text"
        >
          {profile.initials}
        </a>

        <nav aria-label={t.a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="u-rule inline-flex h-8 items-center font-mono text-xs uppercase tracking-[0.08em] text-muted hover:text-text"
                >
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <nav aria-label={t.a11y.language} className="flex items-center gap-2">
            {LOCALES.map((code) => (
              <a
                key={code}
                href={href(`/${code}/`)}
                hrefLang={code === "pt" ? "pt-BR" : "en"}
                aria-current={code === locale ? "true" : undefined}
                className={`u-rule inline-flex h-8 items-center px-1 font-mono text-xs uppercase tracking-[0.08em] ${
                  code === locale ? "text-text" : "text-muted hover:text-text"
                }`}
              >
                {LOCALE_LABEL[code]}
              </a>
            ))}
          </nav>

          <ThemeToggle toLight={t.a11y.toLight} toDark={t.a11y.toDark} />

          <details className="group relative md:hidden">
            <summary className="inline-flex h-11 cursor-pointer list-none items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-muted [&::-webkit-details-marker]:hidden">
              {t.a11y.openMenu}
              <span
                aria-hidden
                className="inline-block transition-transform duration-[--duration-fast] group-open:rotate-180 motion-reduce:transition-none"
              >
                ▾
              </span>
            </summary>
            <nav
              aria-label={t.a11y.mainNav}
              className="absolute right-0 top-full z-50 w-52 border border-rule bg-raised"
            >
              <ul>
                {SECTIONS.map((id) => (
                  <li key={id} className="border-b border-rule last:border-b-0">
                    <a
                      href={`#${id}`}
                      className="flex h-11 items-center px-4 font-mono text-xs uppercase tracking-[0.08em] text-muted"
                    >
                      {t.nav[id]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
