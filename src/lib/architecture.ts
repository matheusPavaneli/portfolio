export const REQUIREMENTS = [
  "serve",
  "latency",
  "traffic",
  "reads",
  "slow",
  "outage",
  "observe",
] as const;

export const FINAL = REQUIREMENTS.length;

export type Layout = "wide" | "tall";

export type Box = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

export const VIEWBOX: Record<Layout, { readonly w: number; readonly h: number }> = {
  wide: { w: 1008, h: 560 },
  tall: { w: 360, h: 432 },
};

export type NodeId =
  | "client"
  | "lb"
  | "api"
  | "apiB"
  | "apiC"
  | "cache"
  | "db"
  | "replicaA"
  | "replicaB"
  | "queue"
  | "workers"
  | "breaker"
  | "provider"
  | "fallback"
  | "telemetry";

export type GraphNode = {
  readonly id: NodeId;
  readonly since: number;
  readonly until?: number;
  readonly stacked?: true;
  readonly at: Record<Layout, Box>;
};

export type Point = readonly [number, number];

export type GraphEdge = {
  readonly id: string;
  readonly from: NodeId;
  readonly to: NodeId;
  readonly since: number;
  readonly until?: number;
  readonly async?: true;
  readonly path: Record<Layout, readonly Point[]>;
};

const box = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h });

export const NODES: readonly GraphNode[] = [
  { id: "client", since: 1, at: { wide: box(16, 248, 136, 44), tall: box(132, 8, 96, 36) } },
  { id: "api", since: 1, at: { wide: box(352, 248, 136, 44), tall: box(132, 124, 96, 36) } },
  { id: "db", since: 1, at: { wide: box(520, 248, 136, 44), tall: box(132, 196, 96, 36) } },
  { id: "cache", since: 2, at: { wide: box(520, 128, 136, 44), tall: box(12, 124, 96, 36) } },
  { id: "lb", since: 3, at: { wide: box(184, 248, 136, 44), tall: box(132, 64, 96, 36) } },
  {
    id: "apiC",
    since: 3,
    stacked: true,
    at: { wide: box(352, 232, 136, 44), tall: box(132, 112, 96, 36) },
  },
  {
    id: "apiB",
    since: 3,
    stacked: true,
    at: { wide: box(352, 240, 136, 44), tall: box(132, 118, 96, 36) },
  },
  { id: "replicaA", since: 4, at: { wide: box(688, 168, 136, 44), tall: box(12, 268, 96, 36) } },
  { id: "replicaB", since: 4, at: { wide: box(688, 328, 136, 44), tall: box(132, 268, 96, 36) } },
  { id: "queue", since: 5, at: { wide: box(352, 408, 136, 44), tall: box(252, 124, 96, 36) } },
  { id: "workers", since: 5, at: { wide: box(520, 408, 136, 44), tall: box(252, 196, 96, 36) } },
  { id: "breaker", since: 6, at: { wide: box(688, 408, 136, 44), tall: box(248, 268, 104, 36) } },
  { id: "provider", since: 6, at: { wide: box(856, 368, 136, 44), tall: box(172, 340, 84, 36) } },
  { id: "fallback", since: 6, at: { wide: box(856, 448, 136, 44), tall: box(264, 340, 84, 36) } },
  { id: "telemetry", since: 7, at: { wide: box(16, 512, 976, 32), tall: box(12, 392, 336, 32) } },
];

export const EDGES: readonly GraphEdge[] = [
  {
    id: "client-api",
    from: "client",
    to: "api",
    since: 1,
    until: 3,
    path: { wide: [[152, 270], [352, 270]], tall: [[180, 44], [180, 124]] },
  },
  {
    id: "api-db",
    from: "api",
    to: "db",
    since: 1,
    path: { wide: [[488, 270], [520, 270]], tall: [[180, 160], [180, 196]] },
  },
  {
    id: "api-cache",
    from: "api",
    to: "cache",
    since: 2,
    path: {
      wide: [[488, 262], [504, 262], [504, 150], [520, 150]],
      tall: [[132, 142], [108, 142]],
    },
  },
  {
    id: "client-lb",
    from: "client",
    to: "lb",
    since: 3,
    path: { wide: [[152, 270], [184, 270]], tall: [[180, 44], [180, 64]] },
  },
  {
    id: "lb-api",
    from: "lb",
    to: "api",
    since: 3,
    path: { wide: [[320, 270], [352, 270]], tall: [[180, 100], [180, 124]] },
  },
  {
    id: "db-replicaA",
    from: "db",
    to: "replicaA",
    since: 4,
    async: true,
    path: {
      wide: [[656, 270], [756, 270], [756, 212]],
      tall: [[150, 232], [150, 250], [60, 250], [60, 268]],
    },
  },
  {
    id: "db-replicaB",
    from: "db",
    to: "replicaB",
    since: 4,
    async: true,
    path: {
      wide: [[656, 270], [756, 270], [756, 328]],
      tall: [[180, 232], [180, 268]],
    },
  },
  {
    id: "api-replicaA",
    from: "api",
    to: "replicaA",
    since: 4,
    path: {
      wide: [[488, 262], [504, 262], [504, 190], [688, 190]],
      tall: [[148, 160], [148, 178], [40, 178], [40, 268]],
    },
  },
  {
    id: "api-replicaB",
    from: "api",
    to: "replicaB",
    since: 4,
    path: {
      wide: [[488, 278], [504, 278], [504, 350], [688, 350]],
      tall: [[212, 160], [212, 178], [240, 178], [240, 250], [200, 250], [200, 268]],
    },
  },
  {
    id: "api-queue",
    from: "api",
    to: "queue",
    since: 5,
    path: { wide: [[420, 292], [420, 408]], tall: [[228, 142], [252, 142]] },
  },
  {
    id: "queue-workers",
    from: "queue",
    to: "workers",
    since: 5,
    async: true,
    path: { wide: [[488, 430], [520, 430]], tall: [[300, 160], [300, 196]] },
  },
  {
    id: "workers-breaker",
    from: "workers",
    to: "breaker",
    since: 6,
    path: { wide: [[656, 430], [688, 430]], tall: [[300, 232], [300, 268]] },
  },
  {
    id: "breaker-provider",
    from: "breaker",
    to: "provider",
    since: 6,
    path: {
      wide: [[824, 430], [840, 430], [840, 390], [856, 390]],
      tall: [[300, 304], [300, 322], [214, 322], [214, 340]],
    },
  },
  {
    id: "breaker-fallback",
    from: "breaker",
    to: "fallback",
    since: 6,
    path: {
      wide: [[824, 430], [840, 430], [840, 470], [856, 470]],
      tall: [[300, 304], [300, 322], [306, 322], [306, 340]],
    },
  },
];

export type ElementState = "hidden" | "added" | "visible" | "removed";

export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 0;
  return Math.min(FINAL, Math.max(0, Math.trunc(step)));
}

export function stateOf(
  element: { readonly since: number; readonly until?: number },
  step: number,
): ElementState {
  const at = clampStep(step);
  if (at < element.since) return "hidden";
  if (element.until !== undefined) {
    if (at === element.until) return "removed";
    if (at > element.until) return "hidden";
  }
  return at === element.since ? "added" : "visible";
}

export const TELEMETRY_STEP = 7;

export function tapState(node: GraphNode, step: number): ElementState {
  if (node.id === "telemetry" || node.stacked) return "hidden";
  const own = stateOf(node, step);
  if (own === "hidden" || own === "removed") return "hidden";
  return stateOf({ since: TELEMETRY_STEP }, step);
}

export function pathD(points: readonly Point[]): string {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
}
