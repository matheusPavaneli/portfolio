import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

/** CI uses the bundled Chromium; set PW_CHANNEL=msedge to use an installed browser instead. */
const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};
const url = process.argv[2] ?? "http://localhost:3001";
const outDir = process.argv[3] ?? ".unique/render/crops";
const width = Number(process.argv[4]) || 1440;
const sel = process.argv.slice(5);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(LAUNCH);
const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
});
for (const s of sel) {
  const el = page.locator(s).first();
  try {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await el.screenshot({ path: `${outDir}/${s.replace(/[^a-z0-9]/gi, "_")}.png` });
    console.log(s, "ok");
  } catch (e) { console.log(s, "FAILED", e.message.split("\n")[0]); }
}
await browser.close();
