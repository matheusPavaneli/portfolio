"use client";

import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/context/LocaleContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  );
}
