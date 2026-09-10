import { describe, expect, it } from "vitest";

import { en } from "./messages/en";
import { pt } from "./messages/pt";

type Tree = Record<string, unknown>;

function paths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value as Tree).flatMap(([key, child]) =>
    paths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("locale catalogues", () => {
  it("carry exactly the same keys", () => {
    expect(paths(pt).sort()).toEqual(paths(en).sort());
  });

  it("have no empty string anywhere", () => {
    for (const [name, catalogue] of Object.entries({ en, pt })) {
      const empty = paths(catalogue).filter((path) => {
        const value = path
          .split(".")
          .reduce<unknown>((node, key) => (node as Tree | undefined)?.[key], catalogue);
        return typeof value !== "string" || value.trim() === "";
      });
      expect(empty, `${name} has empty strings`).toEqual([]);
    }
  });

  it("does not leave an English string sitting in the Portuguese catalogue", () => {
    // Deliberate exceptions: proper nouns, terms of art and identifiers that stay in English.
    const allowed = new Set([
      "cases.stack",
      "reading.kindDelta",
      "cases.query.org",
      "masthead.stripBase",
      "cases.image.org",
      "cases.seal.name",
      "cases.artefacts.name",
      "cases.nanquim.name",
      "cases.anchor.name",
      "record.roles.bernoulli.title",
      "record.roles.eicode.title",
      "record.roles.freelance.title",
      "record.roles.jorrovi.title",
    ]);

    const identical = paths(en).filter((path) => {
      if (allowed.has(path)) return false;
      const read = (catalogue: unknown) =>
        path.split(".").reduce<unknown>((node, key) => (node as Tree | undefined)?.[key], catalogue);
      return read(en) === read(pt);
    });

    expect(identical).toEqual([]);
  });
});
