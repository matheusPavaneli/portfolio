import type { ReactNode } from "react";

/**
 * One module in the rack.
 *
 * A panel is not a page of bands: it is plates of different sizes screwed to a sheet, each
 * with its legend silkscreened on the bezel and its readout in the corner. That is where the
 * density variation comes from — the modules are genuinely different sizes, rather than one
 * section repeated with different words in it.
 */
export function Module({
  legend,
  readout,
  ground = "plate",
  as: Tag = "section",
  className = "",
  bodyClassName = "",
  children,
  ...rest
}: {
  legend?: ReactNode;
  readout?: ReactNode;
  /** A recess is where a meter face or a screen is sunk in. */
  ground?: "plate" | "recess" | "sheet";
  as?: "section" | "article" | "div" | "li";
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "children">) {
  const grounds = {
    plate: "bg-plate text-ink ring-1 ring-edge",
    recess: "bg-recess text-on-recess ring-1 ring-edge",
    sheet: "bg-page text-ink ring-1 ring-edge",
  } as const;

  return (
    <Tag className={`rounded-plate ${grounds[ground]} ${className}`} {...rest}>
      {legend || readout ? (
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3.5 md:px-5 ${
            ground === "recess" ? "text-dim-recess" : "text-dim"
          }`}
        >
          {legend ? <p className="legend m-0">{legend}</p> : <span />}
          {readout ? (
            <p className="m-0 font-readout text-xs tabular-nums">{readout}</p>
          ) : null}
        </div>
      ) : null}
      <div className={`px-4 pb-5 pt-3 md:px-5 ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
