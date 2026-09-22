import type { CaseId } from "@/content/cases";

export const METHOD = [
  { id: "instrument", paidBy: "query" },
  { id: "vendor", paidBy: "orchestration" },
  { id: "gate", paidBy: "nanquim" },
  { id: "live", paidBy: "dashboard" },
  { id: "standard", paidBy: null },
  { id: "illegal", paidBy: "nanquim" },
] as const satisfies readonly { id: string; paidBy: CaseId | null }[];
