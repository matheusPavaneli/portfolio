import { Eyebrow } from "@/components/Eyebrow";
import type { Messages } from "@/i18n";

const ITEMS = ["instrument", "vendor", "gate", "live", "standard", "illegal"] as const;

/**
 * The register shift: the only block on the page that changes ground. It is also the only
 * place a rule is stated without a case body around it — and every rule names the case that
 * paid for it, because six maxims with icons and no evidence is what this block replaced.
 */
export function Method({ t }: { t: Messages }) {
  return (
    <section id="method" className="border-b border-rule bg-raised px-5 py-14 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>{t.method.eyebrow}</Eyebrow>
        <h2 className="mt-5 max-w-[22ch] text-xl font-light tracking-[-0.02em]">
          {t.method.title}
        </h2>
        <p className="mt-3 max-w-[58ch] text-base text-muted">{t.method.lede}</p>

        <ol className="mt-10 grid list-none grid-cols-1 gap-px border border-rule bg-rule p-0 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((id, index) => (
            <li key={id} className="bg-raised p-6">
              <p className="m-0 font-mono text-xs tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 m-0 text-md text-text">{t.method.items[id].rule}</p>
              <p className="mt-2 m-0 max-w-[42ch] text-sm text-muted">
                {t.method.items[id].evidence}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
