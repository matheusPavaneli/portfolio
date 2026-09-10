/** Element crops at 2x, so type and instrument detail can be judged from pixels. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:4173/en/";
const outDir = process.argv[3] ?? ".unique/render/crops";
const width = Number(process.argv[4]) || 1440;
const selectors = process.argv.slice(5);

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  args: ["--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });

for (const selector of selectors) {
  const element = page.locator(selector).first();
  try {
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await element.screenshot({ path: `${outDir}/${selector.replace(/[^a-z0-9]/gi, "_")}.png` });
    console.log(selector, "ok");
  } catch (error) {
    console.log(selector, "FAILED", String(error).split("\n")[0]);
  }
}

await browser.close();
