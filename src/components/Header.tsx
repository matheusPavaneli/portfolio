"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { profile } from "@/data/profile";

const navKeys = [
  { href: "#about",      key: "nav.about" },
  { href: "#experience", key: "nav.experience" },
  { href: "#skills",     key: "nav.skills" },
  { href: "#projects",   key: "nav.projects" },
  { href: "#contact",    key: "nav.contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { t } = useLocale();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // D1 — Active section indicator
  useEffect(() => {
    const ids = navKeys.map((n) => n.href.slice(1));
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.4, rootMargin: "-20% 0px -20% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto safe-top ${
        scrolled
          ? "bg-surface/88 backdrop-blur-md border-b border-fg-muted/10"
          : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 py-4 xs:py-5 max-w-5xl mx-auto">

        {/* Logo — initials */}
        <Link
          href="#hero"
          className="logo-letters font-sans text-[10px] tracking-[0.4em] text-fg-muted hover:text-accent transition-colors uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {profile.name.split(" ").map((n) => n[0]).join("")}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label={t("a11y.mainNav")}>
          {navKeys.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link-underline relative font-sans text-[10px] tracking-[0.35em] text-fg-muted hover:text-fg transition-colors duration-200 uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {t(item.key)}
                {isActive && (
                  <span
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent transition-all duration-200"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden min-w-[44px] min-h-[44px] w-11 h-11 flex flex-col justify-center items-center gap-[5px] text-fg-muted hover:text-fg -mr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={t("a11y.menu")}
            aria-expanded={open}
          >
            <span
              className={`block w-[18px] h-px bg-current transition-all duration-300 origin-center ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-[18px] h-px bg-current transition-all duration-300 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-[18px] h-px bg-current transition-all duration-300 origin-center ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="md:hidden bg-surface border-t border-fg-muted/10 px-6 pb-8 pt-2 safe-bottom safe-x"
          >
            {navKeys.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] py-3 items-center font-sans text-[10px] tracking-[0.3em] uppercase text-fg-muted hover:text-accent border-b border-fg-muted/8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
