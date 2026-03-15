"use client";

import { profile } from "@/data/profile";
import { useLocale } from "@/context/LocaleContext";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="relative border-t border-fg-muted/10 bg-surface py-7 sm:py-8 px-6 sm:px-10 md:px-16 lg:px-20 safe-x">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-fg-muted/50">
          © {new Date().getFullYear()} {profile.name} · {t("footer.rights")}
        </p>

        <div className="flex items-center gap-7">
          {[
            { href: profile.github,          label: "GitHub"          },
            { href: profile.linkedin,         label: "LinkedIn"        },
            { href: `mailto:${profile.email}`, label: t("nav.contact") },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-sans text-[10px] tracking-[0.3em] uppercase text-fg-muted/50 hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
