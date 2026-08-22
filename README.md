# Matheus Pavaneli — portfolio

A single-page portfolio: who I am, what I have shipped, and the work I would
show first.

**Live:** https://matheuspavaneli.github.io/portfolio

---

## What is on it

One route, ten sections, numbered in the order they are read:

| Section | What it holds |
|---|---|
| Hero | Name, title, and the stack, on the first screen |
| About | How I work, in four words and a paragraph |
| Projects | Three featured builds, then the smaller repositories |
| Experience | Roles, with what each one actually changed |
| Skills | Grouped the way the CV groups them, not as a logo wall |
| Freelance | What I take on outside full-time work, and what came of it |
| Principles | Six, and none of them are "passionate about technology" |
| Education | Degree in progress, and certifications |
| Minigame | A canvas game where the targets are the skills above |
| Contact | A form and the three ways to reach me directly |

The order is deliberate. A developer portfolio is scanned, not read: the work
is the strongest evidence, so it comes before the CV, and the two sections a
recruiter is least likely to need — a degree still in progress, and a game —
sit after everything that argues for the hire.

## The featured projects

Each one gets a bespoke card rather than a slot in a grid, and each card's
visual comes from what the project actually does:

- **Seal** — approval gateway for AI agents. The card animates the MCP gate:
  a tool call held, sealed, released, over a hash-chained audit strip.
- **Anchor** — retention intelligence for performance agencies. The card draws
  the health-score gauge the product is built around, counting up on entry.
- **technology-art** — a scroll-led history of technology told through eight
  artefacts. The card's rail places those eras on the same logarithmic scale
  the site itself uses to turn the interval between two eras into the height of
  the silence before it, so the widest gap on the card is the 2,900,000 years
  the reader actually scrolls.

## Stack

- **Next.js 14** (App Router) with `output: "export"` — the whole site is
  static files
- **React 18**, **TypeScript**, **Tailwind CSS 3**
- **framer-motion** for entrance and scroll-triggered motion
- **next-themes** for the theme toggle
- **Formspree** for the contact form, so there is no backend to run

Typography is Cormorant Garamond for display and JetBrains Mono for
everything else. The ambient layers — a scroll progress rule, a glow that
follows the pointer, a tilt on the featured cards — are hand-rolled rather
than pulled in.

## Decisions worth explaining

**Content is typed data, not a CMS.** Every role, skill, principle and project
lives in `src/data/profile.ts` and `src/data/projects.ts` as `as const`
objects. Adding a job is a typed edit with autocomplete, and a typo in a key
fails the build instead of rendering blank.

**Bilingual with no i18n dependency.** `LocaleContext` holds the locale, two
JSON files hold the strings, and `t("path.to.key")` walks them. The choice
persists in `localStorage` and the switch fades out and back in — 150 ms out,
200 ms in — so the page does not flicker through a half-translated frame. No
route duplication, no library, and both languages ship in the same bundle.

**Colours are channel triples, not hex.** Every token is stored as
`--fg: 24 22 14` and consumed as `rgb(var(--fg) / <alpha-value>)`, so every
Tailwind opacity modifier works on every token. That is what lets the whole
page render in one accent at whatever strength each element needs.

**Hairlines have their own token.** Rules, grid gaps and input borders read
from `--line` rather than from the text colour at some guessed alpha, because
the same alpha over ink is a firm rule on the dark ground and nothing at all on
the cream one. The background patterns carry a second variable,
`--pattern-alpha`, for the same reason.

**The minigame reads the theme rather than hardcoding it.** It is a canvas
game, so it cannot use classes; instead it reads the same CSS custom
properties the rest of the page uses and repaints in the current theme. Its
targets are the skills listed one section above. It is dynamically imported
with `ssr: false`, so none of it reaches the first load.

**Motion is opt-out, everywhere.** A global `prefers-reduced-motion` rule
collapses every animation and transition to nothing, scroll-triggered reveals
fire once rather than on every pass, and the cards that loop an animation
check `useReducedMotion` before starting the loop. The one card animating a
position does it on a transform driven by a motion value, not on `left`, so a
loop never puts the browser through layout.

**Keyboard and screen reader first.** A skip link opens the tab order, the
decorative layers are `aria-hidden`, and every string a screen reader needs
lives in the `a11y` block of both message files rather than being improvised
per component.

## Running it

Requires Node 18+ and pnpm — the version is pinned by the `packageManager`
field, so CI and your machine run the same one.

```bash
pnpm install
cp .env.example .env.local   # fill in the Formspree form id
pnpm dev                     # http://localhost:3000
```

```bash
pnpm build   # static export into out/
pnpm lint
```

Two environment variables, both public by design:

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Subpath the site is served from — `/portfolio` on GitHub Pages, empty locally |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | The Formspree form the contact section posts to |

## Deployment

Pushing to `main` builds the static export and publishes it to GitHub Pages.
The base path is supplied at build time, which is why local development and
the deployed site can live at different roots without a conditional in the
code.

## Structure

```
src/
  app/          layout, the single page, global tokens and styles
  components/   sections, the featured project cards, and effects/
  context/      locale provider and the t() helper
  data/         profile.ts, projects.ts — all site content, typed
  messages/     en.json, pt-Br.json
```
