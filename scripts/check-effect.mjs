import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4173";
const browser = await chromium.launch({
  ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
});

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const stepOf = (page) =>
  page.evaluate(() => {
    const svg = Array.from(document.querySelectorAll("#build .build-svg")).find(
      (el) => getComputedStyle(el).display !== "none",
    );
    const states = svg
      ? Array.from(svg.querySelectorAll("[data-state]")).map((el) => el.getAttribute("data-state"))
      : [];
    return {
      fed: document.querySelectorAll("#build .build-feed > li").length,
      added: states.filter((s) => s === "added").length,
      removed: states.filter((s) => s === "removed").length,
    };
  });

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  const canvases = await page.locator("#build canvas").count();
  check("the band draws no canvas", canvases === 0, `${canvases}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const unseen = await stepOf(page);
  check("nothing plays before the band is seen", unseen.fed === 1, JSON.stringify(unseen));

  await page.locator("#build figure").scrollIntoViewIfNeeded();
  await page.waitForTimeout(3600);
  const started = await stepOf(page);
  check("seeing the band starts it", started.fed >= 2, JSON.stringify(started));

  await page.waitForTimeout(3000);
  const third = await stepOf(page);
  check("requirement 3 replaces the direct line", third.fed === 3 && third.removed === 1, JSON.stringify(third));

  await page.locator("#build button").click();
  const held = (await stepOf(page)).fed;
  await page.waitForTimeout(3200);
  const after = (await stepOf(page)).fed;
  check("pause holds the step", held === after, `${held} -> ${after}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  await page.locator("#build figure").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const frames = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = [];
        let last = performance.now();
        const tick = (now) => {
          out.push(now - last);
          last = now;
          if (out.length < 90) requestAnimationFrame(tick);
          else resolve(out);
        };
        requestAnimationFrame(tick);
      }),
  );
  const sorted = [...frames].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const worst = sorted[sorted.length - 1] ?? 0;
  check(
    "frame budget while it plays, at 4x CPU throttle",
    median <= 20,
    `median ${median.toFixed(1)} ms, worst ${worst.toFixed(1)} ms across 90 frames`,
  );
  await session.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  await page.locator("#build").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const state = await page.evaluate(() => {
    const svg = Array.from(document.querySelectorAll("#build .build-svg")).find(
      (el) => getComputedStyle(el).display !== "none",
    );
    const nodes = svg ? Array.from(svg.querySelectorAll(".build-node")) : [];
    return {
      live: document.querySelector("#build")?.hasAttribute("data-live"),
      nodes: nodes.length,
      shown: nodes.filter((el) => getComputedStyle(el).opacity === "1").length,
      running: document.getAnimations().filter((a) => a.playState === "running").length,
    };
  });
  check("reduced motion does not go live", state.live === false);
  check("reduced motion draws every node", state.nodes > 0 && state.shown === state.nodes, `${state.shown}/${state.nodes}`);
  check("reduced motion runs no animation", state.running === 0, `${state.running}`);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${base}/en/`, { waitUntil: "networkidle" });
  const shown = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#build .build-svg"))
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => el.getAttribute("viewBox")),
  );
  check("390 px shows only the portrait diagram", shown.length === 1 && shown[0] === "0 0 360 432", JSON.stringify(shown));
  await context.close();
}

await browser.close();
console.log(failures === 0 ? "PASS" : `FAIL — ${failures} problem(s)`);
process.exitCode = failures === 0 ? 0 : 1;
