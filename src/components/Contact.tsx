import { ArrowUpRight, AtSign, Phone } from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { ContactForm } from "@/components/ContactForm";
import { Module } from "@/components/Module";
import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

export function Contact({ t }: { t: Messages }) {
  const channels: {
    icon?: typeof AtSign;
    brand?: "github" | "linkedin" | null;
    label: string;
    href: string;
    external: boolean;
  }[] = [
    { icon: AtSign, label: profile.email, href: `mailto:${profile.email}`, external: false, brand: null },
    {
      icon: Phone,
      label: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
      external: false,
      brand: null,
    },
    { brand: "linkedin", label: "LinkedIn", href: profile.linkedin, external: true },
    { brand: "github", label: "GitHub", href: profile.github, external: true },
  ];

  return (
    <section id="contact" className="px-4 py-10 md:px-8 md:pb-20 md:pt-14">
      <div className="mx-auto max-w-[1240px]">
        <h2
          className="m-0 max-w-[18ch] text-2xl"
          style={{ fontVariationSettings: '"wdth" 104' }}
        >
          {t.contact.title}
        </h2>
        <p className="m-0 mt-4 max-w-[56ch] text-md text-dim">{t.contact.lede}</p>

        <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-12">
          <Module legend={t.contact.formLegend} className="lg:col-span-7">
            <ContactForm t={t.contact} email={profile.email} />
          </Module>

          <Module legend={t.contact.emailLabel} className="lg:col-span-5">
            <ul className="m-0 list-none space-y-3 p-0">
              {channels.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noreferrer noopener" : undefined}
                    className="inline-flex items-center gap-2 break-all text-base text-ink hover:text-signal"
                  >
                    {channel.brand ? (
                      <BrandMark brand={channel.brand} />
                    ) : channel.icon ? (
                      <channel.icon aria-hidden size={15} strokeWidth={1.75} className="shrink-0" />
                    ) : null}
                    {channel.label}
                    {channel.external ? (
                      <>
                        <ArrowUpRight aria-hidden size={12} strokeWidth={2} />
                        <span className="sr-only">({t.a11y.externalLink})</span>
                      </>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
            <p className="legend m-0 mt-6 text-dim">{t.masthead.location}</p>
          </Module>
        </div>
      </div>
    </section>
  );
}
