import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { contrastRatio, parseOklch, type Oklch } from "./color";

/**
 * Reads the tokens out of the stylesheet that actually ships, so a hand-edit to a colour fails
 * here rather than in production. This is the regression test for the blocking findings in
 * `.unique/audit-baseline.md`: a primary button whose own label measured 2.81:1, and 97 uses of
 * muted text between 1.33:1 and 3.00:1.
 *
 * The panel has three grounds — the sheet, a module's plate, and the recess a meter face is
 * sunk into — so every ink is checked against every ground it can actually land on.
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

  const page = get("page");
  const plate = get("plate");
  const recess = get("recess");

  return [
    { name: "ink on page", fg: get("ink"), bg: page, min: 4.5 },
    { name: "ink on plate", fg: get("ink"), bg: plate, min: 4.5 },
    { name: "dim on page", fg: get("dim"), bg: page, min: 4.5 },
    { name: "dim on plate", fg: get("dim"), bg: plate, min: 4.5 },
    { name: "signal on page", fg: get("signal"), bg: page, min: 4.5 },
    { name: "signal on plate", fg: get("signal"), bg: plate, min: 4.5 },
    { name: "alarm on page", fg: get("alarm"), bg: page, min: 4.5 },
    { name: "alarm on plate", fg: get("alarm"), bg: plate, min: 4.5 },
    // The failure that shipped once: a button's own label against its own fill.
    { name: "button label on signal", fg: get("on-signal"), bg: get("signal"), min: 4.5 },
    // The recess is a second world with its own ramp.
    { name: "on-recess on recess", fg: get("on-recess"), bg: recess, min: 4.5 },
    { name: "dim-recess on recess", fg: get("dim-recess"), bg: recess, min: 4.5 },
    { name: "signal-recess on recess", fg: get("signal-recess"), bg: recess, min: 4.5 },
    // A module's edge carries structure, so it is a graphical object and owes 3:1.
    { name: "edge on page", fg: get("edge"), bg: page, min: 3 },
    { name: "edge on plate", fg: get("edge"), bg: plate, min: 3 },
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
    // Tailwind's `token/NN` shorthand is how 97 sub-AA text uses got into an earlier build.
    const offenders: string[] = [];
    for (const file of collect(join(process.cwd(), "src"))) {
      const text = readFileSync(file, "utf8");
      for (const match of text.matchAll(
        /(?:text|bg|border|outline|ring|fill|stroke|decoration)-(?:page|plate|recess|ink|dim|edge|signal|alarm|on-signal|on-recess|dim-recess|signal-recess)\/\d+/g,
      )) {
        offenders.push(`${file.replace(process.cwd(), "")}: ${match[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps the dark theme and its no-JS mirror in step", () => {
    const explicit = block('[data-theme="dark"]');
    const media = block('html:not([data-theme="light"])');
    expect(Object.keys(media).sort()).toEqual(Object.keys(explicit).sort());
    for (const [name, value] of Object.entries(explicit)) {
      expect(media[name], `--color-${name} drifted between the two dark blocks`).toEqual(value);
    }
  });
});

function collect(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return collect(full);
    return /\.(tsx|ts|css)$/.test(entry.name) ? [full] : [];
  });
}
