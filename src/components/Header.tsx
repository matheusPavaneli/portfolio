import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import { href } from "@/lib/href";
import { LOCALE_LABEL, LOCALES, type Locale, type Messages } from "@/i18n";

const SECTIONS = ["cases", "instrument", "method", "record", "contact"] as const;

/**
 * The rack's own bezel: a plate that stays at the top with the panel's controls on it.
 *
 * Server-rendered. The mobile disclosure is a native `<details>`, so it is keyboard operable,
 * findable by find-in-page and open before hydration; the only client code up here is the
 * theme switch.
 */
export function Header({ locale, t }: { locale: Locale; t: Messages }) {
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 md:px-8">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-plate bg-plate px-4 py-2.5 ring-1 ring-edge">
        <a href={href(`/${locale}/`)} className="legend text-ink">
          {profile.initials}
        </a>

        <nav aria-label={t.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-5">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="lamp legend inline-flex h-8 items-center text-dim">
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <nav aria-label={t.a11y.language} className="flex items-center gap-2 sm:gap-3">
            {LOCALES.map((code) => (
              <a
                key={code}
                href={href(`/${code}/`)}
                hrefLang={code === "pt" ? "pt-BR" : "en"}
                aria-current={code === locale ? "true" : undefined}
                className="lamp legend inline-flex h-8 items-center text-dim"
              >
                {LOCALE_LABEL[code]}
              </a>
            ))}
          </nav>

          <ThemeToggle toLight={t.a11y.toLight} toDark={t.a11y.toDark} />

          <details className="group relative lg:hidden">
            <summary className="inline-flex size-11 cursor-pointer list-none items-center justify-center rounded-recess text-dim [&::-webkit-details-marker]:hidden">
              <Menu aria-hidden size={17} strokeWidth={2} />
              <span className="sr-only">{t.a11y.openMenu}</span>
            </summary>
            <nav
              aria-label={t.a11y.mainNav}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-plate bg-plate ring-1 ring-edge"
            >
              <ul>
                {SECTIONS.map((id) => (
                  <li key={id}>
                    <a href={`#${id}`} className="lamp legend flex h-11 items-center px-4 text-dim">
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
