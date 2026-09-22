import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const LAUNCH = process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {};

const AXIS_MAX = 20;
const place = (ratio) => Math.log10(Math.min(Math.max(ratio, 1), AXIS_MAX)) / Math.log10(AXIS_MAX);

const CARDS = {
  en: {
    role: "SENIOR FULLSTACK ENGINEER · FORWARD-DEPLOYED AI",
    headline: ["Hand me the system", "nobody wants to own."],
    axis: "RATIO, LOG SCALE",
    rows: [
      { name: "The two-second query", reading: "2 s → 150 ms", ratio: 2000 / 150 },
      { name: "The 1.9 GB image", reading: "1.9 GB → 210 MB", ratio: 1900 / 210 },
      { name: "rag-eval", reading: "847 chars → 104", ratio: 847 / 104 },
    ],
  },
  pt: {
    role: "ENGENHEIRO FULLSTACK SÊNIOR · FORWARD-DEPLOYED AI",
    headline: ["Me dê o sistema", "que ninguém quer assumir."],
    axis: "RAZÃO, ESCALA LOG",
    rows: [
      { name: "A query de dois segundos", reading: "2 s → 150 ms", ratio: 2000 / 150 },
      { name: "A imagem de 1,9 GB", reading: "1,9 GB → 210 MB", ratio: 1900 / 210 },
      { name: "rag-eval", reading: "847 chars → 104", ratio: 847 / 104 },
    ],
  },
};

const page = (card) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; padding: 56px 72px 52px;
    background: #0C0C0B; color: #ECE7DD;
    font-family: "Geist", system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .label { font-family: "Geist Mono", monospace; font-size: 15px; font-weight: 500;
           letter-spacing: 0.04em; text-transform: uppercase; color: #8C877D; }
  h1 { font-weight: 500; font-size: 64px; line-height: 1; letter-spacing: -0.045em; max-width: 16ch; }
  h1 span { color: #8C877D; }
  .head { display: grid; grid-template-columns: 330px 1fr 92px; column-gap: 28px; align-items: end;
          border-bottom: 1px solid #2A2925; padding-bottom: 10px; margin-bottom: 18px; }
  .scale { position: relative; height: 16px; }
  .scale span { position: absolute; bottom: 0; transform: translateX(-50%); }
  .row { display: grid; grid-template-columns: 330px 1fr 92px; align-items: center;
         column-gap: 28px; padding: 12px 0; }
  .name { font-size: 19px; }
  .reading { font-family: "Geist Mono", monospace; font-size: 14px; font-variant-numeric: tabular-nums;
             color: #8C877D; margin-top: 3px; }
  .track { position: relative; height: 22px; }
  .tick { position: absolute; top: 0; bottom: 0; width: 1px; background: #2A2925; }
  .tick.end { background: #6A655B; }
  .bar { position: absolute; top: 50%; left: 0; height: 3px; transform: translateY(-50%);
         background: #C8F03C; border-radius: 999px; }
  .cap { position: absolute; top: 50%; width: 11px; height: 11px; border-radius: 999px;
         transform: translate(-50%, -50%); background: #C8F03C; }
  .ratio { font-family: "Geist Mono", monospace; font-size: 17px; font-weight: 500;
           font-variant-numeric: tabular-nums; color: #C8F03C; text-align: right; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; }
  .me { font-family: "Geist Mono", monospace; font-size: 16px; font-weight: 500;
        letter-spacing: 0.04em; text-transform: uppercase; color: #ECE7DD; }
</style></head>
<body>
  <div>
    <p class="label">${card.role}</p>
    <h1 style="margin-top:20px">${card.headline[0]} <span>${card.headline[1]}</span></h1>
  </div>
  <div>
    <div class="head">
      <p class="label">${card.axis}</p>
      <div class="scale">${[1, 2, 5, 10, 20]
        .map((t) => `<span class="label" style="left:${place(t) * 100}%">${t}×</span>`)
        .join("")}</div>
      <span></span>
    </div>
    ${card.rows
      .map((row) => {
        const x = place(row.ratio) * 100;
        const ticks = [1, 2, 5, 10, 20]
          .map(
            (t) =>
              `<span class="tick${t === 1 || t === 20 ? " end" : ""}" style="left:${place(t) * 100}%"></span>`,
          )
          .join("");
        return `<div class="row">
          <div>
            <div class="name">${row.name}</div>
            <div class="reading">${row.reading}</div>
          </div>
          <div class="track">${ticks}
            <span class="bar" style="width:${x}%"></span>
            <span class="cap" style="left:${x}%"></span>
          </div>
          <div class="ratio">${row.ratio >= 10 ? row.ratio.toFixed(1) : row.ratio.toFixed(2)}×</div>
        </div>`;
      })
      .join("")}
    <div class="foot" style="margin-top:26px">
      <p class="me">Matheus Pavaneli</p>
      <p class="label">matheuspavaneli.github.io</p>
    </div>
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
