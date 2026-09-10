# Case file

The public engineering case file of Matheus Pavaneli — a static, two-language page where every
claim is a measurement with a before and an after.

Live: `https://matheusPavaneli.github.io/portfolio/` → `/en/` or `/pt/`.

## What it is

One page, six blocks: a masthead, an index of every case, the eight cases themselves, the
method each one paid for, the reference record, and contact. Every case posts one reading —
a delta, a ceiling or a count — into a fixed column, so the page can be read top to bottom as
a column of numbers without reading a word of prose.

## Stack

Next.js 16 App Router with `output: "export"`, React 19, Tailwind 4, TypeScript strict with
`noUncheckedIndexedAccess`. No runtime dependencies beyond React. Deployed as a static
artifact to GitHub Pages by `.github/workflows/deploy-pages.yml`.

Two client components exist — the theme switch and the contact form — and everything else is
server-rendered at build time. Both locale routes are complete documents with JavaScript
disabled.

## Running it

```bash
pnpm install
pnpm dev                     # http://localhost:3000/en/
pnpm build                   # static export into ./out
node scripts/serve-out.mjs   # serve ./out at http://localhost:4173
```

Copy `.env.example` to `.env.local` and fill it in. With `NEXT_PUBLIC_FORMSPREE_FORM_ID`
unset the contact form renders its mail fallback instead, which is a supported state, not a
broken one.

## The checks

These run in CI on every push and pull request, and they exist because the previous version of
this site shipped a 2.81:1 primary button and 97 sub-AA text uses that nobody had measured.

```bash
pnpm typecheck
pnpm test                    # locale key parity + every palette pair against WCAG 2.2 AA
pnpm check:bundle            # initial JS against the budget in .unique/stack.md
node scripts/check-a11y.mjs http://localhost:4173        # axe, both locales, both themes, plus reflow
node scripts/check-fallbacks.mjs http://localhost:4173   # no JS, reduced motion, no form id
```

`scripts/render-shots.mjs` captures 390 / 768 / 1440 / 320 / 200 %-zoom screenshots, and
`scripts/make-og.mjs` renders the two Open Graph cards into `public/`. Locally they use the
installed Edge (`PW_CHANNEL=msedge`); CI uses the bundled Chromium.

## Why it looks like this

`.unique/` carries the decisions rather than the conclusions:

| File | What it holds |
| --- | --- |
| `brief.md` | Subject, audience, the one job, the constraints |
| `stack.md` | Every technology choice with its rejected alternative, its fallback and its measured cost |
| `contract.md` | The palette, type, grid and component grammar, each traced to a fact, plus the scored rubric |
| `log.md` | What has been tried, so the next pass diverges instead of repeating |
| `audit-baseline.md` | The measured state of the previous version, which is what this one answers |

Colours are generated and contrast-checked before they are written down; `src/lib/palette.test.ts`
re-checks them on every run and fails the build if a pair drops below its floor.
