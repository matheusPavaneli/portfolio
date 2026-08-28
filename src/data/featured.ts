export type FeaturedEntry = {
  id: "nanquim" | "seal" | "anchor" | "art";
  ordinal: string;
  name: string;
  kickerKey: string;
  statusKey: string;
  meta: string;
  tags: readonly string[];
};

export const featuredEntries: readonly FeaturedEntry[] = [
  {
    id: "nanquim",
    ordinal: "01",
    name: "NANQUIM",
    kickerKey: "projects.kicker.nanquim",
    statusKey: "projects.statusOpenSource",
    meta: "SDK · Pix",
    tags: ["TypeScript", "Zero deps", "12 kB"],
  },
  {
    id: "seal",
    ordinal: "02",
    name: "Seal",
    kickerKey: "projects.kicker.seal",
    statusKey: "projects.statusOpenSource",
    meta: "Apache-2.0 · AI Infra",
    tags: ["MCP", "Audit chain", "Open-core"],
  },
  {
    id: "anchor",
    ordinal: "03",
    name: "Anchor",
    kickerKey: "projects.kicker.anchor",
    statusKey: "projects.statusProduction",
    meta: "SaaS · B2B",
    tags: ["Next.js", "Multi-tenant", "Stripe"],
  },
  {
    id: "art",
    ordinal: "04",
    name: "technology-art",
    kickerKey: "projects.kicker.art",
    statusKey: "projects.statusLive",
    meta: "Essay · WebGL",
    tags: ["three.js", "GSAP", "Lighthouse 100"],
  },
];
