import { describe, expect, it } from "vitest";

import { en } from "@/i18n/messages/en";
import { pt } from "@/i18n/messages/pt";
import {
  clampStep,
  EDGES,
  FINAL,
  NODES,
  REQUIREMENTS,
  stateOf,
  tapState,
  VIEWBOX,
  type Box,
  type Layout,
  type NodeId,
  type Point,
} from "./architecture";

const LAYOUTS: readonly Layout[] = ["wide", "tall"];
const STEPS = Array.from({ length: FINAL }, (_, index) => index + 1);

const idsIn = (step: number, state: string) => [
  ...NODES.filter((node) => stateOf(node, step) === state).map((node) => node.id),
  ...EDGES.filter((edge) => stateOf(edge, step) === state).map((edge) => edge.id),
];

const node = (id: NodeId) => {
  const found = NODES.find((entry) => entry.id === id);
  if (!found) throw new Error(`no node ${id}`);
  return found;
};

const onBorder = ([x, y]: Point, b: Box) => {
  const withinX = x >= b.x && x <= b.x + b.w;
  const withinY = y >= b.y && y <= b.y + b.h;
  const onVertical = (x === b.x || x === b.x + b.w) && withinY;
  const onHorizontal = (y === b.y || y === b.y + b.h) && withinX;
  return onVertical || onHorizontal;
};

const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe("the sequence", () => {
  it("starts with exactly a client, an API and a database, all of them new", () => {
    expect(idsIn(1, "added").sort()).toEqual(["api", "api-db", "client", "client-api", "db"].sort());
    expect(idsIn(1, "visible")).toEqual([]);
  });

  it("replaces the direct client→API line when the load balancer arrives", () => {
    expect(stateOf(EDGES.find((e) => e.id === "client-api")!, 3)).toBe("removed");
    expect(idsIn(3, "added")).toEqual(expect.arrayContaining(["lb", "client-lb", "lb-api"]));
    expect(stateOf(EDGES.find((e) => e.id === "client-api")!, 4)).toBe("hidden");
  });

  it("adds something at every requirement, so no stop has nothing to show", () => {
    for (const step of STEPS) {
      expect(idsIn(step, "added").length, `step ${step}`).toBeGreaterThan(0);
    }
  });

  it("never shows an edge whose ends are not drawn", () => {
    for (const step of STEPS) {
      for (const edge of EDGES) {
        if (stateOf(edge, step) === "hidden") continue;
        expect(stateOf(node(edge.from), step), `${edge.id}@${step}`).not.toBe("hidden");
        expect(stateOf(node(edge.to), step), `${edge.id}@${step}`).not.toBe("hidden");
      }
    }
  });

  it("clamps: nothing before the first requirement, and the final frame past the last", () => {
    expect(idsIn(0, "added")).toEqual([]);
    expect(idsIn(0, "visible")).toEqual([]);
    expect(clampStep(99)).toBe(FINAL);
    expect(clampStep(Number.NaN)).toBe(0);
    for (const entry of [...NODES, ...EDGES]) {
      expect(stateOf(entry, 99)).toBe(stateOf(entry, FINAL));
    }
  });

  it("taps every standing node into telemetry at the last step, and only then", () => {
    const taps = (step: number) => NODES.filter((n) => tapState(n, step) !== "hidden").length;
    expect(taps(FINAL - 1)).toBe(0);
    const standing = NODES.filter((n) => !n.stacked && n.id !== "telemetry");
    expect(taps(FINAL)).toBe(standing.length);
  });
});

describe("the geometry", () => {
  for (const layout of LAYOUTS) {
    it(`keeps every ${layout} node inside the viewBox`, () => {
      const view = VIEWBOX[layout];
      for (const entry of NODES) {
        const b = entry.at[layout];
        expect(b.x >= 0 && b.y >= 0, entry.id).toBe(true);
        expect(b.x + b.w <= view.w && b.y + b.h <= view.h, entry.id).toBe(true);
      }
    });

    it(`never overlaps two ${layout} nodes, apart from the stacked instances`, () => {
      const standing = NODES.filter((entry) => !entry.stacked);
      for (const [index, a] of standing.entries()) {
        for (const b of standing.slice(index + 1)) {
          expect(overlaps(a.at[layout], b.at[layout]), `${a.id} × ${b.id}`).toBe(false);
        }
      }
    });

    it(`starts and ends every ${layout} edge on its nodes' borders, orthogonally`, () => {
      for (const edge of EDGES) {
        const points = edge.path[layout];
        const first = points[0];
        const last = points[points.length - 1];
        expect(first && last, edge.id).toBeTruthy();
        if (!first || !last) continue;
        expect(onBorder(first, node(edge.from).at[layout]), `${edge.id} start`).toBe(true);
        expect(onBorder(last, node(edge.to).at[layout]), `${edge.id} end`).toBe(true);
        for (let i = 1; i < points.length; i += 1) {
          const [ax, ay] = points[i - 1] ?? [0, 0];
          const [bx, by] = points[i] ?? [0, 0];
          expect(ax === bx || ay === by, `${edge.id} segment ${i}`).toBe(true);
        }
      }
    });
  }
});

describe("the copy", () => {
  it("has every requirement, in order, in both languages", () => {
    for (const catalogue of [en, pt]) {
      expect(Object.keys(catalogue.build.steps)).toEqual([...REQUIREMENTS]);
    }
  });

  it("names every drawn node in both languages", () => {
    const named = NODES.filter((entry) => !entry.stacked).map((entry) => entry.id).sort();
    for (const catalogue of [en, pt]) {
      expect(Object.keys(catalogue.build.nodes).sort()).toEqual(named);
    }
  });
});
