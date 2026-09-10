import { describe, expect, it } from "vitest";

import { cases } from "@/content/cases";
import { driversFrom, gridFor, ratioOf, singleValueCaseIds } from "./divergence";

/**
 * The effect spec in `.unique/contract.md` says every parameter maps to a real quantity.
 * This is where that is enforced: a ratio tuned by eye, or a case given an invented second
 * magnitude, fails here rather than shipping as decoration wearing a data costume.
 */

describe("what drives the field", () => {
  it("takes a ratio from a delta's two real magnitudes", () => {
    const query = cases.find((entry) => entry.id === "query");
    expect(query).toBeDefined();
    // 2 s against 150 ms, straight out of the case, not out of a designer's hand.
    expect(ratioOf(query!.reading)).toBeCloseTo(2000 / 150, 6);
  });

  it("takes a ratio from a ceiling's value against its limit", () => {
    const nanquim = cases.find((entry) => entry.id === "nanquim");
    // 12.14 kB held exactly at the gate: perfect registration, and no interference at all.
    expect(ratioOf(nanquim!.reading)).toBe(1);
  });

  it("refuses a count, because one number has no divergence", () => {
    for (const id of ["seal", "anchor", "dashboard"] as const) {
      const entry = cases.find((c) => c.id === id);
      expect(ratioOf(entry!.reading), `${id} should not drive the field`).toBeNull();
    }
  });

  it("names every excluded case rather than dropping it silently", () => {
    expect([...singleValueCaseIds].sort()).toEqual(["anchor", "dashboard", "seal"]);
  });

  it("drives the field from exactly the cases that carry two magnitudes", () => {
    expect(driversFrom().map((driver) => driver.id)).toEqual([
      "orchestration",
      "query",
      "nanquim",
      "artefacts",
      "image",
    ]);
  });

  it("every driver carries the labels the reading itself prints", () => {
    const query = driversFrom().find((driver) => driver.id === "query");
    expect(query?.before).toBe("2 s");
    expect(query?.after).toBe("150 ms");
  });

  it("keeps a ceiling readable as a ceiling, not as a before and an after", () => {
    const nanquim = driversFrom().find((driver) => driver.id === "nanquim");
    expect(nanquim?.kind).toBe("ceiling");
    expect(nanquim?.before).toBe("the gate");
    expect(nanquim?.after).toBe("12.14 kB");
  });
});

describe("ratio to geometry", () => {
  it("returns the first grid unchanged when there is nothing to diverge", () => {
    expect(gridFor(1)).toEqual({ pitch: 1, angle: 0 });
  });

  it("is monotonic: a bigger ratio never produces a smaller disagreement", () => {
    const ratios = [1, 1.5, 5, 9.05, 13.33, 40];
    const pitches = ratios.map((r) => gridFor(r).pitch);
    const angles = ratios.map((r) => gridFor(r).angle);
    for (let i = 1; i < ratios.length; i += 1) {
      expect(pitches[i]!).toBeGreaterThanOrEqual(pitches[i - 1]!);
      expect(angles[i]!).toBeGreaterThanOrEqual(angles[i - 1]!);
    }
  });

  it("stays inside the range where a beat is still readable as a beat", () => {
    for (const ratio of [1, 13.33, 1000, Number.MAX_SAFE_INTEGER]) {
      const { pitch, angle } = gridFor(ratio);
      expect(pitch).toBeLessThanOrEqual(1.03);
      expect(angle).toBeLessThanOrEqual(1.4);
      expect(Number.isFinite(pitch) && Number.isFinite(angle)).toBe(true);
    }
  });

  it("holds a ratio below one at rest rather than inverting the grid", () => {
    expect(gridFor(0.5)).toEqual({ pitch: 1, angle: 0 });
  });
});
