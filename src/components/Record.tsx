import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/Section";
import { repos, roles } from "@/content/profile";
import { coreSkills, skillGroups } from "@/content/skills";
import { formatMonths } from "@/lib/dates";
import type { Messages } from "@/i18n";

export function Record({ t }: { t: Messages }) {
  const terms = skillGroups.reduce((n, group) => n + group.terms.length, 0);

  return (
    <Section
      id="record"
      eyebrow={t.record.eyebrow}
      readout={`${roles.length} · ${terms}`}
      title={t.record.title}
    >
      <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div>
          <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
            {t.record.rolesLabel}
          </h3>
          <ol className="m-0 list-none p-0">
            {roles.map((role) => (
              <li key={role.id} className="border-b border-line py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="m-0 text-h3 text-text">{role.org}</p>
                  <p className="m-0 font-mono text-small tabular-nums text-text-muted">
                    {formatMonths(role.from, role.to, t.locale.intl, t.locale.present)}
                  </p>
                </div>
                <p className="label m-0 mt-2 text-text-muted">
                  {t.record.roles[role.id].title} · {t.record.load[role.load]}
                </p>
                <p className="measure m-0 mt-3 text-body text-text-muted">
                  {t.record.roles[role.id].detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-14">
          <div>
            <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
              {t.record.skillsLabel}
            </h3>
            <ul className="m-0 list-none p-0">
              {skillGroups.map((group) => (
                <li key={group.id} className="border-b border-line py-4">
                  <p className="label m-0 text-text-muted">{t.record.skillGroups[group.id]}</p>
                  <p className="m-0 mt-2 font-mono text-code text-text">
                    {coreSkills[group.id].join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
            <details className="mt-4">
              <summary className="ledger-summary link label inline-flex min-h-11 items-center text-text-muted">
                {t.record.fullSkills.replace("{n}", String(terms))}
              </summary>
              <ul className="m-0 list-none p-0">
                {skillGroups.map((group) => (
                  <li key={group.id} className="border-b border-line py-4">
                    <p className="label m-0 text-text-muted">{t.record.skillGroups[group.id]}</p>
                    <p className="m-0 mt-2 font-mono text-code text-text">{group.terms.join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          <div>
            <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
              {t.record.reposLabel}
            </h3>
            <ul className="m-0 list-none p-0">
              {repos.map((repo) => (
                <li key={repo.id} className="border-b border-line py-4">
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link inline-flex items-center gap-1.5 font-mono text-body text-text"
                  >
                    {repo.name}
                    <ArrowUpRight aria-hidden size={13} strokeWidth={2} />
                    <span className="sr-only">({t.a11y.externalLink})</span>
                  </a>
                  <p className="measure m-0 mt-2 text-body text-text-muted">
                    {t.record.repos[repo.id]}
                  </p>
                  <p className="label m-0 mt-2 text-text-muted">{repo.stack.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
              {t.record.educationLabel}
            </h3>
            <p className="measure m-0 py-4 text-body text-text">{t.record.education}</p>
            <p className="label m-0 border-t border-line pt-4 text-text-muted">
              {t.record.languagesLabel}
            </p>
            <p className="measure m-0 mt-2 text-body text-text">{t.record.languages}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
