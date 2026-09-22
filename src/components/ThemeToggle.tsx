"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "case-file-theme";

export function ThemeToggle({ toLight, toDark }: { toLight: string; toDark: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A browser refusing storage is not a reason to refuse the toggle for this session.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="control inline-flex size-10 items-center justify-center rounded-sm text-text-muted"
    >
      <span className="when-light">
        <Moon aria-hidden size={16} strokeWidth={1.5} />
        <span className="sr-only">{toDark}</span>
      </span>
      <span className="when-dark">
        <Sun aria-hidden size={16} strokeWidth={1.5} />
        <span className="sr-only">{toLight}</span>
      </span>
    </button>
  );
}
