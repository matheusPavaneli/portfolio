"use client";

import { useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";

export function LangSync() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale === "pt-Br" ? "pt-BR" : "en";
  }, [locale]);
  return null;
}
