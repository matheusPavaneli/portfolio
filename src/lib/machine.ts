import { cases } from "@/content/cases";
import { METHOD } from "@/content/method";
import { education, place, profile, repos, roles, spokenLanguages } from "@/content/profile";
import { plainText, recommendationsHref, references } from "@/content/references";
import { skillGroups } from "@/content/skills";
import { getMessages, HTML_LANG, otherLocale, type Locale } from "@/i18n";
import { REQUIREMENTS } from "@/lib/architecture";
import { formatRatio, readingText, rows, type BoardRow } from "@/lib/board";
import { formatMonths, formatYears } from "@/lib/dates";
import { absolute } from "@/lib/href";

/*
 * Every machine-readable copy of the page — llms.txt, the Markdown profile, the JSON Resume and
 * the JSON-LD — is built here from the same content and catalogues the page renders, so a
 * recruiter's tool reads exactly what a person reads, and neither can drift from the other.
 */

export const pageUrl = (lang: Locale) => absolute(`/${lang}/`);
export const markdownUrl = (lang: Locale) => absolute(`/${lang}/index.md`);
export const resumeUrl = () => absolute("/resume.json");
export const llmsFullUrl = () => absolute("/llms-full.txt");
export const cvUrl = () => absolute(profile.cv);

const readings = new Map<string, BoardRow>(rows.map((row) => [row.id, row]));

function ratioText(row: BoardRow | undefined, held: string): string | null {
  if (row?.group === "moved" && row.ratio !== null) return formatRatio(row.ratio);
  if (row?.group === "held") return held;
  return null;
}

const quote = (text: string) =>
  text
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");

export function profileMarkdown(lang: Locale): string {
  const t = getMessages(lang);
  const other = otherLocale(lang);
  const blocks: string[] = [];

  blocks.push(`# ${profile.name}`);
  blocks.push(quote(`${t.masthead.role}. ${t.masthead.lede}`));
  blocks.push(`*${t.masthead.headlineLead} ${t.masthead.headlineTail}*`);
  blocks.push(
    [
      `- ${t.masthead.stripNow}: ${t.masthead.stripNowValue}`,
      `- ${t.masthead.stripStack}: ${t.masthead.stripStackValue}`,
      `- ${t.masthead.stripBase}: ${t.masthead.stripBaseValue}`,
      `- ${t.machine.status}: ${t.masthead.stripStatusValue}`,
      `- ${t.contact.emailLabel}: ${profile.email}`,
      `- ${t.machine.phone}: ${profile.phone}`,
      `- LinkedIn: ${profile.linkedin}`,
      `- GitHub: ${profile.github}`,
      `- ${t.machine.resumePdf}: ${cvUrl()}`,
      `- ${t.machine.resumeJson}: ${resumeUrl()}`,
      `- ${t.machine.page}: ${pageUrl(lang)}`,
      `- ${t.machine.otherMarkdown}: ${markdownUrl(other)}`,
    ].join("\n"),
  );

  blocks.push(`## ${t.nav.cases}`, t.index.lede, t.board.lede);
  for (const entry of cases) {
    const copy = t.cases[entry.id];
    const row = readings.get(entry.id);
    const ratio = ratioText(row, t.board.held);
    const reading = row === undefined ? "" : readingText(row);
    const facts = [
      `- ${t.index.colReading}: ${reading}${ratio ? ` (${t.board.ratioLabel} ${ratio})` : ""} — ${copy.caption}`,
      `- ${t.cases.stack}: ${entry.stack.join(", ")}`,
    ];
    if (entry.links.length > 0) {
      facts.push(`- ${t.machine.links}: ${entry.links.map((l) => `[${l.label}](${l.href})`).join(", ")}`);
    }
    blocks.push(
      `### ${copy.name}`,
      `${copy.org} · ${formatYears(entry.years, t.locale.present)}`,
      `*${copy.kicker}*`,
      copy.body,
      facts.join("\n"),
    );
  }

  blocks.push(`## ${t.record.rolesLabel}`);
  for (const role of roles) {
    const copy = t.record.roles[role.id];
    blocks.push(
      `### ${role.org} — ${copy.title}`,
      formatMonths(role.from, role.to, t.locale.intl, t.locale.present),
      copy.detail,
    );
  }

  blocks.push(
    `## ${t.record.skillsLabel}`,
    skillGroups.map((g) => `- ${t.record.skillGroups[g.id]}: ${g.terms.join(", ")}`).join("\n"),
  );

  blocks.push(
    `## ${t.nav.method}`,
    `${t.method.title} ${t.method.lede}`,
    METHOD.map(({ id, paidBy }) => {
      const item = t.method.items[id];
      const source = paidBy ? ` (${t.method.paidBy}: ${t.cases[paidBy].name})` : "";
      return `- **${item.rule}** ${item.evidence}${source}`;
    }).join("\n"),
  );

  blocks.push(
    `## ${t.nav.build}`,
    `${t.build.title} ${t.build.lede}`,
    REQUIREMENTS.map((id, i) => {
      const step = t.build.steps[id];
      return `${i + 1}. **${step.need}** ${t.build.adds}: ${step.adds} ${t.build.costs}: ${step.costs}`;
    }).join("\n"),
  );

  blocks.push(
    `## ${t.record.reposLabel}`,
    repos.map((r) => `- [${r.name}](${r.href}) — ${t.record.repos[r.id]} (${r.stack.join(", ")})`).join("\n"),
  );

  blocks.push(`## ${t.record.educationLabel}`, t.record.education);
  blocks.push(`## ${t.record.languagesLabel}`, t.record.languages);

  blocks.push(`## ${t.nav.references}`, t.references.lede);
  for (const entry of references) {
    const cited = entry.body
      .flat()
      .flatMap((s) => (typeof s === "string" ? [] : [`- ${t.references.claims[s.claim]}: “${s.text}”`]));
    blocks.push(
      `### ${entry.name}`,
      `${entry.headline} · ${entry.org} · ${t.references.relations[entry.relation]} · ${entry.date}`,
      quote(plainText(entry)),
      `${t.machine.cited}:\n${cited.join("\n")}`,
      `${t.references.source}: ${recommendationsHref}`,
    );
  }

  blocks.push(
    `## ${t.nav.contact}`,
    `${t.contact.title} ${t.contact.lede}`,
    [
      `- ${t.contact.emailLabel}: ${profile.email}`,
      `- ${t.machine.phone}: ${profile.phone}`,
      `- LinkedIn: ${profile.linkedin}`,
      `- ${t.masthead.location}`,
    ].join("\n"),
  );

  return `${blocks.join("\n\n")}\n`;
}

/** The llms.txt index (llmstxt.org): what this is, then where the full text lives. */
export function llmsIndex(): string {
  const t = getMessages("en");
  const pt = getMessages("pt");

  return `${[
    `# ${profile.name}`,
    quote(`${t.masthead.role}. ${t.masthead.lede}`),
    [
      `${t.masthead.stripNow}: ${t.masthead.stripNowValue}.`,
      `${t.masthead.stripBase}: ${t.masthead.stripBaseValue}.`,
      `${t.machine.status}: ${t.masthead.stripStatusValue}.`,
      `${t.contact.emailLabel}: ${profile.email}.`,
    ].join(" "),
    "## Profile",
    [
      `- [${t.machine.markdown}](${llmsFullUrl()}): every case, role, skill, reference and contact on the page, in English`,
      `- [${pt.machine.markdown}](${markdownUrl("pt")}): the same, in Brazilian Portuguese`,
      `- [${t.machine.resumeJson}](${resumeUrl()}): jsonresume.org schema v1.0.0`,
      `- [${t.machine.resumePdf}](${cvUrl()})`,
      `- [${t.machine.page} (English)](${pageUrl("en")})`,
      `- [${pt.machine.page} (português)](${pageUrl("pt")})`,
    ].join("\n"),
    `## ${t.nav.cases}`,
    cases
      .map((entry) => `- [${t.cases[entry.id].name}](${pageUrl("en")}#case-${entry.id}): ${t.cases[entry.id].kicker}`)
      .join("\n"),
    "## Optional",
    [`- [GitHub](${profile.github})`, `- [LinkedIn](${profile.linkedin})`].join("\n"),
  ].join("\n\n")}\n`;
}

/** jsonresume.org schema v1.0.0 — the format ATS importers and résumé tools already parse. */
export function jsonResume() {
  const t = getMessages("en");

  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: profile.name,
      label: t.masthead.role,
      email: profile.email,
      phone: profile.phone,
      url: pageUrl("en"),
      summary: t.masthead.lede,
      location: { city: place.city, region: place.region, countryCode: place.countryCode },
      profiles: [
        { network: "GitHub", username: profile.github.split("/").pop() ?? "", url: profile.github },
        { network: "LinkedIn", username: "matheuspavaneli", url: profile.linkedin },
      ],
    },
    work: roles.map((role) => ({
      name: role.org,
      position: t.record.roles[role.id].title,
      startDate: role.from,
      ...(role.to === null ? {} : { endDate: role.to }),
      summary: t.record.roles[role.id].detail,
    })),
    education: [
      {
        institution: education.institution,
        area: education.area,
        studyType: education.studyType,
        endDate: education.expected,
      },
    ],
    skills: skillGroups.map((g) => ({ name: t.record.skillGroups[g.id], keywords: [...g.terms] })),
    languages: spokenLanguages.map((l) => ({ language: l.name, fluency: l.fluency })),
    projects: [
      ...cases.map((entry) => {
        const copy = t.cases[entry.id];
        const row = readings.get(entry.id);
        const [from, to] = entry.years;
        return {
          name: copy.name,
          entity: copy.org,
          description: copy.kicker,
          highlights: [copy.body, `${row === undefined ? "" : readingText(row)} — ${copy.caption}`],
          keywords: [...entry.stack],
          url: entry.links[0]?.href ?? `${pageUrl("en")}#case-${entry.id}`,
          startDate: String(from),
          ...(to === null ? {} : { endDate: String(to) }),
        };
      }),
      ...repos.map((repo) => ({
        name: repo.name,
        description: t.record.repos[repo.id],
        keywords: [...repo.stack],
        url: repo.href,
      })),
    ],
    references: references.map((entry) => ({
      name: `${entry.name}, ${entry.headline}, ${entry.org}`,
      reference: plainText(entry),
    })),
    meta: { canonical: resumeUrl(), version: "v1.0.0" },
  };
}

/** schema.org graph for the page head: the page, and the person it is about. */
export function jsonLd(lang: Locale) {
  const t = getMessages(lang);
  const person = `${absolute("/")}#person`;
  const current = roles.find((role) => role.to === null);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl(lang)}#page`,
        url: pageUrl(lang),
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: HTML_LANG[lang],
        mainEntity: { "@id": person },
      },
      {
        "@type": "Person",
        "@id": person,
        name: profile.name,
        jobTitle: t.masthead.role,
        description: t.masthead.lede,
        email: `mailto:${profile.email}`,
        telephone: profile.phone,
        url: pageUrl(lang),
        sameAs: [profile.github, profile.linkedin],
        address: {
          "@type": "PostalAddress",
          addressLocality: place.city,
          addressRegion: place.region,
          addressCountry: place.countryCode,
        },
        ...(current ? { worksFor: { "@type": "Organization", name: current.org } } : {}),
        knowsAbout: skillGroups.flatMap((g) => g.terms),
        knowsLanguage: spokenLanguages.map((l) => ({ "@type": "Language", name: l.name, alternateName: l.code })),
        hasOccupation: {
          "@type": "Occupation",
          name: t.masthead.role,
          occupationLocation: { "@type": "Country", name: place.country },
          skills: t.masthead.stripStackValue,
        },
        subjectOf: [
          { "@type": "DigitalDocument", name: t.machine.resumePdf, url: cvUrl(), encodingFormat: "application/pdf" },
          {
            "@type": "DigitalDocument",
            name: t.machine.resumeJson,
            url: resumeUrl(),
            encodingFormat: "application/json",
          },
        ],
      },
      ...references.map((entry) => ({
        "@type": "Review",
        itemReviewed: { "@id": person },
        author: {
          "@type": "Person",
          name: entry.name,
          jobTitle: entry.headline,
          worksFor: { "@type": "Organization", name: entry.org },
        },
        datePublished: entry.date,
        reviewBody: plainText(entry),
        inLanguage: "en",
        url: recommendationsHref,
      })),
    ],
  };
}

/** JSON for an inline script: `<` escaped so no string in the content can close the tag. */
export function inlineJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
