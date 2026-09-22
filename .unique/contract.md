# Case file — design contract

SUBJECT      The public case file of an engineer handed broken, abandoned or unbuilt systems —
             including the LLM systems a company is putting into production for the first
             time. Read once, in 60–120 s, by a hiring lead or a recruiter with four other tabs
             open, half the time on a phone. The one job: make it decidable at skim depth that
             this person can be handed a hard system and be trusted to own the outcome.
MODE         marketing
ORIGINALITY  benchmark(Linear)
BUDGET       measured
SIGNATURE    The readings board: every case that moved a number is a bar on one shared
             logarithmic ratio axis, so the lengths compare across cases — and what held under a
             limit, or is a single figure, is stated rather than drawn.

## Why this contract was rewritten (2026-09-22)

The file described an instrument panel — Anybody, Familjen Grotesk, a phthalo signal on a
warm grey plate, a moiré screen — that no longer exists in the code. The code had moved to
the Ink & Signal system (`src/app/globals.css`) and only the 2026-09-22 build amendment below
said so. A contract that describes a different page is the "decision that left no trace"
failure, so the top is replaced to match what ships.

Ink & Signal sits on banned default #2 (near-black ground, one acid accent, mono labels) and
leans on #12 (Geist + Geist Mono). That was put to the owner on 2026-09-22 with a recommended
new signature direction; the owner chose to keep Ink & Signal and refine it. ORIGINALITY is
therefore `benchmark(Linear)`, not `signature`: Linear supplies the bar — spacing rhythm,
contrast discipline, one accent spent sparingly, copy density — never the look. The colour
axis is scored with that default counted against it.

## Directions        (three wells, three directions, two killed)
A  Ink & Signal, refined  COLOR <- the owner's adopted system, contrast-checked in CI (well: constraint) · TYPE <- figures must line up in columns, so one mono face carries every number (well: notation) · LAYOUT <- a ledger: rows a reader scans for what, where, how much, when (well: notation) · SIGNATURE <- a log ratio axis, the trade's way of comparing improvements of different units (well: instrument)
B  Instrument panel       COLOR <- anodized aluminium plate with a phthalo legend (well: material) · TYPE <- a bezel legend is condensed (well: notation) · LAYOUT <- a rack of plates at four spans (well: instrument) · SIGNATURE <- two needles on a three-decade scale
C  New signature pass     COLOR <- re-derived from the subject's material world (well: material) · TYPE <- re-derived five-step face choice (well: notation) · LAYOUT <- re-derived (well: shape of the data) · SIGNATURE <- re-derived
KILL B — superseded by the owner's adoption of Ink & Signal on 2026-09-22; it survives only as
the stale text this rewrite removes, and rebuilding it would reverse a recorded owner decision.
KILL C — declined by the owner on 2026-09-22 when offered as the recommendation; the brief's
job is served by fixing the evidence and the naming, which C would have delayed.

## Tokens
color    Ink & Signal, copied verbatim, re-checked by `src/lib/palette.test.ts` on every run.
         dark   bg `#0c0c0b` (oklch(14.5% 0.002 106)) · surface `#161614` · raised `#1e1d1b` ·
                line `#2a2925` · line-control `#6a655b` · text `#ece7dd` · muted `#8c877d` ·
                accent `#c8f03c` (oklch(90% 0.2 124)) · spice `#ff6a3d`
         light  bg `#f3efe7` · surface `#eae5da` · raised `#fbf9f4` · line `#ddd6c8` ·
                line-control `#8f8676` · text `#141311` · muted `#655f55` · accent `#3f5a00` ·
                accent-fill `#c8f03c` · spice `#c24a22`
         The accent has four jobs and no others: a reading, the primary action, the status
         lamp, and the current nav mark. Chips, rules and method evidence are neutral.
type     sans Geist (language) · mono Geist Mono (every figure, every label)
scale    label 12 · small 13 · body 15 · body-lg 17 · h3 18 · h2 24 · metric 28 · h1 32 px ·
         display-xl `clamp(2.5rem, 1.1rem + 7vw, 4.5rem)`
motion   tint 150 ms on colour and border · build 360 ms · board sweep 620 ms, once

## Grid
PATH     name and role → the claim → the filled action and the résumé → the spec strip (now,
         stack, where) → the readings board, whose top is inside the first 900 px fold at
         1440 → the ledger with three cases open → build → method → record → contact.
COLUMNS  shell 1120 px; spec strip 3 columns at ≥768, 1 below; board
         17rem / 1fr / 4.75rem; ledger 1fr / 11rem / 10rem / 6.5rem; build 4 + 8 of 12.
DENSITY  Densest: the board and the record's skill register. Emptiest: the masthead and
         contact. Section padding 64 / 96 px; the variance is carried by the rows, not the
         padding.
MEASURE  prose 65ch · kicker 60ch · display 15ch · method evidence 60ch
RHYTHM   4 px unit. Heading → lede 16 px, lede → body 48 px, row padding 20 px, chip 24 px.
BLEED    Nothing bleeds. The rail and every section share one inner edge: padding outside,
         `max-w-shell` inside — the rail had it the other way round and sat 32 px inside.

## Components
RECOGNIZED  (1) the readings board — log axis, graduations named once, bar then dot;
            (2) the ledger row — a native `<details>` with what / where / ratio / when;
            (3) the mono label; (4) the status lamp; (5) the build diagram node.
INTERACTION Colour and border only, 150 ms. Links move their underline from `line-control` to
            the accent; controls move their border to `muted`. Nothing lifts or casts a shadow.
CONTROL     44 px for the page's controls; one declared second register of 40 px for every
            control in the rail (language, theme, menu) — previously 40 and 44 mixed there.
CORNER      Two radii, by role: 6 px (`radius-sm`) for anything touched or inline — controls,
            fields, chips, board rows, diagram nodes; 10 px (`radius-md`) for containers —
            board, stage, menu, form panel. `rounded-full` only for data marks and the lamp.
            The 4 px third radius (`radius-xs`) is removed.
SEPARATION  Tone and 1 px `line` rules. No shadow anywhere.
FOCUS       2 px `focus` ring over 2 px of `bg`, drawn as box-shadow so it follows either radius;
            outline kept for forced-colors.

## Provenance
COLOR      Ink & Signal  <- the owner adopted this system on 2026-09-22 and it is re-measured in
           CI; kept as a recorded owner decision against banned default #2.
TYPE       Geist + Geist Mono  <- every number on the page is compared down a column, so the
           figures need one tabular face; Geist is the system's pairing.
LAYOUT     the ledger  <- a reader filters on what, where, how much and when, and a row with
           those four columns answers it without opening anything.
SIGNATURE  the readings board  <- on a log axis equal ratios are equal lengths, so a 13.3×
           query fix and an 8.1× citation cut are comparable though their units differ.

## Borrowed / invented
BORROWED  one accent spent on state and action only, never on decoration, from Linear
BORROWED  every control one of two declared heights, and one inner edge shared by chrome and content, from Linear
BORROWED  copy that states the number before the adjective, from Linear
INVENTED  the readings board and its moved / held / counted split, from the log-axis provenance fact
INVENTED  the ledger's what / where / ratio / when row, from the layout provenance fact
INVENTED  method rules that link to the case that paid for them, from the case file's claim

RISK      The first fold's only filled accent is the call to action, not the evidence: arguable
          against Ink & Signal's "the board owns the fold", defended by the brief's reader, who
          may have decided before scrolling and should not have to hunt for the way to act.

## Rubric            (scored against `.unique/render/v6/` and `v6pt/`, 2026-09-22)
profile: expressive
composition: 4
type: 4
color: 3
density: 4
usability: 5
signature: 3
content: 5
total: 8.2

- **composition 4** — the first fold now carries identity, action, the recruiter's four
  filters and the top of the evidence. Held below 5: at 1440 the right half of the masthead
  is empty ground.
- **type 4** — display line with real optical tracking, a mono face that lines figures up.
  Held below 5 by the Geist pairing reflex (#12).
- **color 3** — disciplined accent and 28 measured pairs, but the palette is banned default
  #2, kept by owner decision.
- **density 4** — board, ledger and register are dense; masthead and contact are quiet.
- **usability 5** — measured: `check-a11y` PASS (axe, both locales, both themes, no overflow
  from 320 to 1440), `check-chrome` PASS (every anchor clears the rail), `check-effect` PASS
  (median 5.6 ms/frame at 4× throttle), `check-fallbacks` PASS (no-JS renders every case).
- **signature 3** — the board is real and honest now, but the build band is a generic
  system-design walk the owner chose knowingly (see its risk clause).
- **content 5** — every number traces to the CV or a public repo; the fake 5.00× and 1.00×
  ratios are gone; rag-eval, the strongest checkable AI evidence, is in.

## Removed
Chanel's rule, this pass: **the ratio on everything**. "5 models → 1" was drawn as a 5.00×
improvement and two held ceilings posted 1.00× and 1.01× beside a dot on zero. Benchmarking is
a count, and a ceiling that held is stated as value ≤ limit.

## Rejected
- The instrument panel and a new signature pass, killed above with the owner's reasons.
- `01`–`08` ordinals: the `ordinal` field is removed from the data, not just hidden.
- Filled accent chips under every case: five lime fills per open row outshouted the readings.
- The accent bar down the left of each method rule (#14): replaced by a link to the case
  that paid for it.

## Open for the owner
- The current title is "Software Engineer" while the page's role line says senior; the
  strip states the title as the CV has it.

## Amendment — 2026-09-22, the build

Entered at step 4 (signature) because it replaces the effect and nothing else. Tokens are
Ink & Signal's (`src/app/globals.css`), unchanged: no colour, face or radius is added, and the
one new value is the motion exception declared below. Direction pass run against the official
`frontend-design` skill and `shared/design/spectacle.md`. Decisions confirmed by the owner on
2026-09-22: generic system, scroll-driven sticky, copy rewritten, SVG on the site's tokens.

SUBJECT    The #build band stops measuring a gap and starts showing the job: an
           architecture drawn from nothing, one requirement at a time. Each requirement adds
           the least structure that satisfies it, and names the cost that structure brings.
           The cost line is the point — the page's claim is "trusted to own the outcome", and
           owning it means knowing what every box will charge you later.
IDIOM      Notation — the whiteboard system-design walk, drawn the way the trade draws it:
           boxes, directed edges, nothing illustrated.
PRIMITIVE  State sequence on a fixed graph. Every node and edge has a lifespan
           `[since, until)` in steps; a step is a set difference, never a relayout.
MECHANISM  Seven requirements, in order:
           1 serve users → client, API, database
           2 p95 reads < 200 ms → cache beside the database
           3 ten times the traffic → load balancer, three stateless API instances
             (the client→API edge is *removed*; client→LB→API replaces it)
           4 reads far outnumber writes → two read replicas
           5 slow work cannot hold the request → queue and workers
           6 a provider outage cannot take us down → circuit breaker, fallback provider
           7 know it broke before users do → telemetry band every node reports into
JOB        reveal (how a system grows) · response (scroll drives it) · repay (each stop
           returns a requirement, a decision and its cost — three facts per stop)
MAPPING    step index <- which requirement block holds the reading band (viewport 40–60 %).
           Visible at step n = lifespan contains n. Added at n = `since == n`; removed at
           n = `until == n`. Pure function, tested; the diagram never decides anything.
INPUT      Native scroll. No scroll-jacking, no snapping, no smooth-scroll library: the
           requirement blocks are ordinary flow content rising past a sticky diagram.
TIER       T0 · inline SVG + CSS transitions + one `IntersectionObserver`. 0 KB of dependency.
           Removes the WebGL2 field (4.9 KB gz shader and its rAF loop).

### Layout
CONCEPT    A  Column left, diagram right: requirements rise in a 4-col column, the diagram is
              sticky in 8 cols. Chosen — it is what the owner described, and the text stays
              on the reading side.
           B  Diagram full width, one requirement ticker beneath it. Killed — the text becomes
              a caption and loses the cost line, and a ticker is a marquee.
           ≥1024
           | head: eyebrow · counter "3 / 7" | title | lede                            |
           | req 1 (flow, 70svh)  | [ sticky: top 12vh, h 76svh                     ] |
           | req 2                | [   diagram, viewBox 960×560, landscape         ] |
           | …       (4 cols)     | [   (8 cols)                                    ] |
           <1024
           | head                                                                    |
           | [ sticky: top 64px, h 52svh — diagram, viewBox 360×480, portrait ]      |
           | requirement blocks rise underneath, 60svh each, full width              |
           Two coordinate sets, one graph: positions are per layout, lifespans are shared.
           At 390 px a landscape viewBox scales labels to ~6 px, so portrait is required.
PATH       title → current requirement → the box it added (accent) → its cost line.
COLUMNS    12 at ≥1024 (4 + 8, gap 32) · single column below.
MEASURE    requirement 28ch · adds and costs 40ch · lede 62ch.
RHYTHM     4 px unit; block padding 24 px; node labels at `text-small`, never under 12 px as
           rendered at 320 px (the portrait viewBox is sized so they hold).
BLEED      None; the shell's 1120 px is the edge.

### Components
NODE       Rect, `radius-xs`, fill `surface-raised`, 1 px `line-control` ring, label in sans
           `text-small` / `text` — not mono: mono small labels are banned default #5, and the
           site already spends mono on readouts.
EDGE       1 px `line-control`, arrowhead at the target. The queue→worker edge is dashed;
           asynchronous is the only thing a dash means here.
NEW        The step's added nodes and edges take `accent` for ring, label and stroke; the
           rest return to `line-control`. One accent at a time — the Ink & Signal budget.
REMOVED    The one removed edge (step 3) exits in `spice` and is gone when the step settles.
REQUIRE    Block: the requirement as the heading (`h3`), then two lines, "Adds" and "Costs".
           The cost sits in `text`, not muted, because it is the argument. Current block in
           `text`; passed blocks `text-muted`.
COUNTER    "n / 7" in the band's corner, where the ratio readout was. The steps are a real
           sequence, so a number is information here, not the ordinal tell.
MOTION     The declared exception to "150 ms on colour, no entrance": an added element draws
           in (edge `stroke-dashoffset`, node ring then label) over 360 ms on `ease-signal`;
           colour settles in `duration-tint`. One new token, `--duration-build: 360ms`.
           Scrolling back reverses the same transitions. Nothing else on the page moves.

### Degrade
reduced-motion  No sticky, no stepping: the final architecture drawn once, all seven
                requirements beneath it as a numbered list, every element in `line-control`.
no JS           The server renders that same final frame and list — the band is never blank
                and never needs the observer to be read.
low-power       Nothing runs per frame; the observer only swaps a step index.
a11y            SVG `role="img"` with a caption naming the final architecture. The requirement
                blocks are the accessible content, so no live region (announcing on scroll is
                noise). Nothing in the band is focusable; it is read, not operated.

### Gates (spectacle A–D, originality 1 and 3)
A          Passes reveal and repay. The tour risk is real ("a scroll sequence explaining what
           a paragraph explains faster"); answered by native scroll only, and by every stop
           returning a cost that a paragraph would bury.
B          A portfolio, visited once: the effect may be large. Below the fold, never in LCP.
C          T0 is the lowest tier that expresses it. Canvas or WebGL would buy nothing.
D          Quiet: the moiré's shader and rAF leave; the masthead board stays the one filled
           accent.
SWAP (1)   LAYOUT passes — the column/diagram pairing is the owner's brief. SIGNATURE is at
           risk: a generic architecture could sit on any backend portfolio, and the owner
           chose generic knowingly. It is held to this page only by the cost line, which is
           the case file's claim restated. RISK CLAUSE: cut the cost lines and this is
           wallpaper.
COLLISION  ByteByteGo diagrams, AWS reference-architecture animations, system-design-interview
           scrollytelling. Difference: no vendor logos, no icon set, one accent, and every box
           arrives with its bill.

### Copy (EN draft; PT in the plan)
eyebrow    The build
title      Every box on the diagram was a requirement first.
lede       Nobody draws the final architecture on day one. It grows one requirement at a
           time, and each thing added solves one problem and starts charging for another.
           Scroll through seven of them.
1  Serve users.                           Adds: one API, one database.
                                          Costs: nothing yet — one thing to deploy, one to back up.
2  Reads under 200 ms at p95.             Adds: a cache.
                                          Costs: every write now has to invalidate something.
3  Ten times the traffic.                 Adds: a load balancer, stateless API instances.
                                          Costs: session state can no longer live in the process.
4  Reads far outnumber writes.            Adds: read replicas.
                                          Costs: a read can now lag the write before it.
5  Slow work can't hold the request.      Adds: a queue and workers.
                                          Costs: jobs fail out of sight, so they need retries and a dead-letter queue.
6  A provider outage can't take us down.  Adds: a circuit breaker and a fallback provider.
                                          Costs: two integrations to keep honest instead of one.
7  Know it broke before users do.         Adds: logs, metrics and traces from every box.
                                          Costs: a bill, and someone on call to read it.

### Rubric
not rendered — pending build; scored with `render.mjs` after implementation.
