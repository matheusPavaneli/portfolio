import {
  Gauge,
  GitBranch,
  Ruler,
  ShieldCheck,
  Siren,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

import { Module } from "@/components/Module";
import type { Messages } from "@/i18n";

/**
 * One module, six rows — not six equal cards in a grid, which is the shape a generated page
 * reaches for. Each rule gets the panel symbol for what it is about, and each names the case
 * that paid for it, because six maxims with icons and no evidence is what this replaced.
 */
const ITEMS: { id: keyof Messages["method"]["items"]; icon: LucideIcon }[] = [
  { id: "instrument", icon: Gauge },
  { id: "vendor", icon: Siren },
  { id: "gate", icon: Ruler },
  { id: "live", icon: GitBranch },
  { id: "standard", icon: ShieldCheck },
  { id: "illegal", icon: Waypoints },
];

export function Method({ t }: { t: Messages }) {
  return (
    <section id="method" className="px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1240px]">
        <Module legend={t.method.eyebrow} readout={`${ITEMS.length}`}>
          <h2 className="m-0 max-w-[24ch] text-xl" style={{ fontVariationSettings: '"wdth" 100' }}>
            {t.method.title}
          </h2>
          <p className="m-0 mt-2 max-w-[56ch] text-sm text-dim">{t.method.lede}</p>

          <ol className="m-0 mt-7 grid list-none grid-cols-1 gap-x-10 gap-y-5 p-0 md:grid-cols-2">
            {ITEMS.map(({ id, icon: Icon }) => (
              <li key={id} className="flex gap-3">
                <Icon
                  aria-hidden
                  size={18}
                  strokeWidth={1.75}
                  className="mt-0.5 shrink-0 text-signal"
                />
                <div>
                  <p className="m-0 text-base text-ink">{t.method.items[id].rule}</p>
                  <p className="m-0 mt-1 max-w-[46ch] text-sm text-dim">
                    {t.method.items[id].evidence}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Module>
      </div>
    </section>
  );
}
