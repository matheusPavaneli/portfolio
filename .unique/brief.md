# Matheus Pavaneli — engineering case file

SUBJECT   The public case file of an engineer who gets handed systems that are broken,
          abandoned or unbuilt and returns them as architecture — including the LLM systems
          a company is putting into production for the first time. Not a résumé page: a set
          of cases, each with the situation, the call made, and the number it moved.
AUDIENCE  Engineering leads, CTOs and technical founders at 10–200-person product companies
          (Brazil and international, hiring remote), plus the recruiter doing the first
          screen. Opens it once, from a link in an application or a DM, gives it 60–120
          seconds, roughly half of them on a phone, with four other candidates open in
          adjacent tabs. Second audience: a founder looking for someone to own an AI feature
          end to end on contract.
JOB       Make it decidable inside 90 seconds — on a phone — that this person can be handed
          a hard system, including an AI system, and be trusted to own the outcome. The
          evidence has to be readable at skim depth, not unlocked by scrolling.

## The problem with the page that exists

The evidence is already written and it is good — an LLM orchestration architecture with
multi-agent routing, provider failover and a response cache chosen off a five-model
benchmark; an approval gateway that pauses an agent's risky tool call until a human signs,
with an offline-verifiable audit chain; a 2 s → 150 ms query fixed by reading planner
statistics rather than guessing. Today it sits as bullet 1 of 4 inside the third band of
"Professional Experience", and as six chips in a 55-keyword list titled "AI Engineering".
The page's own title says "Fullstack Developer". The repositioning is not a copywriting
job — it is a structural one: the strongest evidence has to become the structure.

## Surfaces
- Case file · `marketing` · one page, the whole site; sections are cases, not CV headings [FIRST]

One surface. Deep project detail stays inline as expandable plates rather than becoming
routes, because a second route is a second thing to keep in sync and nobody links to it.

## Capabilities
- Read the whole page in Portuguese or English, with the right language on the first
  paint, crawlable and linkable in both · **core** — needs a technical decision, see below
- Present each case so the situation, the call and the number are legible without opening
  anything, and the depth is one gesture away · **core**
- Four project plates that each carry one instrument proving the project's own claim
  (state rail, byte gate, audit chain) · supporting
- Light and dark, honoured on first paint, no flash · supporting
- Contact that works with no backend — the site is a static export · supporting
- Section entrance motion and pointer response · decorative
- Search-engine and social presence: metadata, OG image, sitemap, robots, JSON-LD
  `Person` · supporting

Two `core` capabilities. That is in scope.

## Constraints
stack: Next.js 14 App Router, `output: "export"`, Tailwind 3, pnpm, Node 24 — existing and
       staying; no server, no runtime, GitHub Pages under `basePath=/portfolio`
devices: phone first (≈half the audience), 320 px floor, laptop second; 4G
browsers: last two versions of Chrome / Safari / Firefox / Edge; `:has()` and
       `@container` are available, CSS scroll-driven animation is not assumed
a11y: WCAG 2.2 AA, and it is not a formality here — the audit measured a 2.81:1 primary
       CTA and 97 sub-AA muted-text uses. The rebuild's palette must be generated against
       measured ratios, not picked by eye.
seo: yes — this page is often reached from a search for the name, and must rank and preview
       correctly in both languages
deploy: GitHub Actions → GitHub Pages, static artifact
deadline: none stated
forbidden: no AI attribution anywhere in commits, PRs or source (repo rule); no new
       runtime dependency without a line in `stack.md` justifying its bytes; no invented
       metric — every number on the page traces to something that happened

## Open questions
- Custom domain, or does the site stay at `matheusPavaneli.github.io/portfolio`? Affects
  canonical URLs, the i18n route shape and whether the OG image is worth generating per
  locale.
- Are Anchor and Seal linkable in public today (`useseal.dev` is in the source; Anchor has
  no URL)? A case with no link is a claim.
- Keep the freelance availability block? Its badge currently pulses "available" beside a
  period that ended Nov 2025.
- Is `NEXT_PUBLIC_FORMSPREE_FORM_ID` actually configured in the repo's Actions secrets, or
  has the contact form been rendering its mailto fallback in production all along?

## Handoff

→ `stack-route`. The bilingual capability is a real technical decision, not a library pick:
the current client-context + `localStorage` approach is what produces the English first
paint, the `lang="en"` on every document, and both message files in one bundle. The
alternative is static per-locale routes out of the export. That, plus the motion budget
(`framer-motion` currently costs the page most of its 161 kB for one fade-up), is what
`stack-route` has to price.
