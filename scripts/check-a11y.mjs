import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

/** CI uses the bundled Chromium; set PW_CHANNEL=msedge to use an installed browser instead. */
const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

const base = process.argv[2] ?? "http://localhost:3100";
const routes = ["/en/", "/pt/"];
const widths = [320, 390, 768, 834, 1024, 1440];

const browser = await chromium.launch(LAUNCH);
let failures = 0;

for (const route of routes) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(
      `try { localStorage.setItem("case-file-theme", ${JSON.stringify(theme)}); } catch {}`,
    );
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    if (results.violations.length === 0) {
      console.log(`axe ${route} ${theme}: 0 violations`);
    } else {
      failures += results.violations.length;
      console.log(`axe ${route} ${theme}: ${results.violations.length} violation(s)`);
      for (const v of results.violations) {
        console.log(`  [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node(s))`);
        for (const node of v.nodes.slice(0, 3)) console.log(`      ${node.target.join(" ")}`);
      }
    }
    await context.close();
  }
}

// Horizontal overflow, including the 200 % zoom case (720 px viewport at DPR 2).
for (const route of routes) {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      widest: (() => {
        let worst = { tag: "", w: 0 };
        for (const el of Array.from(document.querySelectorAll("*"))) {
          const r = el.getBoundingClientRect();
          if (r.right > worst.w) worst = { tag: el.tagName + "." + (el.className || ""), w: r.right };
        }
        return worst;
      })(),
    }));
    const bad = overflow.scroll > overflow.client + 1;
    if (bad) failures += 1;
    console.log(
      `overflow ${route} @${width}: scroll ${overflow.scroll} vs client ${overflow.client}` +
        (bad ? `  OVERFLOW — widest ${overflow.widest.tag} at ${Math.round(overflow.widest.w)}` : "  ok"),
    );
    await context.close();
  }
}

await browser.close();
console.log(failures === 0 ? "PASS" : `FAIL — ${failures} problem(s)`);
process.exitCode = failures === 0 ? 0 : 1;
