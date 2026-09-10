export const en = {
  meta: {
    title: "Matheus Pavaneli — senior fullstack & forward-deployed AI engineer",
    description:
      "I take the broken, the abandoned and the not-yet-built — including the LLM systems a company is putting into production for the first time — and hand back an architecture, with the number it moved.",
    ogAlt: "Matheus Pavaneli — engineering case file",
  },

  a11y: {
    skipToContent: "Skip to the case file",
    mainNav: "Sections",
    openMenu: "Sections",
    language: "Language",
    toLight: "Go light",
    toDark: "Go dark",
    externalLink: "opens in a new tab",
  },

  nav: {
    index: "Index",
    cases: "Cases",
    method: "Method",
    record: "Record",
    contact: "Contact",
  },

  masthead: {
    role: "Senior fullstack engineer · forward-deployed AI engineer",
    headline: "Hand me the system nobody wants to own.",
    lede: "I take the broken, the abandoned and the not-yet-built — including the LLM systems a company is putting into production for the first time — and hand back an architecture, with the number it moved.",
    readingsLabel: "Three of them",
    cta: "Start a conversation",
    location: "Maringá, Brazil (UTC-3) · remote",
    scroll: "The whole file is below",
  },

  index: {
    eyebrow: "The file",
    title: "Eight cases",
    lede: "Every one of them is somebody else's system, before and after.",
    colCase: "Case",
    colReading: "Reading",
    colYear: "Year",
  },

  reading: {
    before: "before",
    after: "after",
    heldAt: "held at",
    limit: "limit",
    count: "count",
    kindDelta: "delta",
    kindCeiling: "ceiling",
    kindCount: "count",
  },

  cases: {
    eyebrow: "The cases",
    title: "What each one actually was.",
    stack: "Stack",
    orchestration: {
      name: "LLM systems in production",
      org: "Bernoulli Educação · EdTech, 100K+ students",
      kicker: "The company's first AI feature, built so no single vendor can take it down",
      body: "I designed and delivered the orchestration architecture: an orchestrator routing requests across specialised agents, provider failover so one vendor outage cannot take the feature down, and a MongoDB layer carrying document retrieval, agent execution logs and a response cache that cuts the cost of repeat inference. The provider was not chosen by reputation — five models were benchmarked on cost, latency and output quality, and the numbers picked one.",
      caption: "models benchmarked on cost, latency and output quality, before one was chosen",
    },
    query: {
      name: "The two-second query",
      org: "Bernoulli Educação",
      kicker: "The planner was not slow. Its statistics were stale.",
      body: "A core query took two seconds and nobody could say why. EXPLAIN ANALYZE said it plainly: the divergence between estimated and actual rows exposed a sequential scan chosen over an index that already existed. I refreshed the statistics, restored correct index usage, tuned the autovacuum thresholds so it would not come back, and wrote the method down for the team — the fix is worth less than the second time somebody finds it themselves.",
      caption: "on the query that had been taking two seconds",
    },
    seal: {
      name: "Seal",
      org: "Open-core · Apache-2.0 local mode on npm",
      kicker: "Approval-as-an-API: human-in-the-loop as infrastructure, not as a code change",
      body: "An approval gateway for AI agents. An MCP proxy intercepts tools/call and holds the risky ones until a human signs, with a declarative policy engine so approval is by exception rather than by default, and elicitation and sampling relayed back in both directions. Every decision lands in a hash-chained audit trail that verifies offline. Agent code does not change to adopt it — the proxy is the integration.",
      caption: "lines of agent code changed to put a human in the loop",
    },
    nanquim: {
      name: "Nanquim",
      org: "Pix checkout SDK · provider-agnostic",
      kicker: "The Brazilian market ships backend SDKs in seven languages and stops at the browser",
      body: "An embeddable Pix checkout that runs on the merchant's own domain, inside a Shadow DOM, with no runtime dependency in the browser and no request beyond the merchant's own backend. No credential can reach the bundle, because the SDK takes functions and not keys. There is no onSuccess, because the truth of a payment is a signed webhook and never the browser. Illegal states are unrepresentable and the promised amount is an invariant.",
      caption: "gzipped — a size the build refuses to exceed, not a number in a README",
    },
    anchor: {
      name: "Anchor",
      org: "B2B SaaS · retention intelligence for performance agencies",
      kicker: "Churn is visible in the ad accounts weeks before anybody cancels",
      body: "A platform that scores client health from Google Ads and Meta Ads signals, learns the weights per client rather than applying one model to everybody, and writes a weekly brief an account manager can act on. Multi-tenant with row-level security, Stripe billing gates, and observability built in from the first deploy rather than added after the first incident.",
      caption: "of warning before a client churns",
    },
    artefacts: {
      name: "technology-art",
      org: "Scroll-led essay · WebGL",
      kicker: "Eight artefacts, 3.3 million years, one point cloud reassembled into each of them",
      body: "A history of technology told through eight objects, from a struck stone to machines that are learning to judge. One WebGL point cloud is reassembled into every era's form, the interval between two eras sets the height of the silence before it, and a single accent walks the spectrum as you read. The heavy layers wait for the reader's first move, which is why the artefact survives the score.",
      caption: "Lighthouse on mobile, against a ceiling of 100 — and 100 on desktop",
    },
    dashboard: {
      name: "The abandoned dashboard",
      org: "Jorrovi Calçados · financial and administrative systems",
      kicker: "Inherited with no handoff, no documentation, and numbers the business was already deciding on",
      body: "Revenue, cost and cash-flow reporting used from the operations floor up to the owners, handed over with nothing. I reverse-engineered it, assessed the debt and set the migration strategy alone, then stabilised it on three fronts: killed the crashes, traced and corrected the figures it had been reporting wrong, and cut load times. The migration ran incrementally while the system stayed in daily use — no feature freeze, no big-bang rewrite, no interruption to financial reporting. Promoted within six months.",
      caption: "migrated to React over fifteen months, with the system live throughout",
    },
    image: {
      name: "The 1.9 GB image",
      org: "Freelance · Workana",
      kicker: "Nobody had documented why it was that big, so the first job was finding out",
      body: "A frontend Docker image nobody wanted to touch, with no prior documentation to work from. I diagnosed the cause rather than trimming layers at random, then rebuilt the pipeline around multi-stage builds. Smaller artifacts dropped registry and transfer costs by over 60% on top of the build time.",
      caption: "an 89% reduction, from a pipeline rebuilt rather than trimmed",
    },
  },

  method: {
    eyebrow: "Method",
    title: "What I do when I am handed a system.",
    lede: "Six rules, each one paid for by a case above.",
    items: {
      instrument: {
        rule: "Read the instrument before guessing.",
        evidence: "EXPLAIN ANALYZE said the plan was wrong. Nobody had looked.",
      },
      vendor: {
        rule: "Assume the vendor fails.",
        evidence: "Provider failover, so one outage cannot take a feature down.",
      },
      gate: {
        rule: "Put the limit in the build.",
        evidence: "12.14 kB is a gate CI enforces, not a claim in a README.",
      },
      live: {
        rule: "Migrate live.",
        evidence: "40+ views over fifteen months, with the system in daily use.",
      },
      standard: {
        rule: "Write the standard down.",
        evidence: "A code review standard now applied across every backend service.",
      },
      illegal: {
        rule: "Make illegal states unrepresentable.",
        evidence: "No onSuccess in the browser: the truth of a payment is a signed webhook.",
      },
    },
  },

  record: {
    eyebrow: "Record",
    title: "The rest of it, compactly.",
    rolesLabel: "Roles",
    skillsLabel: "Skills",
    skillGroups: {
      languages: "Languages & frameworks",
      ai: "AI engineering",
      data: "Data & messaging",
      cloud: "Cloud & infrastructure",
      architecture: "Architecture & APIs",
    },
    reposLabel: "Other repositories",
    languagesLabel: "Languages",
    educationLabel: "Education",
    roles: {
      bernoulli: {
        title: "Software Engineer",
        detail:
          "LLM orchestration architecture. Weekly release batches to daily continuous deployment with automated test suites. Authored the team's code review standard.",
      },
      eicode: {
        title: "Senior Fullstack Engineer · promoted from mid-level",
        detail:
          "Sole technical owner of a greenfield social platform: 12 feature modules, no senior above me, and the technical direction three other engineers built to. Recommendation engine written from scratch — TF-IDF with cosine similarity, no third-party ML service. Technical lead on international engagements, in English.",
      },
      freelance: {
        title: "Senior Fullstack Engineer · 5+ concurrent engagements",
        detail:
          "Delivered alongside full-time roles. Multi-provider authentication built from the ground up — email, Google and Microsoft, 2FA, recovery — with no auth incident reported post-launch. Production Stripe billing for three client platforms, webhooks built for idempotency so retries never double-charged.",
      },
      jorrovi: {
        title: "Junior Fullstack Engineer · promoted from trainee · part-time",
        detail:
          "The abandoned financial dashboard, above. TypeScript rolled across the codebase after making the case to non-technical stakeholders, and Kubernetes deployments automated across dev, staging and production.",
      },
    },
    repos: {
      depguard:
        "Preventive npm dependency risk scoring: registry metadata, lifecycle scripts, OSV advisories and typosquatting heuristics.",
      envValidator:
        "Validates process.env at startup against a typed schema, collecting every error at once, with inference and no dependencies.",
      azthorize: "Authentication API with AES encryption, built for throughput.",
    },
    education: "B.Eng. Software Engineering · Cruzeiro do Sul · in progress, expected 2029",
    languages: "Portuguese, native · English, C1 — used daily in production: ceremonies, code review, technical docs.",
  },

  contact: {
    eyebrow: "Contact",
    title: "What are you building?",
    lede: "Open to engineering roles and to contract work where somebody has to own an AI feature end to end. I reply within a day.",
    emailLabel: "Email",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formNamePlaceholder: "Your name",
    formEmailPlaceholder: "you@company.com",
    formMessagePlaceholder: "What is the system, and what is wrong with it?",
    formSend: "Send it",
    formSending: "Sending…",
    formSuccess: "Sent. I will reply to that address within a day.",
    formErrorNetwork: "That did not reach me — the request failed before it arrived. Write to matheuspavaneli@proton.me instead and it will get to the same place.",
    formErrorInvalid: "Check the highlighted field: I need a name, a reachable email address and a message.",
    formErrorEmail: "That email address will not reach you — check it before sending.",
    formDisabled: "The form is not wired up on this deployment. Email works and reaches the same inbox.",
    formDisabledCta: "Write to matheuspavaneli@proton.me",
    required: "required",
  },

  footer: {
    built: "Built with Next.js as a static export. Palette generated and contrast-checked before it was written down.",
    source: "Source",
  },
};

/** Widened on purpose: the keys are the contract between the locales, not the strings. */
export type Messages = typeof en;
