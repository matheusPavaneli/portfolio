/**
 * The things a screenshot of one module never shows.
 *
 * Written after shipping a theme control that read `GO DARKGO LIGHT`: the rewrite dropped the
 * two CSS rules that hide one of its labels, the component still referenced the classes, and
 * nothing failed — not the build, not the types, not axe, not the reflow pass. A class that no
 * longer has a rule behind it is invisible to every check except looking, so this looks.
 */
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4173";
const browser = await chromium.launch({
  ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
  args: ["--enable-unsafe-swiftshader"],
});

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const SECTIONS = ["cases", "instrument", "method", "record", "contact"];

for (const route of ["/en/", "/pt/"]) {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(
      `try { localStorage.setItem("case-file-theme", ${JSON.stringify(theme)}); } catch {}`,
    );
    const page = await context.newPage();
    await page.goto(base + route, { waitUntil: "networkidle" });

    // The theme control says one thing, and it is the thing it will do.
    const label = await page.evaluate(() => {
      const button = document.querySelector("header button");
      if (!button) return { text: null, visible: 0 };
      const spans = Array.from(button.querySelectorAll(":scope > span"));
      const visible = spans.filter((s) => getComputedStyle(s).display !== "none");
      return {
        text: (button.innerText || "").replace(/\s+/g, " ").trim(),
        visible: visible.length,
      };
    });
    check(
      `${route} ${theme}: the theme control shows one label`,
      label.visible === 1,
      `${label.visible} visible, reads "${label.text}"`,
    );

    await context.close();
  }

  // Anchor navigation has to clear the sticky header, which is what scroll-padding is for.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });

  for (const id of SECTIONS) {
    await page.evaluate((target) => {
      window.location.hash = `#${target}`;
    }, id);
    await page.waitForTimeout(700);
    const geometry = await page.evaluate((target) => {
      const section = document.getElementById(target);
      const heading = section?.querySelector("h2, h3");
      const bar = document.querySelector("header > div");
      if (!section || !heading || !bar) return null;
      return {
        headingTop: heading.getBoundingClientRect().top,
        barBottom: bar.getBoundingClientRect().bottom,
      };
    }, id);
    check(
      `${route} #${id}: its heading clears the sticky bezel`,
      geometry !== null && geometry.headingTop >= geometry.barBottom,
      geometry ? `heading at ${Math.round(geometry.headingTop)}, bezel ends ${Math.round(geometry.barBottom)}` : "not found",
    );
  }
  await context.close();
}

// Nothing may reference a class the stylesheet no longer defines.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  const orphans = await page.evaluate(() => {
    const defined = new Set();
    for (const sheet of Array.from(document.styleSheets)) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      const walk = (list) => {
        for (const rule of Array.from(list)) {
          if (rule.selectorText) {
            for (const match of rule.selectorText.matchAll(/\.([A-Za-z][\w-]*)/g)) {
              defined.add(match[1]);
            }
          }
          if (rule.cssRules) walk(rule.cssRules);
        }
      };
      walk(rules);
    }
    // Only the project's own prefixed hooks; Tailwind utilities are generated on demand.
    const used = new Set();
    for (const element of Array.from(document.querySelectorAll("[class]"))) {
      for (const name of String(element.className).split(/\s+/)) {
        if (/^(u-|legend$|lamp$)/.test(name)) used.add(name.replace(/[^\w-]/g, ""));
      }
    }
    return [...used].filter((name) => name && !defined.has(name));
  });
  check("every project class the markup uses has a rule behind it", orphans.length === 0, orphans.join(", "));
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "PASS" : `FAIL — ${failures} problem(s)`);
process.exitCode = failures === 0 ? 0 : 1;
