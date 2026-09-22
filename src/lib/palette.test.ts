import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { composite, contrast, parseColor, type Rgb, type Rgba } from "./color";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): Record<string, Rgba> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`no "${selector}" block in globals.css`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open);
  const body = css.slice(open + 1, close);

  const tokens: Record<string, Rgba> = {};
  for (const line of body.split("\n")) {
    const match = line.match(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]*\))\s*;/);
    if (!match) continue;
    const [, name, value] = match;
    if (name === undefined || value === undefined) continue;
    tokens[name] = parseColor(value);
  }
  return tokens;
}

type Pair = { name: string; fg: Rgb; bg: Rgb; min: number };

function pairs(tokens: Record<string, Rgba>): Pair[] {
  const get = (name: string): Rgba => {
    const token = tokens[name];
    if (!token) throw new Error(`missing --color-${name}`);
    return token;
  };
  const opaque = (name: string): Rgb => {
    const token = get(name);
    if (token.a !== 1) throw new Error(`--color-${name} is not opaque`);
    return token;
  };

  const bg = opaque("bg");
  const surface = opaque("surface");
  const raised = opaque("surface-raised");
  const soft = get("accent-soft");

  const text = (name: string, min = 4.5): Pair[] => [
    { name: `${name} on bg`, fg: opaque(name), bg, min },
    { name: `${name} on surface`, fg: opaque(name), bg: surface, min },
    { name: `${name} on surface-raised`, fg: opaque(name), bg: raised, min },
  ];

  return [
    ...text("text"),
    ...text("text-muted"),
    { name: "accent on bg", fg: opaque("accent"), bg, min: 4.5 },
    { name: "accent on surface", fg: opaque("accent"), bg: surface, min: 4.5 },
    { name: "on-accent on accent-fill", fg: opaque("on-accent"), bg: opaque("accent-fill"), min: 4.5 },
    { name: "accent on accent-soft over bg", fg: opaque("accent"), bg: composite(soft, bg), min: 4.5 },
    {
      name: "accent on accent-soft over surface",
      fg: opaque("accent"),
      bg: composite(soft, surface),
      min: 4.5,
    },
    { name: "danger on bg", fg: opaque("danger"), bg, min: 4.5 },
    { name: "danger on surface-raised", fg: opaque("danger"), bg: raised, min: 4.5 },
    { name: "warning on bg", fg: opaque("warning"), bg, min: 4.5 },
    { name: "line-control on bg", fg: opaque("line-control"), bg, min: 3 },
    { name: "focus on bg", fg: opaque("focus"), bg, min: 3 },
    { name: "focus on surface", fg: opaque("focus"), bg: surface, min: 3 },
    { name: "spice on bg", fg: opaque("spice"), bg, min: 3 },
    { name: "spice on surface", fg: opaque("spice"), bg: surface, min: 3 },
  ];
}

describe.each([
  ["dark", "@theme"],
  ["light", '[data-theme="light"]'],
])("%s theme", (theme, selector) => {
  const tokens = block(selector);

  it.each(pairs(tokens).map((pair) => [pair.name, pair] as const))(
    "%s clears its threshold",
    (_name, pair) => {
      const ratio = contrast(pair.fg, pair.bg);
      expect(
        ratio,
        `${theme}: ${pair.name} measured ${ratio.toFixed(2)}:1, needs ${pair.min}:1`,
      ).toBeGreaterThanOrEqual(pair.min);
    },
  );

  it("keeps accent legible as a graphical object", () => {
    const accent = tokens["accent"];
    const bg = tokens["bg"];
    if (!accent || !bg) throw new Error("missing accent or bg");
    expect(contrast(accent, bg)).toBeGreaterThanOrEqual(3);
  });
});

describe("the no-JS light path", () => {
  it("repeats every token the light theme overrides", () => {
    const explicit = Object.keys(block('[data-theme="light"]')).sort();
    const preference = Object.keys(block("prefers-color-scheme: light")).sort();
    expect(preference).toEqual(explicit);
  });
});
