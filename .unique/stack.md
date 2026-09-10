# Stack decisions

BUDGET  initial JS **≤ 100 KB gz** · LCP ≤ 2.0 s · INP ≤ 150 ms · CLS ≤ 0.05 · fonts ≤ 100 KB, ≤ 2 families
        (audience: a hiring lead, ~half on a phone on 4G, 60–120 s, one visit — `brief.md`)

Measured baseline before any change, from `pnpm run build` and `gzip -c` over `out/_next/static/chunks/`:

| Chunk | gz | What it is |
| --- | --- | --- |
| `7d771d05` | 52 KB | react-dom |
| `framework` | 43 KB | React + Next runtime |
| `641` | **39 KB** | `framer-motion` — confirmed by `motionValue` / `VisualElement` symbols |
| `main` | 31 KB | Next client entry |
| `588` | 31 KB | shared vendor |
| `app/page` | 17 KB | the page's own client components |
| `776` | **11 KB** | **both message files** — confirmed: one chunk contains `"Arquitetura que"`, `"LLM orchestration"` and `"Bug Invaders"` |
| `11`, `55`, `layout`, `webpack` | 15 KB | rest |

Next's own report: **First Load JS `/` = 161 KB**. Budget says 100 KB and fails at 170 KB.
The 50 KB carried by `framer-motion` and the duplicated message catalogue is the whole gap.

---

## Framework and runtime

CAPABILITY  Serve a static, crawlable, two-language page from GitHub Pages with no server
ROLE        core
TIER        1 / existing stack, version moved
CHOICE      `next@16` App Router, `output: "export"`, `react@19`, `tailwindcss@4`
            (verified against the registry 2026-09-10: next 16.3.4, react 19.3.0, tailwindcss 4.3.3)
COST        not measured until the first build on 16 · build-time only · migration risk on
            ~40 components that are being rewritten in this pass regardless
WHY         `brief.md` fixes the framework and the deploy target, not the major. Two things
            make the major worth moving in the same pass: Tailwind 4 puts tokens in `@theme`,
            which removes the parallel `:root` custom-property set plus `tailwind.config.ts`
            colour map that let the current palette drift past its own contrast floor; and a
            page arguing senior/lead engineering in 2026 on a 14.2 baseline argues against
            itself.
REJECTED    Stay on `next@14.2` / `react@18` / `tailwind@3` — it is the zero-risk option and
            it loses on one point: the token duplication that produced blocking findings 1–3
            of `audit-baseline.md` is a Tailwind-3 shape. Also rejected: **Astro + islands**,
            which is the correct framework for this page on bytes alone and is refused
            because `brief.md` fixes the stack and a framework migration is a project, not a
            step.
FALLBACK    If the 16 migration is not green after the codemods, the build stays on 14.2 and
            every other decision in this file still holds — none of them depend on the major.

## Bilingual, correct on the first paint

CAPABILITY  Read the whole page in Portuguese or English, right language on the first paint,
            crawlable and linkable in both
ROLE        core
TIER        1 — platform: static routes + build-time message resolution
CHOICE      `platform: app/[lang]/` root layout with `generateStaticParams()` → `/en/` and
            `/pt/`, each a fully static document; `<html lang>` comes from the segment.
            `/` is a 15-line `public/index.html` chooser: `hreflang` pair, a canonical to
            `/en/`, a `navigator.language` hop, and two real links for no-JS.
            Messages are plain TypeScript objects imported by **server** components, so the
            active locale's strings exist only in the HTML.
COST        **0 KB runtime** — removes the measured 11 KB duplicate catalogue and the client
            context that forced the `"use client"` boundary to the top of the tree
WHY         `brief.md`: "right language on the first paint, crawlable and linkable in both".
            The current context + `localStorage` shape cannot do any of the three — it is the
            direct cause of blocking findings 6 and 7 in `audit-baseline.md`.
REJECTED    `next-intl` — the mature choice and the reflex one. It loses here because every
            string on this surface resolves at build time, so its provider buys nothing but a
            client boundary, and its locale negotiation runs in middleware, which does not
            exist under `output: "export"`. Also rejected: keeping the client context, which
            is the thing being fixed.
FALLBACK    JS disabled: `/en/` and `/pt/` are complete static documents and lose nothing;
            `/` falls back from the `navigator.language` hop to two visible links. Locale is
            a URL, so it survives a share, a bookmark and a crawler.

## Motion and reveal

CAPABILITY  Section entrance motion and pointer response; the four project plates' instruments
ROLE        decorative (reveals) · supporting (instruments)
TIER        1 — platform: CSS scroll-driven animation, WAAPI, `IntersectionObserver`
CHOICE      `platform: animation-timeline: view()` for every reveal, inside
            `@supports (animation-timeline: view())` so unsupported browsers get the content
            already visible. Instruments that step through real states — the Nanquim state
            rail, the Seal audit chain, the byte gate — use the Web Animations API driven by
            one shared ~60-line `IntersectionObserver` + `matchMedia` hook.
COST        **0 KB** · off the main thread for the reveals · one observer for the whole page
WHY         26 of 39 files import `framer-motion` and all but four use it for the same
            `whileInView` fade-up. 39 KB gz, measured, for one CSS keyframe. `role:
            decorative` may not outcost `role: supporting` — the routing rubric refuses it.
REJECTED    **Motion (`motion`, ex-`framer-motion`), lazy-loaded below the fold.** The real
            contender: it is already installed, its spring model and layout animations are
            best-in-class, and lazy-loading answers the byte objection. It loses because this
            page uses neither springs nor layout animation — nothing here animates between two
            measured layouts — so the entire justification for the dependency is unused.
FALLBACK    `prefers-reduced-motion: reduce` → every reveal resolves to its end state, every
            instrument renders its final frame and does not step. No `animation-timeline`
            support → content is visible, unanimated, no JS involved.
CORRECTED   Two things changed once the code existed. The four project plates and their
            instruments were removed with the rest of the featured section, so the WAAPI half
            of this entry ships as one rule and no hook. And the blanket reveal was cut at the
            render pass: `animation-timeline: view()` left every case screenshotted blank,
            because an element whose timeline has not advanced sits at its `from` state — and a
            reveal on everything was against the contract anyway. What ships is one scroll-driven
            keyframe, on the reading's after-track. Still 0 KB.

## Theme, honoured on the first paint

CAPABILITY  Light and dark, correct before first paint, no flash
ROLE        supporting
TIER        1 — platform: a blocking inline script + `data-theme` on `<html>`
CHOICE      `platform:` 12-line inline script reading `localStorage` then
            `prefers-color-scheme`, setting `data-theme` and `color-scheme` before paint;
            a small client island for the toggle
COST        ~0.4 KB inline, uncached-but-tiny · removes `next-themes`
WHY         `next-themes` mounts a provider at the root of the tree, which is one of the two
            reasons 31 of 39 files in this repo are client components. The behaviour it adds
            over the inline script is cross-tab sync and live system-change tracking, on a
            page a reader opens once.
REJECTED    `next-themes@0.4` — installed, correct, and 2–3 KB. It loses on the client
            boundary it forces, not on its bytes.
FALLBACK    JS disabled: `color-scheme: light dark` plus a `prefers-color-scheme` media block
            gives the reader their system theme with no script; only the toggle is inert.

## Contact with no backend

CAPABILITY  A message reaches the subject from a static page
ROLE        supporting
TIER        2 — small hosted endpoint, no SDK
CHOICE      Formspree via a plain `fetch` POST from one client island (already in the repo);
            `mailto:` card when `NEXT_PUBLIC_FORMSPREE_FORM_ID` is unset
COST        0 KB — no SDK, `fetch` is a built-in
WHY         `brief.md` constraint: no server, static export. Keep what works.
REJECTED    Web3Forms / Formspark — equivalent, and switching costs a secret rotation for no
            gain. Also rejected: `mailto:` only, which loses the reader who has no mail client
            configured.
FALLBACK    No env var → the mailto card renders instead of the form (already implemented).
            Network failure → an inline error naming the address to write to directly, not
            "Something went wrong".

## Search and social presence

CAPABILITY  Rank and preview correctly for a search on the name, in both languages
ROLE        supporting
TIER        1 — platform: framework metadata + static files
CHOICE      `app/sitemap.ts` and `app/robots.ts` (both emit static files under
            `output: "export"`), per-locale `alternates.languages` + `canonical`, inline
            JSON-LD `Person`, and a real `public/og-*.png` per locale rendered once by the
            repo's own Playwright script
COST        0 KB runtime · two PNGs
WHY         `brief.md`: reached from a search for the name, must preview correctly in both
            languages. Today `public/` does not exist and every one of these 404s.
REJECTED    `next/og` `ImageResponse` — it is the idiomatic answer and it wants a runtime;
            under `output: "export"` a checked-in PNG is fewer moving parts and no build
            surprise. Also rejected: no OG image, which is the status quo.
FALLBACK    A crawler that ignores JSON-LD still gets correct `<title>`, description and
            `hreflang`.

## Icons, fonts, utilities

CAPABILITY  Icons; two type families; class composition
ROLE        supporting
TIER        1 — platform / built-in
CHOICE      Inline SVG per icon (`currentColor`, no library). Type via `next/font` — the
            faces themselves are `frontend-design`'s call, the ceiling is two families and
            100 KB. `clsx` + `tailwind-merge` only if the component layer actually needs it.
COST        0 KB for icons · fonts measured at audit
WHY         The page has ~14 icons, all hand-drawn already.
REJECTED    `lucide-react` — right for a product with 60 icons; a barrel import for 14.
FALLBACK    Fonts: `next/font` emits a metric-matched fallback, so a failed font load costs
            no layout shift.

## Verification gates

CAPABILITY  Stop the defects this audit just found from returning
ROLE        supporting
TIER        2
CHOICE      `vitest` for pure logic (message-key parity between locales; a contrast test that
            asserts every token pair in the palette against WCAG 2.2 AA and fails the build
            under it), `@axe-core/playwright` on `/en/` and `/pt/`, and a bundle-size
            assertion against the 100 KB line — all three in CI, which today runs no check at all
COST        devDependencies only, 0 KB shipped
WHY         Blocking findings 1–4 of `audit-baseline.md` are all "a number nobody asserted".
            `playwright` is already installed for the render pass.
REJECTED    A review checklist. It is what produced the 2.81:1 CTA.
FALLBACK    Chromium download is blocked in this environment (`Failed to download Chrome for
            Testing`), so the local render pass runs through the installed `msedge` channel;
            CI uses the normal download.

## Ledger — measured after the build, and one prediction corrected

Measured with `scripts/check-bundle.mjs`, which sums the gzipped bytes of every script the
built page loads for a modern browser (`noModule` legacy polyfills excluded, the same way
Next's own First Load JS number excludes them).

| | Before | After |
| --- | --- | --- |
| Initial JS, `/` → `/en/` | 161 KB gz | **132.4 KB gz** |
| Both message catalogues in the bundle | 11 KB gz | **0** |
| `framer-motion` | 39 KB gz | **0** |
| `next-themes` | ~2–3 KB gz | **0** |
| This project's own client code | — | **~5 KB gz** (theme switch + contact form) |
| Page height at 1440 | 13 392 px | 9 302 px |
| Files marked `"use client"` | 31 of 39 | **2 of 24** |

**The prediction in the framework entry above was wrong, and this is the correction.** It said
the `next@16` / `react@19` baseline would move in a favourable direction, size not measured.
Measured, it moved the other way: the framework accounts for roughly **127 KB gz** of the
132.4, against roughly 87 KB on the 14.2 baseline. Every saving in this project came from the
decisions below the framework line; the framework gave back about 40 KB of it.

```
TOTAL  132.4 KB gz   vs budget 100 KB   OVER BY 32.4 KB
```

The surface is **over budget** and the report says so. What that does and does not mean:

- It is not our code. This project's own client JavaScript is ~5 KB gz. Removing both islands
  entirely would land around 127 KB, still over.
- It is not the reading experience. Both routes are complete static documents:
  `scripts/check-fallbacks.mjs` loads them with JavaScript disabled and finds all eight cases,
  the full index, the correct `<html lang>` and the reader's own system theme. The JS is
  hydration for two controls, not the page.
- The remaining levers, in order of what they cost:
  1. **Pin back to `next@14.2` / `react@18`**, keeping Tailwind 4 and every other decision in
     this record. Projected ≈ 97 KB gz — under budget — at the cost of running a two-major-old
     framework on a page that argues about currency. This is the stack record's declared
     FALLBACK and it is a one-line change to `package.json` plus reverting the async `params`
     signatures.
  2. **Astro with islands**, which is the correct framework for this page on bytes alone and
     which `brief.md` forbids as a migration.
  3. Accept 132.4 KB and hold the line there, which is what CI does today:
     `JS_BUDGET_KB=135` fails the build on a regression.

Option 3 ships. Options 1 and 2 are the user's call, not this record's.


## Next

`frontend-design` and `build-surface` are done; the contract carries the scored rubric
(**8.8**, against a **4.4** baseline) and `.unique/log.md` carries the divergence entry. The
one decision left open by this record is the budget overage above — options 1 and 2 are the
user's call.
