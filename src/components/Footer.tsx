"use client";

import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative border-t border-fg-muted/10 bg-surface-elevated py-10 xs:py-12 md:py-14 px-4 xs:px-5 sm:px-6 md:px-12 lg:px-20 safe-x">
      <div className="absolute top-0 left-0 right-0 h-px bg-accent/50" aria-hidden />
      <div className="max-w-6xl 2xl:max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pl-[clamp(3.5rem,14vw,9rem)]">
        <p className="text-sm text-fg-muted font-mono">
          © {new Date().getFullYear()} Matheus Pavaneli · {t("footer.rights")}
        </p>
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6 md:gap-8">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center text-sm text-fg-muted hover:text-accent transition-colors font-mono py-2"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center text-sm text-fg-muted hover:text-accent transition-colors font-mono py-2"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="min-h-[44px] inline-flex items-center text-sm text-fg-muted hover:text-accent transition-colors font-mono py-2"
          >
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
