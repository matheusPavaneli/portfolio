"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import en from "@/messages/en.json";
import ptBr from "@/messages/pt-Br.json";

export type Locale = "en" | "pt-Br";

const messages: Record<Locale, typeof en> = { en, "pt-Br": ptBr };

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  isTransitioning: boolean;
} | null>(null);

const STORAGE_KEY = "portfolio-locale";

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);
  // Locale transition: fade out (150ms) → swap locale → fade in (200ms)
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "pt-Br") setLocaleState(stored);
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLocaleState(l);
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
      setTimeout(() => setIsTransitioning(false), 200);
    }, 150);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const str = getNested(messages[locale] as Record<string, unknown>, key);
      return str ?? key;
    },
    [locale]
  );

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "en", setLocale, t, isTransitioning: false }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isTransitioning }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
