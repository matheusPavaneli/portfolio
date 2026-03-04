"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { profile } from "@/data/profile";

const navKeys = [
  { href: "#hero", key: "nav.home" },
  { href: "#about", key: "nav.about" },
  { href: "#experience", key: "nav.experience" },
  { href: "#education", key: "nav.education" },
  { href: "#skills", key: "nav.skills" },
  { href: "#projects", key: "nav.projects" },
  { href: "#contact", key: "nav.contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto safe-top ${
        scrolled
          ? "bg-surface/80 backdrop-blur-sm border-b border-fg-muted/10 py-3"
          : "py-4 xs:py-5"
      }`}
    >
      <div className="flex items-center justify-between px-4 xs:px-5 sm:px-6 md:px-10 max-w-6xl mx-auto 2xl:max-w-7xl">
        <Link
          href="#hero"
          className="logo-letters font-mono text-sm tracking-widest text-fg-muted hover:text-accent transition-colors uppercase"
        >
          {profile.name.split(" ").map((n) => n[0]).join("")}
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navKeys.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link-underline font-mono text-xs tracking-wide text-fg-muted hover:text-accent transition-colors uppercase"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden min-w-[44px] min-h-[44px] w-11 h-11 flex flex-col justify-center items-center gap-1 text-fg-muted hover:text-fg -mr-2"
            aria-label="Menu"
          >
            <span
              className={`block h-px bg-current transition-transform ${
                open ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-transform ${
                open ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-surface pt-24 px-4 xs:px-6 pb-8 safe-bottom flex flex-col gap-0 border-t border-fg-muted/10 safe-top safe-x overflow-y-auto"
          >
            {navKeys.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] py-3 px-1 items-center font-mono text-sm text-fg-muted hover:text-accent uppercase tracking-wide border-b border-fg-muted/5"
                >
                  {t(item.key)}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
