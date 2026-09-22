# Matheus Pavaneli — engineering case file

Senior fullstack engineer and forward-deployed AI engineer, based in Brazil (UTC−3) and working
remotely, with C1 English.

**Live:** [English](https://matheusPavaneli.github.io/portfolio/en/) ·
[Português](https://matheusPavaneli.github.io/portfolio/pt/) ·
**Résumé:** [PDF on Google Drive](https://drive.google.com/file/d/1d23kox6oNXPHlDxqFH84jkN9Px5Z5cDf/view?usp=drive_link)

This repository is the site itself. It is small on purpose, and every choice in it was made
against a named alternative. This README explains those choices so a recruiter can check them
in a few minutes, and a staff engineer can argue with them.

---

## If you have 60 seconds

| You want to know | Where to look |
| --- | --- |
| What I have shipped, with numbers | The **Readings** board at the top of the page, then the **Cases** ledger |
| Whether the numbers are real | Every figure traces to the résumé or to a public repository. Nothing on the page is illustrative |
| AI and LLM work specifically | *LLM systems in production* (orchestration, provider failover, a five-model benchmark), *rag-eval* (retrieval measured against character-level ground truth), *Seal* (human approval for agent tool calls) |
| How I work on a system I did not write | The **Method** section. Each rule links to the case that taught it |
| Current role, stack, location | The spec strip under the headline |
| How to reach me | The **Contact** section, or the résumé link above |

---

## Decisions: X over Y, and why

Each decision below states what was chosen, the alternative that lost, and what the choice
cost. The full record, with measurements, is in [`.unique/`](#where-the-reasoning-lives).

### 1. Cases with measured outcomes, over a skills grid and project cards

**Chose:** nine real systems. For each one the page shows the situation, the call I made, and
the number it moved. **Over:** a grid of technology logos and a set of equal project cards.

**Why:** a skills grid shows what someone has heard of, while a before-and-after number shows
what they did. The most useful evidence (an LLM orchestration architecture, a 2 s → 150 ms
query fix) used to sit as bullet 1 of 4 in a job history. It is now the structure of the page.

**Kept anyway:** a full keyword register in *Record*, tested against the résumé by
`src/content/content.test.ts`. Recruiters search by keyword, and cutting the list would have
cost findability.

### 2. One logarithmic ratio axis, and only honest ratios on it

**Chose:** a single log-scale board where every case that moved a number is a bar. Because the
axis is logarithmic, a 13.3× query fix and an 8.1× citation cut can be compared even though
their units differ. **Over:** percentages, a separate chart per case, or a bar for every case.

**Why:** a percentage hides the base and a per-case chart hides the comparison. A bar for every
case would force invented numbers, so the board keeps three kinds of evidence apart:

- **Moved:** a before and an after, so there is a ratio to draw.
- **Held:** a value kept under a limit, such as a 12.14 kB bundle that CI refuses to exceed.
  The page states it and does not plot it, because a dot at 1.00× reads as "did nothing".
- **Counted:** a single figure, such as five models benchmarked. It has no ratio, so none is drawn.

An earlier version plotted "5 models → 1" as a 5× improvement. Choosing one model out of five
is not an improvement ratio, so I removed it. `src/lib/board.test.ts` has a regression test to
keep it removed.

### 3. Native `<details>` rows, over a JavaScript accordion or card grid

**Chose:** a ledger of native disclosure rows, each with four columns: *what, where, ratio,
when*. The three strongest cases are open on arrival. **Over:** a hand-built accordion, or equal
cards in a grid.

**Why:** native disclosure works with JavaScript off, is keyboard-operable without any handler,
and lets find-in-page reach closed content. Hand-built accordions usually break at least one of
those. Equal cards would also claim that nine different cases are interchangeable.

### 4. Static export on GitHub Pages, over a server

**Chose:** `next build` with `output: "export"`, deployed as static files by GitHub Actions.
**Over:** SSR on a hosting platform.

**Why:** the page has no per-request data. A server would add latency, cost and one more thing
that can fail, and it would buy nothing. The contact form posts to a hosted form endpoint and
falls back to `mailto:` when no endpoint is configured, so the site never needs a backend.

### 5. Next.js 16 over Astro, and the cost stated plainly

**Chose:** Next.js 16 (App Router), React 19, Tailwind 4, TypeScript strict with
`noUncheckedIndexedAccess`. **Over:** Astro with islands.

**Why, and the honest part:** on bytes alone, Astro is the better framework for this page. I
kept Next because it is the stack I am hired to work in, and a portfolio in it is a working
sample. The cost is measured and not hidden:

| | Value |
| --- | --- |
| Initial JS per route, measured by `scripts/check-bundle.mjs` | **136.8 kB gz** |
| Design budget | 100 kB gz |
| CI regression line (`JS_BUDGET_KB`) | 140 kB gz |
| This project's own client code | ~5 kB gz. The rest is framework runtime |

The page is over its design budget and the stack record says so. The reading experience does
not depend on that JavaScript: both routes are complete documents with JavaScript disabled, and
CI checks this on every push.

### 6. Per-locale static routes, over `next-intl` or a client-side language context

**Chose:** `/en/` and `/pt/` as two fully static documents. Each has its own `<html lang>`,
`hreflang` and canonical URL, and message catalogues are read only by server components.
**Over:** `next-intl`, or a React context that swaps languages in the browser.

**Why:** the previous build switched language in the browser. It painted English first, set
`lang="en"` on every document, and shipped both catalogues in one bundle. `next-intl` would
bring a client provider and locale middleware, and neither is useful when every string is known
at build time and middleware cannot run under a static export. The fix removed 11 kB gz of
duplicated strings from the bundle.

### 7. CSS and one `IntersectionObserver`, over an animation library

**Chose:** CSS transitions, one declared entrance animation on the board, and an inline-SVG
diagram in the *Build* section driven by one observer. **Over:** `framer-motion` / Motion, and
an earlier WebGL shader.

**Why:** 26 files imported `framer-motion`, almost all of them for the same fade-up, at 39 kB
gz. Nothing on the page animates between two measured layouts, which is the problem a spring
library solves. The WebGL screen was removed for a T0 SVG that shows the actual idea. The idea
is how an architecture grows one requirement at a time, and each step names the cost it adds.
`scripts/check-effect.mjs` measures the diagram at 4× CPU throttle in CI (median ~5.6 ms per
frame). With reduced motion, it draws the final frame and does not animate.

### 8. A 12-line inline theme script, over `next-themes`

**Chose:** a blocking inline script that sets `data-theme` before first paint, plus a small
toggle. **Over:** `next-themes`.

**Why:** `next-themes` needs a provider at the root of the tree. That provider was one of the
reasons 31 of 39 files were client components. After the change, **3 files** are client
components: the theme toggle, the contact form and the build diagram. With JavaScript disabled,
the reader still gets their system theme through CSS alone.

### 9. Contrast measured in CI, over a design review

**Chose:** `src/lib/palette.test.ts` reads the colour tokens from `globals.css` and asserts
every text and control pair against WCAG 2.2 AA, in both themes. axe runs on both locales in
both themes, and a reflow check covers 320 px to 1440 px. **Over:** a checklist.

**Why:** the previous version shipped a primary button at 2.81:1 contrast and 97 text uses
below AA, and nobody had measured any of them. A checklist let that happen. A failing test does
not.

### 10. The design system: kept knowingly

The page uses a near-black, single-accent design system. That is a common look for developer
portfolios, and the design record says so. I chose to keep it because the page's work is done
by the evidence. The design pass went into consistency instead:

- two corner radii, assigned by role: 6 px for controls, 10 px for containers
- two control heights: 44 px on the page, 40 px in the header
- one inner edge shared by the header and the content
- one link style
- the accent used for four things only: readings, the primary action, the status lamp, and the
  current nav item

### 11. No comments in the source

**Chose:** code that states intent through names, types and tests. **Over:** explanatory
comments.

**Why:** a comment that explains code usually marks code that should have been clearer, and
comments drift out of date while tests fail loudly. The reasoning a comment would carry lives
in the decision record instead, next to the alternative it beat. Some examples of intent
carried by the code itself:

- the contact form's status is a discriminated union, so "sending and failed" cannot exist
- case readings are typed as `delta | ceiling | count`, so a ratio cannot be invented for a
  single figure
- dates are formatted per locale in one tested module, so the Portuguese page never prints
  "Oct"

### 12. Dependencies: justified one at a time

Runtime dependencies are `next`, `react`, `react-dom` and `lucide-react`. The stack record
first rejected an icon library. The page ended up with more icons than planned, and named
imports tree-shake to only the glyphs used. That reversal is recorded rather than hidden.
Everything else, including Playwright, axe and Vitest, is a dev dependency and ships 0 kB.

---

## Trade-offs I would revisit

- **Bundle over budget.** The cheapest fix is pinning back to Next 14 / React 18, projected
  ≈ 97 kB gz. I did not take it, because running a framework two majors old undercuts a page
  about engineering judgement. Astro would fix it properly.
- **The Build section is generic on purpose.** A system-design walk-through could appear on any
  backend portfolio. What keeps it relevant is the cost line on every step: owning an outcome
  means knowing what each box will charge you later.

---

## Running it

```bash
pnpm install
pnpm dev                     # http://localhost:3000/en/
pnpm build                   # static export into ./out
node scripts/serve-out.mjs   # serve ./out at http://localhost:4173
```

Copy `.env.example` to `.env.local`. If `NEXT_PUBLIC_FORMSPREE_FORM_ID` is unset, the contact
form renders its `mailto:` fallback. That is a supported state, not a broken one.

## The checks

All of these run in CI on every push and pull request (`.github/workflows/deploy-pages.yml`):

```bash
pnpm typecheck
pnpm lint
pnpm test                    # locale key parity, palette contrast, board arithmetic, dates, CV facts
pnpm check:bundle            # initial JS against JS_BUDGET_KB
node scripts/check-a11y.mjs      http://localhost:4173   # axe, both locales, both themes, reflow 320–1440
node scripts/check-fallbacks.mjs http://localhost:4173   # no JS, reduced motion, no form id
node scripts/check-chrome.mjs    http://localhost:4173   # one label per control, anchors clear the header
node scripts/check-effect.mjs    http://localhost:4173   # frame cost at 4× throttle, pause, reduced motion
```

`scripts/render-shots.mjs` captures screenshots at 390, 768, 1440 and 320 px and at 200 % zoom.
`scripts/make-og.mjs` renders the two Open Graph cards. Locally they use the installed Edge
(`PW_CHANNEL=msedge`); CI uses the bundled Chromium.

## Where the reasoning lives

| File | What it holds |
| --- | --- |
| [`.unique/brief.md`](.unique/brief.md) | Who reads this page, for how long, on what device, and the one job it has |
| [`.unique/stack.md`](.unique/stack.md) | Every technology choice, with the alternative it beat, its fallback and its measured cost |
| [`.unique/contract.md`](.unique/contract.md) | Tokens, grid, component rules, the directions rejected, and the scored rubric |
| [`.unique/audit-baseline.md`](.unique/audit-baseline.md) | The measured state of the previous version, which this one answers |
| [`.unique/log.md`](.unique/log.md) | Each design direction tried, so the next pass does not repeat one |
