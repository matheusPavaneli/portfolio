import { describe, expect, it } from "vitest";

import { formatMonths, formatYears } from "./dates";

describe("formatYears", () => {
  it("prints a single year once", () => {
    expect(formatYears([2026, 2026], "now")).toBe("2026");
  });

  it("uses one en dash for every range, and the locale's word for a running one", () => {
    expect(formatYears([2023, 2025], "now")).toBe("2023 – 2025");
    expect(formatYears([2025, null], "hoje")).toBe("2025 – hoje");
  });
});

describe("formatMonths", () => {
  it("names months in the page's language", () => {
    expect(formatMonths("2024-10", "2025-06", "en-US", "now")).toBe("Oct 2024 – Jun 2025");
    expect(formatMonths("2024-10", "2025-06", "pt-BR", "hoje")).toBe("out 2024 – jun 2025");
  });

  it("refuses a month that is not YYYY-MM rather than printing NaN", () => {
    expect(() => formatMonths("Oct 2024", null, "en-US", "now")).toThrow();
  });
});

