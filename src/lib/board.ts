import { cases, type Case, type CaseId, type Reading, type Years } from "@/content/cases";

export function ratioOf(reading: Reading): number | null {
  if (reading.kind === "delta") {
    if (reading.after.n <= 0 || reading.before.n <= 0) return null;
    return reading.before.n / reading.after.n;
  }
  if (reading.kind === "reduction") {
    if (reading.percent <= 0 || reading.percent >= 100) return null;
    return 100 / (100 - reading.percent);
  }
  if (reading.kind === "ceiling") {
    if (reading.limit.n <= 0 || reading.value.n <= 0) return null;
    return Math.max(reading.value.n, reading.limit.n) / Math.min(reading.value.n, reading.limit.n);
  }
  return null;
}

export const AXIS_MAX = 20;

export const AXIS_TICKS = [1, 2, 5, 10, 20] as const;

export type BoardGroup = "moved" | "held" | "counted";

export type BoardRow = {
  readonly id: CaseId;
  readonly group: BoardGroup;
  readonly ratio: number | null;
  readonly position: number | null;
  readonly from: string | null;
  readonly to: string;
  readonly years: Years;
};

export function position(ratio: number): number {
  const clamped = Math.min(Math.max(ratio, 1), AXIS_MAX);
  return Math.log10(clamped) / Math.log10(AXIS_MAX);
}

export function formatRatio(ratio: number): string {
  return `${ratio >= 10 ? ratio.toFixed(1) : ratio.toFixed(2)}×`;
}

export function readingText(row: BoardRow): string {
  if (row.from === null) return row.to;
  return row.group === "held" ? `${row.to} ≤ ${row.from}` : `${row.from} → ${row.to}`;
}

export function readingRow(entry: Case): BoardRow {
  const { reading } = entry;

  if (reading.kind === "count") {
    return {
      id: entry.id,
      group: "counted",
      ratio: null,
      position: null,
      from: null,
      to: reading.value.label,
      years: entry.years,
    };
  }

  const ratio = ratioOf(reading);
  if (ratio === null) throw new Error(`case "${entry.id}" has a reading with no ratio`);

  if (reading.kind === "reduction") {
    return {
      id: entry.id,
      group: "moved",
      ratio,
      position: position(ratio),
      from: null,
      to: reading.label,
      years: entry.years,
    };
  }

  if (reading.kind === "ceiling") {
    return {
      id: entry.id,
      group: "held",
      ratio,
      position: null,
      from: reading.limit.label,
      to: reading.value.label,
      years: entry.years,
    };
  }

  return {
    id: entry.id,
    group: "moved",
    ratio,
    position: position(ratio),
    from: reading.before.label,
    to: reading.after.label,
    years: entry.years,
  };
}

const ORDER: Record<BoardGroup, number> = { moved: 0, held: 1, counted: 2 };

export function boardRows(entries: readonly Case[] = cases): readonly BoardRow[] {
  return entries
    .map(readingRow)
    .sort((a, b) => ORDER[a.group] - ORDER[b.group] || (b.ratio ?? 0) - (a.ratio ?? 0));
}

export const rows = boardRows();

export function grouped(
  entries: readonly BoardRow[] = rows,
): readonly { group: BoardGroup; rows: readonly BoardRow[] }[] {
  return (["moved", "held", "counted"] as const)
    .map((group) => ({ group, rows: entries.filter((row) => row.group === group) }))
    .filter((band) => band.rows.length > 0);
}
