export const CLAIMS = ["hard", "ownership", "cause", "clarity", "team", "learning"] as const;
export type ClaimId = (typeof CLAIMS)[number];

/** A run of the statement, either plain or a passage marked as backing one trait. */
export type Segment = string | { readonly text: string; readonly claim: ClaimId };

export type ReferenceEntry = {
  readonly id: "gleyver" | "kevin";
  readonly name: string;
  readonly surname: string;
  readonly headline: string;
  readonly relation: "managed" | "team";
  readonly org: string;
  readonly date: string;
  /** Paragraphs, verbatim as posted on LinkedIn. Marks only annotate; they never edit. */
  readonly body: readonly (readonly Segment[])[];
};

export const references: readonly ReferenceEntry[] = [
  {
    id: "gleyver",
    name: "Gleyver Coutinho Castro",
    surname: "Castro",
    headline: "Software Engineering Manager",
    relation: "managed",
    org: "Bernoulli Educação",
    date: "2026-08-23",
    body: [
      [
        "I had the privilege of working with Matheus at Bernoulli, and I can attest that his impact goes far beyond the lines of code he delivers.",
      ],
      [
        "What truly sets Matheus apart is his ",
        { text: "genuine autonomy and strong sense of ownership", claim: "ownership" },
        ". Whenever we faced complex and ambiguous problems, he was the one who ",
        {
          text: "dove deep into the technical investigation, mapped out bottlenecks, made assertive architectural decisions",
          claim: "cause",
        },
        ", and ",
        { text: "drove solutions from start to finish with total responsibility", claim: "ownership" },
        ".",
      ],
      [
        "In addition to his excellent technical background and analytical skills, his communication and collaboration with the team are flawless. He has a natural ability to ",
        {
          text: "translate difficult problems into clear discussions, engage the team, and keep everyone aligned",
          claim: "clarity",
        },
        ". He is the kind of engineer who ",
        { text: "raises the technical bar of any team", claim: "team" },
        " and someone you can ",
        { text: "trust implicitly to unblock the toughest challenges", claim: "hard" },
        ".",
      ],
    ],
  },
  {
    id: "kevin",
    name: "Kevin Blair",
    surname: "Blair",
    headline: "QA Automation Engineer",
    relation: "team",
    org: "Bernoulli Educação",
    date: "2026-06-08",
    body: [
      [
        "I had the chance to work with Matheus, and one thing that always stood out was his ",
        { text: "enthusiasm for technology and learning new things", claim: "learning" },
        ". He's someone who ",
        { text: "genuinely enjoys exploring new ideas", claim: "learning" },
        ", ",
        { text: "takes on challenges with a positive attitude", claim: "hard" },
        ", and always ",
        { text: "puts in the effort to get things done right", claim: "ownership" },
        ". On top of that, he's a great teammate who's ",
        { text: "always willing to help and share what he knows", claim: "team" },
        ". It was a pleasure working with him.",
      ],
    ],
  },
];

/** The section's title: a verbatim run of Gleyver's statement, the page's claim said by someone else. */
export const pullQuote = "someone you can trust implicitly to unblock the toughest challenges.";

export const recommendationsHref = "https://www.linkedin.com/in/matheuspavaneli/details/recommendations/";

export function passages(entry: ReferenceEntry, claim: ClaimId): number {
  return entry.body.flat().filter((s) => typeof s !== "string" && s.claim === claim).length;
}

export type PassageWords = { readonly none: string; readonly one: string; readonly other: string };

/** "no passages" · "1 passage" · "2 passages" — zero is its own case, since CLDR puts pt's 0 in "one". */
export function countPassages(n: number, intl: string, words: PassageWords): string {
  if (n === 0) return words.none;
  const form = new Intl.PluralRules(intl).select(n) === "one" ? words.one : words.other;
  return form.replace("{n}", String(n));
}

export function plainText(entry: ReferenceEntry): string {
  return entry.body.map((p) => p.map((s) => (typeof s === "string" ? s : s.text)).join("")).join("\n\n");
}
