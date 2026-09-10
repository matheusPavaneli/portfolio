/**
 * 13 px mono, uppercase, +0.08em, followed by a 24 px rule. One of the five recognized
 * components in `.unique/contract.md`. The tracking is 0.08em and not 0.45em, and the size
 * is the page's 13 px floor and not 7 px.
 */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
      <span>{children}</span>
      <span aria-hidden className="h-px w-6 bg-edge" />
    </p>
  );
}
