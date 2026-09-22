import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  readout,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  readout?: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-4 py-16 md:px-8 md:py-24 ${className}`}>
      <div className="mx-auto max-w-shell">
        <div className="flex items-baseline justify-between gap-6 border-b border-line pb-3">
          <p className="label m-0 text-text-muted">{eyebrow}</p>
          {readout ? (
            <p className="label m-0 shrink-0 tabular-nums text-text-muted">{readout}</p>
          ) : null}
        </div>

        <h2 className="measure-tight m-0 mt-8 text-h1 text-text">{title}</h2>
        {lede ? <p className="measure m-0 mt-4 text-body-lg text-text-muted">{lede}</p> : null}

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
