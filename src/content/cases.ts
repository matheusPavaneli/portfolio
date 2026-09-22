export type ReadingValue = {
  readonly n: number;
  readonly label: string;
};

export type Reading =
  | { readonly kind: "delta"; readonly before: ReadingValue; readonly after: ReadingValue }
  /** Held it under a limit the build or the platform enforces. */
  | { readonly kind: "ceiling"; readonly value: ReadingValue; readonly limit: ReadingValue }
  /** Shipped N of them, or needed none. */
  | { readonly kind: "count"; readonly value: ReadingValue }
  | { readonly kind: "reduction"; readonly percent: number; readonly label: string };

export type ProjectStatus = "published";

export type Origin =
  | { readonly kind: "production" }
  | { readonly kind: "own"; readonly status: ProjectStatus };

export type CaseLink = {
  readonly label: string;
  readonly href: string;
};

export type Years = readonly [from: number, to: number | null];

export type CaseId =
  | "orchestration"
  | "rageval"
  | "query"
  | "seal"
  | "nanquim"
  | "anchor"
  | "artefacts"
  | "dashboard"
  | "image";

export type Case = {
  readonly id: CaseId;
  readonly years: Years;
  readonly origin: Origin;
  readonly reading: Reading;
  readonly stack: readonly string[];
  readonly links: readonly CaseLink[];
};

export const cases: readonly Case[] = [
  {
    id: "orchestration",
    years: [2025, null],
    origin: { kind: "production" },
    reading: {
      kind: "reduction",
      percent: 90,
      label: "−90% latency",
    },
    stack: ["LLM orchestration", "Multi-agent routing", "Provider failover", "MongoDB", "NestJS"],
    links: [],
  },
  {
    id: "rageval",
    years: [2026, 2026],
    origin: { kind: "own", status: "published" },
    reading: {
      kind: "delta",
      before: { n: 847, label: "847 chars" },
      after: { n: 104, label: "104" },
    },
    stack: ["Python", "PostgreSQL", "BM25", "Gemini embeddings", "Cross-encoder reranking", "Astro"],
    links: [
      { label: "citation viewer", href: "https://matheuspavaneli.github.io/rag-eval/" },
      { label: "github", href: "https://github.com/matheusPavaneli/rag-eval" },
    ],
  },
  {
    id: "query",
    years: [2026, 2026],
    origin: { kind: "production" },
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
    years: [2026, 2026],
    origin: { kind: "own", status: "published" },
    reading: {
      kind: "count",
      value: { n: 0, label: "0 lines" },
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
    years: [2026, 2026],
    origin: { kind: "own", status: "published" },
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
    years: [2026, 2026],
    origin: { kind: "own", status: "published" },
    reading: {
      kind: "count",
      value: { n: 8, label: "6–10 weeks" },
    },
    stack: ["Next.js", "Multi-tenant RLS", "Stripe", "Google Ads", "Meta Ads"],
    links: [],
  },
  {
    id: "artefacts",
    years: [2026, 2026],
    origin: { kind: "own", status: "published" },
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
    years: [2023, 2025],
    origin: { kind: "production" },
    reading: {
      kind: "count",
      value: { n: 40, label: "40+ views" },
    },
    stack: ["React", "TypeScript", "Kubernetes"],
    links: [],
  },
  {
    id: "image",
    years: [2024, 2025],
    origin: { kind: "production" },
    reading: {
      kind: "delta",
      before: { n: 1900, label: "1.9 GB" },
      after: { n: 210, label: "210 MB" },
    },
    stack: ["Docker", "Multi-stage builds"],
    links: [],
  },
];

export const headlineCaseIds = ["orchestration", "query"] as const satisfies readonly CaseId[];

export const productionCases: readonly Case[] = cases.filter((entry) => entry.origin.kind === "production");

export const ownProjects: readonly Case[] = cases.filter((entry) => entry.origin.kind === "own");
