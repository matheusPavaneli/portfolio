import type { Years } from "@/content/cases";

const RANGE = " – ";

export function formatYears([from, to]: Years, present: string): string {
  if (to === from) return `${from}`;
  return `${from}${RANGE}${to ?? present}`;
}

function month(value: string, intl: string): string {
  const [year, index] = value.split("-").map(Number);
  if (!year || !index) throw new Error(`"${value}" is not a YYYY-MM month`);
  const label = new Intl.DateTimeFormat(intl, { month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, index - 1, 1)))
    .replace(".", "");
  return `${label} ${year}`;
}

export function formatMonths(from: string, to: string | null, intl: string, present: string): string {
  return `${month(from, intl)}${RANGE}${to === null ? present : month(to, intl)}`;
}

