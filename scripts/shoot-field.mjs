/** Captures the divergence band across cases, so the effect is judged from pixels. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:4173";
const outDir = process.argv[3] ?? ".unique/render/field";
const theme = process.argv[4] ?? null;

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
if (theme) {
  await context.addInitScript(
    `try { localStorage.setItem("case-file-theme", ${JSON.stringify(theme)}); } catch {}`,
  );
}
const page = await context.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
const band = page.locator("#divergence");
await band.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);

console.log("data-live:", await page.locator(".u-field").getAttribute("data-live"));
const buttons = page.locator("#divergence [role=group] button");
const labels = await buttons.allInnerTexts();
console.log("controls:", labels.join(" | "));

const suffix = theme ? `-${theme}` : "";
for (let i = 0; i < labels.length; i += 1) {
  await buttons.nth(i).click();
  await page.waitForTimeout(1100);
  // Nudge the pointer so the sampling origin is not at its mount default.
  const box = await band.boundingBox();
  if (box) await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.4);
  await page.waitForTimeout(400);
  await band.screenshot({ path: `${outDir}/${i + 1}-${labels[i]?.replace(/\W+/g, "_")}${suffix}.png` });
  console.log("shot", labels[i]);
}

console.log("console errors:", errors.length ? [...new Set(errors)].join(" / ") : "none");
await browser.close();
