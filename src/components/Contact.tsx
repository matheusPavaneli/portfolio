import { ArrowUpRight, AtSign, FileText, Phone } from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { ContactForm } from "@/components/ContactForm";
import { Section } from "@/components/Section";
import { profile } from "@/content/profile";
import type { Messages } from "@/i18n";

export function Contact({ t }: { t: Messages }) {
  const channels = [
    { icon: AtSign, brand: null, label: profile.email, href: `mailto:${profile.email}`, external: false },
    {
      icon: Phone,
      brand: null,
      label: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
      external: false,
    },
    { icon: FileText, brand: null, label: t.masthead.cv, href: profile.cv, external: true },
    { icon: null, brand: "linkedin" as const, label: "LinkedIn", href: profile.linkedin, external: true },
    { icon: null, brand: "github" as const, label: "GitHub", href: profile.github, external: true },
  ];

  return (
    <Section id="contact" eyebrow={t.contact.eyebrow} title={t.contact.title} lede={t.contact.lede}>
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div>
          <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
            {t.contact.formLegend}
          </h3>
          <div className="mt-7">
            <ContactForm t={t.contact} email={profile.email} />
          </div>
        </div>

        <div>
          <h3 className="label m-0 border-b border-line pb-3 text-text-muted">
            {t.contact.emailLabel}
          </h3>
          <ul className="m-0 list-none p-0">
            {channels.map((channel) => (
              <li key={channel.href} className="border-b border-line py-3.5">
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noreferrer noopener" : undefined}
                  className="inline-flex items-center gap-2.5 break-all font-mono text-code text-text transition-colors duration-(--duration-tint) hover:text-accent"
                >
                  {channel.brand ? (
                    <BrandMark brand={channel.brand} size={14} />
                  ) : channel.icon ? (
                    <channel.icon aria-hidden size={14} strokeWidth={1.5} className="shrink-0" />
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
          <p className="label m-0 mt-5 text-text-muted">{t.masthead.location}</p>
        </div>
      </div>
    </Section>
  );
}
