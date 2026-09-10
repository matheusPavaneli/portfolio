/**
 * The structural half of a case: its ordinal, its year, and its one reading.
 *
 * Prose lives in `src/i18n/messages/*`. Numbers live here, once, so the two languages cannot
 * disagree about what happened — the outgoing build kept four hardcoded English kickers next
 * to a translated card and they had already drifted.
 *
 * Every number below traces to something that happened. Nothing here is illustrative.
 */

export type ReadingValue = {
  /** The magnitude, in one unit per reading, used to draw the track to scale. */
  readonly n: number;
  /** What the number is called on the page, unit included. */
  readonly label: string;
};

export type Reading =
  /** Made it faster, smaller, or fewer. */
  | { readonly kind: "delta"; readonly before: ReadingValue; readonly after: ReadingValue }
  /** Held it under a limit the build or the platform enforces. */
  | { readonly kind: "ceiling"; readonly value: ReadingValue; readonly limit: ReadingValue }
  /** Shipped N of them, or needed none. */
  | { readonly kind: "count"; readonly value: ReadingValue };

export type CaseLink = {
  readonly label: string;
  readonly href: string;
};

export type CaseId =
  | "orchestration"
  | "query"
  | "seal"
  | "nanquim"
  | "anchor"
  | "artefacts"
  | "dashboard"
  | "image";

export type Case = {
  readonly id: CaseId;
  readonly ordinal: string;
  readonly year: string;
  readonly reading: Reading;
  readonly stack: readonly string[];
  readonly links: readonly CaseLink[];
};

export const cases: readonly Case[] = [
  {
    id: "orchestration",
    ordinal: "01",
    year: "2025—",
    reading: {
      kind: "delta",
      before: { n: 5, label: "5 models" },
      after: { n: 1, label: "1" },
    },
    stack: ["LLM orchestration", "Multi-agent routing", "Provider failover", "MongoDB", "NestJS"],
    links: [],
  },
  {
    id: "query",
    ordinal: "02",
    year: "2026",
    reading: {
      kind: "delta",
      before: { n: 2000, label: "2 s" },
      after: { n: 150, label: "150 ms" },
    },
    stack: ["PostgreSQL", "EXPLAIN ANALYZE", "autovacuum"],
    links: [],
  },
  {
    id: "seal",
    ordinal: "03",
    year: "2026",
    reading: {
      kind: "count",
      value: { n: 0, label: "0" },
    },
    stack: ["MCP", "Hono", "Drizzle", "PostgreSQL", "Apache-2.0"],
    links: [
      { label: "useseal.dev", href: "https://useseal.dev" },
      { label: "github", href: "https://github.com/useseal/seal" },
      { label: "npm", href: "https://www.npmjs.com/package/@seal-dev/sdk" },
    ],
  },
  {
    id: "nanquim",
    ordinal: "04",
    year: "2026",
    reading: {
      kind: "ceiling",
      value: { n: 12.14, label: "12.14 kB" },
      limit: { n: 12.14, label: "the gate" },
    },
    stack: ["TypeScript", "Shadow DOM", "Pix", "Zero runtime deps"],
    links: [],
  },
  {
    id: "anchor",
    ordinal: "05",
    year: "2026",
    reading: {
      kind: "count",
      value: { n: 8, label: "6–10 weeks" },
    },
    stack: ["Next.js", "Multi-tenant RLS", "Stripe", "Google Ads", "Meta Ads"],
    links: [],
  },
  {
    id: "artefacts",
    ordinal: "06",
    year: "2026",
    reading: {
      kind: "ceiling",
      value: { n: 99, label: "99" },
      limit: { n: 100, label: "100" },
    },
    stack: ["three.js", "GLSL", "GSAP", "Lenis"],
    links: [],
  },
  {
    id: "dashboard",
    ordinal: "07",
    year: "2023—2025",
    reading: {
      kind: "count",
      value: { n: 40, label: "40+ views" },
    },
    stack: ["React", "TypeScript", "Kubernetes"],
    links: [],
  },
  {
    id: "image",
    ordinal: "08",
    year: "2024—2025",
    reading: {
      kind: "delta",
      before: { n: 1900, label: "1.9 GB" },
      after: { n: 210, label: "210 MB" },
    },
    stack: ["Docker", "Multi-stage builds"],
    links: [],
  },
];

/** The three readings the masthead posts before a reader has scrolled anywhere. */
export const headlineCaseIds = ["orchestration", "query", "nanquim"] as const satisfies readonly CaseId[];

export function caseById(id: CaseId): Case {
  const found = cases.find((entry) => entry.id === id);
  if (!found) throw new Error(`no case with id "${id}"`);
  return found;
}
