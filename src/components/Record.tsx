import { Eyebrow } from "@/components/Eyebrow";
import { repos, roles } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import type { Messages } from "@/i18n";

/**
 * Reference register. Everything the file still owes a reader — roles, repositories,
 * education, languages — set compactly, because none of it is the argument. This is where the
 * outgoing build's Experience, Skills, Freelance and Education bands went.
 */
export function Record({ t }: { t: Messages }) {
  return (
    <section id="record" className="border-b border-rule px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.record.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[22ch] text-xl font-light tracking-[-0.02em]">
          {t.record.title}
        </h2>

        <h3 className="mt-12 font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
          {t.record.rolesLabel}
        </h3>
        <ul className="mt-4 list-none p-0">
          {roles.map((role) => (
            <li key={role.id} className="border-t border-rule py-6">
              <div className="grid grid-cols-1 gap-x-12 gap-y-2 lg:grid-cols-[minmax(0,2fr)_260px]">
                <div>
                  <p className="m-0 text-md text-text">{role.org}</p>
                  <p className="m-0 mt-1 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    {t.record.roles[role.id].title}
                  </p>
                  <p className="mt-3 max-w-[58ch] text-base text-muted">
                    {t.record.roles[role.id].detail}
                  </p>
                </div>
                <p className="m-0 font-mono text-xs tabular-nums text-muted lg:text-right">
                  {role.period}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
          {t.record.skillsLabel}
        </h3>
        <ul className="mt-4 list-none p-0">
          {skillGroups.map((group) => (
            <li key={group.id} className="border-t border-rule py-5">
              <div className="grid grid-cols-1 gap-x-12 gap-y-2 lg:grid-cols-[minmax(0,2fr)_260px]">
                <p className="m-0 text-base text-muted">{group.terms.join(" · ")}</p>
                <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted lg:text-right">
                  {t.record.skillGroups[group.id]}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-14 font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
          {t.record.reposLabel}
        </h3>
        <ul className="mt-4 list-none p-0">
          {repos.map((repo) => (
            <li key={repo.id} className="border-t border-rule py-5">
              <div className="grid grid-cols-1 gap-x-12 gap-y-2 lg:grid-cols-[minmax(0,2fr)_260px]">
                <div>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="u-rule text-md text-text"
                  >
                    {repo.name}
                    <span className="sr-only"> ({t.a11y.externalLink})</span>
                  </a>
                  <p className="mt-2 max-w-[58ch] text-base text-muted">
                    {t.record.repos[repo.id]}
                  </p>
                </div>
                <p className="m-0 font-mono text-xs text-muted lg:text-right">
                  {repo.stack.join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-rule pt-8 md:grid-cols-2">
          <div>
            <h3 className="font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
              {t.record.educationLabel}
            </h3>
            <p className="mt-3 max-w-[46ch] text-base text-muted">{t.record.education}</p>
          </div>
          <div>
            <h3 className="font-mono text-xs font-normal uppercase tracking-[0.08em] text-muted">
              {t.record.languagesLabel}
            </h3>
            <p className="mt-3 max-w-[46ch] text-base text-muted">{t.record.languages}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
