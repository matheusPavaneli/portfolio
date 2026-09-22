import { Languages, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import { href } from "@/lib/href";
import { LOCALE_LABEL, otherLocale, type Locale, type Messages } from "@/i18n";

const SECTIONS = ["cases", "build", "method", "record", "references", "contact"] as const;

export function Rail({ locale, t }: { locale: Locale; t: Messages }) {
  const other = otherLocale(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg px-4 md:px-8">
      <div className="mx-auto flex h-14 max-w-shell items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <a href={href(`/${locale}/`)} className="shrink-0 text-body font-medium text-text">
            <span className="sm:hidden">{profile.initials}</span>
            <span className="hidden sm:inline">{profile.name}</span>
          </a>
          <p className="m-0 hidden min-w-0 items-center gap-2 sm:flex">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent-fill" />
            <span className="label truncate text-text-muted">
              {t.masthead.stripStatusValue}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <nav aria-label={t.a11y.mainNav} className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-5 p-0">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="nav-item label inline-flex h-8 items-center">
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={href(`/${other}/`)}
              hrefLang={other === "pt" ? "pt-BR" : "en"}
              lang={other === "pt" ? "pt-BR" : "en"}
              className="control label inline-flex h-10 items-center gap-2 rounded-sm px-3 text-text-muted"
            >
              <Languages aria-hidden size={15} strokeWidth={1.5} />
              {LOCALE_LABEL[other]}
              <span className="sr-only"> — {t.a11y.toOtherLocale}</span>
            </a>

            <ThemeToggle toLight={t.a11y.toLight} toDark={t.a11y.toDark} />

            <details className="group relative lg:hidden">
              <summary className="control ledger-summary inline-flex size-10 items-center justify-center rounded-sm text-text-muted">
                <Menu aria-hidden size={18} strokeWidth={1.5} />
                <span className="sr-only">{t.a11y.openMenu}</span>
              </summary>
              <nav
                aria-label={t.a11y.mainNav}
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-md border border-line bg-surface-raised"
              >
                <ul className="m-0 list-none p-0">
                  {SECTIONS.map((id) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="nav-item label flex h-11 items-center border-b-0 px-4"
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
      </div>
    </header>
  );
}
