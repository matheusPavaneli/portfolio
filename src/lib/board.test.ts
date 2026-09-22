import { describe, expect, it } from "vitest";

import { cases } from "@/content/cases";
import { AXIS_MAX, boardRows, formatRatio, grouped, position, ratioOf, readingRow } from "./board";

describe("the axis", () => {
  it("puts a ratio of 1 at the origin and the maximum at the far end", () => {
    expect(position(1)).toBe(0);
    expect(position(AXIS_MAX)).toBe(1);
  });

  it("is logarithmic: equal ratios are equal distances", () => {
    const first = position(4) - position(2);
    const second = position(8) - position(4);
    expect(first).toBeCloseTo(second, 12);
  });

  it("never runs off either end", () => {
    expect(position(0.1)).toBe(0);
    expect(position(1e6)).toBe(1);
  });

  it("holds every real reading inside the axis, so nothing is clipped", () => {
    for (const row of boardRows()) {
      if (row.ratio === null) continue;
      expect(row.ratio, `${row.id} would clip`).toBeLessThanOrEqual(AXIS_MAX);
    }
  });
});

describe("the rows", () => {
  it("covers every case exactly once", () => {
    const ids = boardRows().map((row) => row.id);
    expect(ids.slice().sort()).toEqual(cases.map((entry) => entry.id).sort());
  });

  it("gives a count no ratio and no axis position, rather than an invented one", () => {
    for (const row of boardRows()) {
      if (row.group !== "counted") continue;
      expect(row.ratio).toBeNull();
      expect(row.position).toBeNull();
      expect(row.from).toBeNull();
    }
  });

  it("orders each group longest first", () => {
    for (const band of grouped()) {
      const ratios = band.rows.map((row) => row.ratio ?? 0);
      expect(ratios).toEqual(ratios.slice().sort((a, b) => b - a));
    }
  });

  it("groups by the kind of evidence the reading actually is", () => {
    const byId = new Map(cases.map((entry) => [entry.id, readingRow(entry).group]));
    expect(byId.get("query")).toBe("moved");
    expect(byId.get("rageval")).toBe("moved");
    expect(byId.get("nanquim")).toBe("held");
    expect(byId.get("seal")).toBe("counted");
    expect(byId.get("orchestration")).toBe("moved");
  });

  it("plots only what moved; a held ceiling is stated, not drawn at the origin", () => {
    for (const row of boardRows()) {
      if (row.group === "moved") expect(row.position, row.id).not.toBeNull();
      else expect(row.position, row.id).toBeNull();
    }
  });
});

describe("the ratio column", () => {
  it("keeps a fixed width of significant figures so the column stays even", () => {
    expect(formatRatio(13.333)).toBe("13.3×");
    expect(formatRatio(9.0476)).toBe("9.05×");
    expect(formatRatio(1)).toBe("1.00×");
  });
});

describe("ratioOf", () => {
  it("takes a ratio from a delta's two real magnitudes", () => {
    const query = cases.find((entry) => entry.id === "query");
    expect(query).toBeDefined();
    expect(ratioOf(query!.reading)).toBeCloseTo(2000 / 150, 6);
  });

  it("takes a ratio from a ceiling's value against its limit", () => {
    const nanquim = cases.find((entry) => entry.id === "nanquim");
    expect(ratioOf(nanquim!.reading)).toBe(1);
  });

  it("refuses a count, because one number has no ratio", () => {
    for (const id of ["seal", "anchor", "dashboard"] as const) {
      const entry = cases.find((c) => c.id === id);
      expect(ratioOf(entry!.reading), `${id} should have no ratio`).toBeNull();
    }
  });
});

describe("a reduction", () => {
  it("turns a 90% latency cut into a 10x ratio, not an invented before and after", () => {
    const orchestration = cases.find((entry) => entry.id === "orchestration");
    expect(orchestration).toBeDefined();
    expect(ratioOf(orchestration!.reading)).toBeCloseTo(10, 9);
    const row = readingRow(orchestration!);
    expect(row.from).toBeNull();
    expect(row.to).toBe("−90% latency");
  });

  it("refuses a reduction of 0% or 100%, which has no finite ratio", () => {
    expect(ratioOf({ kind: "reduction", percent: 0, label: "" })).toBeNull();
    expect(ratioOf({ kind: "reduction", percent: 100, label: "" })).toBeNull();
  });
});
