import { AXIS_TICKS, AXIS_MAX, formatRatio, grouped, position, type BoardRow } from "@/lib/board";
import type { Messages } from "@/i18n";

export function DeltaBoard({ t }: { t: Messages }) {
  const bands = grouped();
  const groupLabel = {
    moved: t.board.groupMoved,
    held: t.board.groupHeld,
    counted: t.board.groupCounted,
  } as const;

  let index = 0;

  return (
    <figure
      className="m-0 rounded-md border border-line bg-surface"
      aria-labelledby="board-caption"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-4 py-3 md:px-6">
        <p className="label m-0 text-text-muted">{t.board.eyebrow}</p>
        <p className="label m-0 text-text-muted">{t.board.axisLabel}</p>
      </div>

      <div className="px-4 pt-4 md:px-6">
        <div className="grid grid-cols-1 items-end gap-x-5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_4.75rem]">
          <span className="hidden md:block" />
          <div className="relative h-4">
            {AXIS_TICKS.map((tick) => {
              const at = position(tick);
              const align = at === 0 ? "translate-x-0" : at === 1 ? "-translate-x-full" : "-translate-x-1/2";
              return (
                <span
                  key={tick}
                  className={`label absolute bottom-0 text-text-muted ${align}`}
                  style={{ left: `${at * 100}%` }}
                >
                  {tick}×
                </span>
              );
            })}
          </div>
          <span className="hidden md:block" />
        </div>
      </div>

      <div className="px-4 pb-5 pt-4 md:px-6 md:pb-6">
        {bands.map((band) => (
          <section key={band.group} className="mt-6 first:mt-0">
            <h3 className="label m-0 text-text-muted">{groupLabel[band.group]}</h3>
            {band.group === "moved" ? null : (
              <p className="measure-tight m-0 mt-1 text-small text-text-muted">
                {band.group === "held" ? t.board.heldNote : t.board.countedNote}
              </p>
            )}

            <ul className="m-0 mt-2 list-none p-0">
              {band.rows.map((row) => (
                <li key={row.id}>
                  <Row row={row} t={t} delay={index++ * 70} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <figcaption id="board-caption" className="sr-only">
        {t.board.figureLabel}
      </figcaption>
    </figure>
  );
}

function Row({ row, t, delay }: { row: BoardRow; t: Messages; delay: number }) {
  const copy = t.cases[row.id];

  return (
    <a
      href={`#case-${row.id}`}
      className="board-row -mx-2 grid grid-cols-1 items-baseline gap-x-5 gap-y-1.5 rounded-sm px-2 py-2.5 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_4.75rem]"
    >
      <span className="min-w-0">
        <span className="block truncate text-body text-text">{copy.name}</span>
        {row.group === "moved" ? (
          <span className="mt-0.5 block font-mono text-small text-text-muted">
            {row.from === null ? row.to : `${row.from} → ${row.to}`}
          </span>
        ) : null}
      </span>

      {row.group === "moved" ? (
        <Track row={row} delay={delay} />
      ) : (
        <span className="font-mono tabular-nums">
          <span className="text-h3 text-accent">{row.to}</span>
          {row.group === "held" ? (
            <span className="text-small text-text-muted"> ≤ {row.from}</span>
          ) : null}
        </span>
      )}

      <span
        className={`font-mono text-small tabular-nums md:text-right ${
          row.group === "moved" ? "text-accent" : "hidden text-text-muted md:block"
        }`}
      >
        {row.group === "moved" && row.ratio !== null
          ? formatRatio(row.ratio)
          : row.group === "held"
            ? t.board.held
            : "—"}
        {row.group === "counted" ? <span className="sr-only">{t.board.single}</span> : null}
      </span>
    </a>
  );
}

function Track({ row, delay }: { row: BoardRow; delay: number }) {
  const travel = (row.position ?? 0) * 100;
  const held = travel < 1.5;

  return (
    <span className="relative block h-7 self-center">
      {AXIS_TICKS.map((tick) => (
        <span
          key={tick}
          aria-hidden
          className={`absolute inset-y-0 w-px ${
            tick === 1 || tick === AXIS_MAX ? "bg-line-control" : "bg-line"
          }`}
          style={{ left: `${position(tick) * 100}%` }}
        />
      ))}

      {held ? null : (
        <span
          aria-hidden
          className="board-bar absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full bg-accent"
          style={{ width: `${travel}%`, animationDelay: `${delay}ms` }}
        />
      )}

      <span
        aria-hidden
        className="board-label absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ left: `${travel}%`, ["--board-delay" as string]: `${delay}ms` }}
      />
    </span>
  );
}
