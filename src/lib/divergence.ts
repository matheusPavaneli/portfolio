import { cases, type Case, type CaseId, type Reading } from "@/content/cases";

/**
 * The numbers the divergence field is drawn from.
 *
 * The effect's whole claim is that its parameters map to real quantities, so this is where
 * that mapping lives and where it can be tested. Nothing here is tuned by eye: the ratio is
 * arithmetic over the same values `Reading` renders, and a case with only one magnitude is
 * excluded rather than given an invented second one.
 */

export type Driver = {
  readonly id: CaseId;
  /** A delta is read as before/after; a ceiling is read as limit/held-at. */
  readonly kind: "delta" | "ceiling";
  /** before ÷ after for a delta, value ÷ limit for a ceiling. 1 means perfect registration. */
  readonly ratio: number;
  readonly before: string;
  readonly after: string;
};

/** A count carries one number, so it has no divergence to show. */
export function ratioOf(reading: Reading): number | null {
  if (reading.kind === "delta") {
    if (reading.after.n <= 0 || reading.before.n <= 0) return null;
    return reading.before.n / reading.after.n;
  }
  if (reading.kind === "ceiling") {
    if (reading.limit.n <= 0 || reading.value.n <= 0) return null;
    // Held at or under the limit either way; the field only cares how far apart they are.
    return Math.max(reading.value.n, reading.limit.n) / Math.min(reading.value.n, reading.limit.n);
  }
  return null;
}

function endpoints(reading: Reading): { before: string; after: string } | null {
  if (reading.kind === "delta") {
    return { before: reading.before.label, after: reading.after.label };
  }
  if (reading.kind === "ceiling") {
    return { before: reading.limit.label, after: reading.value.label };
  }
  return null;
}

export function driversFrom(entries: readonly Case[] = cases): readonly Driver[] {
  const drivers: Driver[] = [];
  for (const entry of entries) {
    const ratio = ratioOf(entry.reading);
    const ends = endpoints(entry.reading);
    if (ratio === null || ends === null) continue;
    drivers.push({
      id: entry.id,
      kind: entry.reading.kind === "ceiling" ? "ceiling" : "delta",
      ratio,
      before: ends.before,
      after: ends.after,
    });
  }
  return drivers;
}

export const drivers = driversFrom();

/** The cases the band names but does not draw, because they carry a single number. */
export const singleValueCaseIds: readonly CaseId[] = cases
  .filter((entry) => ratioOf(entry.reading) === null)
  .map((entry) => entry.id);

/**
 * Ratio to the second grid's pitch and angle.
 *
 * Both are monotonic in the ratio and both are bounded, so a 13× delta cannot rotate the
 * grid past the point where the interference stops being readable as interference. A ratio
 * of exactly 1 returns the first grid unchanged — no pitch difference, no angle, no moiré.
 */
/**
 * The ruling's period in CSS pixels. Shared by the shader and by the CSS fallback, so the two
 * cannot disagree about what the same grid is. Sized against the recess: finer than this and
 * the rulings stop reading as rulings and the beat is lost in the mesh.
 */
export const GRID_PITCH = 26;

export function gridFor(ratio: number): { pitch: number; angle: number } {
  const spread = Math.log(Math.max(ratio, 1)) / Math.log(16);
  return {
    // The beat spacing is roughly the pitch divided by the disagreement, so these bounds are
    // set by legibility, not by taste: at 3 % and 1.4° the bands are a few hundred pixels
    // wide and read as bands. Past about 6 % they collapse into a texture and the effect
    // stops showing anything.
    pitch: 1 + Math.min(spread, 1) * 0.03,
    angle: Math.min(spread, 1) * 1.4,
  };
}
