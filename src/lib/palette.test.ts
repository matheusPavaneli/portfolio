import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { contrastRatio, parseOklch, type Oklch } from "./color";

/**
 * Reads the tokens out of the stylesheet that actually ships, so a hand-edit to a colour
 * fails here rather than in production. This is the regression test for findings 1–3 of
 * `.unique/audit-baseline.md`.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): Record<string, Oklch> {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`no "${selector}" block in globals.css`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);

  const tokens: Record<string, Oklch> = {};
  for (const line of body.split("\n")) {
    const match = line.match(/--color-([a-z-]+):\s*(oklch\([^)]*\))/);
    if (!match) continue;
    const [, name, value] = match;
    if (name === undefined || value === undefined) continue;
    tokens[name] = parseOklch(value);
  }
  return tokens;
}

function required(tokens: Record<string, Oklch>) {
  const get = (name: string): Oklch => {
    const token = tokens[name];
    if (!token) throw new Error(`missing --color-${name}`);
    return token;
  };

  return [
    { name: "body text on surface", fg: get("text"), bg: get("surface"), min: 4.5 },
    { name: "body text on raised", fg: get("text"), bg: get("raised"), min: 4.5 },
    { name: "muted text on surface", fg: get("muted"), bg: get("surface"), min: 4.5 },
    { name: "muted text on raised", fg: get("muted"), bg: get("raised"), min: 4.5 },
    { name: "accent text on surface", fg: get("accent"), bg: get("surface"), min: 4.5 },
    { name: "accent text on raised", fg: get("accent"), bg: get("raised"), min: 4.5 },
    // The failure that shipped last time: the button's own label against its own fill.
    { name: "button label on accent", fg: get("on-accent"), bg: get("accent"), min: 4.5 },
    { name: "alarm text on surface", fg: get("alarm"), bg: get("surface"), min: 4.5 },
    // Structural boundaries are graphical objects, not decoration: 3:1.
    { name: "meaningful boundary on surface", fg: get("edge"), bg: get("surface"), min: 3 },
    { name: "meaningful boundary on raised", fg: get("edge"), bg: get("raised"), min: 3 },
    { name: "focus ring on surface", fg: get("accent-ui"), bg: get("surface"), min: 3 },
    { name: "focus ring on raised", fg: get("accent-ui"), bg: get("raised"), min: 3 },
  ];
}

describe.each([
  ["light", "@theme"],
  ["dark", '[data-theme="dark"]'],
])("%s palette", (_scheme, selector) => {
  const tokens = block(selector);

  it.each(required(tokens))("$name clears $min:1", ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
});

describe("token discipline", () => {
  it("never uses a colour token at an alpha below 1", () => {
    // Tailwind's `token/NN` shorthand is how 97 sub-AA text uses got into the last build.
    const sources = collect(join(process.cwd(), "src"));
    const offenders: string[] = [];
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(
        /(?:text|bg|border|outline|ring|fill|stroke|decoration)-(?:surface|raised|text|muted|rule|edge|accent|accent-ui|on-accent|alarm)\/\d+/g,
      )) {
        offenders.push(`${file.replace(process.cwd(), "")}: ${match[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

function collect(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collect(full);
    return /\.(tsx|ts|css)$/.test(entry.name) ? [full] : [];
  });
}
