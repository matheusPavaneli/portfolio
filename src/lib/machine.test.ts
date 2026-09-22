import { describe, expect, it } from "vitest";

import { cases } from "@/content/cases";
import { profile, repos, roles } from "@/content/profile";
import { plainText, references } from "@/content/references";
import { skillGroups } from "@/content/skills";
import { getMessages, LOCALES } from "@/i18n";
import { cvUrl, inlineJson, jsonLd, jsonResume, llmsIndex, profileMarkdown } from "./machine";

describe("the Markdown profile", () => {
  for (const lang of LOCALES) {
    const md = profileMarkdown(lang);
    const t = getMessages(lang);

    it(`carries everything the ${lang} page says about the work`, () => {
      for (const entry of cases) {
        expect(md).toContain(t.cases[entry.id].name);
        expect(md).toContain(t.cases[entry.id].body);
        expect(md).toContain(t.cases[entry.id].caption);
        for (const link of entry.links) expect(md).toContain(link.href);
      }
      for (const role of roles) {
        expect(md).toContain(role.org);
        expect(md).toContain(t.record.roles[role.id].detail);
      }
      for (const repo of repos) expect(md).toContain(repo.href);
      for (const term of skillGroups.flatMap((g) => g.terms)) expect(md).toContain(term);
      expect(md).toContain(t.record.education);
      expect(md).toContain(t.record.languages);
    });

    it(`quotes every ${lang} reference verbatim, paragraph by paragraph`, () => {
      for (const entry of references) {
        for (const paragraph of plainText(entry).split("\n\n")) expect(md).toContain(`> ${paragraph}`);
      }
    });

    it(`gives a tool every way to reach the person in ${lang}`, () => {
      for (const fact of [profile.email, profile.phone, profile.linkedin, profile.github, cvUrl()]) {
        expect(md).toContain(fact);
      }
    });

    it(`opens on one H1 and leaks no unrendered value in ${lang}`, () => {
      expect(md.startsWith(`# ${profile.name}\n`)).toBe(true);
      expect(md.match(/^# /gm)).toHaveLength(1);
      expect(md).not.toMatch(/undefined|null|\[object Object\]/);
    });
  }
});

describe("llms.txt", () => {
  const txt = llmsIndex();

  it("follows the llmstxt.org shape: H1, blockquote summary, then H2 link lists", () => {
    expect(txt).toMatch(/^# .+\n\n> .+/);
    expect(txt).toContain("## Profile");
    expect(txt).not.toMatch(/undefined/);
  });

  it("links every case, and only with absolute URLs", () => {
    for (const entry of cases) expect(txt).toContain(`#case-${entry.id}`);
    for (const [, url] of txt.matchAll(/\]\(([^)]+)\)/g)) expect(url).toMatch(/^https:\/\//);
  });
});

describe("JSON Resume", () => {
  const resume = jsonResume();

  it("lists every role with ISO months and only the current one open-ended", () => {
    expect(resume.work).toHaveLength(roles.length);
    for (const job of resume.work) {
      expect(job.startDate).toMatch(/^\d{4}-\d{2}$/);
      if ("endDate" in job) expect(job.endDate).toMatch(/^\d{4}-\d{2}$/);
    }
    expect(resume.work.filter((job) => !("endDate" in job))).toHaveLength(
      roles.filter((role) => role.to === null).length,
    );
  });

  it("carries every case and repository as a project, and every reference", () => {
    expect(resume.projects).toHaveLength(cases.length + repos.length);
    expect(resume.references).toHaveLength(references.length);
    expect(JSON.stringify(resume)).not.toMatch(/undefined/);
  });
});

describe("JSON-LD", () => {
  it("describes a ProfilePage about one Person in each locale", () => {
    for (const lang of LOCALES) {
      const graph = jsonLd(lang)["@graph"];
      const types = graph.map((node) => node["@type"]);
      expect(types).toContain("ProfilePage");
      expect(types.filter((type) => type === "Person")).toHaveLength(1);
      expect(types.filter((type) => type === "Review")).toHaveLength(references.length);
    }
  });

  it("cannot close its own script tag", () => {
    expect(inlineJson({ s: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});
