# Case file — design contract

SUBJECT      The public case file of an engineer handed broken, abandoned or unbuilt systems —
             including the LLM systems a company is putting into production for the first
             time. Read once, in 60–120 s, by a hiring lead with four other tabs open, half
             the time on a phone. The one job: make it decidable at skim depth that this
             person can be handed a hard system and be trusted to own the outcome.
MODE         marketing
ORIGINALITY  signature
BUDGET       loud
SIGNATURE    The meter: every case posts its reading on a logarithmic scale spanning a fixed
             three decades, so the distance between the two needles *is* the ratio — and a
             value held exactly at its limit puts both needles in one place and the travel
             closes to nothing.

## Why this replaced the previous direction

The first build of this surface was a plate book: hairline rules, zero radius, dense ruled
columns, mono eyebrows at wide tracking, and `01`–`08` ordinals on the cases. That is banned
default #3 in `originality.md` — the broadsheet — and the ordinals are the numbered-marker
tell: eight cases are a set, not a sequence, and numbering a set is decoration pretending to
be structure. It scored 8.8 while being, on its colour and layout axes, a default. This
direction is the correction, and the whole visual layer changed with it.

## Directions        (three wells, three directions, two killed)
A  Instrument panel  COLOR <- an anodized aluminium panel: a warm grey plate, silkscreened legends, and the deep phthalo the meter faces and blueprint legends are printed in (well: material) · TYPE <- a bezel legend is condensed because that is the width a bezel has, and the same face opens up for a heading (well: notation) · LAYOUT <- a rack is plates of different sizes screwed to one sheet, never one band repeated (well: instrument) · SIGNATURE <- an instrument answers with a needle against a graduated scale, not with a bar (well: instrument)
B  Trace waterfall   COLOR <- a console read in the dark (well: environment) · TYPE <- span labels are truncated monospace (well: notation) · LAYOUT <- nested spans on one shared time axis, each case a span at its real duration (well: notation) · SIGNATURE <- the waterfall itself, root span to leaf
C  Before and after  COLOR <- the system as inherited against the system as returned (well: shape of the data) · TYPE <- one face, two weights, the split carrying everything (well: constraint) · LAYOUT <- the page divides down the middle and scroll wipes between the two states (well: shape of the data) · SIGNATURE <- the wipe
KILL B — the durations are not comparable. A trace's whole grammar is that every span sits on
one time axis, and these cases span a query's 150 ms and a migration's fifteen months. Laying
them on one axis means either an axis nobody can read or one rescaled per case, which is a
waterfall lying about being a waterfall.
KILL C — the wipe is one gesture repeated eight times, and it puts the evidence behind an
interaction on a page whose job is to surrender it in 90 seconds. It also collapses on a
phone, where a left/right split becomes two stacked halves and the comparison dies.

## Tokens
color    Derived from the COLOR fact, then measured: 14 required pairs per theme, 28 in all,
         re-checked by `src/lib/palette.test.ts` on every run.
         light  page `oklch(97.5% 0.008 85)` · plate `oklch(88% 0.01 85)` ·
                recess `oklch(21% 0.01 85)` · ink `oklch(19% 0.0128 85)` ·
                dim `oklch(41% 0.0096 85)` · edge `oklch(56% 0.009 85)` ·
                signal `oklch(48% 0.13 255)` · alarm `oklch(48% 0.16 27)`
         dark   page `oklch(16% 0.009 85)` · plate `oklch(24% 0.01 85)` ·
                recess `oklch(11% 0.008 85)` · ink `oklch(94% 0.0128 85)` ·
                dim `oklch(70% 0.0096 85)` · edge `oklch(54% 0.009 85)` ·
                signal `oklch(70% 0.13 255)` · alarm `oklch(70% 0.16 27)`
         **Three grounds, not one**, because a panel has three: the sheet the rack is screwed
         to, a module's plate, and the recess a meter face is sunk into. The recess carries its
         own ramp (`on-recess`, `dim-recess`, `signal-recess`) rather than borrowing the
         plate's, which is what stops a dark module reading as a hole.
         The signal has three jobs and no others: a reading's after-value, the primary action,
         and a link that leaves the page. No token is ever used at an alpha below 1.
type     display Anybody, variable `wdth` — one family, three registers · body Familjen
         Grotesk · readout Martian Mono 400/500
scale    base 17 px · ratio 1.2 · legend 12 px · steps 13 / 15 / 17 / 20 / 24 / 30 / 38 px ·
         display step `clamp(2.5rem, 1.4rem + 4.6vw, 5rem)`, chosen above the ladder.
         Legends set at `wdth 80`, headings at `wdth 100–108`: the width axis separates the
         registers, not a second family and not a tracking value.

## Grid
PATH     the claim, at a size that is a decision → the status strip under it → the rack, whose
         module sizes say which case carries the argument → the recessed screen. Four stops.
COLUMNS  a twelve-column rack at ≥1024 px, modules spanning 4, 6, 8 or 12. It does not
         alternate and it does not repeat: the two cases carrying the argument take 8 and 12,
         the reference plates take 5 and 7, the rest take 4 and 6.
DENSITY  Densest: the record plates, four modules of compact reference. Emptiest: the masthead
         and the contact block. The recessed screen is the one module that is nearly all
         ground. Section padding is 40 / 56 px by role on a 4 px unit — the variance is carried
         by module span, not by padding, which is why the padding can stay even.
MEASURE  prose 62ch · a case kicker 52ch · the claim 16ch · a module readout unmeasured
RHYTHM   4 px unit. Module gap 12 px, plate padding 16/20 px, section padding 40/56 px.
BLEED    Nothing bleeds. A rack has a sheet edge and the 1240 px content width is it.

## Components
RECOGNIZED  (1) the meter — a graduated three-decade log scale with two needles and the travel
            between them; (2) the module — a milled plate carrying a silkscreened legend and a
            corner readout; (3) the legend itself, the display face at `wdth 80`; (4) the lamp,
            the round indicator every control carries; (5) the recess, the one sunk module.
INTERACTION Every control lights: its lamp fills with signal and its label goes to ink, in
            140 ms. Nothing slides, nothing lifts, nothing casts a shadow — an indicator on a
            panel does exactly one thing and this is it.
CONTROL     44 px, the AA target size and the phone-first audience. One second register
            declared: 32 px for the header's own controls, which keep a 44 px hit area by
            padding. No undeclared third.
CORNER      plate 6 px · recess 3 px · lamp 999 px. A panel is milled, so its corners carry the
            router bit; the recess is cut tighter because it is a second operation. Zero radius
            everywhere was the previous direction's broadsheet tell.
SEPARATION  **Ground carries structure.** A module is a plate on a sheet, and the 1 px ring at
            `edge` is that plate's machined edge rather than a rule doing the separating.
            Shadow is not used anywhere; nothing on a panel floats.
FOCUS       2 px ring in `signal` at 2 px offset, radius 3 px. Measured against every ground it
            can land on — page, plate and recess — in both themes.

## Effect spec

IDIOM      Instrument / notation — the trade's own graphic for "estimated against actual"
PRIMITIVE  Moiré. One primitive, not two: feedback was dropped during the build because its
           decay had no real quantity to map to, and a primitive with no mapping is a filter.
MECHANISM  Two regular grids describe the same system — what it was estimated to do and what
           it actually did — and where they disagree, the disagreement becomes visible.
JOB        reveal · response · repay
MAPPING    The pitch and angle difference between the two grids <- the ratio between a case's
           real before and after values, from `content/cases.ts`. 2 s → 150 ms is 13.3× and
           tears the field apart; 1.9 GB → 210 MB is 9.0×; 5 models → 1 is 5.0×. Nanquim's
           ceiling sits at **1.00** — value exactly at limit — and produces perfect
           registration: a flat field with no interference at all.
           Only the five cases carrying two magnitudes drive it. A count has one number and no
           divergence to show, so Seal, Anchor and the dashboard are named and excluded.
           The bound on both parameters is legibility: a moiré's beat spacing is roughly the
           pitch divided by the disagreement, so 3 % of pitch and 1.4° put the bands a few
           hundred pixels apart. The first build set 26 % and 4.2°, which collapsed the
           interference into a texture — corrected against the render, not the intent.
INPUT      pointer and keyboard, on five real controls — first meaningful frame under 100 ms,
           because the first case is selected at mount and one frame draws before any input.
TIER       T2 · one full-screen quad, one fragment shader, hand-written WebGL2, no wrapper ·
           measured 4.9 KB gz against an 8 KB cut line · one rAF that stops when the pointer
           settles, when the module leaves the viewport, and when the tab is hidden
QUIET      The panel pays: the masthead has no reading strip, every other module is flat plate
           with no motion of any kind, and the field is drawn in the recess ramp rather than in
           a colour of its own.
DEGRADE    reduced-motion: one composed frame, and switching cases still redraws because that
           is content. · no-WebGL / context-lost: two `repeating-linear-gradient` layers draw
           the same two grids at 0 KB — moiré is a property of the geometry, not the renderer.
           · low-power and mobile: DPR clamped to 2, loop paused off screen and while hidden.
           · no JS: the CSS fallback ships in the HTML, so the screen is never blank.
CUT LINE   Removed, not optimised, if the shader exceeds 8 KB gz, if the module costs more than
           3 ms of main thread per frame at 4× CPU throttle, or if LCP moves at all. Measured
           on every CI run by `scripts/check-effect.mjs`.

## Effect candidates, two killed
A  Divergence field   T2 · moiré · the ratio between before and after
B  Fallback ladder    T2/T5 · flow field · a request fans out to five providers and one answers
C  Plate book         T4 · three.js · the case file as physical plates, rotatable and lit
KILL B — the mapping cannot be real. The CV records that five models were benchmarked on cost,
latency and output quality; it does not record the five sets of values, and a particle count
tuned by eye is decoration wearing a data costume.
KILL C — the mascot failure: software with no body dressed in 3D chrome, at ~150 KB of runtime
to render geometry this subject does not have.

## Provenance
COLOR      warm grey plate, phthalo signal  <- An anodized aluminium instrument panel. The
           plate is a warm grey enamel, the legends are silkscreened onto it, and the one
           colour that appears is the deep phthalo blue meter faces and blueprint legends are
           printed in. Three grounds, because a panel has three surfaces.
TYPE       Anybody + Familjen Grotesk + Martian Mono  <- A bezel legend is condensed because
           that is the width a bezel has, and the same face opens up when it is a heading with
           room. One family carrying both means the width axis does the work a second family
           would otherwise do.
LAYOUT     the rack  <- An instrument rack is plates of different sizes screwed to one sheet.
           The size of a module is a statement about the importance of what is on it, which is
           exactly the statement eight identical bands could not make.
SIGNATURE  the meter  <- An instrument answers with a needle against a graduated scale. On a
           logarithmic scale equal ratios are equal distances, so the travel between the two
           needles is the case's ratio, comparably, across every case on the page — and a value
           held at its limit closes the travel to nothing.

## Gate 1 — swap test, per axis
COLOR      No. Three grounds only make sense where something is sunk into something else, and a
           signal reserved to "the value that moved" needs values that moved.
TYPE       No. The width axis is load-bearing: remove the bezel-legend register and the panel
           has no labels, only headings.
LAYOUT     No. Module size encodes which case carries the argument; on a subject whose items
           are peers it would read as an accident.
SIGNATURE  No. A three-decade log scale is meaningless without ratios to place on it.

## Gate 3 — collision check
Teenage Engineering's product pages, Braun's RAL-7035 panels, and a Grafana panel row. The
first two are the provenance and the resemblance is intended; the third is a collision worth
naming, and the difference is that a Grafana row draws live series while this draws eight fixed
readings with their scales engraved. Nothing in the banned-default registry: the ground is a
mid-warm-grey plate rather than cream (#1), the dark theme is a warm charcoal with a blue
signal rather than near-black with an acid accent (#2), the rules are gone entirely and the
radius is non-zero (#3), the modules are genuinely different sizes rather than a grid of equal
cards on heterogeneous content (#7), and there are no ordinals on the cases (#10).

## Rubric            (scored against `.unique/render/panel/`, 2026-09-10)
profile: expressive
composition: 4
type: 5
color: 4
density: 4
usability: 5
signature: 4
content: 5
total: 9.0

Baseline before any of this work: **4.4 BELOW TARGET** (`.unique/audit-baseline.md`). The
broadsheet direction reached 8.8. What each number is scored against, and what holds it below 5:

- **composition 4** — a rack whose module spans say which case carries the argument, a status
  strip, and one recessed screen. Held below 5 because the reading path is still a vertical
  stack of sections; only the modules vary, not the route through them.
- **type 5** — one family carrying three registers off its width axis, a scale that reads as a
  scale, a display step chosen above the ladder, and readouts in a face built for figures.
- **color 4** — three grounds, one signal with three declared jobs, 28 measured pairs. Held
  below 5 because a warm-neutral plate sits close to a beige, and blue is the most conventional
  accent hue available.
- **density 4** — module spans of 4 / 6 / 8 / 12 and a page that went from 9 302 px to 6 528 px
  at 1440. Held below 5 because the rhythm inside the modules is fairly even.
- **usability 5** — measured: `axe` reports 0 violations on `/en/` and `/pt/` in both themes; no
  horizontal overflow at 320 / 390 / 768 / 1440; 44 px controls with one declared 32 px
  register; the focus ring clears 3:1 on every ground; the form carries sending, invalid,
  bad-address, unreachable and sent states; and with JavaScript disabled both routes render all
  eight cases with their readings, the right `lang` and the reader's own system theme.
- **signature 4** — the meter is describable from memory and traces to its provenance. Held
  below 5 because the page now carries two signatures, the meter and the recessed screen, and
  the budget says to spend boldness in one place.
- **content 5** — real copy in both languages, checked line by line against the CV it comes
  from, with no invented metric anywhere.

## Removed
Chanel's rule, this pass: **the case index**. A ruled eight-row table listing the same cases
the rack below it already shows, carrying the ordinals that were the numbered-marker tell. The
rack is scannable on its own, so the index was a second navigation to keep in sync.

## Rejected
- The trace waterfall and the before/after wipe, both killed above with their reasons.
- The plate-book direction this replaced: correct in its rigour, and a default in its idiom.
- `01`–`08` on the cases. Eight cases are a set, and a set does not get numbered.
