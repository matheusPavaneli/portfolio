import { ArrowUpRight } from "lucide-react";

import { Module } from "@/components/Module";
import { repos, roles } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import type { Messages } from "@/i18n";

/**
 * The reference plates: roles, skills, repositories, schooling. None of it is the argument, so
 * none of it gets the rack's big modules — it gets four small ones and the type goes quiet.
 */
export function Record({ t }: { t: Messages }) {
  return (
    <section id="record" className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="m-0 max-w-[22ch] text-xl" style={{ fontVariationSettings: '"wdth" 100' }}>
          {t.record.title}
        </h2>

        <div className="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <Module legend={t.record.rolesLabel} readout={`${roles.length}`} className="lg:col-span-7">
            <ul className="m-0 list-none space-y-5 p-0">
              {roles.map((role) => (
                <li key={role.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="m-0 text-base text-ink">{role.org}</p>
                    <p className="m-0 font-readout text-xs tabular-nums text-dim">{role.period}</p>
                  </div>
                  <p className="legend m-0 mt-1 text-dim">{t.record.roles[role.id].title}</p>
                  <p className="m-0 mt-2 max-w-[62ch] text-sm text-dim">
                    {t.record.roles[role.id].detail}
                  </p>
                </li>
              ))}
            </ul>
          </Module>

          <Module
            legend={t.record.skillsLabel}
            readout={`${skillGroups.reduce((n, g) => n + g.terms.length, 0)}`}
            className="lg:col-span-5"
          >
            <ul className="m-0 list-none space-y-4 p-0">
              {skillGroups.map((group) => (
                <li key={group.id}>
                  <p className="legend m-0 text-dim">{t.record.skillGroups[group.id]}</p>
                  <p className="m-0 mt-1.5 text-sm text-ink">{group.terms.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Module>

          <Module
            legend={t.record.reposLabel}
            readout={`${repos.length}`}
            className="lg:col-span-7"
          >
            <ul className="m-0 list-none space-y-4 p-0">
              {repos.map((repo) => (
                <li key={repo.id}>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-base text-ink hover:text-signal"
                  >
                    {repo.name}
                    <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
                    <span className="sr-only">({t.a11y.externalLink})</span>
                  </a>
                  <p className="m-0 mt-1 max-w-[58ch] text-sm text-dim">{t.record.repos[repo.id]}</p>
                  <p className="legend m-0 mt-1.5 text-dim">{repo.stack.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </Module>

          <Module legend={t.record.educationLabel} className="lg:col-span-5">
            <p className="m-0 max-w-[44ch] text-sm text-ink">{t.record.education}</p>
            <p className="legend m-0 mt-6 text-dim">{t.record.languagesLabel}</p>
            <p className="m-0 mt-1.5 max-w-[44ch] text-sm text-ink">{t.record.languages}</p>
          </Module>
        </div>
      </div>
    </section>
  );
}
