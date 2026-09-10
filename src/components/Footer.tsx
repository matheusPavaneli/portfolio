import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

export function Footer({ t }: { t: Messages }) {
  return (
    <footer className="px-4 pb-8 md:px-8">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 rounded-plate bg-plate px-4 py-4 ring-1 ring-edge md:flex-row md:items-baseline md:justify-between md:px-5">
        <p className="m-0 max-w-[56ch] text-sm text-dim">{t.footer.built}</p>
        <p className="legend m-0 shrink-0 text-dim">
          <span className="tabular-nums">{new Date().getFullYear()}</span> · {profile.name} ·{" "}
          <a className="text-dim hover:text-ink" href={profile.github} rel="me">
            {t.footer.source}
          </a>
        </p>
      </div>
    </footer>
  );
}
