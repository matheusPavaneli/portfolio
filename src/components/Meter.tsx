import type { Reading } from "@/content/cases";
import type { Messages } from "@/i18n";

/**
 * The signature: a real meter, not a bar.
 *
 * The scale is logarithmic and spans a fixed three decades, which is the decision that makes
 * the whole page comparable. On a log scale equal ratios are equal distances, so the gap
 * between the two needles *is* the case's ratio — a 13.3× improvement is visibly wider than a
 * 5× one, across cases, without any of them being rescaled to look good. A value held exactly
 * at its limit puts both needles in the same place and the gap closes to nothing.
 *
 * A count has one number and no gap to draw, so it gets a counter instead. Forcing it onto a
 * scale would have meant inventing a second magnitude for it.
 */

const DECADES = 3;

/** Position on the track, 0–1, from a magnitude and the scale's geometric centre. */
function place(value: number, centre: number): number {
  const offset = Math.log10(value / centre) / DECADES;
  return Math.min(1, Math.max(0, 0.5 + offset));
}

type Props = {
  reading: Reading;
  t: Messages["reading"];
  /** On a recess the ramp inverts: the same ink at the other end of the ground. */
  on?: "plate" | "recess";
};

export function Meter({ reading, t, on = "plate" }: Props) {
  const tone = {
    tick: on === "recess" ? "text-dim-recess" : "text-edge",
    dim: on === "recess" ? "text-dim-recess" : "text-dim",
    ink: on === "recess" ? "text-on-recess" : "text-ink",
    signal: on === "recess" ? "text-signal-recess" : "text-signal",
  };

  if (reading.kind === "count") {
    return (
      <div>
        <p className={`m-0 font-readout text-2xl tabular-nums ${tone.signal}`}>
          {reading.value.label}
        </p>
        <p className={`legend m-0 mt-2 ${tone.dim}`}>{t.kindCount}</p>
      </div>
    );
  }

  const [low, high] =
    reading.kind === "delta"
      ? [reading.after, reading.before]
      : [reading.value, reading.limit];

  const centre = Math.sqrt(Math.max(low.n, 1e-9) * Math.max(high.n, 1e-9));
  const a = place(low.n, centre);
  const b = place(high.n, centre);
  const left = Math.min(a, b);
  const width = Math.abs(b - a);

  // Both needles in the same place means there was nothing to diverge: one label, not two.
  const coincident = width < 0.06;

  return (
    <div>
      <div className="relative">
        <svg
          viewBox="0 0 300 22"
          preserveAspectRatio="none"
          aria-hidden
          className="block h-[22px] w-full"
        >
          {/* The scale: a major graduation each decade, a minor each tenth of one. */}
          {Array.from({ length: DECADES * 10 + 1 }, (_, i) => {
            const major = i % 10 === 0;
            const x = (i / (DECADES * 10)) * 300;
            return (
              <line
                key={i}
                x1={x}
                x2={x}
                y1={major ? 1 : 6}
                y2={12}
                stroke="currentColor"
                strokeWidth={major ? 1.4 : 0.8}
                className={tone.tick}
              />
            );
          })}

          {/* The travel: the distance the value moved, which on this scale is the ratio. */}
          <rect
            x={left * 300}
            y={16}
            width={Math.max(width * 300, 0)}
            height={3}
            fill="currentColor"
            className={tone.signal}
          />

          {/* Where it started, and where it ended. */}
          <path
            d={`M ${b * 300} 13 l -4 -6 l 8 0 z`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            className={tone.tick}
          />
          <path d={`M ${a * 300} 13 l -5 -7 l 10 0 z`} fill="currentColor" className={tone.signal} />
        </svg>

        {/* Labels sit under their own needle, the way a scale is engraved — not in a header
            row, where the reading and the position can disagree. */}
        <div className="relative mt-1 h-6">
          {coincident ? (
            <span
              className={`absolute -translate-x-1/2 whitespace-nowrap font-readout text-sm tabular-nums ${tone.signal}`}
              style={{ left: `clamp(0%, ${a * 100}%, 100%)` }}
            >
              {low.label}
            </span>
          ) : (
            <>
              <span
                className={`absolute -translate-x-1/2 whitespace-nowrap font-readout text-md tabular-nums ${tone.signal}`}
                style={{ left: `clamp(0%, ${a * 100}%, 100%)` }}
              >
                {low.label}
              </span>
              <span
                className={`absolute -translate-x-1/2 whitespace-nowrap font-readout text-sm tabular-nums ${tone.dim}`}
                style={{ left: `clamp(0%, ${b * 100}%, 100%)` }}
              >
                {high.label}
              </span>
            </>
          )}
        </div>
      </div>

      <p className={`legend m-0 mt-3 ${tone.dim}`}>
        {reading.kind === "delta" ? t.kindDelta : t.kindCeiling}
      </p>
    </div>
  );
}
