import { describe, expect, it } from "vitest";

import { en } from "@/i18n/messages/en";
import { pt } from "@/i18n/messages/pt";

import { CLAIMS, countPassages, passages, plainText, pullQuote, references } from "./references";

const VERBATIM = {
  gleyver: `I had the privilege of working with Matheus at Bernoulli, and I can attest that his impact goes far beyond the lines of code he delivers.

What truly sets Matheus apart is his genuine autonomy and strong sense of ownership. Whenever we faced complex and ambiguous problems, he was the one who dove deep into the technical investigation, mapped out bottlenecks, made assertive architectural decisions, and drove solutions from start to finish with total responsibility.

In addition to his excellent technical background and analytical skills, his communication and collaboration with the team are flawless. He has a natural ability to translate difficult problems into clear discussions, engage the team, and keep everyone aligned. He is the kind of engineer who raises the technical bar of any team and someone you can trust implicitly to unblock the toughest challenges.`,
  kevin: `I had the chance to work with Matheus, and one thing that always stood out was his enthusiasm for technology and learning new things. He's someone who genuinely enjoys exploring new ideas, takes on challenges with a positive attitude, and always puts in the effort to get things done right. On top of that, he's a great teammate who's always willing to help and share what he knows. It was a pleasure working with him.`,
};

describe("references", () => {
  it("quote every statement verbatim — marking a passage never edits it", () => {
    for (const entry of references) expect(plainText(entry)).toBe(VERBATIM[entry.id]);
  });

  it("back every trait in the index with at least one passage", () => {
    for (const claim of CLAIMS) {
      const total = references.reduce((n, entry) => n + passages(entry, claim), 0);
      expect(total, claim).toBeGreaterThan(0);
    }
  });

  it("title the section with a verbatim run of a statement", () => {
    expect(VERBATIM.gleyver).toContain(pullQuote);
  });

  it("count passages in the singular for one and name zero outright", () => {
    expect([0, 1, 2].map((n) => countPassages(n, en.locale.intl, en.references.passages))).toEqual([
      "no passages",
      "1 passage",
      "2 passages",
    ]);
    expect([0, 1, 2].map((n) => countPassages(n, pt.locale.intl, pt.references.passages))).toEqual([
      "nenhum trecho",
      "1 trecho",
      "2 trechos",
    ]);
  });

  it("carry ISO dates", () => {
    for (const entry of references) expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
