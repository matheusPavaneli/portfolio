import type { Reading } from "@/content/cases";
import type { Messages } from "@/i18n";

type Props = {
  reading: Reading;
  caption: string;
  t: Messages["reading"];
  /** The masthead posts three readings at a smaller size, without their caption. */
  compact?: boolean;
};

/**
 * The page's signature. Every case posts one measurement here, on the same 1 px track, in
 * one of exactly three forms — a delta, a ceiling, a count — because those are the three
 * shapes an engineering claim takes. There is no fourth form.
 *
 * Lengths are drawn to scale from the numbers in `content/cases.ts`, so the bar is a reading
 * and not a decoration.
 */
export function ReadingBlock({ reading, caption, t, compact = false }: Props) {
  return (
    <figure className="m-0">
      <span
        aria-hidden
        className="block font-mono text-xs uppercase tracking-[0.08em] text-muted"
      >
        {kindLabel(reading, t)}
      </span>

      <div className="mt-3">
        {reading.kind === "delta" ? (
          <DeltaReading reading={reading} t={t} compact={compact} />
        ) : reading.kind === "ceiling" ? (
          <CeilingReading reading={reading} t={t} compact={compact} />
        ) : (
          <CountReading reading={reading} compact={compact} />
        )}
      </div>

      <figcaption
        className={compact ? "sr-only" : "mt-4 max-w-[34ch] text-sm text-muted"}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

function kindLabel(reading: Reading, t: Messages["reading"]): string {
  if (reading.kind === "delta") return t.kindDelta;
  if (reading.kind === "ceiling") return t.kindCeiling;
  return t.kindCount;
}

/** Percentage of the track a magnitude occupies, floored so a tiny value is still visible. */
function share(value: number, against: number): number {
  if (against <= 0) return 100;
  return Math.max(4, Math.min(100, (value / against) * 100));
}

function DeltaReading({
  reading,
  t,
  compact,
}: {
  reading: Extract<Reading, { kind: "delta" }>;
  t: Messages["reading"];
  compact: boolean;
}) {
  const scale = Math.max(reading.before.n, reading.after.n);

  return (
    <div>
      <Row
        label={t.before}
        value={reading.before.label}
        percent={share(reading.before.n, scale)}
        tone="muted"
        compact={compact}
      />
      <Row
        label={t.after}
        value={reading.after.label}
        percent={share(reading.after.n, scale)}
        tone="accent"
        compact={compact}
        animate
      />
    </div>
  );
}

function CeilingReading({
  reading,
  t,
  compact,
}: {
  reading: Extract<Reading, { kind: "ceiling" }>;
  t: Messages["reading"];
  compact: boolean;
}) {
  return (
    <div>
      <Row
        label={t.heldAt}
        value={reading.value.label}
        percent={share(reading.value.n, reading.limit.n)}
        tone="accent"
        compact={compact}
        animate
      />
      <div className="mt-2 flex items-baseline justify-between border-t-2 border-edge pt-2">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {t.limit}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted">{reading.limit.label}</span>
      </div>
    </div>
  );
}

function CountReading({
  reading,
  compact,
}: {
  reading: Extract<Reading, { kind: "count" }>;
  compact: boolean;
}) {
  return (
    <p
      className={`m-0 font-mono tabular-nums text-accent ${compact ? "text-md" : "text-xl"}`}
    >
      {reading.value.label}
    </p>
  );
}

function Row({
  label,
  value,
  percent,
  tone,
  compact,
  animate = false,
}: {
  label: string;
  value: string;
  percent: number;
  tone: "muted" | "accent";
  compact: boolean;
  animate?: boolean;
}) {
  const text = tone === "accent" ? "text-accent" : "text-muted";
  const track = tone === "accent" ? "bg-accent" : "bg-edge";
  const height = tone === "accent" ? "h-0.5" : "h-px";

  return (
    <div className={tone === "accent" ? "mt-3" : ""}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{label}</span>
        <span
          className={`font-mono tabular-nums ${text} ${compact ? "text-sm" : "text-md"}`}
        >
          {value}
        </span>
      </div>
      <div className="mt-1.5 w-full" aria-hidden>
        <div
          className={`${height} ${track} ${animate ? "u-track-fill" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
