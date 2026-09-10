import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/** CI uses the bundled Chromium; set PW_CHANNEL=msedge to use an installed browser instead. */
const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

const url = process.argv[2] ?? "http://localhost:3001";
const outDir = process.argv[3] ?? ".unique/render";
const theme = process.argv[4] ?? null; // "light" | "dark" | null

const shots = [
  { label: "390", width: 390, height: 844, scale: 1 },
  { label: "768", width: 768, height: 1024, scale: 1 },
  { label: "1440", width: 1440, height: 900, scale: 1 },
  { label: "320", width: 320, height: 844, scale: 1 },
  { label: "1440-zoom200", width: 720, height: 900, scale: 2 },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch(LAUNCH);
const consoleErrors = [];

for (const shot of shots) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: shot.scale,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`${shot.label}: ${m.text()}`);
  });
  page.on("pageerror", (e) => consoleErrors.push(`${shot.label}: ${e.message}`));
  if (theme) {
    await context.addInitScript(
      `try { localStorage.setItem("case-file-theme", ${JSON.stringify(theme)}); } catch {}`,
    );
  }
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  // let whileInView animations settle: scroll the whole page, then return
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  const suffix = theme ? `-${theme}` : "";
  await page.screenshot({
    path: join(outDir, `${shot.label}${suffix}.png`),
    fullPage: true,
  });
  console.log(`${shot.label}${suffix} ok`);
  await context.close();
}

await browser.close();
if (consoleErrors.length) {
  console.log("--- console errors ---");
  for (const e of [...new Set(consoleErrors)]) console.log(e);
} else {
  console.log("--- no console errors ---");
}
