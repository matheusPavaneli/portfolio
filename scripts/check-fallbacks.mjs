import { chromium } from "playwright";

const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

const base = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch(LAUNCH);
let failures = 0;

function check(name, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

{
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of ["/en/", "/pt/"]) {
    await page.goto(base + route, { waitUntil: "domcontentloaded" });
    const seen = await page.evaluate(() => ({
      cases: document.querySelectorAll("details[id^='case-']").length,
      indexed: document.querySelectorAll("figure a[href^='#case-']").length,
      meters: document.querySelectorAll("details[id^='case-'] [data-reading]").length,
      words: (document.body.innerText || "").split(/\s+/).filter(Boolean).length,
      lang: document.documentElement.lang,
      theme: document.documentElement.getAttribute("data-theme"),
    }));
    check(
      `no-JS ${route}: every case on the board is rendered in the ledger`,
      seen.cases > 0 && seen.cases === seen.indexed,
      `${seen.cases} of ${seen.indexed}`,
    );
    check(`no-JS ${route}: every case still posts its reading`, seen.meters === seen.cases, `${seen.meters}`);
    check(`no-JS ${route}: readable text present`, seen.words > 600, `${seen.words} words`);
    check(
      `no-JS ${route}: html lang correct`,
      seen.lang === (route === "/pt/" ? "pt-BR" : "en"),
      seen.lang,
    );
    check(`no-JS ${route}: no theme is asserted, so the system decides`, seen.theme === null, String(seen.theme));
  }
  await context.close();
}

{
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(base + "/en/", { waitUntil: "networkidle" });
  const state = await page.evaluate(() => {
    const running = document
      .getAnimations()
      .filter((animation) => animation.playState === "running").length;
    const invisible = Array.from(document.querySelectorAll("main *")).filter((el) => {
      const style = getComputedStyle(el);
      return Number(style.opacity) < 0.5 && el.textContent && el.textContent.trim().length > 0;
    }).length;
    return { running, invisible };
  });
  check("reduced motion: no animation running", state.running === 0, `${state.running}`);
  check("reduced motion: no text left faded out", state.invisible === 0, `${state.invisible} node(s)`);
  await context.close();
}

{
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((a) => a.getAttribute("href")),
  );
  check("no-JS /: both locales are reachable links", hrefs.includes("./en/") && hrefs.includes("./pt/"), hrefs.join(" "));
  await context.close();
}

{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base + "/en/", { waitUntil: "networkidle" });
  const contact = await page.evaluate(() => {
    const section = document.querySelector("#contact");
    if (!section) return { hasForm: false, hasMailto: false };
    return {
      hasForm: Boolean(section.querySelector("form")),
      hasMailto: Boolean(section.querySelector('a[href^="mailto:"]')),
    };
  });
  check(
    "contact: a reachable route exists either way",
    contact.hasForm || contact.hasMailto,
    contact.hasForm ? "form is wired" : "mail fallback rendered",
  );
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "PASS" : `FAIL — ${failures} problem(s)`);
process.exitCode = failures === 0 ? 0 : 1;
