/**
 * The budget in .unique/stack.md, asserted rather than observed.
 *
 * Counts the gzipped bytes of every script the built page loads for a modern browser —
 * `noModule` chunks are legacy polyfills and are excluded, the same way Next's own
 * First Load JS number excludes them.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const BUDGET_KB = Number(process.env.JS_BUDGET_KB ?? 100);
const routes = ["en", "pt"];

let worst = 0;
const rows = [];

for (const route of routes) {
  const html = join("out", route, "index.html");
  if (!existsSync(html)) {
    console.error(`no build at ${html} — run \`pnpm build\` first`);
    process.exit(2);
  }
  const source = readFileSync(html, "utf8");

  const modern = [...source.matchAll(/<script[^>]*src="([^"]+\.js)"[^>]*>/g)]
    .filter((match) => !match[0].includes("noModule"))
    .map((match) => match[1]);

  let total = 0;
  for (const src of new Set(modern)) {
    const file = join("out", src.replace(/^\/+/, "").replace(/^portfolio\//, ""));
    if (!existsSync(file)) continue;
    total += gzipSync(readFileSync(file)).length;
  }
  const kb = total / 1024;
  worst = Math.max(worst, kb);
  rows.push(`/${route}/  ${kb.toFixed(1)} kB gz`);
}

for (const row of rows) console.log(row);
console.log(`budget ${BUDGET_KB} kB gz`);

if (worst > BUDGET_KB) {
  console.error(`OVER BUDGET by ${(worst - BUDGET_KB).toFixed(1)} kB`);
  process.exit(1);
}
console.log("within budget");
