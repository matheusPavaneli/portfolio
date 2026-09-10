/**
 * Renders the two Open Graph cards into `public/`, once, at build-authoring time.
 *
 * `next/og` wants a runtime and this project is a static export, so the card is drawn by the
 * Playwright that already ships for the render pass and checked in as a PNG.
 * Run: `node scripts/make-og.mjs`
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/** CI uses the bundled Chromium; set PW_CHANNEL=msedge to use an installed browser instead. */
const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

const CARDS = {
  en: {
    role: "SENIOR FULLSTACK ENGINEER · FORWARD-DEPLOYED AI ENGINEER",
    headline: "Hand me the system nobody wants to own.",
    readings: [
      ["5 models", "1"],
      ["2 s", "150 ms"],
      ["1.9 GB", "210 MB"],
    ],
  },
  pt: {
    role: "ENGENHEIRO FULLSTACK SÊNIOR · FORWARD-DEPLOYED AI ENGINEER",
    headline: "Me dê o sistema que ninguém quer assumir.",
    readings: [
      ["5 modelos", "1"],
      ["2 s", "150 ms"],
      ["1,9 GB", "210 MB"],
    ],
  },
};

const page = (card) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@300;400&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; padding: 72px 80px;
    background: oklch(15% 0.006 250); color: oklch(94% 0.0096 250);
    font-family: "Zilla Slab", Georgia, serif;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .role { font-family: "IBM Plex Mono", monospace; font-size: 17px; letter-spacing: 0.08em;
          color: oklch(72% 0.0072 250); }
  h1 { font-weight: 300; font-size: 76px; line-height: 1.02; letter-spacing: -0.02em; max-width: 20ch; }
  .rule { height: 1px; background: oklch(50% 0.006 250); }
  .readings { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; padding-top: 28px; }
  .r { font-family: "IBM Plex Mono", monospace; font-variant-numeric: tabular-nums; }
  .before { font-size: 20px; color: oklch(72% 0.0072 250); }
  .bar-before { height: 1px; background: oklch(50% 0.006 250); margin: 10px 0 18px; }
  .after { font-size: 30px; color: oklch(62% 0.109 185); }
  .bar-after { height: 2px; background: oklch(62% 0.109 185); margin-top: 10px; }
  .name { font-family: "IBM Plex Mono", monospace; font-size: 17px; letter-spacing: 0.08em;
          color: oklch(94% 0.0096 250); }
</style></head>
<body>
  <div>
    <p class="role">${card.role}</p>
    <h1 style="margin-top:28px">${card.headline}</h1>
  </div>
  <div>
    <div class="rule"></div>
    <div class="readings">
      ${card.readings
        .map(
          ([before, after], index) => `<div class="r">
            <div class="before">${before}</div>
            <div class="bar-before" style="width:100%"></div>
            <div class="after">${after}</div>
            <div class="bar-after" style="width:${[20, 8, 11][index]}%"></div>
          </div>`,
        )
        .join("")}
    </div>
    <p class="name" style="margin-top:36px">MATHEUS PAVANELI</p>
  </div>
</body></html>`;

mkdirSync("public", { recursive: true });
const browser = await chromium.launch(LAUNCH);

for (const [locale, card] of Object.entries(CARDS)) {
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 } });
  const tab = await context.newPage();
  await tab.setContent(page(card), { waitUntil: "networkidle" });
  await tab.screenshot({ path: `public/og-${locale}.png` });
  console.log(`public/og-${locale}.png`);
  await context.close();
}

await browser.close();
