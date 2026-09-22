import { ArrowDownRight } from "lucide-react";

import { Section } from "@/components/Section";
import type { CaseId } from "@/content/cases";
import type { Messages } from "@/i18n";

const ITEMS = [
  { id: "instrument", paidBy: "query" },
  { id: "vendor", paidBy: "orchestration" },
  { id: "gate", paidBy: "nanquim" },
  { id: "live", paidBy: "dashboard" },
  { id: "standard", paidBy: null },
  { id: "illegal", paidBy: "nanquim" },
] as const satisfies readonly { id: string; paidBy: CaseId | null }[];

export function Method({ t }: { t: Messages }) {
  return (
    <Section
      id="method"
      eyebrow={t.method.eyebrow}
      readout={`${ITEMS.length}`}
      title={t.method.title}
      lede={t.method.lede}
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-8 p-0 md:grid-cols-2">
        {ITEMS.map(({ id, paidBy }) => (
          <li key={id} className="border-t border-line pt-5">
            <h3 className="measure-tight m-0 text-h3 text-text">{t.method.items[id].rule}</h3>
            <p className="measure-tight m-0 mt-2 font-mono text-code text-text-muted">
              {t.method.items[id].evidence}
            </p>
            {paidBy ? (
              <p className="label m-0 mt-3 text-text-muted">
                {t.method.paidBy}{" "}
                <a href={`#case-${paidBy}`} className="link inline-flex items-center gap-1 text-text">
                  {t.cases[paidBy].name}
                  <ArrowDownRight aria-hidden size={12} strokeWidth={2} />
                </a>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
