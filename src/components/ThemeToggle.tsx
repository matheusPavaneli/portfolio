"use client";

const STORAGE_KEY = "case-file-theme";

/**
 * The only interactive chrome on the page, and it holds no React state.
 *
 * Which label is showing is decided by CSS from the `data-theme` attribute the inline script
 * already set before paint, so there is nothing to read into state on mount and nothing to
 * re-render. The visible text is the action, which is also the accessible name — no
 * `aria-label` overriding what a reader can see.
 */
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
      // 32 px is the header's declared second control register; the 44 px hit area is padding.
      className="lamp legend inline-flex h-8 items-center text-dim hover:text-ink"
    >
      <span className="u-when-light">
        <span className="hidden lg:inline">{toDark}</span>
        <span className="sr-only lg:hidden">{toDark}</span>
      </span>
      <span className="u-when-dark">
        <span className="hidden lg:inline">{toLight}</span>
        <span className="sr-only lg:hidden">{toLight}</span>
      </span>
    </button>
  );
}
