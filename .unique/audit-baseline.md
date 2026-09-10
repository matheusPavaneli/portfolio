# Baseline audit — portfolio, as shipped at `c7d61c0`

Run before the refactor, so the refactor has a number to beat. Pipeline entry point:
**step 5 · `ship-audit`**, because code already exists. `brief.md`, `stack.md` and `log.md`
do not exist; `contract.md` covers only the featured-projects section, so the rest of this
audit runs against the defaults in `shared/quality/engineering.md` and `shared/quality/floor.md`.

## What was measured, and how

| Check | Command | Result |
| --- | --- | --- |
| Build | `pnpm run build` | ✓ compiled, no type errors |
| Bundle | build output | `/` = **161 kB** First Load JS, 21.8 kB route + 87.3 kB shared |
| Render | `scripts/render-shots.mjs` → 390 / 768 / 1440 / 320 / 1440@200 % | ✓ 5 shots in `.unique/render/` |
| Contrast | WCAG 2.1 relative luminance, tokens from `globals.css` | see below — **fails** |
| Console | Playwright page + console listeners | 1 page error, 1 × 404 |
| Page height | render | 13 392 px @1440 · **16 841 px @320** |
| LCP / INP / CLS | — | **not measured** — no field data, no throttled lab run |
| axe | — | **not run** — not installed |

`.unique/stack.md` does not exist, so step 9 (declared fallbacks exercised) has nothing to
check against. Reported, not skipped.

## Rubric — scored against `.unique/render/`, profile `expressive`

The surface is a page whose job is to be looked at and remembered, so MODE reads as
`marketing`/`editorial` → `expressive` (design 40 / usability 30 / signature 20 / content 10).

| Axis | Score | Scored against |
| --- | --- | --- |
| Composition | 2 | 1440.png: ten full-width bands, one `max-w-5xl` left column, identical rhythm top to bottom. At 1440 the right 30–45 % of every band is empty and carries nothing. |
| Type | 2 | crops/_hero.png, crops/_skills.png: two families, but the working scale is 163 hand-set sizes ≤ 11 px — 43 at 7 px, 2 at 6 px — each with its own tracking. Body prose is monospace throughout. |
| Color | 2 | One gold accent applied to headings, bullets, borders, icons, ordinals, rules, scrollbar and the CTA alike — the rubric's own "1" description, saved only by a disciplined ground. |
| Density | 2 | `py-24 sm:py-32 md:py-44` on nine of ten sections; uniform padding; nothing groups. 13 392 px at 1440. |
| Usability | 2 | Anchor targets land under the fixed header (0 uses of `scroll-mt`, visible in crops/_skills.png). Muted text fails AA everywhere. Full-page opacity fade on locale switch. First paint always English. 16 841 px at 320. Focus rings, skip link and 44 px targets exist, so not a 1. |
| Signature | 3 | The featured contents sheet (`<details>` plates) and the Nanquim state-rail are describable from memory and trace to the shipped contract. They live in one section; the other nine are generic. |
| Content | 2 | Real copy, no lorem. But the headline makes no argument, the CTA is "GET IN TOUCH", Skills is 55 undifferentiated keywords, Principles is six evidence-free maxims, and the subject's actual differentiator — AI systems work — appears only as six bullets inside that keyword list. |

```
(2+2+2+2)×0.10 + 2×0.30 + 3×0.20 + 2×0.10 = 2.2
total: 4.4 BELOW TARGET
```

Largest weighted shortfall: **Usability**, `(5−2) × 0.30 = 0.90`. Signature is second at 0.40.

## Blocking

1. **Light-theme accent fails AA at every size.** `--color-accent` `rgb(184 137 42)` on
   `--surface` `rgb(245 241 234)` = **2.81:1**. AA needs 4.5:1 for text, 3.0:1 for large text
   and UI. Every `text-accent` in light mode fails, including the accented word in all six
   section headings. `src/app/globals.css:2`
2. **The primary CTA's own label fails AA in light mode.** `--on-accent` on `--color-accent`
   = **2.81:1**. The gold "Get in touch" button is unreadable to the contrast standard.
   `src/app/globals.css:2,8` · `src/components/Hero.tsx:118`
3. **97 uses of `fg-muted` at alpha < 1, all failing AA.** Measured over `--surface`:
   `/70` = 3.00 dark / 2.57 light · `/55` = 2.27 / 2.05 · `/40` = 1.73 / 1.65 ·
   `/30` = 1.45 / 1.45 · `/25` = 1.33 / 1.35. This is not decoration — it carries status
   labels, project meta, tags, ordinals and the scroll hint.
4. **163 font sizes at or below 11 px carrying real content**, 43 of them at 7 px and 2 at
   6 px, most at `tracking-[0.35em]`–`[0.45em]`. Status, meta and tag values are set at 7 px.
5. **Anchor navigation puts every heading under the fixed header.** Zero `scroll-mt` /
   `scroll-margin-top` in `src/`; the header is `fixed` at `h≈68px`.
   `src/components/Header.tsx:51` · every `<section>` in `src/components/`
6. **The page is always English on first paint.** `LocaleProvider` returns a provider
   hard-coded to `en` until `mounted`, then swaps to the stored locale — a guaranteed content
   flash for every returning pt-BR reader, on every load.
   `src/context/LocaleContext.tsx:75-81`
7. **`<html lang>` is hard-coded `en`** and patched in an effect after hydration.
   `src/app/layout.tsx:66` · `src/components/LangSync.tsx:8`
8. **A page error and a 404 on load.** Console: `Invalid or unexpected token`, plus one
   404 — `public/` does not exist, so the `og:image`, favicon, `robots.txt` and `sitemap.xml`
   the metadata advertises are all missing. `src/app/layout.tsx:36-45`

## Should fix

9. **161 kB First Load JS on a static résumé page.** Budget for marketing is ≤ 100 kB,
   fails at 170 kB. 26 of 39 source files import `framer-motion`, and almost every use is the
   same `whileInView` fade-up that CSS + one `IntersectionObserver` does for ~0 kB.
10. **31 of 39 files are `"use client"`.** `page.tsx` is a server component that renders ten
   client components; the i18n context forces the boundary to the top. Nothing is
   server-rendered in practice.
11. **Both locales ship in the JS bundle** (`en.json` + `pt-Br.json` imported into a client
   context, 177 keys each), so every reader downloads copy in a language they did not ask for.
12. **`LocaleTransition` fades the whole page to `opacity: 0` for ~350 ms** on every locale
   switch (150 ms timeout + 200 ms). A deliberate content flash.
   `src/context/LocaleContext.tsx:57-64` · `src/components/LocaleTransition.tsx:13`
13. **`MouseGlow` writes `style.left/top` on every `mousemove`** with no `requestAnimationFrame`
   batching, on a 480 px element with `filter: blur(100px)`. `src/components/MouseGlow.tsx:15-21`
14. **`Header`'s IntersectionObserver takes the last intersecting entry**, not the topmost, so
   the active-section dot flips between two sections mid-scroll.
   `src/components/Header.tsx:37-41`
15. **`Hero` reads `prefers-reduced-motion` in an effect**, so the first frame always animates
   and then corrects — and it duplicates the global media query already in
   `globals.css:170`. `src/components/Hero.tsx:11-15`
16. **The section numbering is visibly broken.** Hard-coded `SectionMarker` indices run
   01, 02, 03, 04, 05, 06, 07, 09 — Hero has none and 08 does not exist. The site's own
   organising device does not survive a read.
17. **`tsconfig.json` has `strict` but not `noUncheckedIndexedAccess`**, and source carries
   two non-null assertions. `tsconfig.json:6` · `src/components/FeaturedSealCard.tsx:57,61`
18. **No tests, and CI runs no check.** `.github/workflows/deploy-pages.yml` builds and
   deploys; `lint` is never run in CI and there is no typecheck step.

## Noted

19. `profile.projects: []` is dead. `src/data/profile.ts:167`
20. The freelance block shows a pulsing "available" badge next to a period that ended in
    Nov 2025. `src/data/profile.ts:159` · `src/components/Freelancer.tsx:78`
21. Education is a single course dated 2026–2029 — not yet started — given a full band.
22. `metadata.title` says "Fullstack Developer"; `profile.title` says "Senior Fullstack
    Engineer". Neither says lead, and neither says AI.
23. Seven decorative devices coexist with no meaning attached: `pattern-dot`,
    `pattern-cross`, `MouseGlow`, `hover-shine`, `logo-letters`, `nav-link-underline`,
    `MagneticButton` + `TiltCard`.

## The one thing worth removing

**`Minigame.tsx` — 569 lines, the largest file in the repo**, a canvas Space Invaders sitting
between Principles and Contact. It is the last thing a hiring reader sees before the call to
action, it is the only capability on the page with no relationship to the subject, and it
costs a `dynamic(ssr:false)` boundary and its own render loop to deliver a joke. Removing it
removes a section, a boundary and a state machine, and shortens the path to Contact.
